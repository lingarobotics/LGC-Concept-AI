import express from "express";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import UserQuestions from "../models/UserQuestions.js";

const router = express.Router();

/* =========================
   RATE LIMITER
   ========================= */

const userQueryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

/* =========================
   GET ALL QUESTIONS OF USER
   ========================= */

router.get("/questions", userQueryLimiter, async (req, res) => {
  let { email, mode } = req.query;

  // Validate email presence + type
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Valid email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // 1. Find user safely
    const user = await User.findOne({ userId: normalizedEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Find user's questions document
    const userQuestions = await UserQuestions.findOne({
      userId: user._id
    });

    if (!userQuestions) {
      return res.json({
        questionsAskedCount: 0,
        questions: []
      });
    }

    let questions = userQuestions.questions;

    // 3. Optional safe mode filter
    if (mode && typeof mode === "string") {
      const allowedModes = ["learn", "fast learn", "doubt", "teachback"];

      if (!allowedModes.includes(mode)) {
        return res.status(400).json({ error: "Invalid mode filter" });
      }

      questions = questions.filter((q) => q.mode === mode);
    }

    return res.json({
      user: {
        email: user.userId,
        name: user.name,
        department: user.department,
        passOutYear: user.passOutYear
      },
      questionsAskedCount: user.questionsAskedCount,
      totalQuestionsStored: userQuestions.questions.length,
      questions
    });

  } catch (err) {
    console.error("FETCH USER QUESTIONS ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch questions" });
  }
});

export default router;
