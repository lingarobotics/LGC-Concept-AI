import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import Home from "./Pages/Home";
import ExploreModes from "./Pages/ExploreModes";
import LearnMode from "./Pages/LearnMode";
import FastLearnMode from "./Pages/FastLearnMode";
import DoubtMode from "./Pages/DoubtMode";
import TeachBackMode from "./Pages/TeachBackMode";
import VerifyEmail from "./Pages/VerifyEmail";
import AuthPage from "./Pages/AuthPage";
import Why from "./Pages/Why";

import lgcLogo from "./assets/icon.png";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

function AppShell({ children }) {
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
      {showSplash && (
        <div className="splash-overlay">
          <div className="splash-card">
            <img
              src={lgcLogo}
              alt="LGC Concept AI Logo"
              width="100"
              className="splash-logo"
              style={{ marginBottom: "12px" }}
            />
            <h2 className="splash-title">LGC Concept AI</h2>
            <h3 className="splash-subtitle">Learn. Govern. Construct</h3>
            <p className="splash-tagline">Learning at No Cost</p>
            <span className="splash-version">Version 2.0</span>
          </div>
        </div>
      )}

      <div className="app-shell">
        {/* Header */}
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

          {!isAuthenticated ? (
            <button
              style={{
                background: "transparent",
                border: "1px solid #4f8cff",
                color: "#4f8cff",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "0.85rem"
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
                fontSize: "0.85rem"
              }}
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>

        {/* Page Content */}
        <div className="mode-container" style={{ marginTop: "24px" }}>
          {children}
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
          <Route
            path="/"
            element={
              <AppShell>
                <Home />
              </AppShell>
            }
          />

          <Route
            path="/explore"
            element={
              <AppShell>
                <ExploreModes />
              </AppShell>
            }
          />

          <Route
            path="/why"
            element={
              <AppShell>
                <Why />
              </AppShell>
            }
          />

          <Route
            path="/learn"
            element={
              <AppShell>
                <LearnMode />
              </AppShell>
            }
          />

          <Route
            path="/fast-learn"
            element={
              <AppShell>
                <FastLearnMode />
              </AppShell>
            }
          />

          <Route
            path="/doubt"
            element={
              <AppShell>
                <DoubtMode />
              </AppShell>
            }
          />

          <Route
            path="/teach-back"
            element={
              <AppShell>
                <TeachBackMode />
              </AppShell>
            }
          />

          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
