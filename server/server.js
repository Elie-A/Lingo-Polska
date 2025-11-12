import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";
import vocabularyRoutes from "./routes/vocabularyRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import practiceRoutes from "./routes/practiceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import exercisesRoutes from "./routes/exercisesRoutes.js";
import readingComprehensionExercisesRoutes from "./routes/readingComprehensionExercisesRoutes.js";
import wordsRoutes from "./routes/wordsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Compression middleware
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
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
    origin: (origin, callback) => {
      if (!origin) {
        // Allow requests with no origin (e.g., mobile apps, Postman)
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (!allowedOrigins.includes(origin)) {
        console.warn(`Blocked CORS request from origin: ${origin}`);
        return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
      // Explicitly reject other origins
      return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API Routes
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/reading", readingComprehensionExercisesRoutes);
app.use("/api/words", wordsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
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

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || process.env.MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
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
