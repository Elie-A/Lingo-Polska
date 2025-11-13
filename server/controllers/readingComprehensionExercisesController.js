import { Op, Sequelize } from "sequelize";
import {
  ReadingComprehensionExercise,
  Question,
} from "../models/ReadingComprehensionExercise.js";
import {
  handleSuccess,
  handleError,
  handleNotFound,
} from "../utils/responseHandler.js";

// Validation
const validateReadingComprehensionExercise = ({
  title,
  text,
  topic,
  level,
  questions,
}) => {
  if (
    !title ||
    !text ||
    !topic ||
    !level ||
    !questions ||
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    const error = new Error(
      "Title, text, topic, level, and at least one question are required"
    );
    error.statusCode = 400;
    throw error;
  }
};

// -----------------------------------------------------------------------------
// GET /api/reading
// -----------------------------------------------------------------------------
export const getAllReadingComprehensionExercises = async (req, res) => {
  try {
    const { topic, level, page = 1, limit = 20 } = req.query;

    const where = {};
    if (topic) where.topic = topic;
    if (level) where.level = level;

    const offset = (Number(page) - 1) * Number(limit);

    const { rows: data, count: total } =
      await ReadingComprehensionExercise.findAndCountAll({
        where,
        include: [{ model: Question, as: "questions" }],
        order: [["createdAt", "DESC"]],
        offset,
        limit: Number(limit),
      });

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

// -----------------------------------------------------------------------------
// GET /api/reading/:id
// -----------------------------------------------------------------------------
export const getReadingComprehensionExerciseById = async (req, res) => {
  try {
    const exercise = await ReadingComprehensionExercise.findByPk(
      req.params.id,
      {
        include: [{ model: Question, as: "questions" }],
      }
    );

    if (!exercise) return handleNotFound(res, "Reading exercise not found");

    handleSuccess(res, { data: exercise });
  } catch (error) {
    handleError(res, error, "Failed to fetch reading exercise");
  }
};

// -----------------------------------------------------------------------------
// GET /api/reading/random
// -----------------------------------------------------------------------------
export const getRandomReadingComprehensionExercise = async (req, res) => {
  try {
    const { topic, level, limit = 1 } = req.query;
    const numLimit = Math.min(Number(limit), 20);

    const where = {};
    if (topic) where.topic = { [Op.iLike]: topic };
    if (level) where.level = { [Op.iLike]: level };

    const exercises = await ReadingComprehensionExercise.findAll({
      where,
      include: [{ model: Question, as: "questions" }],
      order: Sequelize.literal("RANDOM()"),
      limit: numLimit,
    });

    if (exercises.length === 0)
      return handleNotFound(res, "No reading exercises found");

    handleSuccess(res, exercises);
  } catch (error) {
    handleError(res, error, "Failed to fetch random reading exercises");
  }
};

// -----------------------------------------------------------------------------
// POST /api/reading
// -----------------------------------------------------------------------------
export const addReadingComprehensionExercise = async (req, res) => {
  const transaction =
    await ReadingComprehensionExercise.sequelize.transaction();
  try {
    validateReadingComprehensionExercise(req.body);

    const { title, text, topic, level, tags, questions } = req.body;

    const exercise = await ReadingComprehensionExercise.create(
      { title, text, topic, level, tags },
      { transaction }
    );

    await Question.bulkCreate(
      questions.map((q) => ({ ...q, exerciseId: exercise.id })),
      { transaction }
    );

    await transaction.commit();

    const result = await ReadingComprehensionExercise.findByPk(exercise.id, {
      include: [{ model: Question, as: "questions" }],
    });

    handleSuccess(res, result, 201);
  } catch (error) {
    await transaction.rollback();
    handleError(res, error, "Failed to add reading exercise");
  }
};

// -----------------------------------------------------------------------------
// PUT /api/reading/:id
// -----------------------------------------------------------------------------
export const updateReadingComprehensionExercise = async (req, res) => {
  const transaction =
    await ReadingComprehensionExercise.sequelize.transaction();
  try {
    validateReadingComprehensionExercise(req.body);

    const { title, text, topic, level, tags, questions } = req.body;

    const exercise = await ReadingComprehensionExercise.findByPk(
      req.params.id,
      {
        include: [{ model: Question, as: "questions" }],
      }
    );

    if (!exercise) {
      await transaction.rollback();
      return handleNotFound(res, "Reading exercise not found");
    }

    await exercise.update({ title, text, topic, level, tags }, { transaction });

    // Delete old questions and re-create
    await Question.destroy({ where: { exerciseId: exercise.id }, transaction });
    await Question.bulkCreate(
      questions.map((q) => ({ ...q, exerciseId: exercise.id })),
      { transaction }
    );

    await transaction.commit();

    const updated = await ReadingComprehensionExercise.findByPk(exercise.id, {
      include: [{ model: Question, as: "questions" }],
    });

    handleSuccess(res, updated);
  } catch (error) {
    await transaction.rollback();
    handleError(res, error, "Failed to update reading exercise");
  }
};

// -----------------------------------------------------------------------------
// DELETE /api/reading/:id
// -----------------------------------------------------------------------------
export const deleteReadingComprehensionExercise = async (req, res) => {
  const transaction =
    await ReadingComprehensionExercise.sequelize.transaction();
  try {
    const exercise = await ReadingComprehensionExercise.findByPk(req.params.id);

    if (!exercise) {
      await transaction.rollback();
      return handleNotFound(res, "Reading exercise not found");
    }

    await exercise.destroy({ transaction });
    await transaction.commit();

    handleSuccess(res, { message: "Reading exercise deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    handleError(res, error, "Failed to delete reading exercise");
  }
};
