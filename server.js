import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import playerRoutes from "./src/api/playerRoutes.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

// Check if Mongo URI is set
if (!mongoUri) {
  console.error("Mongo URI is not set in .env");
  process.exit(1);
}

// MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Avoids long connection hangs
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Express Setup
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // ✅ Should be BEFORE route usage
app.use("/api/player", playerRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
