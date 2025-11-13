import Vocabulary from "../models/Vocabulary.js";
import {
  handleSuccess,
  handleError,
  handleNotFound,
} from "../utils/responseHandler.js";
import { Op } from "sequelize";

// Validation
const validateVocabulary = ({ polish, english, category, level }) => {
  if (!polish || !english || !category || !level) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }
};

/** GET /api/vocabulary */
export const getAllVocabularies = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const totalCount = await Vocabulary.count();
    const vocab = await Vocabulary.findAll({
      order: [
        ["category", "ASC"],
        ["polish", "ASC"],
      ],
      offset,
      limit: limitNum,
      raw: true,
    });

    // Optional grouping
    const groupedVocab = vocab.reduce((acc, word) => {
      const group = acc.find((g) => g._id === word.category);
      if (group) group.words.push(word);
      else acc.push({ _id: word.category, words: [word] });
      return acc;
    }, []);

    handleSuccess(res, {
      data: groupedVocab,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch vocabularies");
  }
};

/** GET /api/vocabulary/search */
export const searchVocabulary = async (req, res) => {
  try {
    const { q, level, category, page = 1, limit = 50 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    if (q) {
      where[Op.or] = [
        { polish: { [Op.iLike]: `%${q}%` } },
        { english: { [Op.iLike]: `%${q}%` } },
      ];
    }
    if (level) where.level = level;
    if (category) where.category = category;

    const [results, totalCount] = await Promise.all([
      Vocabulary.findAll({
        where,
        attributes: [
          "id",
          "polish",
          "english",
          "level",
          "category",
          "createdAt",
        ],
        order: [
          ["category", "ASC"],
          ["polish", "ASC"],
        ],
        offset,
        limit: limitNum,
        raw: true,
      }),
      Vocabulary.count({ where }),
    ]);

    res.set("Cache-Control", "public, max-age=60"); // 1 minute cache
    handleSuccess(res, {
      data: results,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to search vocabulary");
  }
};

/** GET /api/vocabulary/categories */
export const getCategories = async (req, res) => {
  try {
    const categories = await Vocabulary.findAll({
      attributes: ["category"],
      group: ["category"],
      raw: true,
    });
    res.set("Cache-Control", "public, max-age=600"); // 10 minutes cache
    handleSuccess(res, categories.map((c) => c.category).sort());
  } catch (error) {
    handleError(res, error, "Failed to fetch categories");
  }
};

/** POST /api/vocabulary */
export const addVocabulary = async (req, res) => {
  try {
    validateVocabulary(req.body);
    const { polish, english, category, level } = req.body;

    const existingWord = await Vocabulary.findOne({
      where: { polish, english, category, level },
    });

    if (existingWord)
      return res
        .status(409)
        .json({ message: "This translation already exists for this word" });

    const savedWord = await Vocabulary.create(req.body);
    handleSuccess(res, savedWord, 201);
  } catch (error) {
    handleError(res, error, "Failed to add vocabulary");
  }
};

/** PUT /api/vocabulary/:id */
export const updateVocabulary = async (req, res) => {
  try {
    validateVocabulary(req.body);
    const { polish, english, category, level } = req.body;

    const duplicateCheck = await Vocabulary.findOne({
      where: {
        id: { [Op.ne]: req.params.id },
        polish,
        english,
        category,
        level,
      },
    });

    if (duplicateCheck)
      return res
        .status(409)
        .json({ message: "This translation already exists for this word" });

    const [updatedCount, [updated]] = await Vocabulary.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });

    if (updatedCount === 0) return handleNotFound(res, "Word not found");
    handleSuccess(res, updated);
  } catch (error) {
    handleError(res, error, "Failed to update vocabulary");
  }
};

/** DELETE /api/vocabulary/:id */
export const deleteVocabulary = async (req, res) => {
  try {
    const deletedCount = await Vocabulary.destroy({
      where: { id: req.params.id },
    });
    if (!deletedCount) return handleNotFound(res, "Word not found");

    handleSuccess(res, { message: "Word deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete vocabulary");
  }
};

/** DELETE /api/vocabulary - Bulk delete */
export const bulkDeleteVocabulary = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      const error = new Error("Array of IDs is required");
      error.statusCode = 400;
      throw error;
    }

    const deletedCount = await Vocabulary.destroy({ where: { id: ids } });
    handleSuccess(res, {
      message: `${deletedCount} word(s) deleted successfully`,
      deletedCount,
    });
  } catch (error) {
    handleError(res, error, "Failed to delete vocabulary");
  }
};
