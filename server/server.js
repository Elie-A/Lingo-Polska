import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React app during dev
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

// basic route
app.get("/", (req, res) => {
  res.send("LingoPolska backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
