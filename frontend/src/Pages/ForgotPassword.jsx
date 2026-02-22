import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setError("");
    setInfo("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // explicit feedback as per product decision
        setError(data.error || "No account found with this email");
        setLoading(false);
        return;
      }

      setInfo("Password reset link has been sent to your email.");
    } catch {
      setError("Server error. Please try again later.");
    }

    setLoading(false);
  };

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
        <button
          onClick={() => navigate("/auth")}
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
          ← Back to login
        </button>

        <h2 style={{ marginBottom: "8px" }}>Reset your password</h2>

        <p
          style={{
            fontSize: "0.85rem",
            color: "#a0a0a0",
            marginBottom: "20px"
          }}
        >
          Enter your registered email address. If the account exists, we’ll send
          you a password reset link.
        </p>

        <input
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "12px" }}
        />

        {error && (
          <div style={{ color: "#f88", fontSize: "0.8rem", marginBottom: "8px" }}>
            {error}
          </div>
        )}

        {info && (
          <div style={{ color: "#8f8", fontSize: "0.8rem", marginBottom: "8px" }}>
            {info}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;