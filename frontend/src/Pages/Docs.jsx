import { useRef } from "react";

function Docs() {
  const featuresRef = useRef(null);
  const modesRef = useRef(null);
  const flowRef = useRef(null);
  const subjectRef = useRef(null);

  const isMobile = window.innerWidth < 768;

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sectionStyle = { marginBottom: "40px" };
  const subText = { color: "#aaa", lineHeight: "1.7" };

  return (
    <div
      style={{
        display: isMobile ? "block" : "flex",
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "0 12px"
      }}
    >
      {/* SIDEBAR / TOP NAV */}
      <div
        style={{
          width: isMobile ? "100%" : "220px",
          position: isMobile ? "relative" : "sticky",
          top: "80px",
          marginBottom: isMobile ? "20px" : "0",
          paddingRight: isMobile ? "0" : "20px"
        }}
      >
        <h3 style={{ marginBottom: "12px" }}>📘 Docs</h3>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            gap: "10px",
            overflowX: isMobile ? "auto" : "visible"
          }}
        >
          <button onClick={() => scrollTo(featuresRef)} className="doc-link">
            🚀 Features
          </button>

          <button onClick={() => scrollTo(modesRef)} className="doc-link">
            🧠 Modes
          </button>

          <button onClick={() => scrollTo(flowRef)} className="doc-link">
            ⚙️ Flow
          </button>

          <button onClick={() => scrollTo(subjectRef)} className="doc-link">
            🎯 Subject
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "0 8px" }}>
        <h1>📘 Documentation</h1>
        <p style={{ color: "#aaa", marginBottom: "32px" }}>
          Understand how to use LGC Concept AI effectively based on your learning need
        </p>

        {/* FEATURES */}
        <div ref={featuresRef} style={sectionStyle}>
          <h2>🚀 Core Features</h2>
          <p style={subText}>
            LGC Concept AI is designed as a structured learning system, not just an AI chatbot.
          </p>

          <ul style={subText}>
            <li><b>Subject-Aware Learning:</b> Domain-focused answers</li>
            <li><b>Core Points Extraction:</b> Convert answers into revision points</li>
            <li><b>Understanding Verification:</b> Explain → AI evaluates</li>
            <li><b>Structured Answers:</b> Clear, exam-ready format</li>
          </ul>
        </div>

        {/* MODES */}
        <div ref={modesRef} style={sectionStyle}>
          <h2>🧠 Mode Selection Guide</h2>

          <h3>🧠 Learn Mode</h3>
          <p style={subText}>
            Use when learning a topic for the first time or preparing for exams.
            Provides structured, complete, and exam-ready answers.
          </p>

          <h3>❓ Doubt Mode</h3>
          <p style={subText}>
            Use when you have a specific confusion.
            Answers are short, precise, and focused only on the doubt.
          </p>

          <h3>⚡ Fast Learn Mode</h3>
          <p style={subText}>
            Use for quick revision or last-minute preparation.
            Provides only key points without detailed explanation.
          </p>

          <h3>🔁 Teach-Back Mode</h3>
          <p style={subText}>
            Use to verify your understanding.
            You explain → AI evaluates and highlights gaps.
          </p>
        </div>

        {/* FLOW */}
        <div ref={flowRef} style={sectionStyle}>
          <h2>⚙️ Recommended Learning Flow</h2>

          <ol style={subText}>
            <li>Start with <b>Learn Mode</b> for full understanding</li>
            <li>Use <b>Doubt Mode</b> to clear specific confusion</li>
            <li>Use <b>Fast Learn Mode</b> for quick revision</li>
            <li>Use <b>Teach-Back Mode</b> to verify understanding</li>
          </ol>
        </div>

        {/* SUBJECT */}
        <div ref={subjectRef} style={sectionStyle}>
          <h2>🎯 Subject Context</h2>

          <p style={subText}>
            You can optionally define a subject (e.g., Automotive Mechatronics).
          </p>

          <ul style={subText}>
            <li>Answers stay strictly within the domain</li>
            <li>No unrelated explanations</li>
            <li>More exam-relevant responses</li>
          </ul>
        </div>

        {/* CORE IDEA */}
        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <b>Core Idea:</b>
          <p style={{ ...subText, marginTop: "6px" }}>
            Use the right mode at the right time.  
            LGC Concept AI is a guided learning system, not a single-answer tool.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Docs;