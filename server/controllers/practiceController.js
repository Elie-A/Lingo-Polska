import Exercise from "../models/Exercise.js";
import ReadingComprehensionExercise from "../models/ReadingComprehensionExercise.js";
import {
  handleSuccess,
  handleError,
  handleNotFound,
} from "../utils/responseHandler.js";

// In-memory cache for filters
let filtersCache = null;
let filtersCacheTime = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const buildQuery = (topic, type, level) => {
  const query = {};
  if (topic) query.topic = { $regex: new RegExp(`^${topic}$`, "i") };
  if (type) query.type = { $regex: new RegExp(`^${type}$`, "i") };
  if (level) query.level = { $regex: new RegExp(`^${level}$`, "i") };
  return query;
};

// Fetch paginated exercises
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

    const skip = (Number(page) - 1) * Number(limit);
    const numLimit = Number(limit);

    // Determine model based on type
    const isReading = type === "reading-comprehension";
    const Model = isReading ? ReadingComprehensionExercise : Exercise;
    const query = isReading
      ? buildQuery(topic, null, level)
      : buildQuery(topic, type, level);

    const [exercises, total] = await Promise.all([
      Model.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(numLimit)
        .lean()
        .select("-__v"),
      Model.countDocuments(query),
    ]);

    if (!exercises.length) return handleNotFound(res, "No exercises found");

    const totalPages = Math.ceil(total / numLimit);

    handleSuccess(res, {
      data: exercises,
      pagination: { total, totalPages, page: Number(page), limit: numLimit },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch exercises");
  }
};

// Fetch single exercise by ID
export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;

    let exercise = await Exercise.findById(id).lean().select("-__v");
    if (!exercise) {
      exercise = await ReadingComprehensionExercise.findById(id)
        .lean()
        .select("-__v");
    }

    if (!exercise) return handleNotFound(res, "Exercise not found");

    handleSuccess(res, exercise);
  } catch (error) {
    handleError(res, error, "Failed to fetch exercise");
  }
};

// Fetch random exercises (any type if type not specified)
export const getRandomExercise = async (req, res) => {
  try {
    const { topic, type, level, limit = 1 } = req.query;
    const numLimit = Math.min(Number(limit), 100);

    let exercises = [];

    if (!type) {
      // No type specified → fetch from both collections
      const queries = [
        Exercise.aggregate([
          { $match: buildQuery(topic, null, level) },
          { $sample: { size: numLimit } },
          { $project: { __v: 0 } },
        ]),
        ReadingComprehensionExercise.aggregate([
          { $match: buildQuery(topic, null, level) },
          { $sample: { size: numLimit } },
          { $project: { __v: 0 } },
        ]),
      ];

      const [exerciseResults, readingResults] = await Promise.all(queries);
      exercises = [...exerciseResults, ...readingResults].slice(0, numLimit);
    } else if (type === "reading-comprehension") {
      exercises = await ReadingComprehensionExercise.aggregate([
        { $match: buildQuery(topic, null, level) },
        { $sample: { size: numLimit } },
        { $project: { __v: 0 } },
      ]);
    } else {
      exercises = await Exercise.aggregate([
        { $match: buildQuery(topic, type, level) },
        { $sample: { size: numLimit } },
        { $project: { __v: 0 } },
      ]);
    }

    if (!exercises.length) return handleNotFound(res, "No exercises found");

    handleSuccess(res, exercises);
  } catch (error) {
    handleError(res, error, "Failed to fetch random exercises");
  }
};

// Fetch available filters
export const getFilters = async (req, res) => {
  try {
    const now = Date.now();

    if (
      filtersCache &&
      filtersCacheTime &&
      now - filtersCacheTime < CACHE_TTL
    ) {
      return handleSuccess(res, filtersCache, "Filters (cached)");
    }

    const [exerciseTopics, exerciseTypes, exerciseLevels] = await Promise.all([
      Exercise.distinct("topic"),
      Exercise.distinct("type"),
      Exercise.distinct("level"),
    ]);

    const readingTopics = await ReadingComprehensionExercise.distinct("topic");
    const readingLevels = await ReadingComprehensionExercise.distinct("level");

    const filters = {
      topics: Array.from(new Set([...exerciseTopics, ...readingTopics])).sort(),
      types: Array.from(
        new Set([...exerciseTypes, "reading-comprehension"])
      ).sort(),
      levels: Array.from(new Set([...exerciseLevels, ...readingLevels])).sort(),
    };

    filtersCache = filters;
    filtersCacheTime = now;

    handleSuccess(res, filters);
  } catch (error) {
    handleError(res, error, "Failed to fetch filters");
  }
};

export const invalidateFiltersCache = () => {
  filtersCache = null;
  filtersCacheTime = null;
};
