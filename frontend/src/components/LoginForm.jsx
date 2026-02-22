import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ onSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [resending, setResending] = useState(false);

  const allFieldsFilled = email && password;

  const handleLogin = async () => {
    if (!allFieldsFilled) {
      setError("Email and password are required");
      return;
    }

    setError("");
    setInfo("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Email not verified") {
          setError("Your email is not verified.");
          setInfo("Please verify your email using the link sent to your inbox.");
        } else {
          setError(data.error || "Login failed");
        }
        return;
      }

      onSuccess({ email, success: true });
    } catch {
      setError("Server error");
    }
  };

  const resendVerification = async () => {
    setResending(true);
    setError("");
    setInfo("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not resend verification email");
        setResending(false);
        return;
      }

      setInfo("Verification email has been resent. Please check your inbox.");
    } catch {
      setError("Server error");
    }

    setResending(false);
  };

  return (
    <div style={{ textAlign: "left" }}>
      <input
        placeholder="Email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          👁️
        </button>
      </div>

      {/* Forgot password link */}
      <div
        style={{
          textAlign: "right",
          marginBottom: "10px"
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          style={{
            background: "none",
            border: "none",
            color: "#4f8cff",
            cursor: "pointer",
            fontSize: "0.8rem",
            padding: 0
          }}
        >
          Forgot password?
        </button>
      </div>

      {error && (
        <div style={{ color: "#f88", fontSize: "0.8rem", marginBottom: "6px" }}>
          {error}
        </div>
      )}

      {info && (
        <div style={{ color: "#8f8", fontSize: "0.8rem", marginBottom: "6px" }}>
          {info}
        </div>
      )}

      {error === "Your email is not verified." && (
        <button
          onClick={resendVerification}
          disabled={resending}
          style={{
            width: "100%",
            marginBottom: "8px",
            fontSize: "0.85rem"
          }}
        >
          {resending ? "Resending…" : "Resend verification email"}
        </button>
      )}

      <button
        onClick={handleLogin}
        disabled={!allFieldsFilled}
        style={{ width: "100%" }}
      >
        Login
      </button>
    </div>
  );
}

export default LoginForm;