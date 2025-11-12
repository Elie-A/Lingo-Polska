import NodeCache from "node-cache";
import Word from "../models/Word.js";
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
import { groupVerbForms, groupNominalForms } from "../utils/word/wordsUtils.js";

const cache = new NodeCache({ stdTTL: 3600 });

// Get all unique lemmas (for search/autocomplete)
export const getLemmas = async (req, res) => {
  try {
    // Create a cache key based on query params
    const cacheKey = `lemmas:${JSON.stringify(req.query)}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return handleSuccess(res, cached, "Cached lemmas");
    }

    const { pipeline } = buildLemmaQuery(req.query);
    const lemmas = await Word.aggregate(pipeline);

    const data = lemmas.map((l) => ({
      lemma: l._id.lemma,
      partOfSpeech: l._id.pos,
      formCount: l.count,
    }));

    // Store in cache
    cache.set(cacheKey, data);

    handleSuccess(res, data, "Lemmas fetched successfully");
  } catch (error) {
    handleError(res, error);
  }
};

// Main lookup: Get full declension/conjugation (auto-detects lemma or inflected form)
export const getInflections = async (req, res) => {
  try {
    let { word } = req.params;
    word = word.trim().toLowerCase(); // normalize input

    // Check cache first
    const cached = cache.get(word);
    if (cached) {
      return handleSuccess(res, cached, "Cached result");
    }

    // Try to find lemma directly
    let forms = await Word.find({ lemma: word });

    // If not found, try as inflected form
    if (!forms.length) {
      const inflected = await Word.findOne({ inflectedForm: word });
      if (inflected) {
        word = inflected.lemma;
        forms = await Word.find({ lemma: word });
      }
    }

    // Not found → 404
    if (!forms.length) {
      return handleNotFound(res, `No forms found for '${word}'`);
    }

    // Detect part of speech
    const partOfSpeech = forms[0].partOfSpeech;

    // Group forms
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
        inflections = { other: forms };
    }

    const responseData = {
      lemma: word,
      partOfSpeech,
      totalForms: forms.length,
      inflections,
    };

    // Store in cache
    cache.set(word, responseData);

    // Return
    handleSuccess(
      res,
      responseData,
      `All forms for '${word}' (${partOfSpeech})`
    );
  } catch (error) {
    handleError(res, error);
  }
};

// Search inflected forms by morphological features
export const searchForms = async (req, res) => {
  try {
    // Create a cache key based on search body
    const cacheKey = `search:${JSON.stringify(req.body)}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return handleSuccess(res, cached, "Cached search results");
    }

    const query = buildSearchQuery(req.body);
    const results = await Word.find(query).limit(100);

    // Store in cache
    cache.set(cacheKey, results);

    handleSuccess(res, results, "Search results");
  } catch (error) {
    handleError(res, error);
  }
};

// Statistics endpoint
export const getStats = async (req, res) => {
  try {
    const cacheKey = "stats";
    const cached = cache.get(cacheKey);
    if (cached) {
      return handleSuccess(res, cached, "Cached statistics");
    }

    const pipeline = buildStatsAggregation();
    const stats = await Word.aggregate(pipeline);

    // Store in cache with TTL (e.g., 6 hours = 21600 seconds)
    cache.set(cacheKey, stats, 21600);

    handleSuccess(res, stats, "Statistics fetched successfully");
  } catch (error) {
    handleError(res, error);
  }
};
