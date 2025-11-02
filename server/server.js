import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import vocabularyRoutes from "./routes/vocabularyRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import practiceRoutes from "./routes/practiceRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security & Compression
app.use(helmet());
app.use(
  compression({
    filter: (req, res) =>
      req.headers["x-no-compression"] ? false : compression.filter(req, res),
    level: 6,
  })
);

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Serve React in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientBuildPath));

  // Catch-all route for React (exclude /api)
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api"))
      return res.status(404).json({ message: "API route not found" });
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// 404 for unmatched API routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || process.env.MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

export default app;
