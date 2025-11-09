import express from "express";
import {
  getAllExercises,
  getExerciseById,
  addExercise,
  updateExercise,
  deleteExercise,
  bulkDeleteExercises,
} from "../controllers/exercisesController.js";

const router = express.Router();

router.get("/", getAllExercises);
router.get("/:id", getExerciseById);
router.post("/", addExercise);
router.put("/:id", updateExercise);
router.delete("/:id", deleteExercise);
router.delete("/", bulkDeleteExercises); // For bulk delete

export default router;
