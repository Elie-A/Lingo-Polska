import Exercise from "../models/Exercise.js";

// In-memory cache for filters (invalidate on exercise create/update/delete)
let filtersCache = null;
let filtersCacheTime = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Get all exercises with optional filters
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

    // Build dynamic case-insensitive query
    const query = {};
    if (topic) query.topic = { $regex: new RegExp(`^${topic}$`, "i") };
    if (type) query.type = { $regex: new RegExp(`^${type}$`, "i") };
    if (level) query.level = { $regex: new RegExp(`^${level}$`, "i") };

    const skip = (Number(page) - 1) * Number(limit);
    const numLimit = Number(limit);

    // Use lean() to return plain objects instead of Mongoose documents (faster)
    // Use parallel queries with Promise.all
    const [exercises, total] = await Promise.all([
      Exercise.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(numLimit)
        .lean()
        .select("-__v"), // Exclude version key
      Exercise.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / numLimit);

    res.status(200).json({
      success: true,
      data: exercises,
      pagination: {
        total,
        totalPages,
        page: Number(page),
        limit: numLimit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get single exercise by ID
export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Use lean() for faster query
    const exercise = await Exercise.findById(id).lean().select("-__v");

    if (!exercise) {
      return res
        .status(404)
        .json({ success: false, message: "Exercise not found" });
    }

    res.status(200).json({ success: true, data: exercise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get random exercise(s) - OPTIMIZED
export const getRandomExercise = async (req, res) => {
  try {
    const { topic, type, level, limit = 1 } = req.query;
    const numLimit = Math.min(Number(limit), 100); // Cap at 100

    // Build query
    const query = {};
    if (topic) query.topic = { $regex: new RegExp(`^${topic}$`, "i") };
    if (type) query.type = { $regex: new RegExp(`^${type}$`, "i") };
    if (level) query.level = { $regex: new RegExp(`^${level}$`, "i") };

    // Use MongoDB's $sample aggregation for efficient random selection
    const exercises = await Exercise.aggregate([
      { $match: query },
      { $sample: { size: numLimit } },
      { $project: { __v: 0 } },
    ]);

    if (exercises.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No exercises found" });
    }

    // Return single object if limit=1, array otherwise
    const data = numLimit === 1 ? exercises[0] : exercises;

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get distinct values for filters - CACHED
export const getFilters = async (req, res) => {
  try {
    const now = Date.now();

    // Return cached data if valid
    if (
      filtersCache &&
      filtersCacheTime &&
      now - filtersCacheTime < CACHE_TTL
    ) {
      return res.status(200).json({
        success: true,
        data: filtersCache,
        cached: true,
      });
    }

    // Use aggregation for faster distinct queries in parallel
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

    // Update cache
    filtersCache = filters;
    filtersCacheTime = now;

    res.status(200).json({
      success: true,
      data: filters,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Helper to invalidate cache (call after create/update/delete operations)
export const invalidateFiltersCache = () => {
  filtersCache = null;
  filtersCacheTime = null;
};
