import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DoubtMode() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, userEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const askAI = async () => {
    if (!input.trim()) return;

    /* -------- AUTH REQUIRED (STRICT) -------- */
    if (!isAuthenticated) {
      navigate("/auth", {
        state: { from: location.pathname }
      });
      return;
    }
    /* --------------------------------------- */

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
      {/* V2 Detailed Explanation */}
      <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "12px" }}>
        <b>Doubt Mode (Version 2.0)</b>
        <br />
        <br />
        This mode is designed to answer <b>one clear and explicit doubt</b> at a time.
        Each question is processed independently and does not rely on previous
        messages for context.
        <br />
        <br />
        To get accurate answers, always mention <b>what you are asking about</b>
        and <b>what exactly you want to know</b> in the same question.
        <br />
        <br />
        Conversation memory and multi-turn context understanding are
        actively being designed and will be introduced in a future version.
      </div>

      {/* Messages */}
      <div style={{ maxHeight: "60vh", overflowY: "auto", marginBottom: "10px" }}>
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
    </>
  );
}

export default DoubtMode;
