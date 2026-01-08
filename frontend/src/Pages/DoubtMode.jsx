import { useState } from "react";
import AuthGate from "../components/AuthGate";
import { useAuth } from "../context/AuthContext";

function DoubtMode() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);

  /* -------- GLOBAL AUTH (v1.1) -------- */
  const { isAuthenticated, userEmail, login } = useAuth();
  /* ----------------------------------- */

  const askAI = async () => {
    if (!input.trim()) return;

    if (!isAuthenticated) {
      setShowAuthGate(true);
      return;
    }

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentQuestion = input;
    setInput("");
    setLoading(true);

    try {
      /* -------- AI CALL (Railway) -------- */
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

      /* -------- LOG QUESTION (Local Backend) -------- */
      try {
        const logRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/question/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            question: currentQuestion,
            mode: "doubt"
          })
        });

        const logData = await logRes.json();
        console.log("Doubt logged:", logData);
      } catch (err) {
        console.error("Doubt logging failed:", err);
      }
      /* --------------------------------------------- */
    } catch (err) {
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
      {/* V1.1 Detailed Explanation */}
      <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "12px" }}>
        <b>Doubt Mode (Version 1.2)</b>
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

      {/* Auth Info */}
      {!isAuthenticated && (
        <div
          style={{
            fontSize: "0.8rem",
            color: "#bbb",
            marginBottom: "12px",
            textAlign: "center"
          }}
        >
          Please{" "}
          <button
            style={{ fontSize: "0.8rem" }}
            onClick={() => setShowAuthGate(true)}
          >
            Login
          </button>{" "}
          to save your doubts.
        </div>
      )}

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

      {/* Auth Gate */}
      {showAuthGate && (
        <AuthGate
          onSuccess={(email) => {
            login(email);
            setShowAuthGate(false);
          }}
          onClose={() => setShowAuthGate(false)}
        />
      )}
    </>
  );
}

export default DoubtMode;
