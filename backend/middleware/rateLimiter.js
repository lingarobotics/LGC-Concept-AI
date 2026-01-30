import rateLimit from "express-rate-limit";

/* =========================
   GLOBAL LIMITER
   ========================= */

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});

/* =========================
   AUTH LIMITER
   ========================= */

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many auth attempts. Try again later." }
});

/* =========================
   AI LIMITER
   ========================= */

export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Too many AI requests. Try again later." }
});
