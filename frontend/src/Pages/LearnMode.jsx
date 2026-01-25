import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../context/AuthContext";

function LearnMode() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [coreAnswer, setCoreAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [coreLoading, setCoreLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [questionCount, setQuestionCount] = useState(0);

  const { isAuthenticated, userEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

    /* ----------- SOFT AUTH GATE (v1.2 parity) ----------- */
    if (!isAuthenticated && questionCount >= 3) {
      navigate("/auth", {
        state: { from: location.pathname }
      });
      return;
    }
    /* --------------------------------------------------- */

    setLoading(true);
    setLoadingText("Getting your answer…");
    setAnswer("");
    setCoreAnswer("");

    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoadingText("Structuring it…");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          mode: "learn"
        })
      });

      const data = await res.json();
      setAnswer(data.answer);
      setQuestionCount((prev) => prev + 1);

      if (isAuthenticated && userEmail) {
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/question/log`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              question,
              mode: "learn"
            })
          });
        } catch {}
      }
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const getCorePoints = async () => {
    if (!answer) return;

    setCoreLoading(true);
    setCoreAnswer("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          explanation: answer,
          mode: "learn-core"
        })
      });

      const data = await res.json();
      setCoreAnswer(data.answer);

      /* -------- LOG CORE POINTS ACTION (v2.0) -------- */
      if (isAuthenticated && userEmail) {
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/question/log`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              question,
              mode: "learn",
              action: "core_points"
            })
          });
        } catch {}
      }
      /* ---------------------------------------------- */
    } finally {
      setCoreLoading(false);
    }
  };

  return (
    <>
      {/* V2.0 Detailed Explanation */}
      <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "12px" }}>
        <b>Learn Mode (Version 2.0)</b>
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
        {loading ? loadingText : "Ask"}
      </button>

      {/* Answer (mandatory) */}
      {answer && (
        <div className="output-box" style={{ marginTop: "16px" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {answer}
          </ReactMarkdown>
        </div>
      )}

      {/* Core / Mental Model Button */}
      {answer && (
        <div style={{ marginTop: "12px" }}>
          <button
            onClick={getCorePoints}
            disabled={coreLoading}
            style={{ fontSize: "0.85rem", opacity: 0.9 }}
          >
            {coreLoading
              ? "Extracting core points…"
              : "Get core points / mental model"}
          </button>
        </div>
      )}

      {/* Core Answer (separate space) */}
      {coreAnswer && (
        <div
          className="output-box"
          style={{
            marginTop: "16px",
            borderLeft: "4px solid #4f8cff",
            paddingLeft: "12px"
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {coreAnswer}
          </ReactMarkdown>
        </div>
      )}
    </>
  );
}

export default LearnMode;
