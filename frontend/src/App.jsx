import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import LearnMode from "./Pages/LearnMode";
import FastLearnMode from "./Pages/FastLearnMode";
import DoubtMode from "./Pages/DoubtMode";
import TeachBackMode from "./Pages/TeachBackMode";
import VerifyEmail from "./Pages/VerifyEmail";
import AuthPage from "./Pages/AuthPage";

import lgcLogo from "./assets/icon.png";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

function AppContent() {
  const [mode, setMode] = useState("home");
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Splash */}
      {showSplash && (
        <div className="splash-overlay">
          <div className="splash-card">
            <img
              src={lgcLogo}
              alt="LGC Concept AI Logo"
              width="100"
              className = "splash-logo"
              style={{ marginBottom: "12px" }}
            />
            <h2 className = "splash-title">LGC Concept AI</h2>
            <h3 className = "splash-subtitle">Learn. Govern. Construct</h3>
            <p className = "splash-tagline">Learning at No Cost</p>
            <span className = "splash-version">Version 2.0</span>
          </div>
        </div>
      )}

      {/* App Shell */}
      <div className="app-shell">
        {/* Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <h2 style={{ marginBottom: "4px" }}>LGC Concept AI</h2>
            <p className="helper-text">
              Exam-focused learning • Doubt clearing • Teach-back verification
            </p>
          </div>

          {/* TOP-RIGHT AUTH ACTION */}
          {!isAuthenticated ? (
            <button
              style={{
                background: "transparent",
                border: "1px solid #4f8cff",
                color: "#4f8cff",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "0.85rem",
                whiteSpace: "nowrap"
              }}
              onClick={() => navigate("/auth")}
            >
              Login / Register
            </button>
          ) : (
            <button
              style={{
                background: "transparent",
                border: "1px solid #8a8a8a",
                color: "#8a8a8a",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "0.85rem",
                whiteSpace: "nowrap"
              }}
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>

        {/* MODE SWITCH */}
        <div className="mode-switch" style={{ marginTop: "16px" }}>
          <button onClick={() => setMode("home")}>Home</button>
          <button onClick={() => setMode("learn")}>Learn</button>
          <button onClick={() => setMode("fastlearn")}>Fast Learn</button>
          <button onClick={() => setMode("doubt")}>Doubt</button>
          <button onClick={() => setMode("teachback")}>Teach-Back</button>
        </div>

        {/* MODE CONTENT */}
        <div className="mode-container">
          {mode === "home" && (
            <div className="home-mode">
              <h3>Choose the Right Mode for Your Situation</h3>

              <p>
                <strong>Learn Mode</strong> — Use this when you want
                <b> deep and structured understanding</b>.
                Best suited for first-time learning, exam preparation,
                and building strong conceptual foundations.
              </p>

              <p>
                <strong>Fast Learn</strong> — Choose this when you
                <b> don’t have much time</b> and need quick clarity.
                This mode provides key takeaways directly,
                without long explanations.
                Suitable for last-minute learning or revision.
                For deep understanding and coding-related questions,
                use Learn Mode.
              </p>

              <p>
                <strong>Doubt Mode</strong> — Use this when you already
                understand most of a topic but have
                <b> one specific confusion</b>.
                This mode clears precise doubts quickly,
                without re-explaining the entire concept
                or switching to exam-style answers.
              </p>

              <p>
                <strong>Teach-Back Mode</strong> — This is the
                <b> most powerful way to learn</b>.
                If you want to be sure you truly understand a concept,
                explain it in your own words and let the system
                verify your understanding.
              </p>
            </div>
          )}

          {mode === "learn" && <LearnMode />}
          {mode === "fastlearn" && <FastLearnMode />}
          {mode === "doubt" && <DoubtMode />}
          {mode === "teachback" && <TeachBackMode />}
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

//this file is for version 2.0.0