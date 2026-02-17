import express from "express";
import { aiLimiter } from "../middleware/rateLimiter.js";
import { askAI } from "../services/aiService.js";

const router = express.Router();

router.post("/", aiLimiter, async (req, res) => {
  const { question, explanation, mode = "learn" } = req.body;

  try {
    const answer = await askAI({ question, explanation, mode });
    res.json({ answer });
  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({
      error: err.message || "AI request failed",
    });
  }
});

export default router;
