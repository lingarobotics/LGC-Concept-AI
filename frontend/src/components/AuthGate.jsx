import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

function AuthGate({ onSuccess, onClose }) {
  const [mode, setMode] = useState("register"); // register | login

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
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
          textAlign: "center"
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
              // ✅ DO NOTHING on register success
              // Keep modal open so user sees verification guidance
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

        <button
          onClick={onClose}
          style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: "12px" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default AuthGate;
