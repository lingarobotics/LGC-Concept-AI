import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ModeSwitchCTA = ({ currentMode }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const modes = [
    {
      key: "learn",
      path: "/learn",
      label: "Learn Mode → Deep structured learning"
    },
    {
      key: "fast-learn",
      path: "/fast-learn",
      label: "Fast Learn → Focused revision under time pressure"
    },
    {
      key: "doubt",
      path: "/doubt",
      label: "Doubt Mode → Clear one precise confusion"
    },
    {
      key: "teach-back",
      path: "/teach-back",
      label: "Teach-Back Mode → Explain and verify your understanding"
    }
  ];

  const filteredModes = modes.filter(
    (mode) => mode.key !== currentMode
  );

  return (
    <section
      style={{
        marginTop: "3rem",
        borderTop: "1px solid #333",
        paddingTop: "1.2rem"
      }}
    >
      {/* Back + Switch Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={navButtonStyle}
        >
          ← Back to Home
        </button>

        <button
          onClick={() => setOpen(!open)}
          style={navButtonStyle}
        >
          Switch learning aspect →
        </button>
      </div>

      {/* Reveal Options */}
      {open && (
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          {filteredModes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => navigate(mode.path)}
              style={ctaStyle}
            >
              {mode.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

const navButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#4f8cff",
  cursor: "pointer",
  fontSize: "0.9rem",
  padding: 0
};

const ctaStyle = {
  padding: "0.85rem 1rem",
  borderRadius: "6px",
  border: "1px solid #4f8cff",
  background: "transparent",
  color: "#4f8cff",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "0.95rem"
};

export default ModeSwitchCTA;
