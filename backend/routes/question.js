import express from "express";
import User from "../models/User.js";
import UserQuestions from "../models/UserQuestions.js";
import UserExplanations from "../models/UserExplanations.js";

const router = express.Router();

/* =========================
   LOG USER ACTIVITY (v1.1)
   ========================= */
router.post("/log", async (req, res) => {
  const { email, question, mode } = req.body;

  if (!email || !question || !mode) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // 1. Find user
    const user = await User.findOne({ userId: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    /* =====================================
       TEACH-BACK → EXPLANATION LOG ONLY
       ===================================== */
    if (mode === "teachback") {
      await UserExplanations.findOneAndUpdate(
        { userId: user._id },
        {
          $push: {
            explanations: {
              text: question
            }
          }
        },
        {
          upsert: true,
          new: true
        }
      );

      return res.json({ message: "Explanation logged (teach-back)" });
    }

    /* =====================================
       LEARN / DOUBT → QUESTION LOG + COUNT
       ===================================== */
    await UserQuestions.findOneAndUpdate(
      { userId: user._id },
      {
        $push: {
          questions: {
            question,
            mode
          }
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    user.questionsAskedCount += 1;
    await user.save();

    return res.json({ message: "Question logged and counted" });
  } catch (err) {
    console.error("USER ACTIVITY LOG ERROR:", err);
    return res.status(500).json({ error: "Failed to log user activity" });
  }
});

export default router;
