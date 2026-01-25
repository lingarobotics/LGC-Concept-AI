import express from "express";
import User from "../models/User.js";
import UserQuestions from "../models/UserQuestions.js";
import UserExplanations from "../models/UserExplanations.js";

const router = express.Router();

/* =========================
   LOG USER ACTIVITY (v2.0)
   ========================= */
router.post("/log", async (req, res) => {
  const { email, question, mode, action } = req.body;

  if (!email || (!question && !action) || !mode) {
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
              text: question,
              type: "teachback",
              createdAt: new Date()
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
       LEARN → CORE POINTS ACTION (NEW)
       ===================================== */
    if (mode === "learn" && action === "core_points") {
      await UserExplanations.findOneAndUpdate(
        { userId: user._id },
        {
          $push: {
            explanations: {
              text: question,
              type: "core_points",
              createdAt: new Date()
            }
          }
        },
        {
          upsert: true,
          new: true
        }
      );

      return res.json({ message: "Core points action logged" });
    }

    /* =====================================
       LEARN / DOUBT / FASTLEARN → QUESTION LOG
       ===================================== */
    await UserQuestions.findOneAndUpdate(
      { userId: user._id },
      {
        $push: {
          questions: {
            question,
            mode,
            createdAt: new Date()
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
