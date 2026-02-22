import { useNavigate } from "react-router-dom";

const Why = () => {
  const navigate = useNavigate();

  return (
    <main
      style={{
        maxWidth: "820px",
        margin: "0 auto",
        paddingTop: "1rem"
      }}
    >
      {/* Primary heading */}
      <h1 style={{ marginBottom: "0.8rem" }}>
        Why LGC Concept AI Exists
      </h1>

      {/* SEO clarification line (short & honest) */}
      <p
        style={{
          lineHeight: "1.7",
          marginBottom: "1.5rem",
          color: "#cfcfcf"
        }}
      >
        LGC Concept AI is an exam-oriented AI learning assistant designed to
        improve how engineering students understand, recall, and articulate
        concepts under exam pressure.
      </p>

      <p style={{ lineHeight: "1.7", marginBottom: "1.2rem", color: "#cfcfcf" }}>
        Most AI tools provide answers.
        <br />
        This system is built to improve how you learn.
      </p>

      <p style={{ lineHeight: "1.7", marginBottom: "1.2rem", color: "#cfcfcf" }}>
        <strong>Learning is not a single action, but a chain of activities.</strong>
        <br />
        It is situational.
        <br />
        <br />
        Sometimes you need depth.
        <br />
        Sometimes speed.
        <br />
        Sometimes precision.
        <br />
        Sometimes verification — which strengthens understanding because articulation exposes gaps.
      </p>

      <p style={{ lineHeight: "1.7", color: "#cfcfcf" }}>
        LGC Concept AI separates learning into structured aspects —
        Learn, Fast Learn, Doubt, and Teach-Back —
        so that the method matches the situation.
      </p>

      {/* Bottom Navigation */}
      <div
        style={{
          marginTop: "3rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid #333",
          display: "flex",
          justifyContent: "flex-start"
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            color: "#4f8cff",
            cursor: "pointer",
            fontSize: "0.9rem",
            padding: 0
          }}
        >
          ← Back to Home
        </button>
      </div>
    </main>
  );
};

export default Why;