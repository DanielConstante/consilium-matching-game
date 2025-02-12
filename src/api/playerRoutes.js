import express from "express";
import { Player } from "../models/Player.js";

const router = express.Router();

/** 
 * 1️⃣ Save Player Name 
 * POST /api/player
 */
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Player name is required" });

    let player = await Player.findOne({ name });
    if (!player) {
      player = new Player({ name, numTries: 0 });
      await player.save();
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * 2️⃣ Get Player Data 
 * GET /api/player/:name
 */
router.get("/:name", async (req, res) => {
  try {
    const player = await Player.findOne({ name: req.params.name });
    if (!player) return res.status(404).json({ error: "Player not found" });

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * 3️⃣ Update Number of Tries
 * PUT /api/player/:name
 */
router.put("/:name", async (req, res) => {
  try {
    const player = await Player.findOneAndUpdate(
      { name: req.params.name },
      { $inc: { numTries: 1 } }, // Increment tries by 1
      { new: true }
    );

    if (!player) return res.status(404).json({ error: "Player not found" });

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
