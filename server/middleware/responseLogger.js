/**
 * Response Logger Middleware
 * Logs response sizes and helps debug truncation issues
 */

/**
 * Intercept and log response data
 */
export const responseLogger = (req, res, next) => {
  // Store original json method
  const originalJson = res.json.bind(res);

  // Override json method
  res.json = function (data) {
    // Log response info
    const responseString = JSON.stringify(data);
    const responseSize = Buffer.byteLength(responseString, "utf8");
    const responseSizeKB = (responseSize / 1024).toFixed(2);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📤 Response for: ${req.method} ${req.path}`);
    console.log(`📦 Size: ${responseSize} bytes (${responseSizeKB} KB)`);
    console.log(`⏱️  Timestamp: ${new Date().toISOString()}`);

    // Check for large responses
    if (responseSize > 1000000) {
      // > 1MB
      console.warn(`⚠️  WARNING: Large response (${responseSizeKB} KB)`);
    }

    // Log feedback-specific info
    if (data.data?.feedback) {
      console.log(
        `💬 Feedback length: ${data.data.feedback.length} characters`
      );
      console.log(`🔍 Truncated: ${data.data.isTruncated || false}`);

      // Check for incomplete markdown
      const codeBlockCount = (data.data.feedback.match(/```/g) || []).length;
      if (codeBlockCount % 2 !== 0) {
        console.warn(`⚠️  WARNING: Unclosed code blocks detected`);
      }

      // Check if ends abruptly
      const lastChars = data.data.feedback.slice(-50);
      console.log(`📝 Last 50 chars: "${lastChars}"`);
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Call original json method
    return originalJson(data);
  };

  next();
};

/**
 * Request logger middleware
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📥 Incoming: ${req.method} ${req.path}`);
  console.log(`🌐 IP: ${req.ip || req.connection.remoteAddress}`);
  console.log(`⏰ Time: ${new Date().toISOString()}`);

  if (req.body?.text) {
    console.log(`📝 Text length: ${req.body.text.length} characters`);
  }

  // Log response time on finish
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`✅ Completed in ${duration}ms with status ${res.statusCode}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  });

  next();
};

/**
 * Error boundary middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("❌ ERROR CAUGHT IN MIDDLEWARE:");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Send error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
  });
};

/**
 * CORS and JSON limit configuration
 * Add this to your Express app configuration
 */
export const configureExpressApp = (app) => {
  // Increase JSON payload limit (default is 100kb)
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // Add request logging
  //   app.use(requestLogger);

  // Add response logging
  //   app.use(responseLogger);

  console.log("✓ Express middleware configured with 10MB payload limit");
};

export default {
  responseLogger,
  requestLogger,
  errorHandler,
  configureExpressApp,
};
