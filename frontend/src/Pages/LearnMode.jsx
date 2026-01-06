import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AuthGate from "../components/AuthGate";
import { useAuth } from "../context/AuthContext";

function LearnMode() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [showAuthGate, setShowAuthGate] = useState(false);
  
  /* -------- GLOBAL AUTH (v1.1) -------- */
  const { isAuthenticated, userEmail, login, logout } = useAuth();
  /* ----------------------------------- */

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

    /* ----------- SOFT AUTH GATE ----------- */
    if (!isAuthenticated && questionCount >= 3) {
      setShowAuthGate(true);
      return;
    }
    /* ------------------------------------- */

    setLoading(true);
    setLoadingText("Getting your answer…");
    setAnswer("");

    // readable pause for first message
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
          const logRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/question/log`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              question,
              mode: "learn"
            })
          });

          const logData = await logRes.json();
          console.log("Question log result:", logData);
        } catch (err) {
          console.error("Question logging failed:", err);
        }
      }
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <>
      {/* V1.1 Detailed Explanation */}
      <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "12px" }}>
        <b>Learn Mode (Version 1.1)</b>
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

      {/* Auth entry */}
      {!isAuthenticated && (
        <div
          style={{
            fontSize: "0.8rem",
            color: "#bbb",
            marginBottom: "12px",
            textAlign: "center"
          }}
        >
          You may{" "}
          <button
            style={{ fontSize: "0.8rem" }}
            onClick={() => setShowAuthGate(true)}
          >
            Login / Register
          </button>{" "}
          to save your learning progress.
        </div>
      )}

      {/* Logout */}
      {isAuthenticated && (
        <div style={{ textAlign: "right", marginBottom: "8px" }}>
          <button
            style={{ fontSize: "0.8rem", opacity: 0.7 }}
            onClick={() => {
              logout();
              setQuestionCount(0);
            }}
          >
            Logout
          </button>
        </div>
      )}

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

      {/* Answer */}
      {answer && (
        <div className="output-box" style={{ marginTop: "16px" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {answer}
          </ReactMarkdown>
        </div>
      )}

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

export default LearnMode;
