import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  numTries: { type: Number, default: 0 }, // Default tries to 0
});

export const Player = mongoose.model("Player", playerSchema);
