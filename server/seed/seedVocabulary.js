// seed/seedVocabulary.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Vocabulary from "../models/Vocabulary.js";
import fs from "fs";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Load your vocabulary JSON file
const vocabularyData = JSON.parse(
  fs.readFileSync("./seed/vocabulary.json", "utf-8")
);

const connectAndSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "LingoPolska", // Ensure it uses your target database
    });
    console.log("✅ Connected to MongoDB");

    // Optional: Clear existing vocabulary before seeding
    await Vocabulary.deleteMany({});
    console.log("🗑 Cleared existing vocabulary");

    // Insert data
    const inserted = await Vocabulary.insertMany(vocabularyData);
    console.log(`✅ Inserted ${inserted.length} vocabulary items`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

connectAndSeed();
