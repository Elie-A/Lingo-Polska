import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  lemma: { type: String, required: true, index: true },
  inflectedForm: { type: String, required: true },
  features: { type: String, required: true },
  partOfSpeech: { type: String, required: true, index: true }, // V, N, ADJ

  // Verb features
  tense: String,
  person: String,
  mood: String,
  aspect: String,
  voice: String,

  // Noun/Adjective features
  case: String, // NOM, GEN, DAT, ACC, INS, LOC, VOC
  number: String, // SG, PL
  gender: String, // MASC, FEM, NEUT
  animacy: String, // ANIM, INAN, HUM

  // Additional features
  degree: String, // POS, CMPR, SPRL (positive, comparative, superlative)
  definiteness: String,
  polarity: String, // NEG, POS
});

// Compound indexes for efficient queries
wordSchema.index({ lemma: 1, partOfSpeech: 1 });
wordSchema.index({ partOfSpeech: 1, case: 1 });
wordSchema.index({ lemma: 1, features: 1 });

const Word = mongoose.model("Word", wordSchema);
export default Word;
