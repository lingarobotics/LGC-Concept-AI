import express from "express";
import { aiLimiter } from "../middleware/rateLimiter.js";
import { askAI } from "../services/aiService.js";

const router = express.Router();

router.post("/", aiLimiter, async (req, res) => {
  const { question, explanation, mode = "learn" } = req.body;

  // Input validation
  if (!question && mode !== "learn-core") {
    return res.status(400).json({
      error: "Question is required.",
    });
  }

  try {
    const result = await askAI({ question, explanation, mode });

    // result = { answer, modelUsed }
    return res.status(200).json(result);
  } catch (err) {
    console.error("[AI_ROUTE_ERROR]", err.message);

    if (err.message.includes("temporarily unavailable")) {
      return res.status(503).json({
        error: "AI service temporarily unavailable. Please try again later.",
      });
    }

    return res.status(500).json({
      error: "AI request failed.",
    });
  }
});

export default router;