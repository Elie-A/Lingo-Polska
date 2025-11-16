// models/Word.js
import mongoose from "mongoose";

const wordSchema = new mongoose.Schema(
  {
    lemma: { type: String, required: true, index: true },
    inflectedForm: { type: String, required: true },
    features: { type: String, required: true },
    partOfSpeech: { type: String, required: true, index: true },

    // Verb features
    tense: String,
    person: String,
    mood: String,
    aspect: String,
    voice: String,

    // Noun/Adjective features
    case: String,
    number: String,
    gender: String,
    animacy: String,
    humanness: String, // HUM / NHUM

    // Additional features
    degree: String, // POS / CMPR / SPRL
    definiteness: String,
    polarity: String, // NEG / POS

    // safety: store unmapped tags
    otherTags: [String],
  },
  { timestamps: false, versionKey: false }
);

/**
 * Recommended indexes:
 *  - unique compound index to enforce deduplication on (lemma, inflectedForm, POS)
 *  - inflectedForm search
 *  - combined grammatical index for common queries
 */

// Unique dedupe index
wordSchema.index(
  { lemma: 1, inflectedForm: 1, partOfSpeech: 1 },
  { unique: true, name: "uniq_lemma_form_pos" }
);

// Fast search by surface form
wordSchema.index({ inflectedForm: 1 }, { name: "idx_inflectedForm" });

// Combined grammatical index used by queries like
// find verbs where tense=past && gender=feminine, etc.
wordSchema.index(
  {
    partOfSpeech: 1,
    tense: 1,
    person: 1,
    mood: 1,
    case: 1,
    number: 1,
    gender: 1,
  },
  { name: "idx_pos_grammars" }
);

// Export separate models for each POS collection
export const VerbWord = mongoose.model("VerbWord", wordSchema, "verb_words");
export const NounWord = mongoose.model("NounWord", wordSchema, "noun_words");
export const AdjectiveWord = mongoose.model(
  "AdjectiveWord",
  wordSchema,
  "adjective_words"
);
export const AdverbWord = mongoose.model(
  "AdverbWord",
  wordSchema,
  "adverb_words"
);
export const PronounWord = mongoose.model(
  "PronounWord",
  wordSchema,
  "pronoun_words"
);
export const NumeralWord = mongoose.model(
  "NumeralWord",
  wordSchema,
  "numeral_words"
);
