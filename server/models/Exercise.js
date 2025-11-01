// models/Exercise.js
import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    topic: { type: String, required: true },
    type: { type: String, required: true },
    level: {
      type: String,
      required: true,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
    },
    options: [{ type: String }],
    hints: [{ type: String }],
    text: { type: String },
  },
  { timestamps: true }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
