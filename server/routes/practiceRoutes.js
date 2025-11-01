import express from "express";
import {
  getExercises,
  getExerciseById,
  getFilters,
  getRandomExercise,
} from "../controllers/practiceController.js";

const router = express.Router();

// Routes
router.get("/", getExercises); // GET /api/practice?topic=&type=&level=
router.get("/filters", getFilters); // GET /api/practice/filters
router.get("/random", getRandomExercise); // GET /api/practice/random?topic=&type=&level=
router.get("/:id", getExerciseById); // GET /api/practice/:id

export default router;
