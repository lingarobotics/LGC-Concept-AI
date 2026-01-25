import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

function AuthGate({ onSuccess }) {
  const [mode, setMode] = useState("register"); // register | login

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f1115",
        padding: "24px"
      }}
    >
      <div
        style={{
          background: "#111",
          color: "#eee",
          padding: "24px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
          border: "1px solid #2a2f45"
        }}
      >
        <h3 style={{ marginBottom: "12px" }}>
          Save your learning progress
        </h3>

        <p style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "20px" }}>
          Create a free account or log in to continue learning.
        </p>

        {/* Toggle buttons */}
        <div style={{ marginBottom: "16px" }}>
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

        {/* Auth Forms */}
        {mode === "register" ? (
          <RegisterForm
            onSuccess={() => {
              // Registration success flow stays unchanged
            }}
          />
        ) : (
          <LoginForm
            onSuccess={({ email, success }) => {
              if (success) {
                onSuccess({ email, success });
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

export default AuthGate;
