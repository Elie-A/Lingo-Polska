import express from "express";
import {
  getAllReadingComprehensionExercises,
  getReadingComprehensionExerciseById,
  addReadingComprehensionExercise,
  updateReadingComprehensionExercise,
  deleteReadingComprehensionExercise,
  getRandomReadingComprehensionExercise,
} from "../controllers/readingComprehensionExercisesController.js";

const router = express.Router();

router.get("/", getAllReadingComprehensionExercises);
router.get("/random", getRandomReadingComprehensionExercise);
router.get("/:id", getReadingComprehensionExerciseById);
router.post("/", addReadingComprehensionExercise);
router.put("/:id", updateReadingComprehensionExercise);
router.delete("/:id", deleteReadingComprehensionExercise);

export default router;
