import express from "express";
import {
  validatePolishText,
  detectLevel,
  healthCheck,
} from "../controllers/polishValidatorController.js";

import {
  aiValidationLimiter,
  levelDetectionLimiter,
  speedLimiter,
  rateLimitInfo,
} from "../middleware/rateLimiter/rateLimiter.js";

// Import rate limit logging
import {
  logRateLimitHit,
  checkRateLimitStatus,
  rateLimitWarning,
} from "../middleware/rateLimiter/rateLimiterLogger.js";

const router = express.Router();

// Apply logging and warning middleware to all routes
router.use(logRateLimitHit);
router.use(rateLimitWarning);

/**
 * @route   POST /api/validate-polish
 * @desc    Validate Polish text and get AI feedback
 * @access  Public (can add authentication middleware later)
 * @body    { text: string, userRole: 'student' | 'teacher', level: 'beginner' | 'intermediate' | 'advanced' }
 */
router.post(
  "/validate-polish",
  speedLimiter,
  aiValidationLimiter,
  rateLimitInfo,
  validatePolishText
);

/**
 * @route   POST /api/detect-level
 * @desc    Auto-detect proficiency level of Polish text
 * @access  Public
 * @body    { text: string }
 */
router.post(
  "/detect-level",
  speedLimiter, // Gradual slowdown
  levelDetectionLimiter, // Rate limit
  rateLimitInfo, // Add rate limit info to response
  detectLevel
);

/**
 * @route   GET /api/polish-validation/health
 * @desc    Health check for Polish validation service
 * @access  Public
 */
router.get("/health", healthCheck);

router.get("/rate-limit/status", checkRateLimitStatus);

export default router;
