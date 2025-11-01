// seed/seedExercises.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Exercise from "../models/Exercise.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Default levels for topics (fallback if question doesn't have level)
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

// Load your exercises JSON file with proper path resolution
const exercisesPath = path.resolve(__dirname, "../seed/exercises.json");
const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, "utf-8"));

const connectAndSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "LingoPolska",
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log("🗑 Cleared existing exercises");

    // Flatten and enrich exercises
    const allExercises = Object.entries(exercisesData).flatMap(
      ([topic, exercises]) =>
        exercises.map((exercise) => ({
          ...exercise,
          topic,
          // Use the level from the question, or fall back to topic default
          level: exercise.level || topicLevels[topic] || "A1",
          // Use the type from the question, or default to fill-in-the-blank
          type: exercise.type || "fill-in-the-blank",
        }))
    );

    // Insert data
    const inserted = await Exercise.insertMany(allExercises);
    console.log(`✅ Inserted ${inserted.length} exercises`);

    // Log level distribution
    const levelCounts = allExercises.reduce((acc, ex) => {
      acc[ex.level] = (acc[ex.level] || 0) + 1;
      return acc;
    }, {});

    console.log("\n📊 Exercises by level:");
    Object.entries(levelCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([level, count]) => {
        console.log(`   ${level}: ${count} exercises`);
      });

    // Log type distribution
    const typeCounts = allExercises.reduce((acc, ex) => {
      acc[ex.type] = (acc[ex.type] || 0) + 1;
      return acc;
    }, {});

    console.log("\n📝 Exercises by type:");
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} exercises`);
    });

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

connectAndSeed();
