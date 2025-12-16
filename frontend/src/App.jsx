import { useState } from "react";
import LearnMode from "./Pages/LearnMode";
import DoubtMode from "./Pages/DoubtMode";
import TeachBackMode from "./Pages/TeachBackMode";

function App() {
  const [mode, setMode] = useState("learn");

  return (
    <div style={{ minHeight: "100vh", background: "#1f1f1f", padding: "16px" }}>
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          fontFamily: "Arial, sans-serif",
          color: "#eaeaea"
        }}
      >
        <h2 style={{ color: "#ffffff", marginBottom: "6px" }}>
          LGC Concept AI
        </h2>

        <p style={{ color: "#b5b5b5", marginBottom: "16px" }}>
          Exam-focused learning • Doubt clearing • Teach-back verification
        </p>

        {/* MODE SWITCH */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button onClick={() => setMode("learn")}>Learn</button>
          <button onClick={() => setMode("doubt")}>Doubt</button>
          <button onClick={() => setMode("teachback")}>Teach-Back</button>
        </div>

        {/* MODE SCREENS */}
        {mode === "learn" && <LearnMode />}
        {mode === "doubt" && <DoubtMode />}
        {mode === "teachback" && <TeachBackMode />}
      </div>
    </div>
  );
}

export default App;
