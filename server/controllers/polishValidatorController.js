/**
 * Polish Validation Controller
 * Handles validation and level detection for Polish text
 */

import aiService from "../services/aiService.js";
import {
  getPromptForLevel,
  getLevelDetectionPrompt,
} from "../utils/gemini/promptsTemplate.js";
import {
  validateTextInput,
  validateValidationInputs,
  validateDetectedLevel,
} from "../utils/gemini/validation.js";

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code
 */
const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default error message
 */
const sendError = (res, error, defaultMessage = "An error occurred") => {
  console.error(`[Controller Error]: ${error.message}`, error.stack);

  const statusCode = error.statusCode || 500;
  const message = error.message || defaultMessage;

  // Handle specific error types
  if (message === "INVALID_API_KEY") {
    return res.status(401).json({
      success: false,
      error: "Invalid API key configuration",
      message: "Please check your Gemini API key configuration",
      timestamp: new Date().toISOString(),
    });
  }

  if (
    message.includes("required") ||
    message.includes("Invalid") ||
    message.includes("must be")
  ) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message,
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(statusCode).json({
    success: false,
    error: defaultMessage,
    message,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Validate Polish text with AI feedback
 * @route POST /api/validate-polish
 * @body { text: string, userRole?: 'student' | 'teacher', level?: 'beginner' | 'intermediate' | 'advanced' }
 */
export const validatePolishText = async (req, res) => {
  try {
    // Validate and sanitize inputs
    const { text, userRole, level } = validateValidationInputs(req.body);

    // Get AI validation
    const result = await aiService.validateText(
      text,
      userRole,
      level,
      getPromptForLevel
    );

    // Send response
    return sendSuccess(res, result);
  } catch (error) {
    return sendError(res, error, "Failed to validate text");
  }
};

/**
 * Auto-detect proficiency level of Polish text
 * @route POST /api/detect-level
 * @body { text: string }
 */
export const detectLevel = async (req, res) => {
  try {
    const { text } = req.body;

    // Validate input
    validateTextInput(text);

    // Detect level using AI
    const result = await aiService.detectLevel(
      text.trim(),
      getLevelDetectionPrompt
    );

    // Validate and normalize detected level
    const { level, confidence } = validateDetectedLevel(
      result.normalizedResponse
    );

    // Send response
    return sendSuccess(res, {
      detectedLevel: level,
      confidence,
      analyzedAt: result.timestamp,
    });
  } catch (error) {
    return sendError(res, error, "Failed to detect level");
  }
};

/**
 * Health check for AI service
 * @route GET /api/polish-validation/health
 */
export const healthCheck = async (req, res) => {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        status: "unhealthy",
        message: "Gemini API key not configured",
        timestamp: new Date().toISOString(),
      });
    }

    // Optional: Test AI connection
    const isConnected = await aiService.testConnection();

    return res.status(200).json({
      success: true,
      status: "healthy",
      message: "Polish validation service is running",
      aiConnection: isConnected ? "connected" : "degraded",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
