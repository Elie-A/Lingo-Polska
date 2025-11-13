import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Word = sequelize.define(
  "Word",
  {
    lemma: { type: DataTypes.STRING, allowNull: false },
    inflectedForm: { type: DataTypes.STRING, allowNull: false },
    features: { type: DataTypes.STRING, allowNull: false },
    partOfSpeech: { type: DataTypes.STRING, allowNull: false },
    tense: { type: DataTypes.STRING },
    person: { type: DataTypes.STRING },
    mood: { type: DataTypes.STRING },
    aspect: { type: DataTypes.STRING },
    voice: { type: DataTypes.STRING },
    gramCase: { type: DataTypes.STRING, field: "case" },
    number: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    animacy: { type: DataTypes.STRING },
    degree: { type: DataTypes.STRING },
    definiteness: { type: DataTypes.STRING },
    polarity: { type: DataTypes.STRING },
  },
  {
    tableName: "words",
    indexes: [
      { fields: ["lemma"], name: "idx_words_lemma" },
      { fields: ["partOfSpeech"], name: "idx_words_part_of_speech" },
      {
        fields: ["lemma", "partOfSpeech"],
        name: "idx_words_lemma_part_of_speech",
      },
      {
        fields: ["partOfSpeech", "case"],
        name: "idx_words_part_of_speech_case",
      },
      { fields: ["lemma", "features"], name: "idx_words_lemma_features" },
    ],
  }
);

export default Word;
