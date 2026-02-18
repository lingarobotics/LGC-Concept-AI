import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const aspects = [
  {
    title: "Learning is not just study → write → forget.",
    text: "Real learning is layered. It evolves with time, pressure, reflection, and articulation."
  },
  {
    title: "When you have time — learn slow and steady.",
    text: "Build structured foundations. Connect ideas deeply. Strength creates long-term confidence."
  },
  {
    title: "When exams are near — learn under pressure.",
    text: "Prioritize what matters. Extract clarity quickly. Focus on what moves marks."
  },
  {
    title: "Clearing a doubt is another form of learning.",
    text: "Fixing one conceptual crack can prevent multiple exam mistakes."
  },
  {
    title: "Explaining what you learned is the ultimate way of learning.",
    text: "If you can teach it clearly in your own words, you truly understand it."
  }
];

const ExploreModes = () => {
  const navigate = useNavigate();
  const refs = useRef([]);
  const [showModes, setShowModes] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateX(0)";
          }
        });
      },
      { threshold: 0.25 }
    );

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main style={{ maxWidth: "820px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>
        Learning has aspects.
      </h1>

      {aspects.map((aspect, index) => (
        <section
          key={index}
          ref={(el) => (refs.current[index] = el)}
          style={{
            marginBottom: "3rem",
            opacity: 0,
            transform:
              index % 2 === 0
                ? "translateX(-60px)"
                : "translateX(60px)",
            transition: `all 0.7s ease-out ${index * 0.15}s`
          }}
        >
          <h3 style={{ marginBottom: "0.6rem" }}>
            {aspect.title}
          </h3>
          <p style={{ lineHeight: "1.7", color: "#cfcfcf" }}>
            {aspect.text}
          </p>
        </section>
      ))}

      {/* Transition to Modes */}
      <section
        style={{
          marginTop: "4rem",
          paddingTop: "2rem",
          borderTop: "1px solid #333"
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>
          Choose how you want to learn today.
        </h2>

        {!showModes && (
          <button
            onClick={() => setShowModes(true)}
            style={revealButtonStyle}
          >
            Show Learning Modes
          </button>
        )}

        {showModes && (
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            <button
              onClick={() => navigate("/learn")}
              style={ctaStyle}
            >
              Want to learn with clarity and structure? Start with Learn Mode.
            </button>

            <button
              onClick={() => navigate("/fast-learn")}
              style={ctaStyle}
            >
              Is time clicking? Fast Learn Mode gives you focused clarity under time pressure.
            </button>

            <button
              onClick={() => navigate("/doubt")}
              style={ctaStyle}
            >
              Want to clear a specific doubt? Doubt Mode helps you fix it with precision.
            </button>

            <button
              onClick={() => navigate("/teach-back")}
              style={{...ctaStyle, fontWeight: "600"}}
            >
              Wanna test if you really understood? Teach-Back Mode lets you explain and verify your understanding.
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

const revealButtonStyle = {
  padding: "0.8rem 1rem",
  borderRadius: "6px",
  border: "1px solid #4f8cff",
  background: "transparent",
  color: "#4f8cff",
  cursor: "pointer",
  fontSize: "0.95rem"
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

const ctaStyleHighlight = {
  ...ctaStyle,
  background: "#4f8cff",
  color: "white",
  fontWeight: "600"
};

export default ExploreModes;
