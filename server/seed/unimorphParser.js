import fs from "fs";
import readline from "readline";

// Parse UniMorph features into structured object
export function parseFeatures(featureString) {
  const features = featureString.split(";");
  const parsed = {
    partOfSpeech: null,
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

  if (features.includes("V")) parsed.partOfSpeech = "VERB";
  else if (features.includes("N")) parsed.partOfSpeech = "NOUN";
  else if (features.includes("ADJ")) parsed.partOfSpeech = "ADJECTIVE";
  else parsed.partOfSpeech = "OTHER";

  const tenseMap = { PST: "past", PRS: "present", FUT: "future" };
  const personMap = { 1: "first", 2: "second", 3: "third" };
  const moodMap = {
    IND: "indicative",
    IMP: "imperative",
    COND: "conditional",
    SBJV: "subjunctive",
  };
  const aspectMap = { PFV: "perfective", IPFV: "imperfective" };
  const voiceMap = { ACT: "active", PASS: "passive" };

  const caseMap = {
    NOM: "nominative",
    GEN: "genitive",
    DAT: "dative",
    ACC: "accusative",
    INS: "instrumental",
    LOC: "locative",
    VOC: "vocative",
  };
  const numberMap = { SG: "singular", PL: "plural" };
  const genderMap = { MASC: "masculine", FEM: "feminine", NEUT: "neuter" };
  const animacyMap = { ANIM: "animate", INAN: "inanimate", HUM: "human" };
  const degreeMap = {
    POS: "positive",
    CMPR: "comparative",
    SPRL: "superlative",
  };
  const polarityMap = { NEG: "negative", POS: "positive" };

  features.forEach((f) => {
    if (tenseMap[f]) parsed.tense = tenseMap[f];
    if (personMap[f]) parsed.person = personMap[f];
    if (moodMap[f]) parsed.mood = moodMap[f];
    if (aspectMap[f]) parsed.aspect = aspectMap[f];
    if (voiceMap[f]) parsed.voice = voiceMap[f];
    if (caseMap[f]) parsed.case = caseMap[f];
    if (numberMap[f]) parsed.number = numberMap[f];
    if (genderMap[f]) parsed.gender = genderMap[f];
    if (animacyMap[f]) parsed.animacy = animacyMap[f];
    if (degreeMap[f]) parsed.degree = degreeMap[f];
    if (polarityMap[f]) parsed.polarity = polarityMap[f];
  });

  return parsed;
}

export async function parseUnimorphFile(filePath) {
  const words = [];
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    if (!line.trim()) continue;

    const parts = line.split("\t");
    if (parts.length < 3) {
      console.warn(`Skipping malformed line ${lineCount}: ${line}`);
      continue;
    }

    const [lemma, inflectedForm, features] = parts;
    if (!features.match(/\b(V|N|ADJ)\b/)) continue;

    const parsedFeatures = parseFeatures(features);

    words.push({
      lemma: lemma.trim(),
      inflectedForm: inflectedForm.trim(),
      features: features.trim(),
      ...parsedFeatures,
    });
  }

  return words;
}
