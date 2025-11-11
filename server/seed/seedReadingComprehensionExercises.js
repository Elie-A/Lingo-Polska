import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ReadingComprehensionExercise from "../models/ReadingComprehensionExercise.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI;

// Default topic → level mapping
const topicLevels = {
  reading: "A1",
  culture: "B1",
  history: "B2",
  travel: "A2",
  literature: "B2",
  daily_life: "A1",
};

// Load reading comprehension data (JSON format)
const dataPath = path.resolve(
  __dirname,
  "../seed/data/readingComprehensionExercises.json"
);
const readingExercises = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const connectAndSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "LingoPolska" });
    console.log("✅ Connected to MongoDB");

    await ReadingComprehensionExercise.deleteMany({});
    console.log("🗑 Cleared existing reading comprehension exercises");

    // Map and normalize imported exercises
    const formatted = readingExercises.map((exercise) => ({
      title: exercise.title || "Untitled Reading Passage",
      topic: exercise.topic || "reading-comprehension",
      level: exercise.level || topicLevels[exercise.topic] || "A1",
      text: exercise.text,
      questions: exercise.questions.map((q) => ({
        type: q.type || "multiple-choice",
        question: q.question,
        options: q.options || [],
        answer: q.answer,
        hints: q.hints || [],
      })),
      tags: exercise.tags || [],
    }));

    const inserted = await ReadingComprehensionExercise.insertMany(formatted);
    console.log(
      `✅ Inserted ${inserted.length} reading comprehension exercises`
    );

    // Log distribution by level
    const levelStats = formatted.reduce((acc, ex) => {
      acc[ex.level] = (acc[ex.level] || 0) + 1;
      return acc;
    }, {});

    console.log("\n📊 Exercises by level:");
    Object.entries(levelStats).forEach(([level, count]) => {
      console.log(`   ${level}: ${count}`);
    });

    // Log distribution by topic
    const topicStats = formatted.reduce((acc, ex) => {
      acc[ex.topic] = (acc[ex.topic] || 0) + 1;
      return acc;
    }, {});

    console.log("\n📚 Exercises by topic:");
    Object.entries(topicStats).forEach(([topic, count]) => {
      console.log(`   ${topic}: ${count}`);
    });

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error seeding reading exercises:", err);
  }
};

connectAndSeed();
