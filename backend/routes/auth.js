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

// Strict limiter for login (brute-force protection)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5,
  message: { error: "Too many login attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

// Moderate limiter for registration
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: "Too many registrations. Try again later." }
});

// Resend verification limiter
const resendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: "Too many requests. Try again later." }
});

/* =========================
   BASIC VALIDATORS (v1.3)
   ========================= */

const NAME_REGEX = /^[A-Za-z.\-\s]{2,50}$/;

const PROFANITY_WORDS = [
  "fuck","fucker","shit","bitch","asshole","pussy","ass","cock",
  "thevidiyapaiyan","thevdiya","otha","oththa","punda","lusukoodhi","koodhi" //Tamil profanity
];

const ALLOWED_DEPARTMENTS = [
  "Robotics Engineering","CSE","ECE","EEE","Mechanical Engineering",
  "Civil Engineering","Automobile Engineering","Biotechnology",
  "BME","AI & DS","Other"
];

function isNameValid(name) {
  if (!NAME_REGEX.test(name)) return false;
  const lower = name.toLowerCase();
  return !PROFANITY_WORDS.some((word) => lower.includes(word));
}

/* =========================
   REGISTER
   ========================= */

router.post("/register", registerLimiter, async (req, res) => {
  let { email, password, name, department, passOutYear } = req.body;

  if (!email || !password || !name || !department || !passOutYear) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isNameValid(name)) {
    return res.status(400).json({
      error:
        "Invalid name. Use only letters, spaces, dot or hyphen (2–50 characters)."
    });
  }

  if (!ALLOWED_DEPARTMENTS.includes(department)) {
    return res.status(400).json({ error: "Invalid department selection" });
  }

  try {
    const existingUser = await User.findOne({ userId: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = new User({
      userId: normalizedEmail,
      passwordHash,
      name: name.trim(),
      department,
      passOutYear,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiresAt: tokenExpiry,
      isEmailVerified: false
    });

    await user.save();

    const verificationLink =
      `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "Verify your email - LGC Concept AI",
        html: `
          <p>Welcome to LGC Concept AI,</p>
          <p>Please verify your email by clicking the link below:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
          <p>This link will expire in 24 hours.</p>
        `
      });
    } catch (mailError) {
      console.error("EMAIL SEND FAILED:", mailError);
      await User.deleteOne({ userId: normalizedEmail });

      return res.status(500).json({
        error: "Could not send verification email. Please try again."
      });
    }

    return res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
});

/* =========================
   RESEND VERIFICATION
   ========================= */

router.post("/resend-verification", resendLimiter, async (req, res) => {
  let { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Valid email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ userId: normalizedEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpiresAt = tokenExpiry;
    await user.save();

    const verificationLink =
      `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: normalizedEmail,
      subject: "Verify your email - LGC Concept AI",
      html: `
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>This link will expire in 24 hours.</p>
      `
    });

    return res.json({ message: "Verification email resent" });

  } catch (err) {
    console.error("RESEND VERIFY ERROR:", err);
    return res
      .status(500)
      .json({ error: "Could not resend verification email" });
  }
});

/* =========================
   VERIFY EMAIL
   ========================= */

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Invalid verification request" });
  }

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Verification link expired or invalid" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiresAt = undefined;

    await user.save();

    return res.json({ message: "Email verified successfully" });

  } catch (err) {
    console.error("EMAIL VERIFY ERROR:", err);
    return res.status(500).json({ error: "Email verification failed" });
  }
});

/* =========================
   LOGIN
   ========================= */

router.post("/login", loginLimiter, async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password || typeof email !== "string") {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ userId: normalizedEmail });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ error: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json({ message: "Login successful" });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

export default router;
