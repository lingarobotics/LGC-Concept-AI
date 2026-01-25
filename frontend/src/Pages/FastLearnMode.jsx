import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../context/AuthContext";

function FastLearnMode() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const askFastLearn = async () => {
    if (!question.trim()) return;

    /* ----------- SOFT AUTH GATE (v1.2 parity) ----------- */
    if (!isAuthenticated && questionCount >= 3) {
      navigate("/auth", {
        state: { from: location.pathname }
      });
      return;
    }
    /* --------------------------------------------------- */

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          mode: "fast-learn"
        })
      });

      const data = await res.json();
      setAnswer(data.answer);
      setQuestionCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Fast Learn Explanation */}
      <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "12px" }}>
        <b>Fast Learn Mode (Version 2.0)</b>
        <br />
        <br />
        This mode is designed for <b>quick clarity</b> when you do not have
        enough time for detailed explanations.
        <br />
        <br />
        Ask a question and receive <b>key takeaways only</b>.
        This mode focuses on remembering the core idea, not deep learning.
        Use Learn Mode for <strong>comprehensive understanding and coding-related questions</strong>.
      </div>

      {/* Input */}
      <textarea
        rows="3"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question for quick understanding"
        style={{ width: "100%", padding: "12px", resize: "none" }}
      />

      <button
        onClick={askFastLearn}
        disabled={loading}
        style={{ marginTop: "12px" }}
      >
        {loading ? "Getting key points…" : "Ask"}
      </button>

      {/* Answer */}
      {answer && (
        <div className="output-box" style={{ marginTop: "16px" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {answer}
          </ReactMarkdown>
        </div>
      )}
    </>
  );
}

export default FastLearnMode;
