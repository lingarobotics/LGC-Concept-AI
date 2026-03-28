import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useContextState } from "../context/ContextProvider";
import ModeSwitchCTA from "../components/ModeSwitchCTA";
import SubjectInput from "../components/SubjectInput";

function DoubtMode() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, userEmail } = useAuth();
  const { context } = useContextState();

  const navigate = useNavigate();
  const location = useLocation();

  const askAI = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    /* Strict Auth Required */
    if (!isAuthenticated) {
      navigate("/auth", {
        state: { from: location.pathname }
      });
      return;
    }

    const userMsg = { role: "user", text: trimmedInput };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmedInput,
          mode: "doubt",
          context // ✅ NOW CORRECTLY SENT
        })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer }
      ]);

      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/question/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            question: trimmedInput,
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
      {/* Mode Description */}
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

      {/* ✅ SUBJECT INPUT (CORRECT POSITION) */}
      <SubjectInput />

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

      {/* Switch */}
      <ModeSwitchCTA currentMode="doubt" />
    </>
  );
}

export default DoubtMode;