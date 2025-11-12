import mongoose from "mongoose";
import fs from "fs";
import readline from "readline";
import Word from "../models/Word.js";
import { parseFeatures } from "./unimorphParser.js";

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

function printProgress(current, total, elapsed) {
  const percentage = ((current / total) * 100).toFixed(2);
  const linesPerSecond = Math.floor(current / (elapsed / 1000));
  const etaMs = ((total - current) / linesPerSecond) * 1000;
  const barLength = 40;
  const filledLength = Math.floor((current / total) * barLength);
  const bar = "█".repeat(filledLength) + "-".repeat(barLength - filledLength);
  process.stdout.write(
    `\r[${bar}] ${percentage}% | ${current}/${total} lines | ${linesPerSecond} lines/s | ETA: ${formatTime(
      etaMs
    )}`
  );
}

async function importWords(filePath, estimatedTotalLines) {
  try {
    await mongoose.connect(
      "mongodb+srv://LingoPolskaDbUsr:OD73mKz%261K8%40S%5E4BqA%23%40@lingopolskacluster.ftmi9fj.mongodb.net/LingoPolska?retryWrites=true&w=majority&appName=LingoPolskaCluster",
      { maxPoolSize: 50 }
    );
    console.log("✅ Connected to MongoDB");

    const batchSize = 30000;
    let batch = [];
    let totalProcessed = 0;
    const startTime = Date.now();

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    console.log("🚀 Starting import...");

    for await (const line of rl) {
      if (!line.trim()) continue;

      const parts = line.split("\t");
      if (parts.length < 3) continue;

      const [lemma, inflectedForm, features] = parts;
      if (!features.match(/\b(V|N|ADJ)\b/)) continue;

      const parsedFeatures = parseFeatures(features);

      batch.push({
        updateOne: {
          filter: { lemma: lemma.trim(), inflectedForm: inflectedForm.trim() },
          update: {
            $setOnInsert: { features: features.trim(), ...parsedFeatures },
          },
          upsert: true,
        },
      });

      if (batch.length >= batchSize) {
        await Word.collection.bulkWrite(batch, { ordered: false });
        totalProcessed += batch.length;
        const elapsed = Date.now() - startTime;
        printProgress(totalProcessed, estimatedTotalLines, elapsed);
        batch = [];
      }
    }

    if (batch.length > 0) {
      await Word.collection.bulkWrite(batch, { ordered: false });
      totalProcessed += batch.length;
    }

    const totalTime = Date.now() - startTime;
    printProgress(totalProcessed, estimatedTotalLines, totalTime);
    console.log(
      `\n🎉 Import complete. Total records processed: ${totalProcessed}`
    );
    console.log(`⏱ Total time: ${formatTime(totalTime)}`);

    await Word.createIndexes();
    console.log("✅ Indexes created successfully.");

    process.exit(0);
  } catch (err) {
    console.error("❌ Import failed:", err);
    process.exit(1);
  }
}

// Path to your large file
const filePath =
  "C:/Users/eliea/Documents/vscode-projects/Lingo-Polska/server/seed/data/pol";

// Provide an estimated total lines for progress bar (~14M in your case)
const estimatedTotalLines = 14096560;

importWords(filePath, estimatedTotalLines);
