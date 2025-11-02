import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    topic: { type: String, required: true, index: true }, // Add index
    type: { type: String, required: true, index: true }, // Add index
    level: {
      type: String,
      required: true,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      index: true, // Add index
    },
    options: [{ type: String }],
    hints: [{ type: String }],
    text: { type: String },
  },
  {
    timestamps: true,
    // Optimize for read-heavy operations
    collation: { locale: "en", strength: 2 }, // Case-insensitive by default
  }
);

// Compound indexes for common query patterns
exerciseSchema.index({ topic: 1, level: 1 });
exerciseSchema.index({ topic: 1, type: 1 });
exerciseSchema.index({ topic: 1, level: 1, type: 1 });

// Index for sorting by creation date
exerciseSchema.index({ createdAt: -1 });

// Text index for search functionality (if needed in future)
// exerciseSchema.index({ question: 'text', answer: 'text' });

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
