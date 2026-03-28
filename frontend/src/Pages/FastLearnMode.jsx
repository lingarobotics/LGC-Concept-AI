import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../context/AuthContext";
import { useContextState } from "../context/ContextProvider"; // ✅ ADDED
import ModeSwitchCTA from "../components/ModeSwitchCTA";

function FastLearnMode() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const { isAuthenticated } = useAuth();
  const { context } = useContextState(); // ✅ ADDED

  const navigate = useNavigate();
  const location = useLocation();

  const askFastLearn = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

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
          question: trimmedQuestion,
          mode: "fast-learn",
          context // ✅ ADDED
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
      <div style={{ fontSize: "0.9rem", color: "#bbb", marginBottom: "16px", lineHeight: "1.6" }}>
        <b>Fast Learn Mode</b> is for quick clarity under time pressure.
        <br />
        Ask your question and get focused key takeaways.
      </div>

      <SubjectInput />

      <textarea
        rows="3"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask for quick understanding"
        style={{ width: "100%", padding: "12px", resize: "none" }}
      />

      <button
        onClick={askFastLearn}
        disabled={loading || !question.trim()}
        style={{ marginTop: "12px" }}
      >
        {loading ? "Getting key points…" : "Ask"}
      </button>

      {answer && (
        <div className="output-box" style={{ marginTop: "16px" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {answer}
          </ReactMarkdown>
        </div>
      )}

      <ModeSwitchCTA currentMode="fast-learn" />
    </>
  );
}

export default FastLearnMode;