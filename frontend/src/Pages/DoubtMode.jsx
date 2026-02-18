import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ModeSwitchCTA from "../components/ModeSwitchCTA";

function DoubtMode() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, userEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const askAI = async () => {
    if (!input.trim()) return;

    /* Strict Auth Required */
    if (!isAuthenticated) {
      navigate("/auth", {
        state: { from: location.pathname }
      });
      return;
    }

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentQuestion = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          mode: "doubt"
        })
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);

      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/question/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            question: currentQuestion,
            mode: "doubt"
          })
        });
      } catch {}
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Unable to clear doubt at the moment. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mode Description - Cleaned */}
      <div
        style={{
          fontSize: "0.9rem",
          color: "#bbb",
          marginBottom: "16px",
          lineHeight: "1.6"
        }}
      >
        <b>Doubt Mode</b> is for clearing one specific confusion at a time.
        <br />
        Ask clearly and mention the exact concept you’re referring to.
      </div>

      {/* Messages */}
      <div
        style={{
          maxHeight: "60vh",
          overflowY: "auto",
          marginBottom: "10px"
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <b>{m.role === "user" ? "You:" : "AI:"}</b> {m.text}
          </div>
        ))}

        {loading && (
          <div style={{ marginBottom: "8px" }}>
            <b>AI:</b> Thinking…
          </div>
        )}
      </div>

      {/* Input */}
      <textarea
        rows="2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Example: How many rectifier diodes are used in an alternator?"
        style={{ width: "100%", marginBottom: "8px" }}
      />

      <button onClick={askAI} disabled={loading || !input.trim()}>
        {loading ? "Clearing…" : "Clear Doubt"}
      </button>

      {/* Switch Section */}
      <ModeSwitchCTA currentMode="doubt" />
    </>
  );
}

export default DoubtMode;
