/**
 * Production-Ready Memory-Based Rate Limiting
 * Works without Redis - optimized for single server deployments
 */

import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import slowDown from "express-slow-down";
import MongoStore from "rate-limit-mongo";

/**
 * Create MongoDB store for rate limiting (optional but recommended)
 * Persists rate limit data across server restarts
 */
const createMongoStore = () => {
  if (process.env.MONGODB_URI) {
    return new MongoStore({
      uri: process.env.MONGODB_URI,
      collectionName: "rate_limits",
      expireTimeMs: 15 * 60 * 1000, // 15 minutes
      errorHandler: (err) => {
        console.error("MongoDB rate limit store error:", err);
      },
    });
  }
  return undefined; // Fall back to memory store
};

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: createMongoStore(),
  handler: (req, res) => {
    const resetTime = new Date(req.rateLimit.resetTime);
    const minutesUntilReset = Math.max(
      0,
      Math.ceil((resetTime - Date.now()) / 60000)
    );

    res.status(429).json({
      success: false,
      error: "Too many requests",
      message: "You have exceeded the rate limit. Please try again later.",
      details: {
        limit: req.rateLimit.limit,
        current: req.rateLimit.current,
        remaining: req.rateLimit.remaining,
        resetTime: resetTime.toISOString(),
        retryAfter: `${minutesUntilReset} minutes`,
      },
      timestamp: new Date().toISOString(),
    });
  },
  skip: (req) => {
    const whitelist = process.env.RATE_LIMIT_WHITELIST?.split(",") || [];
    return whitelist.includes(req.ip);
  },
  keyGenerator: (req) => ipKeyGenerator(req),
});

/**
 * Strict rate limiter for AI validation endpoints
 * 20 requests per 10 minutes per IP
 */
export const aiValidationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  handler: (req, res) => {
    const resetTime = new Date(req.rateLimit.resetTime);
    const minutesUntilReset = Math.max(
      0,
      Math.ceil((resetTime - Date.now()) / 60000)
    );

    res.status(429).json({
      success: false,
      error: "AI validation rate limit exceeded",
      message:
        "You have made too many validation requests. Our AI service has usage limits to ensure fair access for all users.",
      details: {
        limit: req.rateLimit.limit,
        remaining: 0,
        resetTime: resetTime.toISOString(),
        retryAfter: `${minutesUntilReset} minutes`,
      },
      tip: "Consider reviewing your text locally before validating to make the most of your requests.",
      timestamp: new Date().toISOString(),
    });
  },
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
  skip: (req) => req.user?.role === "admin",
});

/**
 * Level detection rate limiter
 * 30 requests per 10 minutes per IP
 */
export const levelDetectionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const resetTime = new Date(req.rateLimit.resetTime);
    const minutesUntilReset = Math.max(
      0,
      Math.ceil((resetTime - Date.now()) / 60000)
    );

    res.status(429).json({
      success: false,
      error: "Level detection rate limit exceeded",
      message:
        "Too many level detection requests. Please wait before trying again.",
      details: {
        limit: req.rateLimit.limit,
        remaining: 0,
        resetTime: resetTime.toISOString(),
        retryAfter: `${minutesUntilReset} minutes`,
      },
      timestamp: new Date().toISOString(),
    });
  },
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
});

/**
 * Slow down middleware - gradually increase response time
 */
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: (hits) => (hits - 50) * 500,
  maxDelayMs: 20000,
  skipFailedRequests: true,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
});

/**
 * Tiered rate limiter based on user type
 */
export const createTieredLimiter = (options = {}) => {
  const limits = {
    guest: 20,
    student: 50,
    teacher: 100,
    admin: 1000,
    ...options,
  };

  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req) =>
      req.user ? limits[req.user.role] || limits.student : limits.guest,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const userType = req.user?.role || "guest";
      const limit = req.user ? limits[req.user.role] : limits.guest;

      res.status(429).json({
        success: false,
        error: "Rate limit exceeded",
        message: `You have exceeded your ${userType} rate limit of ${limit} requests.`,
        suggestion:
          userType === "guest"
            ? "Login to get higher rate limits."
            : "Please wait before making more requests.",
        timestamp: new Date().toISOString(),
      });
    },
    keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
    skip: (req) => req.user?.role === "admin",
  });
};

/**
 * Create custom rate limiter with flexible options
 */
export const createCustomLimiter = (config) => {
  const defaultConfig = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests",
    standardHeaders: true,
    legacyHeaders: false,
  };

  return rateLimit({
    ...defaultConfig,
    ...config,
    handler: (req, res) => {
      const resetTime = new Date(req.rateLimit.resetTime);
      const minutesUntilReset = Math.max(
        0,
        Math.ceil((resetTime - Date.now()) / 60000)
      );

      res.status(429).json({
        success: false,
        error: config.message || defaultConfig.message,
        details: {
          limit: req.rateLimit.limit,
          remaining: 0,
          resetTime: resetTime.toISOString(),
          retryAfter: `${minutesUntilReset} minutes`,
        },
        timestamp: new Date().toISOString(),
      });
    },
    keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
  });
};

/**
 * Rate limit info middleware
 */
export const rateLimitInfo = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    if (data && typeof data === "object" && data.success !== false) {
      data.rateLimitInfo = {
        limit: req.rateLimit?.limit,
        remaining: req.rateLimit?.remaining,
        reset: req.rateLimit?.resetTime,
      };
    }
    return originalJson.call(this, data);
  };

  next();
};
