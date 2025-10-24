import mongoose from "mongoose";
import dotenv from "dotenv";
import Exercise from "./models/Exercise.js";

dotenv.config();
const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/minisite";
mongoose
  .connect(MONGO)
  .then(async () => {
    console.log("Connected to MongoDB for seeding");
    await Exercise.deleteMany({});
    const items = [
      {
        title: "Example: Basic Practice",
        description: "This is a sample exercise",
        difficulty: "easy",
        content: "<p>Solve 2+2</p>",
      },
      {
        title: "Example: Intermediate",
        description: "Sample intermediate exercise",
        difficulty: "medium",
        content: "<p>Solve a puzzle</p>",
      },
    ];
    await Exercise.insertMany(items);
    console.log("Seeded exercises");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
