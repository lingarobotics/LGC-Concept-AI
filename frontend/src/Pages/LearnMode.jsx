import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useAuth } from "../context/AuthContext";
import { useContextState } from "../context/ContextProvider";
import ModeSwitchCTA from "../components/ModeSwitchCTA";
import SubjectInput from "../components/SubjectInput";

/* ---------------- CLEANING PIPELINE (FINAL SAFE) ---------------- */

function normalizeMath(text) {
  if (!text) return "";

  // Convert latex wrappers
  text = text
    .replace(/\\\((.*?)\\\)/gs, (_, expr) => `$${expr.trim()}$`)
    .replace(/\\\[(.*?)\\\]/gs, (_, expr) => `\n$$\n${expr.trim()}\n$$\n`);

  // Clean ONLY inside math blocks
  text = text
    .replace(/\$([^$]+)\$/g, (_, expr) => {
      return `$${expr
        .replace(/\s*,\s*/g, ",")
        .replace(/\s{2,}/g, " ")
        .trim()}$`;
    })
    .replace(/\$\$([^$]+)\$\$/g, (_, expr) => {
      return `$$${expr
        .replace(/\s*,\s*/g, ",")
        .replace(/\s{2,}/g, " ")
        .trim()}$$`;
    });

  return text;
}

const cleanLatex = (text) => {
  if (!text) return "";

  return text
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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
  const { context } = useContextState();

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
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

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
          question: trimmedQuestion,
          mode: "learn",
          context // Learn mode uses context
        })
      });

      const data = await res.json();

      console.log("RAW:", data.answer); // optional debug

      const processed = normalizeMath(cleanLatex(data.answer));

      setAnswer(processed);
      setQuestionCount((prev) => prev + 1);

      if (isAuthenticated && userEmail) {
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/question/log`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              question: trimmedQuestion,
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
          mode: "learn-core",
          context
        })
      });

      const data = await res.json();

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
      <div style={{ fontSize: "0.9rem", color: "#bbb", marginBottom: "16px", lineHeight: "1.6" }}>
        <b>Learn Mode</b> is for structured, exam-relevant understanding.
        <br />
        Ask for full explanations when you want clarity with proper depth.
      </div>

      <SubjectInput questionCount={questionCount} />

      <textarea
        rows="4"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", padding: "12px", resize: "none" }}
      />

      <button onClick={askAI} disabled={loading || !question.trim()} style={{ marginTop: "12px" }}>
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
          <button onClick={getCorePoints} disabled={coreLoading}>
            {coreLoading ? "Extracting…" : "Extract core points"}
          </button>
        </div>
      )}

      {coreAnswer && (
        <div className="output-box" style={{ marginTop: "16px" }}>
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