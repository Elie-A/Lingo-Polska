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

import { verifyAdmin } from "../middleware/auth/authMiddleware.js";

const router = express.Router();

// GET routes
router.get("/", getAllVocabularies);
router.get("/search", searchVocabulary);
router.get("/categories", getCategories);

// POST routes
router.post("/", verifyAdmin, addVocabulary);

// PUT routes
router.put("/:id", verifyAdmin, updateVocabulary);

// DELETE routes
router.delete("/bulk", verifyAdmin, bulkDeleteVocabulary);
router.delete("/:id", verifyAdmin, deleteVocabulary);

export default router;
