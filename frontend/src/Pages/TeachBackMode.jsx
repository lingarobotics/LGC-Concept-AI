import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function TeachBackMode() {
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!explanation.trim()) return;

    setLoading(true);

    const res = await fetch("https://lgc-concept-ai.up.railway.app/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: explanation, mode: "teachback" })
    });

    const data = await res.json();
    setFeedback((prev) => [...prev, data.answer]);
    setExplanation("");
    setLoading(false);
  };

  return (
    <>
      {/* V1 Detailed Explanation */}
      <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "12px" }}>
        <b>Teach-Back Mode (Version 1.0)</b>
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

      {/* Input */}
      <textarea
        rows="4"
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        placeholder="Explain what you understood…"
        style={{ width: "100%", padding: "12px", resize: "none" }}
      />

      <button onClick={submit} disabled={loading} style={{ marginTop: "12px" }}>
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
    </>
  );
}

export default TeachBackMode;
