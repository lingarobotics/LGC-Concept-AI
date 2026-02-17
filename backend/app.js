import express from "express";
import cors from "cors";

import { globalLimiter } from "./middleware/rateLimiter.js";

import authRoutes from "./routes/auth.js";
import questionRoutes from "./routes/question.js";
import userRoutes from "./routes/user.js";
import aiRoutes from "./routes/ai.js";

const app = express();

// ---------------- MIDDLEWARE ----------------

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(globalLimiter);

// ---------------- ROUTES ----------------

app.use("/auth", authRoutes);
app.use("/question", questionRoutes);
app.use("/user", userRoutes);
app.use("/ask", aiRoutes);

// ---------------- HEALTH CHECK ----------------

app.get("/", (req, res) => {
  res.send("LGC Concept AI backend running (OpenRouter)");
});

export default app;
