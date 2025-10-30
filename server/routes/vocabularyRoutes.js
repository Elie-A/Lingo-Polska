import express from "express";
import {
  getAllVocabularies,
  addVocabulary,
  deleteVocabulary,
} from "../controllers/vocabularyController.js";

const router = express.Router();

// GET /api/vocabulary?level=A1&category=food
router.get("/", getAllVocabularies);

// POST /api/vocabulary
router.post("/", addVocabulary);

// DELETE /api/vocabulary/:id
router.delete("/:id", deleteVocabulary);

export default router;
