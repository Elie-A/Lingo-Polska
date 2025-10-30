import express from "express";
import { sendContactEmail } from "../controllers/contactController.js";
import cors from "cors";

const router = express.Router();

router.options("/", cors()); // preflight
router.post("/", cors(), sendContactEmail);

export default router;
