// backend/models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Identity
    userId: {
      type: String, // email
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    // Academic context
    name: {
      type: String,
      required: true,
      trim: true
    },

    department: {
      type: String,
      required: true,
      trim: true
    },

    passOutYear: {
      type: Number,
      required: true
    },

    // Stats (v1.1 scope)
    questionsAskedCount: {
      type: Number,
      default: 0
    },

    lastSeenAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
