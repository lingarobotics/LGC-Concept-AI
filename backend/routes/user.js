import express from "express";
import User from "../models/User.js";
import UserQuestions from "../models/UserQuestions.js";

const router = express.Router();

/* =========================
   GET ALL QUESTIONS OF USER
   ========================= */
router.get("/questions", async (req, res) => {
  const { email, mode } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // 1. Find user
    const user = await User.findOne({ userId: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Find user's questions document
    const userQuestions = await UserQuestions.findOne({ userId: user._id });

    if (!userQuestions) {
      return res.json({
        questionsAskedCount: 0,
        questions: []
      });
    }

    let questions = userQuestions.questions;

    // 3. Optional mode filter (learn / doubt / teachback)
    if (mode) {
      questions = questions.filter(q => q.mode === mode);
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
//this file is untouched in v2.0.0, so no version tag is added