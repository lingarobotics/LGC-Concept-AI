import { useState } from "react";

function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const allFieldsFilled = email && password;

  const handleLogin = async () => {
    if (!allFieldsFilled) {
      setError("Email and password are required");
      return;
    }

    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // 🔑 PASS IDENTITY UPWARD
      onSuccess(email);
    } catch {
      setError("Server error");
    }
  };

  return (
    <div style={{ textAlign: "left" }}>
      <input
        placeholder="Email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
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

      {error && (
        <div style={{ color: "#f88", fontSize: "0.8rem", marginBottom: "8px" }}>
          {error}
        </div>
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
