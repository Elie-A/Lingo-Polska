// controllers/exerciseController.js
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
    const where = {};
    if (topic) where.topic = topic;
    if (type) where.type = type;
    if (level) where.level = level;

    if (page && limit) {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const offset = (pageNum - 1) * limitNum;

      const { rows: exercises, count: totalCount } =
        await Exercise.findAndCountAll({
          where,
          order: [["createdAt", "DESC"]],
          limit: limitNum,
          offset,
        });

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

    const exercises = await Exercise.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    handleSuccess(res, { data: exercises });
  } catch (error) {
    handleError(res, error, "Failed to fetch exercises");
  }
};

// GET /api/exercises/:id
export const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
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
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) return handleNotFound(res, "Exercise not found");

    const updated = await exercise.update(req.body);
    handleSuccess(res, updated);
  } catch (error) {
    handleError(res, error, "Failed to update exercise");
  }
};

// DELETE /api/exercises/:id
export const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) return handleNotFound(res, "Exercise not found");

    await exercise.destroy();
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

    const deletedCount = await Exercise.destroy({ where: { id: ids } });
    handleSuccess(res, {
      message: `${deletedCount} exercise(s) deleted successfully`,
      deletedCount,
    });
  } catch (error) {
    handleError(res, error, "Failed to delete exercises");
  }
};
