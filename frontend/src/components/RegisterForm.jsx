import { useState } from "react";

function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    department: "",
    customDepartment: "",
    passOutYear: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isOtherDepartment = form.department === "Other";

  const allFieldsFilled =
    form.email &&
    form.password &&
    form.name &&
    form.department &&
    form.passOutYear &&
    (!isOtherDepartment || form.customDepartment);

  const handleSubmit = async () => {
    if (!allFieldsFilled) {
      setError("Please fill all required fields");
      return;
    }

    setError("");
    setLoading(true);

    const payload = {
      email: form.email,
      password: form.password,
      name: form.name,
      department: isOtherDepartment
        ? form.customDepartment.trim()
        : form.department,
      passOutYear: form.passOutYear
    };

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Registration = authentication
      onSuccess(form.email);
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

      {/* Custom Department (only if Other) */}
      {isOtherDepartment && (
        <input
          name="customDepartment"
          placeholder="Enter your department *"
          value={form.customDepartment}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "8px" }}
        />
      )}

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
