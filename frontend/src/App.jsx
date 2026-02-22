import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation
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
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

import lgcLogo from "./assets/icon.png";
import ProfileIcon from "./assets/profile.png";

import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

/* =========================
   APP SHELL
   ========================= */

function AppShell({ children, isLaunching }) {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const hideAuthHeader = [
    "/auth",
    "/forgot-password",
    "/reset-password",
    "/verify-email"
  ].includes(location.pathname);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
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
            <span className="splash-version">Version 2.2</span>
          </div>
        </div>
      )}

      {isLaunching && (
        <div className="launch-overlay">
          <h2 className="launch-text">
            Initializing your Learning Experience
            <span className="dots"></span>
          </h2>
          <div className="launch-bar"></div>
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
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={lgcLogo}
              alt="LGC Concept AI logo"
              style={{
                height: "3.6rem",
                width: "3.6rem",
                borderRadius: "8px",
                flexShrink: 0
              }}
            />

            <div>
              <h2 style={{ marginBottom: "4px" }}>LGC Concept AI</h2>
              <p className="helper-text">
                Exam-focused learning • Doubt clearing • Teach-back verification
              </p>
            </div>
          </div>

          {/* Auth Controls (HIDDEN on auth/reset pages) */}
          {!hideAuthHeader && (
            !isAuthenticated ? (
              <>
                <button
                  className="auth-btn desktop-only"
                  onClick={() => navigate("/auth")}
                >
                  Login / Register
                </button>

                <button
                  className="auth-icon mobile-only"
                  onClick={() => navigate("/auth")}
                  aria-label="Login or Register"
                >
                  <img
                    src={ProfileIcon}
                    alt=""
                    style={{ width: "22px", height: "22px" }}
                  />
                </button>
              </>
            ) : (
              <>
                <button
                  className="auth-btn desktop-only"
                  onClick={logout}
                >
                  Logout
                </button>

                <button
                  className="auth-icon mobile-only"
                  onClick={logout}
                  aria-label="Logout"
                >
                  <img
                    src={ProfileIcon}
                    alt=""
                    style={{ width: "22px", height: "22px" }}
                  />
                </button>
              </>
            )
          )}
        </div>

        <div className="mode-container" style={{ marginTop: "24px" }}>
          {children}
        </div>
      </div>
    </>
  );
}

/* =========================
   ROUTES
   ========================= */

function AppRoutes({ startLaunch, isLaunching }) {
  const navigate = useNavigate();

  const triggerLaunch = (target) => {
    startLaunch(() => navigate(target));
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppShell isLaunching={isLaunching}>
            <Home onStartLearning={() => triggerLaunch("/learn?mode=learn")} />
          </AppShell>
        }
      />

      <Route
        path="/explore"
        element={
          <AppShell isLaunching={isLaunching}>
            <ExploreModes />
          </AppShell>
        }
      />

      <Route
        path="/why"
        element={
          <AppShell isLaunching={isLaunching}>
            <Why />
          </AppShell>
        }
      />

      <Route
        path="/learn"
        element={
          <AppShell isLaunching={isLaunching}>
            <LearnMode />
          </AppShell>
        }
      />

      <Route
        path="/fast-learn"
        element={
          <AppShell isLaunching={isLaunching}>
            <FastLearnMode />
          </AppShell>
        }
      />

      <Route
        path="/doubt"
        element={
          <AppShell isLaunching={isLaunching}>
            <DoubtMode />
          </AppShell>
        }
      />

      <Route
        path="/teach-back"
        element={
          <AppShell isLaunching={isLaunching}>
            <TeachBackMode />
          </AppShell>
        }
      />

      <Route path="/auth" element={<AuthPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/reset-password"
        element={
          <AppShell isLaunching={isLaunching}>
            <ResetPassword />
          </AppShell>
        }
      />
    </Routes>
  );
}

/* =========================
   ROOT
   ========================= */

export default function App() {
  const [isLaunching, setIsLaunching] = useState(false);

  const startLaunch = (navigateFn) => {
    setIsLaunching(true);
    setTimeout(() => {
      navigateFn();
      setIsLaunching(false);
    }, 900);
  };

  return (
    <AuthProvider>
      <AppRoutes startLaunch={startLaunch} isLaunching={isLaunching} />
    </AuthProvider>
  );
}