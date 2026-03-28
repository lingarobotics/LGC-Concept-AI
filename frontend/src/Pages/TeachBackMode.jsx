import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../context/AuthContext";
import { useContextState } from "../context/ContextProvider"; // ✅ ADDED
import ModeSwitchCTA from "../components/ModeSwitchCTA";
import SubjectInput from "../components/SubjectInput";

function TeachBackMode() {
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, userEmail } = useAuth();
  const { context } = useContextState(); // ✅ ADDED

  const navigate = useNavigate();
  const location = useLocation();

  const submit = async () => {
    const trimmedExplanation = explanation.trim();
    if (!trimmedExplanation) return;

    /* Strict Auth Required */
    if (!isAuthenticated) {
      navigate("/auth", {
        state: { from: location.pathname }
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmedExplanation,
          mode: "teachback",
          context //  ADDED context for teach-back evaluation
        })
      });

      const data = await res.json();

      if (data?.answer && data.answer.trim()) {
        setFeedback((prev) => [...prev, data.answer]);
      } else {
        setFeedback((prev) => [
          ...prev,
          "⚠️ Feedback unavailable at the moment. Try refining your explanation or retry"
        ]);
      }

      setExplanation("");

      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/question/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            question: trimmedExplanation,
            mode: "teachback"
          })
        });
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mode Description */}
      <div
        style={{
          fontSize: "0.9rem",
          color: "#bbb",
          marginBottom: "16px",
          lineHeight: "1.6"
        }}
      >
        <b>Teach-Back Mode</b> verifies your understanding.
        <br />
        Explain the concept in your own words and receive structured feedback.
      </div>

      <SubjectInput />
      {/* Input */}
      <textarea
        rows="4"
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        placeholder="Explain what you understood…"
        style={{ width: "100%", padding: "12px", resize: "none" }}
      />

      <button
        onClick={submit}
        disabled={loading || !explanation.trim()}
        style={{ marginTop: "12px" }}
      >
        {loading ? "Evaluating…" : "Evaluate my explanation"}
      </button>

      {/* Feedback */}
      <div style={{ marginTop: "12px" }}>
        {feedback.map((f, i) => (
          <div key={i} className="output-box" style={{ marginBottom: "12px" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {f}
            </ReactMarkdown>
          </div>
        ))}
      </div>

      {/* Switch */}
      <ModeSwitchCTA currentMode="teach-back" />
    </>
  );
}

export default TeachBackMode;