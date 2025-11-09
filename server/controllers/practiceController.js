import Exercise from "../models/Exercise.js";
import {
  handleSuccess,
  handleError,
  handleNotFound,
} from "../utils/responseHandler.js";

// In-memory cache for filters
let filtersCache = null;
let filtersCacheTime = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

    const query = {};
    if (topic) query.topic = { $regex: new RegExp(`^${topic}$`, "i") };
    if (type) query.type = { $regex: new RegExp(`^${type}$`, "i") };
    if (level) query.level = { $regex: new RegExp(`^${level}$`, "i") };

    const skip = (Number(page) - 1) * Number(limit);
    const numLimit = Number(limit);

    const [exercises, total] = await Promise.all([
      Exercise.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(numLimit)
        .lean()
        .select("-__v"),
      Exercise.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / numLimit);

    handleSuccess(res, {
      data: exercises,
      pagination: { total, totalPages, page: Number(page), limit: numLimit },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch exercises");
  }
};

export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id).lean().select("-__v");

    if (!exercise) return handleNotFound(res, "Exercise not found");

    handleSuccess(res, exercise);
  } catch (error) {
    handleError(res, error, "Failed to fetch exercise");
  }
};

export const getRandomExercise = async (req, res) => {
  try {
    const { topic, type, level, limit = 1 } = req.query;
    const numLimit = Math.min(Number(limit), 100);

    const query = {};
    if (topic) query.topic = { $regex: new RegExp(`^${topic}$`, "i") };
    if (type) query.type = { $regex: new RegExp(`^${type}$`, "i") };
    if (level) query.level = { $regex: new RegExp(`^${level}$`, "i") };

    const exercises = await Exercise.aggregate([
      { $match: query },
      { $sample: { size: numLimit } },
      { $project: { __v: 0 } },
    ]);

    if (exercises.length === 0)
      return handleNotFound(res, "No exercises found");

    handleSuccess(res, exercises);
  } catch (error) {
    handleError(res, error, "Failed to fetch random exercises");
  }
};

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

    const [topicsResult, typesResult, levelsResult] = await Promise.all([
      Exercise.aggregate([
        { $group: { _id: "$topic" } },
        { $sort: { _id: 1 } },
      ]),
      Exercise.aggregate([{ $group: { _id: "$type" } }, { $sort: { _id: 1 } }]),
      Exercise.aggregate([
        { $group: { _id: "$level" } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const filters = {
      topics: topicsResult.map((r) => r._id).filter(Boolean),
      types: typesResult.map((r) => r._id).filter(Boolean),
      levels: levelsResult.map((r) => r._id).filter(Boolean),
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
