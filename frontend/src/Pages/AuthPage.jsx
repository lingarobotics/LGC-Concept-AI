import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const [mode, setMode] = useState("register"); // register | login
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
        {/* Back / Close */}
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

        <h2 style={{ marginBottom: "6px" }}>LGC Concept AI</h2>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#a0a0a0",
            marginBottom: "24px"
          }}
        >
          Create an account or log in to save your learning progress.
        </p>

        {/* Mode Switch */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setMode("register")}
            style={{
              marginRight: "8px",
              opacity: mode === "register" ? 1 : 0.6
            }}
          >
            Register
          </button>

          <button
            onClick={() => setMode("login")}
            style={{
              opacity: mode === "login" ? 1 : 0.6
            }}
          >
            Login
          </button>
        </div>

        {/* Forms */}
        {mode === "register" ? (
          <RegisterForm
            onSuccess={() => {
              // Registration success handled inside form
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
      </div>
    </div>
  );
}

export default AuthPage;
