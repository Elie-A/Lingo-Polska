// models/LemmaCache.js
import mongoose from "mongoose";

const lemmaCacheSchema = new mongoose.Schema(
  {
    lemma: { type: String, required: true, index: true },
    partOfSpeech: { type: String, required: true, index: true },
    totalForms: { type: Number, default: 0 },
    inflectionSummary: { type: Object }, // optional summary, e.g., tenses/cases count
  },
  { timestamps: true }
);

lemmaCacheSchema.index({ lemma: 1, partOfSpeech: 1 }, { unique: true });

export const LemmaCache = mongoose.model(
  "LemmaCache",
  lemmaCacheSchema,
  "lemma_cache"
);
