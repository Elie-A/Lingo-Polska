// scripts/buildLemmaCache.js
import mongoose from "mongoose";
import {
  VerbWord,
  NounWord,
  AdjectiveWord,
  AdverbWord,
  PronounWord,
  NumeralWord,
} from "../models/Word.js";
import { LemmaCache } from "../models/LemmaCache.js";

const MONGO_URI = process.env.MONGO_URI;

const posCollections = [
  { model: VerbWord, name: "VERB" },
  { model: NounWord, name: "NOUN" },
  { model: AdjectiveWord, name: "ADJECTIVE" },
  { model: AdverbWord, name: "ADVERB" },
  { model: PronounWord, name: "PRONOUN" },
  { model: NumeralWord, name: "NUMERAL" },
];

async function buildLemmaCache() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing cache
    await LemmaCache.deleteMany({});
    console.log("Cleared existing lemma cache");

    for (const { model, name } of posCollections) {
      console.log(`Processing ${name}...`);

      const batchSize = 100000; // process in batches
      let skip = 0;
      let hasMore = true;

      while (hasMore) {
        const pipeline = [
          { $skip: skip },
          { $limit: batchSize },
          {
            $group: {
              _id: "$lemma",
              totalForms: { $sum: 1 },
            },
          },
        ];

        const lemmas = await model.aggregate(pipeline);

        if (!lemmas.length) {
          hasMore = false;
          break;
        }

        const bulkOps = lemmas.map((l) => ({
          updateOne: {
            filter: { lemma: l._id, partOfSpeech: name },
            update: {
              $set: {
                lemma: l._id,
                partOfSpeech: name,
                totalForms: l.totalForms,
              },
            },
            upsert: true,
          },
        }));

        await LemmaCache.bulkWrite(bulkOps);
        skip += batchSize;
        console.log(`Inserted/updated batch of ${lemmas.length} for ${name}`);
      }
    }

    console.log("Lemma cache build completed!");
    process.exit(0);
  } catch (err) {
    console.error("Error building lemma cache:", err);
    process.exit(1);
  }
}

buildLemmaCache();
