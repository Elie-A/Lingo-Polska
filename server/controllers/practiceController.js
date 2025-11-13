import { Op, Sequelize } from "sequelize";
import Exercise from "../models/Exercise.js";
import {
  ReadingComprehensionExercise,
  Question,
} from "../models/ReadingComprehensionExercise.js";
import {
  handleSuccess,
  handleError,
  handleNotFound,
} from "../utils/responseHandler.js";

// In-memory cache for filters
let filtersCache = null;
let filtersCacheTime = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Utility: build WHERE filters
const buildWhere = (topic, type, level) => {
  const where = {};
  if (topic) where.topic = { [Op.iLike]: topic };
  if (type) where.type = { [Op.iLike]: type };
  if (level) where.level = { [Op.iLike]: level };
  return where;
};

// -----------------------------------------------------------------------------
// GET /api/practice
// -----------------------------------------------------------------------------
export const getExercises = async (req, res) => {
  try {
    const {
      topic,
      type,
      level,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const numLimit = Number(limit);
    const sortDirection = order === "asc" ? "ASC" : "DESC";

    const isReading = type === "reading-comprehension";
    const Model = isReading ? ReadingComprehensionExercise : Exercise;
    const where = isReading
      ? buildWhere(topic, null, level)
      : buildWhere(topic, type, level);

    const { rows: exercises, count: total } = await Model.findAndCountAll({
      where,
      include: isReading ? [{ model: Question, as: "questions" }] : [],
      order: [[sortBy, sortDirection]],
      offset,
      limit: numLimit,
    });

    if (!exercises.length) return handleNotFound(res, "No exercises found");

    handleSuccess(res, {
      data: exercises,
      pagination: {
        total,
        totalPages: Math.ceil(total / numLimit),
        page: Number(page),
        limit: numLimit,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch exercises");
  }
};

// -----------------------------------------------------------------------------
// GET /api/practice/:id
// -----------------------------------------------------------------------------
export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;

    let exercise = await Exercise.findByPk(id);
    if (!exercise) {
      exercise = await ReadingComprehensionExercise.findByPk(id, {
        include: [{ model: Question, as: "questions" }],
      });
    }

    if (!exercise) return handleNotFound(res, "Exercise not found");

    handleSuccess(res, exercise);
  } catch (error) {
    handleError(res, error, "Failed to fetch exercise");
  }
};

// -----------------------------------------------------------------------------
// GET /api/practice/random
// -----------------------------------------------------------------------------
export const getRandomExercise = async (req, res) => {
  try {
    const { topic, type, level, limit = 1 } = req.query;
    const numLimit = Math.min(Number(limit), 100);
    let exercises = [];

    if (!type) {
      // Fetch from both models
      const [exerciseResults, readingResults] = await Promise.all([
        Exercise.findAll({
          where: buildWhere(topic, null, level),
          order: Sequelize.literal("RANDOM()"),
          limit: numLimit,
        }),
        ReadingComprehensionExercise.findAll({
          where: buildWhere(topic, null, level),
          include: [{ model: Question, as: "questions" }],
          order: Sequelize.literal("RANDOM()"),
          limit: numLimit,
        }),
      ]);

      exercises = [...exerciseResults, ...readingResults].slice(0, numLimit);
    } else if (type === "reading-comprehension") {
      exercises = await ReadingComprehensionExercise.findAll({
        where: buildWhere(topic, null, level),
        include: [{ model: Question, as: "questions" }],
        order: Sequelize.literal("RANDOM()"),
        limit: numLimit,
      });
    } else {
      exercises = await Exercise.findAll({
        where: buildWhere(topic, type, level),
        order: Sequelize.literal("RANDOM()"),
        limit: numLimit,
      });
    }

    if (!exercises.length) return handleNotFound(res, "No exercises found");

    handleSuccess(res, exercises);
  } catch (error) {
    handleError(res, error, "Failed to fetch random exercises");
  }
};

// -----------------------------------------------------------------------------
// GET /api/practice/filters
// -----------------------------------------------------------------------------
export const getFilters = async (req, res) => {
  try {
    const now = Date.now();

    // Check cache validity
    if (
      filtersCache &&
      filtersCacheTime &&
      now - filtersCacheTime < CACHE_TTL
    ) {
      return handleSuccess(res, filtersCache, "Filters (cached)");
    }

    // Collect distinct filters from both models
    const [
      exerciseTopics,
      exerciseTypes,
      exerciseLevels,
      readingTopics,
      readingLevels,
    ] = await Promise.all([
      Exercise.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("topic")), "topic"],
        ],
      }),
      Exercise.findAll({
        attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("type")), "type"]],
      }),
      Exercise.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("level")), "level"],
        ],
      }),
      ReadingComprehensionExercise.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("topic")), "topic"],
        ],
      }),
      ReadingComprehensionExercise.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("level")), "level"],
        ],
      }),
    ]);

    const extractValues = (rows, key) =>
      rows.map((r) => r.dataValues[key]).filter(Boolean);

    const filters = {
      topics: Array.from(
        new Set([
          ...extractValues(exerciseTopics, "topic"),
          ...extractValues(readingTopics, "topic"),
        ])
      ).sort(),
      types: Array.from(
        new Set([
          ...extractValues(exerciseTypes, "type"),
          "reading-comprehension",
        ])
      ).sort(),
      levels: Array.from(
        new Set([
          ...extractValues(exerciseLevels, "level"),
          ...extractValues(readingLevels, "level"),
        ])
      ).sort(),
    };

    // Cache the filters
    filtersCache = filters;
    filtersCacheTime = now;

    handleSuccess(res, filters);
  } catch (error) {
    handleError(res, error, "Failed to fetch filters");
  }
};

// -----------------------------------------------------------------------------
// Cache invalidation (for admin use)
// -----------------------------------------------------------------------------
export const invalidateFiltersCache = () => {
  filtersCache = null;
  filtersCacheTime = null;
};
