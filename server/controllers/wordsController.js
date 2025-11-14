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
import {
  handleSuccess,
  handleError,
  handleNotFound,
} from "../utils/responseHandler.js";
import {
  buildSearchQuery,
  buildStatsAggregation,
  buildLemmaQuery,
} from "../utils/word/wordQueries.js";
import {
  groupVerbForms,
  groupNominalForms,
  groupOtherForms,
} from "../utils/word/wordsUtils.js";

const cache = new NodeCache({ stdTTL: 3600 });

// POS → model mapping
const posModelMap = {
  VERB: VerbWord,
  NOUN: NounWord,
  ADJECTIVE: AdjectiveWord,
  ADVERB: AdverbWord,
  PRONOUN: PronounWord,
  NUMERAL: NumeralWord,
};

// ---------------- Helper functions ---------------- //

// Search all models for a lemma (parallel)
const findFormsByLemma = async (lemma) => {
  const promises = Object.values(posModelMap).map((model) =>
    model.find({ lemma })
  );
  const results = await Promise.all(promises);
  return results.find((arr) => arr.length) || [];
};

// Search for an inflected form (parallel)
const findLemmaByInflected = async (word) => {
  const promises = Object.values(posModelMap).map((model) =>
    model.findOne({ inflectedForm: word })
  );
  const results = await Promise.all(promises);
  const found = results.find((r) => r);
  return found ? found.lemma : null;
};

// ---------------- Controllers ---------------- //

// Get all unique lemmas (for autocomplete/search)
export const getLemmas = async (req, res) => {
  try {
    const cacheKey = `lemmas:${JSON.stringify(req.query)}`;
    const cached = cache.get(cacheKey);
    if (cached) return handleSuccess(res, cached, "Cached lemmas");

    const { pipeline } = buildLemmaQuery(req.query);

    const aggPromises = Object.values(posModelMap).map((model) =>
      model.aggregate(pipeline)
    );
    const aggResults = await Promise.all(aggPromises);
    const lemmas = aggResults.flat();

    const data = lemmas.map((l) => ({
      lemma: l._id.lemma,
      partOfSpeech: l._id.pos,
      formCount: l.count,
    }));

    cache.set(cacheKey, data);
    handleSuccess(res, data, "Lemmas fetched successfully");
  } catch (error) {
    handleError(res, error);
  }
};

// Get full declension/conjugation for a word
export const getInflections = async (req, res) => {
  try {
    let { word } = req.params;
    word = word.trim().toLowerCase();

    const cached = cache.get(word);
    if (cached) return handleSuccess(res, cached, "Cached result");

    let forms = await findFormsByLemma(word);

    // If not found, try as inflected form
    if (!forms.length) {
      const lemma = await findLemmaByInflected(word);
      if (lemma) forms = await findFormsByLemma(lemma);
      word = lemma || word;
    }

    if (!forms.length)
      return handleNotFound(res, `No forms found for '${word}'`);

    const partOfSpeech = forms[0].partOfSpeech;
    let inflections;

    switch (partOfSpeech) {
      case "VERB":
        inflections = groupVerbForms(forms);
        break;
      case "NOUN":
      case "ADJECTIVE":
        inflections = groupNominalForms(forms);
        break;
      default:
        inflections = groupOtherForms(forms);
    }

    const responseData = {
      lemma: word,
      partOfSpeech,
      totalForms: forms.length,
      inflections,
    };

    cache.set(word, responseData);
    handleSuccess(
      res,
      responseData,
      `All forms for '${word}' (${partOfSpeech})`
    );
  } catch (error) {
    handleError(res, error);
  }
};

// Search forms by morphological features
export const searchForms = async (req, res) => {
  try {
    const cacheKey = `search:${JSON.stringify(req.body)}`;
    const cached = cache.get(cacheKey);
    if (cached) return handleSuccess(res, cached, "Cached search results");

    const query = buildSearchQuery(req.body);

    const searchPromises = Object.values(posModelMap).map((model) =>
      model.find(query).limit(100)
    );
    const resultsArrays = await Promise.all(searchPromises);
    const results = resultsArrays.flat();

    // Optional: group by POS if needed for UI
    const groupedByPOS = results.reduce((acc, f) => {
      const pos = f.partOfSpeech || "OTHER";
      acc[pos] = acc[pos] || [];
      acc[pos].push(f);
      return acc;
    }, {});

    cache.set(cacheKey, groupedByPOS);
    handleSuccess(res, groupedByPOS, "Search results");
  } catch (error) {
    handleError(res, error);
  }
};

// Statistics endpoint
export const getStats = async (req, res) => {
  try {
    const cacheKey = "stats";
    const cached = cache.get(cacheKey);
    if (cached) return handleSuccess(res, cached, "Cached statistics");

    const pipeline = buildStatsAggregation();

    const statsPromises = Object.values(posModelMap).map((model) =>
      model.aggregate(pipeline)
    );
    const statsArrays = await Promise.all(statsPromises);
    const stats = statsArrays.flat();

    cache.set(cacheKey, stats, 21600); // 6 hours
    handleSuccess(res, stats, "Statistics fetched successfully");
  } catch (error) {
    handleError(res, error);
  }
};
