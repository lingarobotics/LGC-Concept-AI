import mongoose from "mongoose";

const userExplanationsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    explanations: [
      {
        text: {
          type: String,
          required: true
        },

        type: {
          type: String,
          enum: ["teachback", "core_points"],
          required: true
        },

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("UserExplanations", userExplanationsSchema);
