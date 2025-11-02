import express from "express";
import {
  getAllVocabularies,
  searchVocabulary,
  getCategories,
  addVocabulary,
  updateVocabulary,
  deleteVocabulary,
  bulkDeleteVocabulary,
} from "../controllers/vocabularyController.js";

const router = express.Router();

// GET routes
router.get("/", getAllVocabularies);
router.get("/search", searchVocabulary);
router.get("/categories", getCategories);

// POST routes
router.post("/", addVocabulary);

// PUT routes
router.put("/:id", updateVocabulary);

// DELETE routes
router.delete("/bulk", bulkDeleteVocabulary);
router.delete("/:id", deleteVocabulary);

export default router;
