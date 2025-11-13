// seedExercises.js
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "../config/database.js";
import Exercise from "../models/Exercise.js";

dotenv.config({ path: path.resolve("server/.env") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default levels for topics (fallback if exercise doesn't have level)
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
  conditional: "A2",
};

// Load exercises JSON file
const exercisesPath = path.resolve(__dirname, "../seed/data/exercises.json");
const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, "utf-8"));

const seedExercises = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");

    // Optional: sync model (create table if not exists)
    await Exercise.sync({ alter: true });

    // Clear existing exercises
    await Exercise.destroy({ where: {} });
    console.log("🗑 Cleared existing exercises");

    // Flatten and enrich exercises
    const allExercises = Object.entries(exercisesData).flatMap(
      ([topic, exercises]) =>
        exercises.map((exercise) => ({
          ...exercise,
          topic,
          level: exercise.level || topicLevels[topic] || "A1",
          type: exercise.type || "fill-in-the-blank",
          options: exercise.options || [],
          hints: exercise.hints || [],
        }))
    );

    // Insert data in bulk
    const inserted = await Exercise.bulkCreate(allExercises, {
      returning: true,
    });
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

    await sequelize.close();
    console.log("\n✅ Disconnected from PostgreSQL");
  } catch (err) {
    console.error("❌ Error seeding exercises:", err);
  }
};

seedExercises();
