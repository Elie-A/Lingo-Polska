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

// Simple in-memory rate limiter (replace with Redis in production)
const rateLimitStore = new Map();
const RATE_LIMIT = {
  maxRequests: 20,
  windowMs: 10 * 60 * 1000, // 10 minutes
};

/**
 * Check rate limit for IP
 * @param {string} ip - Client IP address
 * @returns {Object} Rate limit info
 */
const checkRateLimit = (ip) => {
  const now = Date.now();
  const record = rateLimitStore.get(ip) || {
    count: 0,
    resetTime: now + RATE_LIMIT.windowMs,
  };

  // Reset if window expired
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + RATE_LIMIT.windowMs;
  }

  record.count++;
  rateLimitStore.set(ip, record);

  return {
    limit: RATE_LIMIT.maxRequests,
    remaining: Math.max(0, RATE_LIMIT.maxRequests - record.count),
    reset: new Date(record.resetTime).toISOString(),
    exceeded: record.count > RATE_LIMIT.maxRequests,
  };
};

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {Object} rateLimitInfo - Rate limit info
 * @param {number} statusCode - HTTP status code
 */
const sendSuccess = (res, data, rateLimitInfo = null, statusCode = 200) => {
  const response = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  if (rateLimitInfo) {
    response.rateLimitInfo = rateLimitInfo;
  }

  // Log response size for debugging
  const responseSize = JSON.stringify(response).length;
  console.log(
    `[Controller] Response size: ${responseSize} bytes (${(
      responseSize / 1024
    ).toFixed(2)} KB)`
  );

  if (data.feedback) {
    console.log(
      `[Controller] Feedback length: ${data.feedback.length} characters`
    );
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default error message
 */
const sendError = (res, error, defaultMessage = "An error occurred") => {
  console.error(`[Controller Error]: ${error.message}`);
  if (error.stack) {
    console.error(error.stack);
  }

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

  if (statusCode === 429) {
    return res.status(429).json({
      success: false,
      error: "Rate Limit Exceeded",
      message: "Too many requests. Please try again later.",
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
    // Get client IP for rate limiting
    const clientIP = req.ip || req.connection.remoteAddress || "unknown";
    const rateLimitInfo = checkRateLimit(clientIP);

    // Check rate limit
    if (rateLimitInfo.exceeded) {
      const error = new Error("Rate limit exceeded");
      error.statusCode = 429;
      return sendError(res, error, "Too many requests");
    }

    // Validate and sanitize inputs
    const { text, userRole, level } = validateValidationInputs(req.body);

    console.log(
      `[Controller] Validating text: ${text.length} characters, level: ${level}, role: ${userRole}`
    );

    // Get AI validation
    const result = await aiService.validateText(
      text,
      userRole,
      level,
      getPromptForLevel
    );

    // Log result info
    console.log(
      `[Controller] Validation complete. Feedback length: ${
        result.feedback?.length || 0
      } characters`
    );
    console.log(`[Controller] Is truncated: ${result.isTruncated || false}`);

    // Check if response is suspiciously short or empty
    if (!result.feedback || result.feedback.length < 50) {
      console.warn(
        `[Controller] Warning: Suspiciously short feedback (${
          result.feedback?.length || 0
        } chars)`
      );
    }

    // Send response with rate limit info
    return sendSuccess(res, result, rateLimitInfo);
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
    // Get client IP for rate limiting
    const clientIP = req.ip || req.connection.remoteAddress || "unknown";
    const rateLimitInfo = checkRateLimit(clientIP);

    // Check rate limit
    if (rateLimitInfo.exceeded) {
      const error = new Error("Rate limit exceeded");
      error.statusCode = 429;
      return sendError(res, error, "Too many requests");
    }

    const { text } = req.body;

    // Validate input
    validateTextInput(text);

    console.log(
      `[Controller] Detecting level for text: ${text.length} characters`
    );

    // Detect level using AI
    const result = await aiService.detectLevel(
      text.trim(),
      getLevelDetectionPrompt
    );

    // Validate and normalize detected level
    const { level, confidence } = validateDetectedLevel(
      result.normalizedResponse
    );

    console.log(
      `[Controller] Detected level: ${level} (confidence: ${confidence})`
    );

    // Send response with rate limit info
    return sendSuccess(
      res,
      {
        detectedLevel: level,
        confidence,
        analyzedAt: result.timestamp,
      },
      rateLimitInfo
    );
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

    // Test AI connection
    const isConnected = await aiService.testConnection();

    return res.status(200).json({
      success: true,
      status: "healthy",
      message: "Polish validation service is running",
      aiConnection: isConnected ? "connected" : "degraded",
      environment: process.env.NODE_ENV || "development",
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

/**
 * Clear rate limit for testing (only in development)
 * @route POST /api/polish-validation/clear-rate-limit
 */
export const clearRateLimit = async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({
      success: false,
      message: "Not available in production",
    });
  }

  const { ip } = req.body;

  if (ip) {
    rateLimitStore.delete(ip);
  } else {
    rateLimitStore.clear();
  }

  return res.status(200).json({
    success: true,
    message: ip ? `Rate limit cleared for ${ip}` : "All rate limits cleared",
  });
};

/**
 * Continue AI feedback for truncated text
 * @route POST /api/polish-validation/continue-analysis
 * @body { text: string, previousFeedback: string, userRole?: string, level?: string }
 */
export const continueAnalysis = async (req, res) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || "unknown";
    const rateLimitInfo = checkRateLimit(clientIP);

    if (rateLimitInfo.exceeded) {
      const error = new Error("Rate limit exceeded");
      error.statusCode = 429;
      return sendError(res, error, "Too many requests");
    }

    const { text, previousFeedback, userRole, level } = req.body;

    if (!text || !previousFeedback) {
      throw new Error("Text and previous feedback are required");
    }

    // Ask AI to continue analysis based on previous feedback
    const newResult = await aiService.continueAnalysis(
      text,
      previousFeedback,
      userRole,
      level,
      getPromptForLevel
    );

    return sendSuccess(res, newResult, rateLimitInfo);
  } catch (error) {
    return sendError(res, error, "Failed to continue analysis");
  }
};
