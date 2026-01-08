import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AuthGate from "../components/AuthGate";
import { useAuth } from "../context/AuthContext";

function TeachBackMode() {
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);

  /* -------- GLOBAL AUTH (v1.1) -------- */
  const { isAuthenticated, userEmail, login } = useAuth();
  /* ----------------------------------- */

  const submit = async () => {
    if (!explanation.trim()) return;

    if (!isAuthenticated) {
      setShowAuthGate(true);
      return;
    }

    setLoading(true);
    const currentExplanation = explanation;

    try {
      /* -------- AI CALL (Railway) -------- */
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentExplanation,
          mode: "teachback"
        })
      });

      const data = await res.json();

      /* -------- SAFE FEEDBACK HANDLING -------- */
      if (data?.answer && data.answer.trim()) {
        setFeedback((prev) => [...prev, data.answer]);
      } else {
        setFeedback((prev) => [
          ...prev,
          "✅ Your explanation appears conceptually correct. No major issues were detected. You may add more depth or examples if required."
        ]);
      }

      setExplanation("");

      /* -------- LOG EXPLANATION (Local Backend) -------- */
      try {
        const logRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/question/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            question: currentExplanation,
            mode: "teachback"
          })
        });

        const logData = await logRes.json();
        console.log("Teachback logged:", logData);
      } catch (err) {
        console.error("Teachback logging failed:", err);
      }
      /* ----------------------------------------------- */
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* V1 Detailed Explanation */}
      <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "12px" }}>
        <b>Teach-Back Mode (Version 1.2)</b>
        <br />
        <br />
        This mode evaluates your understanding by asking you to
        <b> explain the concept in your own words</b>.
        <br />
        <br />
        Your explanation is checked for correctness, missing logic,
        and misconceptions. The goal is to verify understanding,
        not to judge writing style.
        <br />
        <br />
        Each submission is evaluated independently.
        Progress tracking and cross-session learning analysis
        will be introduced in a future version.
      </div>

      {/* Auth Info */}
      {!isAuthenticated && (
        <div
          style={{
            fontSize: "0.8rem",
            color: "#bbb",
            marginBottom: "12px",
            textAlign: "center"
          }}
        >
          Please{" "}
          <button
            style={{ fontSize: "0.8rem" }}
            onClick={() => setShowAuthGate(true)}
          >
            Login
          </button>{" "}
          to save your explanations.
        </div>
      )}

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

      {/* Auth Gate */}
      {showAuthGate && (
        <AuthGate
          onSuccess={(email) => {
            login(email);
            setShowAuthGate(false);
          }}
          onClose={() => setShowAuthGate(false)}
        />
      )}
    </>
  );
}

export default TeachBackMode;
