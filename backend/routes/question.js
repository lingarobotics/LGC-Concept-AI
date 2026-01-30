import express from "express";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import UserQuestions from "../models/UserQuestions.js";
import UserExplanations from "../models/UserExplanations.js";

const router = express.Router();

/* =========================
   RATE LIMITER
   ========================= */

const activityLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

/* =========================
   LOG USER ACTIVITY (v2.1 hardened)
   ========================= */

router.post("/log", activityLimiter, async (req, res) => {
  let { email, question, mode, action } = req.body;

  // Basic validation
  if (!email || !mode || (!question && !action)) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Whitelist allowed modes
  const allowedModes = ["learn", "fast learn", "doubt", "teachback"];
  if (!allowedModes.includes(mode)) {
    return res.status(400).json({ error: "Invalid mode" });
  }

  // Whitelist allowed actions (only used in learn)
  const allowedActions = ["core_points"];
  if (action && !allowedActions.includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  try {
    // 1. Find user safely
    const user = await User.findOne({ userId: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    /* =====================================
       TEACH-BACK → EXPLANATION LOG ONLY
       ===================================== */
    if (mode === "teachback") {
      if (typeof question !== "string") {
        return res.status(400).json({ error: "Invalid question format" });
      }

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
       LEARN → CORE POINTS ACTION
       ===================================== */
    if (mode === "learn" && action === "core_points") {
      if (typeof question !== "string") {
        return res.status(400).json({ error: "Invalid question format" });
      }

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
       LEARN / DOUBT / FAST LEARN → QUESTION LOG
       ===================================== */

    if (typeof question !== "string") {
      return res.status(400).json({ error: "Invalid question format" });
    }

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
