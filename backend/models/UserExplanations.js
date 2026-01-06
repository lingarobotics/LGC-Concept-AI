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

        mode: {
          type: String,
          enum: ["teachback"],
          default: "teachback"
        },

        explainedAt: {
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
