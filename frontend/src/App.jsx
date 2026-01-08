import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LearnMode from "./Pages/LearnMode";
import DoubtMode from "./Pages/DoubtMode";
import TeachBackMode from "./Pages/TeachBackMode";
import VerifyEmail from "./Pages/VerifyEmail";

import lgcLogo from "./assets/lgc-logo.png";
import { AuthProvider } from "./context/AuthContext";

function AppContent() {
  const [mode, setMode] = useState("learn");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Splash / Flash Card Overlay */}
      {showSplash && (
        <div className="splash-overlay">
          <div className="splash-card">
            <img
              src={lgcLogo}
              alt="LGC Concept AI Logo"
              width="72"
              style={{ marginBottom: "12px" }}
            />
            <h2>LGC Concept AI</h2>
            <p>Learning at No Cost</p>
            <span>Version 1.2</span>
          </div>
        </div>
      )}

      {/* Main Application */}
      <div className="app-shell">
        <h2>LGC Concept AI</h2>

        <p className="helper-text">
          Exam-focused learning • Doubt clearing • Teach-back verification
        </p>

        {/* MODE SWITCH */}
        <div className="mode-switch">
          <button onClick={() => setMode("learn")}>Learn</button>
          <button onClick={() => setMode("doubt")}>Doubt</button>
          <button onClick={() => setMode("teachback")}>Teach-Back</button>
        </div>

        {/* MODE CONTENT */}
        <div className="mode-container">
          {mode === "learn" && <LearnMode />}
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
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
