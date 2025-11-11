import ReadingComprehensionExercise from "../models/ReadingComprehensionExercise.js";
import {
  handleSuccess,
  handleError,
  handleNotFound,
} from "../utils/responseHandler.js";

// Validation
const validateReadingComprehensionExercise = ({
  text,
  topic,
  level,
  questions,
}) => {
  if (
    !text ||
    !topic ||
    !level ||
    !questions ||
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    const error = new Error(
      "Text, topic, level, and at least one question are required"
    );
    error.statusCode = 400;
    throw error;
  }
};

// GET /api/reading
export const getAllReadingComprehensionExercises = async (req, res) => {
  try {
    const { topic, level, page = 1, limit = 20 } = req.query;
    const match = {};
    if (topic) match.topic = topic;
    if (level) match.level = level;

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      ReadingComprehensionExercise.find(match)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ReadingComprehensionExercise.countDocuments(match),
    ]);

    handleSuccess(res, {
      data,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch reading exercises");
  }
};

// GET /api/reading/:id
export const getReadingComprehensionExerciseById = async (req, res) => {
  try {
    const exercise = await ReadingComprehensionExercise.findById(
      req.params.id
    ).lean();
    if (!exercise) return handleNotFound(res, "Reading exercise not found");
    handleSuccess(res, { data: exercise });
  } catch (error) {
    handleError(res, error, "Failed to fetch reading exercise");
  }
};

// GET /api/reading/random
export const getRandomReadingComprehensionExercise = async (req, res) => {
  try {
    const { topic, level, limit = 1 } = req.query;
    const numLimit = Math.min(Number(limit), 20);

    const query = {};
    if (topic) query.topic = { $regex: new RegExp(`^${topic}$`, "i") };
    if (level) query.level = { $regex: new RegExp(`^${level}$`, "i") };

    const exercises = await ReadingComprehensionExercise.aggregate([
      { $match: query },
      { $sample: { size: numLimit } },
      { $project: { __v: 0 } },
    ]);

    if (exercises.length === 0)
      return handleNotFound(res, "No reading exercises found");

    handleSuccess(res, exercises);
  } catch (error) {
    handleError(res, error, "Failed to fetch random reading exercises");
  }
};

// POST /api/reading
export const addReadingComprehensionExercise = async (req, res) => {
  try {
    validateReadingComprehensionExercise(req.body);
    const saved = await ReadingComprehensionExercise.create(req.body);
    handleSuccess(res, saved, 201);
  } catch (error) {
    handleError(res, error, "Failed to add reading exercise");
  }
};

// PUT /api/reading/:id
export const updateReadingComprehensionExercise = async (req, res) => {
  try {
    validateReadingComprehensionExercise(req.body);
    const updated = await ReadingComprehensionExercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated) return handleNotFound(res, "Reading exercise not found");
    handleSuccess(res, updated);
  } catch (error) {
    handleError(res, error, "Failed to update reading exercise");
  }
};

// DELETE /api/reading/:id
export const deleteReadingComprehensionExercise = async (req, res) => {
  try {
    const deleted = await ReadingComprehensionExercise.findByIdAndDelete(
      req.params.id
    );
    if (!deleted) return handleNotFound(res, "Reading exercise not found");
    handleSuccess(res, { message: "Reading exercise deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete reading exercise");
  }
};
