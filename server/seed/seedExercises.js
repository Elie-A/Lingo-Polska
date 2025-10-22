import mongoose from "mongoose";
import dotenv from "dotenv";
import Exercise from "../models/Exercise.js";
import fs from "fs";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Load your exercises JSON file
const exercisesData = JSON.parse(
  fs.readFileSync("./seed/exercises.json", "utf-8")
);

// Optional: assign levels per topic
const topicLevels = {
  grammar: "A1",
  numbers: "A1",
  cases: "B1",
  vocabulary: "A1",
  verbs: "A2",
  pronouns: "A1",
  adjectives: "A2",
  phrases: "A1",
  prepositions: "B1",
};

const connectAndSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Optional: clear existing exercises
    await Exercise.deleteMany({});
    console.log("🗑 Cleared existing exercises");

    const exercisesArray = [];

    for (const type in exercisesData) {
      exercisesData[type].forEach((ex) => {
        exercisesArray.push({
          ...ex,
          type,
          level: topicLevels[type] || "A1", // default to A1 if not defined
          options: ex.options || [], // default empty array
          hints: ex.hints || [], // default empty array
        });
      });
    }

    const inserted = await Exercise.insertMany(exercisesArray);
    console.log(`✅ Inserted ${inserted.length} exercises`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

connectAndSeed();
