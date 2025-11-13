import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "../config/database.js";
import {
  ReadingComprehensionExercise,
  Question,
} from "../models/ReadingComprehensionExercise.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");

    // Create tables if they don't exist
    await sequelize.sync({ force: true });
    console.log("✅ Database synced (tables created)");

    // Map and normalize imported exercises
    const formatted = readingExercises.map((exercise) => ({
      title: exercise.title || "Untitled Reading Passage",
      topic: exercise.topic || "reading-comprehension",
      level: exercise.level || topicLevels[exercise.topic] || "A1",
      text: exercise.text,
      tags: exercise.tags || [],
      questions:
        exercise.questions?.map((q) => ({
          type: q.type || "multiple-choice",
          question: q.question,
          options: q.options || [],
          answer: q.answer,
          hints: q.hints || [],
        })) || [],
    }));

    // Bulk insert exercises with questions
    await ReadingComprehensionExercise.bulkCreate(formatted, {
      include: [{ model: Question, as: "questions" }],
    });

    console.log(
      `✅ Seeded ${formatted.length} reading comprehension exercises`
    );

    await sequelize.close();
    console.log("✅ Disconnected from PostgreSQL");
  } catch (err) {
    console.error("❌ Error seeding reading exercises:", err);
  }
};

connectAndSeed();
