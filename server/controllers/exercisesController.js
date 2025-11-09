import Exercise from "../models/Exercise.js";
import {
  handleError,
  handleNotFound,
  handleSuccess,
} from "../utils/responseHandler.js";

// Validation
const validateExercise = ({ question, answer, topic, type, level }) => {
  if (!question || !answer || !topic || !type || !level) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }
};

// GET /api/exercises
export const getAllExercises = async (req, res) => {
  try {
    const { topic, type, level, page, limit } = req.query;
    const match = {};
    if (topic) match.topic = topic;
    if (type) match.type = type;
    if (level) match.level = level;

    if (page && limit) {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const [exercises, totalCount] = await Promise.all([
        Exercise.find(match)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Exercise.countDocuments(match),
      ]);

      return handleSuccess(res, {
        data: exercises,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalItems: totalCount,
          itemsPerPage: limitNum,
        },
      });
    }

    const exercises = await Exercise.find(match).sort({ createdAt: -1 }).lean();
    handleSuccess(res, { data: exercises });
  } catch (error) {
    handleError(res, error, "Failed to fetch exercises");
  }
};

// GET /api/exercises/:id
export const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id).lean();
    if (!exercise) return handleNotFound(res, "Exercise not found");
    handleSuccess(res, { data: exercise });
  } catch (error) {
    handleError(res, error, "Failed to fetch exercise");
  }
};

// POST /api/exercises
export const addExercise = async (req, res) => {
  try {
    validateExercise(req.body);
    const savedExercise = await Exercise.create(req.body);
    handleSuccess(res, savedExercise, 201);
  } catch (error) {
    handleError(res, error, "Failed to add exercise");
  }
};

// PUT /api/exercises/:id
export const updateExercise = async (req, res) => {
  try {
    validateExercise(req.body);
    const updated = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return handleNotFound(res, "Exercise not found");
    handleSuccess(res, updated);
  } catch (error) {
    handleError(res, error, "Failed to update exercise");
  }
};

// DELETE /api/exercises/:id
export const deleteExercise = async (req, res) => {
  try {
    const deleted = await Exercise.findByIdAndDelete(req.params.id);
    if (!deleted) return handleNotFound(res, "Exercise not found");
    handleSuccess(res, { message: "Exercise deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete exercise");
  }
};

// DELETE /api/exercises (bulk delete)
export const bulkDeleteExercises = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      const error = new Error("Array of IDs is required");
      error.statusCode = 400;
      throw error;
    }
    const result = await Exercise.deleteMany({ _id: { $in: ids } });
    handleSuccess(res, {
      message: `${result.deletedCount} exercise(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    handleError(res, error, "Failed to delete exercises");
  }
};
