import { useState } from "react";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const allFieldsFilled =
    form.email &&
    form.password &&
    form.name &&
    form.department &&
    form.passOutYear;

  const handleSubmit = async () => {
    if (!allFieldsFilled) {
      setError("Please fill all required fields");
      return;
    }

    setError("");
    setInfo("");
    setLoading(true);

    const payload = {
      email: form.email,
      password: form.password,
      name: form.name,
      department: form.department, // "Other" is stored as-is
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

      // ✅ Registration successful — DO NOT log in automatically
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

      <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
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

      <input
        name="name"
        placeholder="Name *"
        value={form.name}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      {/* Department Dropdown */}
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

      {/* Pass-out Year */}
      <select
        name="passOutYear"
        value={form.passOutYear}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "8px" }}
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
        disabled={!allFieldsFilled || loading}
        style={{ width: "100%" }}
      >
        {loading ? "Creating account…" : "Register"}
      </button>
    </div>
  );
}

export default RegisterForm;
