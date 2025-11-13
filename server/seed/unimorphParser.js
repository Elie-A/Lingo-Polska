import fs from "fs";
import readline from "readline";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import sequelize from "../config/database.js";
import Word from "../models/word.js";

dotenv.config({ path: path.resolve("server/.env") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const polPath = path.resolve(__dirname, "../seed/data/pol");

/**
 * Parse UniMorph features into structured object
 */
function parseFeatures(featureString) {
  const features = featureString.split(";").map((f) => f.trim());
  const featureSet = new Set(features);

  const parsed = {
    partOfSpeech: "OTHER",
    tense: null,
    person: null,
    mood: null,
    aspect: null,
    voice: null,
    case: null,
    number: null,
    gender: null,
    animacy: null,
    degree: null,
    definiteness: null,
    polarity: null,
  };

  // Part-of-speech
  if (featureSet.has("V")) parsed.partOfSpeech = "VERB";
  else if (featureSet.has("N")) parsed.partOfSpeech = "NOUN";
  else if (featureSet.has("ADJ")) parsed.partOfSpeech = "ADJECTIVE";

  // Feature mappings
  const featureMaps = {
    tense: { PST: "past", PRS: "present", FUT: "future" },
    person: { 1: "first", 2: "second", 3: "third" },
    mood: {
      IND: "indicative",
      IMP: "imperative",
      COND: "conditional",
      SBJV: "subjunctive",
    },
    aspect: { PFV: "perfective", IPFV: "imperfective" },
    voice: { ACT: "active", PASS: "passive" },
    case: {
      NOM: "nominative",
      GEN: "genitive",
      DAT: "dative",
      ACC: "accusative",
      INS: "instrumental",
      LOC: "locative",
      VOC: "vocative",
    },
    number: { SG: "singular", PL: "plural" },
    gender: { MASC: "masculine", FEM: "feminine", NEUT: "neuter" },
    animacy: { ANIM: "animate", INAN: "inanimate", HUM: "human" },
    degree: { POS: "positive", CMPR: "comparative", SPRL: "superlative" },
    polarity: { NEG: "negative", POS: "positive" },
  };

  for (const f of features) {
    for (const [key, map] of Object.entries(featureMaps)) {
      if (map[f]) parsed[key] = map[f];
    }
  }

  return parsed;
}

/**
 * Import UniMorph TSV file into PostgreSQL
 */
export async function importUnimorphFile(filePath, batchSize = 10000) {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let batch = [];
    let totalProcessed = 0;
    let insertedCount = 0;

    for await (const line of rl) {
      totalProcessed++;
      if (!line.trim()) continue;

      const [lemma, inflectedForm, features] = line.split("\t");
      if (!lemma || !inflectedForm || !features) continue;

      const featureSet = new Set(features.split(";"));
      if (
        !featureSet.has("V") &&
        !featureSet.has("N") &&
        !featureSet.has("ADJ")
      )
        continue;

      const parsedFeatures = parseFeatures(features);

      batch.push({
        lemma: lemma.trim(),
        inflectedForm: inflectedForm.trim(),
        features: features.trim(),
        partOfSpeech: parsedFeatures.partOfSpeech,
        tense: parsedFeatures.tense,
        person: parsedFeatures.person,
        mood: parsedFeatures.mood,
        aspect: parsedFeatures.aspect,
        voice: parsedFeatures.voice,
        gramCase: parsedFeatures.case,
        number: parsedFeatures.number,
        gender: parsedFeatures.gender,
        animacy: parsedFeatures.animacy,
        degree: parsedFeatures.degree,
        definiteness: parsedFeatures.definiteness,
        polarity: parsedFeatures.polarity,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (batch.length >= batchSize) {
        await Word.bulkCreate(batch, { ignoreDuplicates: true });
        insertedCount += batch.length;
        batch = [];
        process.stdout.write(`\rInserted ${insertedCount} words...`);
      }
    }

    if (batch.length > 0) {
      await Word.bulkCreate(batch, { ignoreDuplicates: true });
      insertedCount += batch.length;
    }

    console.log(
      `\n🎉 Import complete. Processed: ${totalProcessed}, Inserted: ${insertedCount}`
    );
  } catch (err) {
    console.error("❌ Import failed:", err);
  } finally {
    await sequelize.close();
  }
}

// Run
importUnimorphFile(polPath, 30000);
