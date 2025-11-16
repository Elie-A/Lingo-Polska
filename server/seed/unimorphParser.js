import fs from "fs";
import readline from "readline";

// Parse UniMorph features into structured object
export function parseFeatures(featureString) {
  if (!featureString || typeof featureString !== "string") return null;

  const tags = featureString
    .split(";")
    .map((t) => t.trim())
    .filter(Boolean);

  const parsed = {
    partOfSpeech: null, // VERB | NOUN | ADJECTIVE | OTHER
    // verb
    tense: null,
    mood: null,
    aspect: null,
    voice: null,
    person: null,
    infinitive: false,
    participle: false,
    converbal: false,
    verbalNoun: false,
    impersonal: false,
    reflexive: false,
    // nominal
    case: null,
    number: null,
    gender: null,
    animacy: null,
    humanness: null,
    // adjective
    degree: null,
    // misc
    polarity: null,
    otherTags: [],
  };

  // -- POS detection with support for dotted tags (V.PTCP, V.MSDR, etc.)
  const posCandidates = ["V", "N", "ADJ", "ADV", "PRON", "NUM", "DET", "AUX"];
  const first = tags[0];

  // Check if first tag is or starts with a known POS
  let matchedPOS = null;
  for (const pos of posCandidates) {
    if (first === pos || first.startsWith(pos + ".")) {
      matchedPOS = pos;
      break;
    }
  }

  if (matchedPOS) {
    if (matchedPOS === "V") parsed.partOfSpeech = "VERB";
    else if (matchedPOS === "N") parsed.partOfSpeech = "NOUN";
    else if (matchedPOS === "ADJ") parsed.partOfSpeech = "ADJECTIVE";
    else if (matchedPOS === "ADV") parsed.partOfSpeech = "ADVERB";
    else if (matchedPOS === "PRON") parsed.partOfSpeech = "PRONOUN";
    else if (matchedPOS === "NUM") parsed.partOfSpeech = "NUMERAL";
    else parsed.partOfSpeech = matchedPOS; // keep other POS if present
  } else {
    // fallback: search all tags for V/N/ADJ (with or without dots)
    const hasVerb = tags.some((t) => t === "V" || t.startsWith("V."));
    const hasNoun = tags.some((t) => t === "N" || t.startsWith("N."));
    const hasAdj = tags.some((t) => t === "ADJ" || t.startsWith("ADJ."));

    if (hasVerb) parsed.partOfSpeech = "VERB";
    else if (hasNoun) parsed.partOfSpeech = "NOUN";
    else if (hasAdj) parsed.partOfSpeech = "ADJECTIVE";
    else parsed.partOfSpeech = "OTHER";
  }

  // canonical maps
  const maps = {
    tense: { PST: "past", PRS: "present", FUT: "future", IMPF: "imperfect" },
    mood: { IND: "indicative", IMP: "imperative", COND: "conditional" },
    aspect: { PFV: "perfective", IPFV: "imperfective" },
    voice: { ACT: "active", PASS: "passive" },
    number: { SG: "singular", PL: "plural", DU: "dual" },
    gender: { MASC: "masculine", FEM: "feminine", NEUT: "neuter" },
    case: {
      NOM: "nominative",
      ACC: "accusative",
      GEN: "genitive",
      DAT: "dative",
      LOC: "locative",
      INS: "instrumental",
      VOC: "vocative",
      ESS: "essive",
    },
    degree: { POS: "positive", CMPR: "comparative", SPRL: "superlative" },
    person: { 1: "1", 2: "2", 3: "3" },
    humanness: { HUM: "human", NHUM: "nonhuman" },
    animacy: { ANIM: "animate", INAN: "inanimate" },
  };

  for (const t of tags) {
    // Handle dotted tags (V.PTCP, V.MSDR, etc.) by extracting the suffix
    const parts = t.split(".");
    const mainTag = parts.length > 1 ? parts[1] : t;

    // flags / boolean tags
    if (mainTag === "NFIN" || t === "NFIN") parsed.infinitive = true;
    if (mainTag === "PTCP" || mainTag === "PCT" || t === "PTCP" || t === "PCT")
      parsed.participle = true;
    if (mainTag === "CVB" || t === "CVB") parsed.converbal = true;
    if (mainTag === "MSDR" || t === "MSDR") parsed.verbalNoun = true;
    if (mainTag === "IMPRS" || t === "IMPRS") parsed.impersonal = true;
    if (mainTag === "REFL" || mainTag === "RE" || t === "REFL" || t === "RE")
      parsed.reflexive = true;

    if (t === "NEG") parsed.polarity = "negative";
    if (t === "POS") parsed.polarity = "positive";

    // mappings
    if (maps.tense[t]) parsed.tense = maps.tense[t];
    if (maps.mood && maps.mood[t]) parsed.mood = maps.mood[t];
    if (maps.aspect[t]) parsed.aspect = maps.aspect[t];
    if (maps.voice[t]) parsed.voice = maps.voice[t];
    if (maps.case[t]) parsed.case = maps.case[t];
    if (maps.number[t]) parsed.number = maps.number[t];
    if (maps.gender[t]) parsed.gender = maps.gender[t];
    if (maps.person[t]) parsed.person = maps.person[t];
    if (maps.humanness[t]) parsed.humanness = maps.humanness[t];
    if (maps.animacy[t]) parsed.animacy = maps.animacy[t];
    if (maps.degree[t]) parsed.degree = maps.degree[t];

    // Build known tags set
    const known = new Set([
      ...Object.keys(maps.tense),
      ...Object.keys(maps.mood || {}),
      ...Object.keys(maps.aspect),
      ...Object.keys(maps.voice),
      ...Object.keys(maps.case),
      ...Object.keys(maps.number),
      ...Object.keys(maps.gender),
      ...Object.keys(maps.person),
      ...Object.keys(maps.humanness),
      ...Object.keys(maps.animacy),
      ...Object.keys(maps.degree),
      "V",
      "N",
      "ADJ",
      "ADV",
      "PRON",
      "NUM",
      "DET",
      "AUX",
      "PTCP",
      "PCT",
      "MSDR",
      "CVB",
      "NFIN",
      "IMPRS",
      "REFL",
      "RE",
      "NEG",
      "POS",
    ]);

    // Check both the full tag and the main part (for V.PTCP, etc.)
    if (
      !known.has(t) &&
      !known.has(mainTag) &&
      !t.startsWith("V.") &&
      !t.startsWith("N.") &&
      !t.startsWith("ADJ.")
    ) {
      parsed.otherTags.push(t);
    }
  }

  // normalize empty otherTags to null to save space
  if (parsed.otherTags.length === 0) parsed.otherTags = null;

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
