import { Player } from "../src/models/Player";
import { connectDB } from "../src/utils/db";

export default async function handler(req, res) {
  await connectDB(); // Ensure database connection

  if (req.method === "POST") {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Player name is required" });

    let player = await Player.findOne({ name });
    if (!player) {
      player = new Player({ name, numTries: 0 });
      await player.save();
    }

    return res.json(player);
  }

  if (req.method === "GET") {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "Player name is required" });

    const player = await Player.findOne({ name });
    if (!player) return res.status(404).json({ error: "Player not found" });

    return res.json(player);
  }

  if (req.method === "PUT") {
    const { name } = req.query;
    const player = await Player.findOneAndUpdate(
      { name },
      { $inc: { numTries: 1 } },
      { new: true }
    );

    if (!player) return res.status(404).json({ error: "Player not found" });

    return res.json(player);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
