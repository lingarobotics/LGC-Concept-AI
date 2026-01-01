import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function LearnMode() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  /* Typing Placeholder */
  const placeholderTexts = [
    "Explain the construction and working of a transformer",
    "Compare alternator with AC generator",
    "Explain application of ECG with example",
    "What are the advantages and limitations of CPU?",
    "Define and differentiate PN junction and Zener diode",
    "List the contrasts between half-wave and full-wave rectifier"
  ];

  const [placeholder, setPlaceholder] = useState("");
  const [pIndex, setPIndex] = useState(0);
  const [cIndex, setCIndex] = useState(0);

  useEffect(() => {
    if (question) return;
    const current = placeholderTexts[pIndex];

    if (cIndex < current.length) {
      const timer = setTimeout(() => {
        setPlaceholder((prev) => prev + current[cIndex]);
        setCIndex(cIndex + 1);
      }, 60);
      return () => clearTimeout(timer);
    } else {
      const pause = setTimeout(() => {
        setPlaceholder("");
        setCIndex(0);
        setPIndex((pIndex + 1) % placeholderTexts.length);
      }, 1200);
      return () => clearTimeout(pause);
    }
  }, [cIndex, pIndex, question]);

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    const res = await fetch("https://lgc-concept-ai.up.railway.app/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, mode: "learn" })
    });

    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  return (
    <>
      {/* V1 Detailed Explanation */}
      <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "12px" }}>
        <b>Learn Mode (V1)</b>
        <br />
        <br />
        This mode provides <b>structured explanations</b> focused on clarity,
        exam relevance, and <b>mark separation</b>.
        <br />
        <br />
        Each question is handled independently. If you want continuity,
        restate the concept or topic explicitly in your question.
        <br />
        <br />
        Future versions will introduce guided learning paths and
        context-aware progression across topics.
      </div>

      {/* Input */}
      <textarea
        rows="4"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", padding: "12px", resize: "none" }}
      />

      <button onClick={askAI} disabled={loading} style={{ marginTop: "12px" }}>
        {loading ? "Structuring your answer…" : "Ask"}
      </button>

      {/* Answer */}
      {answer && (
        <div
          style={{
            marginTop: "16px",
            maxHeight: "60vh",
            overflowY: "auto",
            background: "#f9f9f9",
            color: "#111",
            padding: "16px",
            borderRadius: "8px"
          }}
        >
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      )}
    </>
  );
}

export default LearnMode;
