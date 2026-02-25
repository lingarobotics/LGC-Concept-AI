import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

/* =========================
   RATE LIMITERS
   ========================= */

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many registrations. Try again later." }
});

const resendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: "Too many requests. Try again later." }
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many password reset requests. Try again later." }
});

/* =========================
   VALIDATORS
   ========================= */

const NAME_REGEX = /^[A-Za-z.\-\s]{2,50}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROFANITY_WORDS = [
  "fuck","fucker","shit","bitch","asshole","pussy","ass","cock",
  "thevidiyapaiyan","thevdiya","otha","oththa","punda","lusukoodhi","koodhi"
];

const ALLOWED_DEPARTMENTS = [
  "Robotics Engineering","CSE","ECE","EEE","Mechanical Engineering",
  "Civil Engineering","Automobile Engineering","Biotechnology",
  "BME","AI & DS","Other"
];

function isNameValid(name) {
  if (typeof name !== "string") return false;
  if (!NAME_REGEX.test(name)) return false;
  const lower = name.toLowerCase();
  return !PROFANITY_WORDS.some((word) => lower.includes(word));
}

function isStrongPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8
  );
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/* =========================
   REGISTER
   ========================= */

router.post("/register", registerLimiter, async (req, res) => {
  const { email, password, name, department, passOutYear } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof department !== "string" ||
    typeof passOutYear !== "string"
  ) {
    return res.status(400).json({ error: "Invalid input types" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(normalizedEmail))
    return res.status(400).json({ error: "Invalid email format" });

  if (!isNameValid(name))
    return res.status(400).json({ error: "Invalid name" });

  if (!ALLOWED_DEPARTMENTS.includes(department))
    return res.status(400).json({ error: "Invalid department selection" });

  if (!isStrongPassword(password))
    return res.status(400).json({ error: "Password must be at least 8 characters" });

  try {
    const existingUser = await User.findOne({ userId: normalizedEmail });
    if (existingUser)
      return res.status(409).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 12);

    const verificationTokenRaw = crypto.randomBytes(32).toString("hex");
    const verificationTokenHashed = hashToken(verificationTokenRaw);

    const user = new User({
      userId: normalizedEmail,
      passwordHash,
      name: name.trim(),
      department,
      passOutYear,
      emailVerificationToken: verificationTokenHashed,
      emailVerificationTokenExpiresAt: new Date(Date.now() + 86400000),
      isEmailVerified: false
    });

    await user.save();

    const verificationLink =
      `${process.env.FRONTEND_URL}/verify-email?token=${verificationTokenRaw}`;

    await sendEmail({
      to: normalizedEmail,
      subject: "Verify your email - LGC Concept AI",
      html: `<a href="${verificationLink}">${verificationLink}</a>`
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch {
    return res.status(500).json({ error: "Registration failed" });
  }
});

/* =========================
   LOGIN
   ========================= */

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string")
    return res.status(400).json({ error: "Invalid input" });

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ userId: normalizedEmail });

    if (!user)
      return res.status(401).json({ error: "Invalid credentials" });

    if (!user.isEmailVerified)
      return res.status(403).json({ error: "Email not verified" });

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match)
      return res.status(401).json({ error: "Invalid credentials" });

    return res.json({ message: "Login successful" });
  } catch {
    return res.status(500).json({ error: "Login failed" });
  }
});

/* =========================
   FORGOT PASSWORD
   ========================= */

router.post("/forgot-password", forgotPasswordLimiter, async (req, res) => {
  const { email } = req.body;

  if (typeof email !== "string")
    return res.status(400).json({ error: "Valid email is required" });

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ userId: normalizedEmail });

    if (!user)
      return res.status(404).json({ error: "No account found with this email" });

    const resetTokenRaw = crypto.randomBytes(32).toString("hex");
    const resetTokenHashed = hashToken(resetTokenRaw);

    user.passwordResetToken = resetTokenHashed;
    user.passwordResetTokenExpiresAt = new Date(Date.now() + 1800000);

    await user.save();

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${resetTokenRaw}`;

    await sendEmail({
      to: normalizedEmail,
      subject: "Reset your password - LGC Concept AI",
      html: `<a href="${resetLink}">${resetLink}</a>`
    });

    return res.json({ message: "Password reset link sent" });
  } catch {
    return res.status(500).json({ error: "Could not process request" });
  }
});

/* =========================
   RESET PASSWORD
   ========================= */

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (
    typeof token !== "string" ||
    typeof newPassword !== "string" ||
    token.length !== 64 ||
    !isStrongPassword(newPassword)
  ) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresAt: { $gt: new Date() }
    });

    if (!user)
      return res.status(400).json({ error: "Reset link expired or invalid" });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;

    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch {
    return res.status(500).json({ error: "Password reset failed" });
  }
});

export default router;