import { useState } from "react";

function DoubtMode() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ NEW: sessionId state
  const [sessionId, setSessionId] = useState(null);

  const askAI = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const res = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: input,
        mode: "doubt",
        sessionId // ✅ NEW: send sessionId if exists
      })
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "ai", text: data.answer }
    ]);

    // ✅ NEW: store sessionId returned by backend
    if (data.sessionId) {
      setSessionId(data.sessionId);
    }

    setLoading(false);
  };

  return (
    <>
      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <b>{m.role === "user" ? "You:" : "AI:"}</b> {m.text}
          </div>
        ))}
      </div>

      <textarea
        rows="2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your doubt…"
      />

      <button onClick={askAI} disabled={loading}>
        Clear Doubt
      </button>
    </>
  );
}

export default DoubtMode;
