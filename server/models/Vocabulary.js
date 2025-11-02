import mongoose from "mongoose";

const vocabularySchema = new mongoose.Schema(
  {
    polish: {
      type: String,
      required: true,
      trim: true,
    },
    english: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true, // Index for faster filtering
    },
    level: {
      type: String,
      required: true,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      index: true, // Index for faster filtering
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common query patterns
vocabularySchema.index({ category: 1, polish: 1 }); // For sorted category views
vocabularySchema.index({ level: 1, category: 1 }); // For level + category filtering
vocabularySchema.index({ polish: 1, english: 1 }); // For search queries

// Text index for full-text search (optional but very powerful)
vocabularySchema.index({ polish: "text", english: "text" });

const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);

export default Vocabulary;
