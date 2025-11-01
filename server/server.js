import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import contactRoutes from "./routes/contactRoutes.js";
import vocabularyRoutes from "./routes/vocabularyRoutes.js";
import practiceRoutes from "./routes/practiceRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://lingo-polska.vercel.app",
];

// ⚡ Apply CORS globally BEFORE routes
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // allow
      } else {
        callback(null, true); // ⚠️ important: always return true for preflight, do NOT throw
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle OPTIONS preflight for all routes
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Test route
app.get("/", (req, res) => res.send("Backend is running!"));

// Contact form route
app.use("/api/contact", contactRoutes);

// Vocabulary form route
app.use("/api/vocabulary", vocabularyRoutes);

// Practice from route
app.use("/api/practice", practiceRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
