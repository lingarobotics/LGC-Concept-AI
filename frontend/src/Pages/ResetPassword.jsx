import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 1) return "weak";
  if (score === 2) return "medium";
  return "strong";
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const strength = getPasswordStrength(password);

  const canSubmit =
    password &&
    confirmPassword &&
    password === confirmPassword &&
    strength !== "weak";

  const handleReset = async () => {
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Password reset failed");
        return;
      }

      setSuccess("Password reset successful. Redirecting to login…");

      setTimeout(() => navigate("/auth"), 2000);
    } catch {
      setError("Server error");
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "40px auto",
        background: "#12141c",
        border: "1px solid #2a2f45",
        borderRadius: "8px",
        padding: "20px"
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>Reset Password</h2>

      {/* New Password */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          👁️
        </button>
      </div>

      {/* Strength */}
      {password && (
        <div
          style={{
            fontSize: "0.8rem",
            marginBottom: "8px",
            color:
              strength === "weak"
                ? "#f87171"
                : strength === "medium"
                ? "#facc15"
                : "#4ade80"
          }}
        >
          Password strength: <b>{strength}</b>
        </div>
      )}

      {/* Confirm Password */}
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "12px" }}
      />

      {error && (
        <div style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: "8px" }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ color: "#4ade80", fontSize: "0.8rem", marginBottom: "8px" }}>
          {success}
        </div>
      )}

      <button
        onClick={handleReset}
        disabled={!canSubmit}
        style={{ width: "100%" }}
      >
        Reset Password
      </button>
    </div>
  );
}