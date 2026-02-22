import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const [mode, setMode] = useState("register"); // "register" | "login"
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = location.state?.from || "/";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1115",
        color: "#e6e6e6",
        padding: "24px 16px"
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto"
        }}
      >
        {/* Back */}
        <button
          onClick={() => navigate(redirectTo)}
          style={{
            background: "none",
            border: "none",
            color: "#8a8a8a",
            cursor: "pointer",
            fontSize: "0.85rem",
            marginBottom: "16px",
            padding: 0
          }}
        >
          ← Back to learning
        </button>

        {/* Heading */}
        <h2 style={{ marginBottom: "6px" }}>LGC Concept AI</h2>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#a0a0a0",
            marginBottom: "24px"
          }}
        >
          {mode === "register"
            ? "Create an account to save your learning progress."
            : "Log in to continue your learning journey."}
        </p>

        {/* Form */}
        {mode === "register" ? (
          <RegisterForm
            onSuccess={() => {
              // handled inside form
            }}
          />
        ) : (
          <LoginForm
            onSuccess={({ email, success }) => {
              if (success) {
                login({ email, success });
                navigate(redirectTo, { replace: true });
              }
            }}
          />
        )}

        {/* Bottom Switch (THIS is the key UX fix) */}
        <div
          style={{
            marginTop: "20px",
            fontSize: "0.85rem",
            color: "#a0a0a0",
            textAlign: "center"
          }}
        >
          {mode === "register" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4f8cff",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "0.85rem"
                }}
              >
                Log in
              </button>
            </>
          ) : (
            <>
              New user?{" "}
              <button
                onClick={() => setMode("register")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4f8cff",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "0.85rem"
                }}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;