import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "multiple-choice",
        "true-false",
        "fill-in-the-blank",
        "short-answer",
      ],
      index: true,
    },
    question: { type: String, required: true },
    options: [{ type: String }], // For MCQ or fill-in options
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
    // can be string, array, or boolean (for flexibility)
    hints: [{ type: String }],
  },
  { _id: false }
);

const readingComprehensionExerciseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    topic: { type: String, required: true, index: true },
    level: {
      type: String,
      required: true,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      index: true,
    },
    text: { type: String, required: true },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one question is required",
      },
    },
    tags: [{ type: String }], // optional — for search or classification
  },
  {
    timestamps: true,
    collation: { locale: "en", strength: 2 }, // case-insensitive comparisons
  }
);

// Compound indexes for efficient lookups
readingComprehensionExerciseSchema.index({ topic: 1, level: 1 });
readingComprehensionExerciseSchema.index({
  topic: 1,
  level: 1,
  "questions.type": 1,
});
readingComprehensionExerciseSchema.index({ createdAt: -1 });

// Optional text index for full-text search in future
// readingComprehensionExerciseSchema.index({ title: "text", text: "text", "questions.question": "text" });

const ReadingComprehensionExercise = mongoose.model(
  "ReadingComprehensionExercise",
  readingComprehensionExerciseSchema
);

export default ReadingComprehensionExercise;
