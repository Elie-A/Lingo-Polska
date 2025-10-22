// models/Vocabulary.js
import mongoose from "mongoose";

const vocabularySchema = new mongoose.Schema(
  {
    polish: { type: String, required: true },
    english: { type: String, required: true },
    category: { type: String, required: true },
    level: {
      type: String,
      required: true,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
    },
  },
  { timestamps: true }
);

const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);

export default Vocabulary;
