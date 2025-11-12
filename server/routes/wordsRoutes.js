import express from "express";
import {
  getLemmas,
  getInflections,
  searchForms,
  getStats,
} from "../controllers/wordsController.js";

const router = express.Router();

// List lemmas
router.get("/lemmas", getLemmas);

// Search by morphological features (POST)
router.post("/search", searchForms);

// Stats (aggregate)
router.get("/stats", getStats);

// Main universal route: lookup by word or lemma
router.get("/:word", getInflections);

export default router;
