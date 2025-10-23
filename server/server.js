import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import contactRoutes from "./routes/contact.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000", // React dev
  "http://localhost:5173", // Vite dev if used
  "https://lingo-polska.vercel.app", // Production frontend
];

// middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// connect MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas (LingoPolskaCluster)"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// test route
app.get("/", (req, res) => {
  res.send("LingoPolska backend is running!");
});

// Contact form route
app.use("/api/contact", contactRoutes);

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
