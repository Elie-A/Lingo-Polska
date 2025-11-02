import express from "express";
import {
  getExercises,
  getExerciseById,
  getFilters,
  getRandomExercise,
} from "../controllers/practiceController.js";

const router = express.Router();

router.get("/filters", getFilters);
router.get("/random", getRandomExercise);
router.get("/:id", getExerciseById);
router.get("/", getExercises);

export default router;
