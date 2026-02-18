import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../context/AuthContext";
import ModeSwitchCTA from "../components/ModeSwitchCTA";

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

    /* Soft Auth Gate */
    if (!isAuthenticated && questionCount >= 3) {
      navigate("/auth", {
        state: { from: location.pathname }
      });
      return;
    }

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
      {/* Mode Description - Cleaned */}
      <div
        style={{
          fontSize: "0.9rem",
          color: "#bbb",
          marginBottom: "16px",
          lineHeight: "1.6"
        }}
      >
        <b>Fast Learn Mode</b> is for quick clarity under time pressure.
        <br />
        Ask your question and get focused key takeaways.
      </div>

      {/* Input */}
      <textarea
        rows="3"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask for quick understanding"
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

      {/* Switch Section */}
      <ModeSwitchCTA currentMode="fast-learn" />
    </>
  );
}

export default FastLearnMode;
