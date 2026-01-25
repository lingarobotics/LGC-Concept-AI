import mongoose from "mongoose";

const userQuestionsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    questions: [
      {
        question: {
          type: String,
          required: true
        },

        mode: {
          type: String,
          enum: ["learn", "doubt", "teachback", "fast-learn"],
          required: true
        },

        askedAt: {
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

export default mongoose.model("UserQuestions", userQuestionsSchema);
