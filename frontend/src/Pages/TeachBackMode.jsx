import { useState } from "react";

function TeachBackMode() {
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!explanation.trim()) return;

    setLoading(true);

    const res = await fetch("http://localhost:5000/ask", {
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
      <textarea
        rows="4"
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        placeholder="Explain what you understood…"
      />

      <button onClick={submit} disabled={loading}>
        Evaluate my explanation
      </button>

      <div style={{ maxHeight: "60vh", overflowY: "auto", marginTop: "12px" }}>
        {feedback.map((f, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            {f}
          </div>
        ))}
      </div>
    </>
  );
}

export default TeachBackMode;
