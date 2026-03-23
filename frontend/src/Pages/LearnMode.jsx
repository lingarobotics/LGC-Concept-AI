import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useAuth } from "../context/AuthContext";
import ModeSwitchCTA from "../components/ModeSwitchCTA";

/* ---------------- CLEANING PIPELINE ---------------- */

function normalizeMath(text) {
  if (!text) return "";

  return text
    // Convert \( ... \) → $ ... $
    .replace(/\\\((.*?)\\\)/gs, (_, expr) => `$${expr.trim()}$`)

    // Convert \[ ... \] → $$ ... $$
    .replace(/\\\[(.*?)\\\]/gs, (_, expr) => `\n$$\n${expr.trim()}\n$$\n`)

    // Fix broken comma math
    .replace(
      /([A-Za-z0-9\)\}])\s*,\s*(\\dot\{?[A-Za-z]+\}?|\\ddot\{?[A-Za-z]+\}?)/g,
      "$1$2"
    )

    .replace(
      /([A-Za-z0-9\)\}])\s*,\s*(\\(mathbf|tau|mathcal|partial|frac|sum|int|left|right))/g,
      "$1 $2"
    )

    // Clean spacing
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const cleanLatex = (text) => {
  if (!text) return "";

  return text
    // Normalize dash variants (CRITICAL FIX)
    .replace(/[\u2010-\u2015]/g, "-")

    // Normalize quotes
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")

    // Clean ONLY inside math blocks (safe)
    .replace(/\$([^$]*)\$/g, (_, expr) =>
      `$${expr.replace(/[\u2010-\u2015]/g, "-")}$`
    )

    .replace(/\$\$([^$]*)\$\$/g, (_, expr) =>
      `$$${expr.replace(/[\u2010-\u2015]/g, "-")}$$`
    );
};

/* ---------------- COMPONENT ---------------- */

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

  /* ---------------- ASK AI ---------------- */

  const askAI = async () => {
    if (!question.trim()) return;

    if (!isAuthenticated && questionCount >= 3) {
      navigate("/auth", {
        state: { from: location.pathname }
      });
      return;
    }

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

      // 🔥 FIX: Proper pipeline
      const processed = normalizeMath(cleanLatex(data.answer));

      setAnswer(processed); // MAIN OUTPUT
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

  /* ---------------- CORE POINTS ---------------- */

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

      // 🔥 FIX: Same pipeline
      const processed = normalizeMath(cleanLatex(data.answer));

      setCoreAnswer(processed);

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
    } finally {
      setCoreLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <div
        style={{
          fontSize: "0.9rem",
          color: "#bbb",
          marginBottom: "16px",
          lineHeight: "1.6"
        }}
      >
        <b>Learn Mode</b> is for structured, exam-relevant understanding.
        <br />
        Ask for full explanations when you want clarity with proper depth.
      </div>

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

      {answer && (
        <div className="output-box" style={{ marginTop: "16px" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {answer}
          </ReactMarkdown>
        </div>
      )}

      {answer && (
        <div style={{ marginTop: "12px" }}>
          <button
            onClick={getCorePoints}
            disabled={coreLoading}
            style={{ fontSize: "0.85rem", opacity: 0.9 }}
          >
            {coreLoading
              ? "Extracting core points…"
              : "Extract core points / mental model"}
          </button>
        </div>
      )}

      {coreAnswer && (
        <div
          className="output-box"
          style={{
            marginTop: "16px",
            borderLeft: "4px solid #4f8cff",
            paddingLeft: "12px"
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {coreAnswer}
          </ReactMarkdown>
        </div>
      )}

      <ModeSwitchCTA currentMode="learn" />
    </>
  );
}

export default LearnMode;