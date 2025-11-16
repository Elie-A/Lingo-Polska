// scripts/dedupeExisting.js
// This script finds exact duplicates (same lemma/inflectedForm/partOfSpeech)
// and keeps only the earliest inserted (or one arbitrarily).
import mongoose from "mongoose";
import {
  VerbWord,
  NounWord,
  AdjectiveWord,
  AdverbWord,
  PronounWord,
  NumeralWord,
} from "../models/Word.js";

const MONGO_URI = env.process.MONGO_URI;

async function dedupeCollection(model) {
  const coll = model.collection;
  console.log("Dedupe:", coll.collectionName);
  const pipeline = [
    {
      $group: {
        _id: {
          lemma: "$lemma",
          inflectedForm: "$inflectedForm",
          pos: "$partOfSpeech",
        },
        ids: { $push: "$_id" },
        count: { $sum: 1 },
      },
    },
    { $match: { count: { $gt: 1 } } },
    { $project: { _id: 0, ids: 1 } },
  ];

  const cursor = coll.aggregate(pipeline, { allowDiskUse: true });
  let totalRemoved = 0;

  for await (const doc of cursor) {
    const ids = doc.ids;
    // keep first, remove the rest
    const keep = ids.shift();
    const remove = ids;
    if (remove.length > 0) {
      const res = await coll.deleteMany({ _id: { $in: remove } });
      totalRemoved += res.deletedCount || 0;
    }
  }
  console.log("Removed duplicates:", totalRemoved);
  return totalRemoved;
}

async function run() {
  await mongoose.connect(MONGO_URI, { maxPoolSize: 10 });
  await dedupeCollection(VerbWord);
  await dedupeCollection(NounWord);
  await dedupeCollection(AdjectiveWord);
  await dedupeCollection(AdverbWord);
  await dedupeCollection(PronounWord);
  await dedupeCollection(NumeralWord);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
