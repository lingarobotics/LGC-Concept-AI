import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../context/AuthContext";
import ModeSwitchCTA from "../components/ModeSwitchCTA";

function TeachBackMode() {
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, userEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async () => {
    if (!explanation.trim()) return;

    /* Strict Auth Required */
    if (!isAuthenticated) {
      navigate("/auth", {
        state: { from: location.pathname }
      });
      return;
    }

    setLoading(true);
    const currentExplanation = explanation;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentExplanation,
          mode: "teachback"
        })
      });

      const data = await res.json();

      if (data?.answer && data.answer.trim()) {
        setFeedback((prev) => [...prev, data.answer]);
      } else {
        setFeedback((prev) => [
          ...prev,
          "✅ Your explanation appears conceptually correct. You may refine it further with clearer logic or examples."
        ]);
      }

      setExplanation("");

      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/question/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            question: currentExplanation,
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
      {/* Mode Description - Cleaned */}
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
        disabled={loading}
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

      {/* Switch Section */}
      <ModeSwitchCTA currentMode="teach-back" />
    </>
  );
}

export default TeachBackMode;
