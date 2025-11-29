// seed/importWords.js
import mongoose from "mongoose";
import fs from "fs";
import readline from "readline";
import path from "path";
import { fileURLToPath } from "url";

import {
  VerbWord,
  NounWord,
  AdjectiveWord,
  AdverbWord,
  PronounWord,
  NumeralWord,
} from "../models/Word.js";

import { parseFeatures } from "./unimorphParser.js";

const MONGO_URI = process.env.MONGO_URI;
const BATCH_SIZE = 30000;

// ------------------------------
// Utilities
// ------------------------------

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  return `${Math.floor(totalSeconds / 3600)}h ${Math.floor(
    (totalSeconds % 3600) / 60
  )}m ${totalSeconds % 60}s`;
}

function printProgress(current, total, elapsed) {
  const percentage = ((current / total) * 100).toFixed(2);
  const linesPerSecond = Math.max(1, Math.floor(current / (elapsed / 1000)));
  const etaMs = ((total - current) / linesPerSecond) * 1000;
  const barLength = 40;
  const filledLength = Math.floor((current / total) * barLength);
  const bar = "█".repeat(filledLength) + "-".repeat(barLength - filledLength);

  process.stdout.write(
    `\r[${bar}] ${percentage}% | ${current.toLocaleString()}/${total.toLocaleString()} lines | ${linesPerSecond} lines/s | ETA: ${formatTime(
      etaMs
    )}`
  );
}

// ------------------------------
// Flush batched bulk ops
// ------------------------------

async function flushBatches(batches) {
  const ops = [];
  const models = {
    VERB: VerbWord,
    NOUN: NounWord,
    ADJECTIVE: AdjectiveWord,
    ADVERB: AdverbWord,
    PRONOUN: PronounWord,
    NUMERAL: NumeralWord,
  };

  for (const pos of Object.keys(batches)) {
    const batch = batches[pos];
    if (!batch || batch.length === 0) continue;

    const model = models[pos];
    ops.push(
      model.collection.bulkWrite(batch, { ordered: false }).catch((err) => {
        console.error(`[bulkWrite ${pos}] failed:`, err?.message);
      })
    );

    batches[pos] = [];
  }

  if (ops.length > 0) await Promise.all(ops);
}

// ------------------------------
// Main import function
// ------------------------------

export async function importWords(filePath, estimatedTotalLines) {
  if (!fs.existsSync(filePath)) {
    console.error("❌ File not found:", filePath);
    process.exit(1);
  }

  console.log("📂 Loading file:", filePath);

  await mongoose.connect(MONGO_URI, { maxPoolSize: 50 });
  console.log("✅ Connected to MongoDB");

  // Drop existing collections
  const collections = [
    VerbWord,
    NounWord,
    AdjectiveWord,
    AdverbWord,
    PronounWord,
    NumeralWord,
  ];
  await Promise.all(
    collections.map((model) => model.collection.drop().catch(() => {}))
  );
  console.log("🧹 All collections dropped. Fresh import starting...");

  const batches = {
    VERB: [],
    NOUN: [],
    ADJECTIVE: [],
    ADVERB: [],
    PRONOUN: [],
    NUMERAL: [],
  };

  let totalProcessed = 0;
  let skippedEmpty = 0;
  let skippedParts = 0;
  let skippedPOS = 0;

  const startTime = Date.now();
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  console.log("🚀 Starting import...");

  for await (const line of rl) {
    if (!line.trim()) {
      skippedEmpty++;
      continue;
    }

    const parts = line.split("\t");
    if (parts.length < 3) {
      skippedParts++;
      continue;
    }

    const [lemmaRaw, inflectedRaw, featureStringRaw] = parts;
    const lemma = lemmaRaw.trim();
    const inflectedForm = inflectedRaw.trim();
    const featureString = featureStringRaw.trim();

    // Pre-check POS
    if (!/^(V|N|ADJ|ADV|PRON|NUM)(\.|;|$)/.test(featureString)) {
      skippedPOS++;
      continue;
    }

    const parsed = parseFeatures(featureString);
    if (!parsed || !parsed.partOfSpeech) {
      skippedPOS++;
      continue;
    }

    const pos = parsed.partOfSpeech;
    if (
      !["VERB", "NOUN", "ADJECTIVE", "ADVERB", "PRONOUN", "NUMERAL"].includes(
        pos
      )
    ) {
      skippedPOS++;
      continue;
    }

    const compact = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (v === null || v === false || v === undefined) continue;
      if (k === "otherTags" && v.length === 0) continue;
      compact[k] = v;
    }

    // 🔥 Use updateOne + upsert to prevent exact duplicates
    const op = {
      updateOne: {
        filter: {
          lemma,
          inflectedForm,
          partOfSpeech: pos,
          features: featureString,
        },
        update: { $setOnInsert: { ...compact } },
        upsert: true,
      },
    };

    batches[pos].push(op);

    if (batches[pos].length >= BATCH_SIZE) {
      await flushBatches(batches);
      totalProcessed += BATCH_SIZE;
      printProgress(
        totalProcessed,
        estimatedTotalLines,
        Date.now() - startTime
      );
    }
  }

  // Final batch
  await flushBatches(batches);

  // Report counts
  const counts = await Promise.all([
    VerbWord.estimatedDocumentCount(),
    NounWord.estimatedDocumentCount(),
    AdjectiveWord.estimatedDocumentCount(),
    AdverbWord.estimatedDocumentCount(),
    PronounWord.estimatedDocumentCount(),
    NumeralWord.estimatedDocumentCount(),
  ]);
  const totalInserted = counts.reduce((a, b) => a + b, 0);

  printProgress(totalInserted, estimatedTotalLines, Date.now() - startTime);
  console.log("\n🎉 Import complete.");

  console.table({
    "Processed (inserted)": totalInserted,
    "Skipped (empty lines)": skippedEmpty,
    "Skipped (invalid parts count)": skippedParts,
    "Skipped (pre-POS check)": skippedPOS,
    "Total estimated lines": estimatedTotalLines,
    "Unaccounted difference":
      estimatedTotalLines -
      (totalInserted + skippedEmpty + skippedParts + skippedPOS),
  });

  console.log("🧱 Creating indexes...");
  await Promise.all(collections.map((model) => model.createIndexes()));
  console.log("✅ Indexes created.");

  await mongoose.disconnect();
}

// ------------------------------
// Execute directly
// ------------------------------

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  const filePath = process.argv[2];
  const estimated = parseInt(process.argv[3], 10);

  if (!filePath || isNaN(estimated)) {
    console.error(
      "Usage: node importWords.js <filePath> <estimatedTotalLines>"
    );
    process.exit(1);
  }

  console.log("📥 Starting importWords() with:", filePath, estimated);

  importWords(filePath, estimated)
    .then(() => {
      console.log("✔️ Done");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error:", err);
      process.exit(1);
    });
}
