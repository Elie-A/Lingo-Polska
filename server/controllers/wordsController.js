// controllers/wordController.js
import NodeCache from "node-cache";
import {
  VerbWord,
  NounWord,
  AdjectiveWord,
  AdverbWord,
  PronounWord,
  NumeralWord,
} from "../models/Word.js";
import { LemmaCache } from "../models/LemmaCache.js";
import {
  handleSuccess,
  handleError,
  handleNotFound,
} from "../utils/responseHandler.js";
import {
  buildSearchQuery,
  buildStatsAggregation,
} from "../utils/word/wordQueries.js";
import {
  groupVerbForms,
  groupNominalForms,
  groupOtherForms,
} from "../utils/word/wordsUtils.js";

const cache = new NodeCache({ stdTTL: 3600 });

// ---------------- POS Collections ---------------- //
const posCollections = [
  {
    model: VerbWord,
    pos: "VERB",
    fields: ["tense", "mood", "person", "number"],
  },
  { model: NounWord, pos: "NOUN", fields: ["case", "number", "gender"] },
  {
    model: AdjectiveWord,
    pos: "ADJECTIVE",
    fields: ["case", "number", "gender"],
  },
  { model: AdverbWord, pos: "ADVERB", fields: [] },
  { model: PronounWord, pos: "PRONOUN", fields: ["case", "number", "gender"] },
  { model: NumeralWord, pos: "NUMERAL", fields: ["number", "gender"] },
];

// ---------------- Helper Functions ---------------- //

// Project only needed fields to reduce memory
const projectionFields = [
  "lemma",
  "inflectedForm",
  "partOfSpeech",
  "tense",
  "mood",
  "person",
  "number",
  "case",
  "gender",
];

// Generic aggregation helper for lemma or inflected form
const aggregateAcrossPOS = async ({ matchField, value, limitOne = false }) => {
  let agg = posCollections[0].model.aggregate([
    { $match: { [matchField]: value } },
    { $project: projectionFields.reduce((a, f) => ({ ...a, [f]: 1 }), {}) },
    ...(limitOne ? [{ $limit: 1 }] : []),
  ]);

  for (const col of posCollections.slice(1)) {
    agg = agg.unionWith({
      coll: col.model.collection.name,
      pipeline: [
        { $match: { [matchField]: value } },
        { $project: projectionFields.reduce((a, f) => ({ ...a, [f]: 1 }), {}) },
        ...(limitOne ? [{ $limit: 1 }] : []),
      ],
    });
  }

  return agg;
};

// Group forms according to POS
const groupFormsByPOS = (forms) => {
  if (!forms.length) return {};
  const pos = forms[0].partOfSpeech;
  switch (pos) {
    case "VERB":
      return groupVerbForms(forms);
    case "NOUN":
    case "ADJECTIVE":
      return groupNominalForms(forms);
    default:
      return groupOtherForms(forms);
  }
};

// ---------------- Controllers ---------------- //

// 1️⃣ Get lemmas (autocomplete)
export const getLemmas = async (req, res) => {
  try {
    const cacheKey = `lemmas:${JSON.stringify(req.query)}`;
    const cached = cache.get(cacheKey);
    if (cached) return handleSuccess(res, cached, "Cached lemmas");

    const { prefix = "", limit = 50 } = req.query;

    const query = prefix
      ? { lemma: { $regex: `^${prefix}`, $options: "i" } }
      : {};

    const lemmas = await LemmaCache.find(query)
      .select("lemma partOfSpeech totalForms")
      .sort({ lemma: 1 })
      .limit(Number(limit))
      .lean();

    cache.set(cacheKey, lemmas);
    handleSuccess(res, lemmas, "Lemmas fetched successfully");
  } catch (error) {
    handleError(res, error);
  }
};

// 2️⃣ Get full inflections for a lemma or inflected form
export const getInflections = async (req, res) => {
  try {
    let { word } = req.params;
    word = decodeURIComponent(word.trim().toLowerCase());

    const cached = cache.get(word);
    if (cached) return handleSuccess(res, cached, "Cached result");

    // Try lemma first
    let forms = await aggregateAcrossPOS({ matchField: "lemma", value: word });

    // If not found, try as inflected form
    if (!forms.length) {
      const lemmaAgg = await aggregateAcrossPOS({
        matchField: "inflectedForm",
        value: word,
        limitOne: true,
      });
      const lemma = lemmaAgg.length ? lemmaAgg[0].lemma : null;
      if (lemma)
        forms = await aggregateAcrossPOS({ matchField: "lemma", value: lemma });
      word = lemma || word;
    }

    if (!forms.length)
      return handleNotFound(res, `No forms found for '${word}'`);

    const responseData = {
      lemma: word,
      partOfSpeech: forms[0].partOfSpeech,
      totalForms: forms.length,
      inflections: groupFormsByPOS(forms),
    };

    cache.set(word, responseData);
    handleSuccess(
      res,
      responseData,
      `All forms for '${word}' (${forms[0].partOfSpeech})`
    );
  } catch (error) {
    handleError(res, error);
  }
};

// 3️⃣ Search forms by morphological features
export const searchForms = async (req, res) => {
  try {
    const cacheKey = `search:${JSON.stringify(req.body)}`;
    const cached = cache.get(cacheKey);
    if (cached) return handleSuccess(res, cached, "Cached search results");

    const query = buildSearchQuery(req.body);

    let agg = posCollections[0].model.aggregate([{ $match: query }]);
    for (const col of posCollections.slice(1)) {
      agg = agg.unionWith({
        coll: col.model.collection.name,
        pipeline: [{ $match: query }],
      });
    }

    const results = await agg;

    // Group results by lemma and POS
    const grouped = {};
    results.forEach((f) => {
      const lemma = f.lemma;
      const pos = f.partOfSpeech || "OTHER";
      grouped[lemma] = grouped[lemma] || {};
      grouped[lemma][pos] = grouped[lemma][pos] || [];
      grouped[lemma][pos].push(f);
    });

    const structured = Object.entries(grouped)
      .map(([lemma, posMap]) =>
        Object.entries(posMap).map(([pos, forms]) => ({
          lemma,
          partOfSpeech: pos,
          totalForms: forms.length,
          inflections: groupFormsByPOS(forms),
        }))
      )
      .flat();

    cache.set(cacheKey, structured);
    handleSuccess(res, structured, "Search results");
  } catch (error) {
    handleError(res, error);
  }
};

// 4️⃣ Statistics endpoint
export const getStats = async (req, res) => {
  try {
    const cacheKey = "stats";
    const cached = cache.get(cacheKey);
    if (cached) return handleSuccess(res, cached, "Cached statistics");

    const pipeline = buildStatsAggregation();

    let agg = posCollections[0].model.aggregate(pipeline);
    for (const col of posCollections.slice(1)) {
      agg = agg.unionWith({ coll: col.model.collection.name, pipeline });
    }

    const stats = await agg;
    cache.set(cacheKey, stats, 21600); // 6 hours
    handleSuccess(res, stats, "Statistics fetched successfully");
  } catch (error) {
    handleError(res, error);
  }
};
