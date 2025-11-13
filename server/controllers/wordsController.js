import NodeCache from "node-cache";
import Word from "../models/word.js";
import {
  handleSuccess,
  handleError,
  handleNotFound,
} from "../utils/responseHandler.js";
import {
  buildSearchQuery,
  buildStatsQuery,
  buildLemmaQuery,
} from "../utils/word/wordQueries.js";
import { groupVerbForms, groupNominalForms } from "../utils/word/wordsUtils.js";
import { Op, QueryTypes } from "sequelize";
import sequelize from "../config/database.js";

const cache = new NodeCache({ stdTTL: 3600 });

// ------------------------------
// Get all unique lemmas
// ------------------------------
export const getLemmas = async (req, res) => {
  try {
    const cacheKey = `lemmas:${JSON.stringify(req.query)}`;
    const cached = cache.get(cacheKey);
    if (cached) return handleSuccess(res, cached, "Cached lemmas");

    const { where, limit } = buildLemmaQuery(req.query);

    const lemmas = await Word.findAll({
      where,
      attributes: [
        "lemma",
        "partOfSpeech",
        [sequelize.fn("COUNT", sequelize.col("inflected_form")), "formCount"],
      ],
      group: ["lemma", "partOfSpeech"],
      order: [["lemma", "ASC"]],
      limit,
      raw: true,
    });

    cache.set(cacheKey, lemmas);
    handleSuccess(res, lemmas, "Lemmas fetched successfully");
  } catch (error) {
    handleError(res, error);
  }
};

// ------------------------------
// Get all inflections (declension/conjugation)
// ------------------------------
export const getInflections = async (req, res) => {
  try {
    let { word } = req.params;
    word = word.trim().toLowerCase();

    const cached = cache.get(word);
    if (cached) return handleSuccess(res, cached, "Cached result");

    // Try as lemma
    let forms = await Word.findAll({ where: { lemma: word } });

    // Try as inflected form
    if (!forms.length) {
      const inflected = await Word.findOne({ where: { inflectedForm: word } });
      if (inflected) {
        word = inflected.lemma;
        forms = await Word.findAll({ where: { lemma: word } });
      }
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
        inflections = { other: forms };
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

// ------------------------------
// Search forms
// ------------------------------
export const searchForms = async (req, res) => {
  try {
    const cacheKey = `search:${JSON.stringify(req.body)}`;
    const cached = cache.get(cacheKey);
    if (cached) return handleSuccess(res, cached, "Cached search results");

    const { where, limit } = buildSearchQuery(req.body);

    const results = await Word.findAll({
      where,
      limit,
      raw: true,
    });

    cache.set(cacheKey, results);
    handleSuccess(res, results, "Search results");
  } catch (error) {
    handleError(res, error);
  }
};

// ------------------------------
// Statistics
// ------------------------------
export const getStats = async (req, res) => {
  try {
    const cacheKey = "stats";
    const cached = cache.get(cacheKey);
    if (cached) return handleSuccess(res, cached, "Cached statistics");

    const stats = await sequelize.query(buildStatsQuery(), {
      type: QueryTypes.SELECT,
    });

    cache.set(cacheKey, stats, 21600); // 6 hours
    handleSuccess(res, stats, "Statistics fetched successfully");
  } catch (error) {
    handleError(res, error);
  }
};
