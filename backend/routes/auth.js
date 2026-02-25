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

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many password reset requests. Try again later." }
});

/* =========================
   CONSTANTS
   ========================= */

const ALLOWED_DEPARTMENTS = [
  "Robotics Engineering","CSE","ECE","EEE","Mechanical Engineering",
  "Civil Engineering","Automobile Engineering","Biotechnology",
  "BME","AI & DS","Other"
];

const PROFANITY_WORDS = [
  "fuck","fucker","shit","bitch","asshole","pussy","ass","cock",
  "thevidiyapaiyan","thevdiya","otha","oththa","punda","lusukoodhi","koodhi"
];

/* =========================
   HELPER FUNCTIONS
   ========================= */

function safeString(input) {
  return typeof input === "string" ? input : null;
}

function isEmailValid(email) {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  if (!trimmed.includes("@") || !trimmed.includes(".")) return false;
  return true;
}

function isStrongPassword(password) {
  if (typeof password !== "string") return false;
  if (password.length < 8 || password.length > 128) return false;
  return true;
}

function isNameValid(name) {
  if (typeof name !== "string") return false;

  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 50) return false;

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];

    const isLetter =
      (ch >= "A" && ch <= "Z") ||
      (ch >= "a" && ch <= "z");

    const isAllowedSymbol = ch === "." || ch === "-" || ch === " ";

    if (!isLetter && !isAllowedSymbol) {
      return false;
    }
  }

  const lower = trimmed.toLowerCase();
  return !PROFANITY_WORDS.some((word) => lower.includes(word));
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/* =========================
   REGISTER
   ========================= */

router.post("/register", registerLimiter, async (req, res) => {
  const emailRaw = safeString(req.body.email);
  const passwordRaw = safeString(req.body.password);
  const nameRaw = safeString(req.body.name);
  const departmentRaw = safeString(req.body.department);
  const passOutYearRaw = safeString(req.body.passOutYear);

  if (!emailRaw || !passwordRaw || !nameRaw || !departmentRaw || !passOutYearRaw)
    return res.status(400).json({ error: "Invalid input types" });

  const email = emailRaw.trim().toLowerCase();

  if (!isEmailValid(email))
    return res.status(400).json({ error: "Invalid email format" });

  if (!isNameValid(nameRaw))
    return res.status(400).json({ error: "Invalid name" });

  if (!ALLOWED_DEPARTMENTS.includes(departmentRaw))
    return res.status(400).json({ error: "Invalid department selection" });

  if (!isStrongPassword(passwordRaw))
    return res.status(400).json({ error: "Password must be at least 8 characters" });

  try {
    const existingUser = await User.findOne({ userId: email });
    if (existingUser)
      return res.status(409).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(passwordRaw, 12);

    const verificationTokenRaw = crypto.randomBytes(32).toString("hex");
    const verificationTokenHashed = hashToken(verificationTokenRaw);

    const user = new User({
      userId: email,
      passwordHash,
      name: nameRaw.trim(),
      department: departmentRaw,
      passOutYear: passOutYearRaw,
      emailVerificationToken: verificationTokenHashed,
      emailVerificationTokenExpiresAt: new Date(Date.now() + 86400000),
      isEmailVerified: false
    });

    await user.save();

    const verificationLink =
      `${process.env.FRONTEND_URL}/verify-email?token=${verificationTokenRaw}`;

    await sendEmail({
      to: email,
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
  const emailRaw = safeString(req.body.email);
  const passwordRaw = safeString(req.body.password);

  if (!emailRaw || !passwordRaw)
    return res.status(400).json({ error: "Invalid input" });

  const email = emailRaw.trim().toLowerCase();

  try {
    const user = await User.findOne({ userId: email });

    if (!user)
      return res.status(401).json({ error: "Invalid credentials" });

    if (!user.isEmailVerified)
      return res.status(403).json({ error: "Email not verified" });

    const match = await bcrypt.compare(passwordRaw, user.passwordHash);

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
  const emailRaw = safeString(req.body.email);
  if (!emailRaw)
    return res.status(400).json({ error: "Valid email is required" });

  const email = emailRaw.trim().toLowerCase();

  try {
    const user = await User.findOne({ userId: email });

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
      to: email,
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
  const tokenRaw = safeString(req.body.token);
  const newPasswordRaw = safeString(req.body.newPassword);

  if (
    !tokenRaw ||
    !newPasswordRaw ||
    tokenRaw.length !== 64 ||
    !isStrongPassword(newPasswordRaw)
  ) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const hashedToken = hashToken(tokenRaw);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresAt: { $gt: new Date() }
    });

    if (!user)
      return res.status(400).json({ error: "Reset link expired or invalid" });

    user.passwordHash = await bcrypt.hash(newPasswordRaw, 12);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;

    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch {
    return res.status(500).json({ error: "Password reset failed" });
  }
});

export default router;