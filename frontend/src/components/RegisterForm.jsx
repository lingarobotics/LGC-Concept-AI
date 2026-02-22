import { useState } from "react";

/* =========================
   PASSWORD STRENGTH
   ========================= */

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 1) return "weak";
  if (score === 2) return "medium";
  return "strong";
}

function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    department: "",
    passOutYear: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const passwordStrength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const allFieldsFilled =
    form.email &&
    form.password &&
    form.name &&
    form.department &&
    form.passOutYear;

  const canSubmit =
    allFieldsFilled && passwordStrength !== "weak";

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError(
        passwordStrength === "weak"
          ? "Password is too weak"
          : "Please fill all required fields"
      );
      return;
    }

    setError("");
    setInfo("");
    setLoading(true);

    const payload = {
      email: form.email,
      password: form.password,
      name: form.name,
      department: form.department,
      passOutYear: form.passOutYear
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      setInfo(
        "Account created successfully. Please verify your email using the link sent to your inbox."
      );
    } catch {
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "left" }}>
      <input
        name="email"
        placeholder="Email *"
        value={form.email}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      {/* Password */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password *"
          value={form.password}
          onChange={handleChange}
          style={{ flex: 1 }}
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          👁️
        </button>
      </div>

      {/* Password strength */}
      {form.password && (
        <div
          style={{
            fontSize: "0.8rem",
            marginBottom: "10px",
            color:
              passwordStrength === "weak"
                ? "#f87171"
                : passwordStrength === "medium"
                ? "#facc15"
                : "#4ade80"
          }}
        >
          Password strength: <b>{passwordStrength}</b>
        </div>
      )}

      <input
        name="name"
        placeholder="Name *"
        value={form.name}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      {/* Department */}
      <select
        name="department"
        value={form.department}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "8px" }}
      >
        <option value="" disabled>
          Select Department *
        </option>
        <option value="Robotics Engineering">Robotics Engineering</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="EEE">EEE</option>
        <option value="Mechanical Engineering">Mechanical Engineering</option>
        <option value="Civil Engineering">Civil Engineering</option>
        <option value="Automobile Engineering">Automobile Engineering</option>
        <option value="Biotechnology">Biotechnology</option>
        <option value="BME">BME</option>
        <option value="AI & DS">AI & DS</option>
        <option value="Other">Other</option>
      </select>

      {/* Pass-out year */}
      <select
        name="passOutYear"
        value={form.passOutYear}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <option value="" disabled>
          Pass-out Year *
        </option>
        {Array.from({ length: 11 }, (_, i) => {
          const year = 2022 + i;
          return (
            <option key={year} value={year}>
              {year}
            </option>
          );
        })}
      </select>

      {error && (
        <div style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: "8px" }}>
          {error}
        </div>
      )}

      {info && (
        <div style={{ color: "#4ade80", fontSize: "0.8rem", marginBottom: "8px" }}>
          {info}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        style={{ width: "100%" }}
      >
        {loading ? "Creating account…" : "Register"}
      </button>
    </div>
  );
}

export default RegisterForm;