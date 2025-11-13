// server.js
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import dotenv from "dotenv";

// Import Sequelize instance
import sequelize from "./config/database.js";

// Import routes
import vocabularyRoutes from "./routes/vocabularyRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import practiceRoutes from "./routes/practiceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import exercisesRoutes from "./routes/exercisesRoutes.js";
import readingComprehensionExercisesRoutes from "./routes/readingComprehensionExercisesRoutes.js";
import path from "path";
import wordsRoutes from "./routes/wordsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Security middleware =====
app.use(helmet());

// ===== Compression middleware =====
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
    level: 6,
  })
);

// ===== CORS =====
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman or mobile apps
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`Blocked CORS request from origin: ${origin}`);
      return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// ===== Body parsing =====
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ===== API Routes =====
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/reading", readingComprehensionExercisesRoutes);
app.use("/api/words", wordsRoutes);

// ===== Health check =====
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// ===== 404 handler =====
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", path: req.path });
});

// ===== Global error handler =====
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ===== PostgreSQL Connection & Server Start =====
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");

    // Sync all models (creates tables if they don't exist)
    // await sequelize.sync({ alter: true });
    console.log("✅ Tables synced successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ PostgreSQL connection error:", error);
    process.exit(1);
  }
};

startServer();

// ===== Graceful shutdown =====
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});

export default app;
