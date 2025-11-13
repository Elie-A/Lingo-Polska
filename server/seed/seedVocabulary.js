import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "../config/database.js";
import Vocabulary from "../models/Vocabulary.js";

dotenv.config({ path: path.resolve("server/.env") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your JSON file
const vocabularyPath = path.resolve(__dirname, "../seed/data/vocabulary.json");
const vocabularyData = JSON.parse(fs.readFileSync(vocabularyPath, "utf-8"));

// Function to split array into batches
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const seedVocabulary = async (batchSize = 500) => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");

    // Ensure table exists (drops table if exists)
    await Vocabulary.sync({ force: true });
    console.log("🗑 Cleared existing vocabulary (table recreated)");

    // Insert data in batches
    const batches = chunkArray(vocabularyData, batchSize);
    let totalInserted = 0;

    for (const [index, batch] of batches.entries()) {
      const inserted = await Vocabulary.bulkCreate(batch, {
        returning: true,
        ignoreDuplicates: true,
      });
      totalInserted += inserted.length;
      console.log(
        `✅ Batch ${index + 1}/${batches.length} inserted (${
          inserted.length
        } items)`
      );
    }

    console.log(`🎉 Total inserted vocabulary items: ${totalInserted}`);

    await sequelize.close();
    console.log("✅ Disconnected from PostgreSQL");
  } catch (err) {
    console.error("❌ Error seeding vocabulary:", err);
  }
};

// Call the seeding function
seedVocabulary();
