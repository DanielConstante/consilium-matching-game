import mongoose from "mongoose";

let isConnected = false; // Track connection status

export async function connectDB() {
  if (isConnected) return;

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI is missing in .env file");

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
  console.log("✅ Connected to MongoDB Atlas");
}
