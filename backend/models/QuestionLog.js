import mongoose from "mongoose";

const questionLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    question: {
      type: String,
      required: true
    },

    mode: {
      type: String,
      enum: ["learn", "doubt", "teachback"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("QuestionLog", questionLogSchema);
