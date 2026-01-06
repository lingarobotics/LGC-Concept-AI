import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

/* =========================
   REGISTER (v1.1)
   ========================= */
router.post("/register", async (req, res) => {
  const { email, password, name, department, passOutYear } = req.body;

  // Mandatory field check
  if (!email || !password || !name || !department || !passOutYear) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ userId: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      userId: email.toLowerCase(),
      passwordHash,
      name,
      department,
      passOutYear
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully"
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
});

/* =========================
   LOGIN (v1.1)
   ========================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Mandatory field check
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ userId: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json({
      message: "Login successful"
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

export default router;
