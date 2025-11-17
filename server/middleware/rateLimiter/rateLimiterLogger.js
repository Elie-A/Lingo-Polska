/**
 * Rate Limit Logging Middleware
 * Tracks rate limit hits for analytics and monitoring
 */

import RateLimit from "../../models/RateLimit.js";

/**
 * Log rate limit hits to database
 */
export const logRateLimitHit = async (req, res, next) => {
  // Only log if MongoDB is connected
  if (!process.env.MONGODB_URI) {
    return next();
  }

  // Capture original end function
  const originalEnd = res.end;

  res.end = function (...args) {
    // Log if rate limit was hit (429 status)
    if (res.statusCode === 429 && req.rateLimit) {
      const logData = {
        key: req.user?.id || req.ip,
        ip: req.ip,
        userId: req.user?.id || null,
        endpoint: req.originalUrl,
        resetTime: new Date(req.rateLimit.resetTime),
      };

      // Log asynchronously (don't block response)
      RateLimit.logHit(logData).catch((err) => {
        console.error("Failed to log rate limit hit:", err);
      });
    }

    // Call original end function
    return originalEnd.apply(this, args);
  };

  next();
};

/**
 * Get rate limit statistics
 */
export const getRateLimitStats = async (req, res) => {
  try {
    const timeRange = parseInt(req.query.hours) || 24;
    const stats = await RateLimit.getStats(timeRange);

    res.status(200).json({
      success: true,
      data: {
        timeRange: `${timeRange} hours`,
        stats,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve rate limit statistics",
      message: error.message,
    });
  }
};

/**
 * Check rate limit status for current user/IP
 */
export const checkRateLimitStatus = (req, res) => {
  const status = {
    success: true,
    data: {
      key: req.user?.id || req.ip,
      userType: req.user?.role || "guest",
      limits: {
        api: {
          limit: 100,
          window: "15 minutes",
        },
        aiValidation: {
          limit: req.user?.role === "admin" ? "unlimited" : 20,
          window: "10 minutes",
        },
        levelDetection: {
          limit: 30,
          window: "10 minutes",
        },
      },
      current: req.rateLimit
        ? {
            limit: req.rateLimit.limit,
            remaining: req.rateLimit.remaining,
            resetTime: new Date(req.rateLimit.resetTime).toISOString(),
          }
        : null,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(status);
};

/**
 * Middleware to add rate limit warnings before hitting limit
 */
export const rateLimitWarning = (req, res, next) => {
  // Add warning header if approaching limit
  if (req.rateLimit && req.rateLimit.remaining <= 5) {
    res.setHeader("X-RateLimit-Warning", "Approaching rate limit");
    res.setHeader("X-RateLimit-Remaining", req.rateLimit.remaining);
  }

  next();
};
