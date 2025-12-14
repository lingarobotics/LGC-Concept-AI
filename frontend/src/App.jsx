import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- Typing Placeholder ---------------- */

  const placeholderTexts = [
    "Explain the construction and working of a transformer",
    "Compare alternator with AC generator",
    "Explain application of ECG with example",
    "What are the advantages and limitations of CPU?",
    "Define and differentiate PN junction and Zener diode",
    "List the contrasts between half-wave and full-wave rectifier"
  ];

  const [placeholder, setPlaceholder] = useState("");
  const [pIndex, setPIndex] = useState(0);
  const [cIndex, setCIndex] = useState(0);

  useEffect(() => {
    if (question) return;

    const current = placeholderTexts[pIndex];

    if (cIndex < current.length) {
      const timer = setTimeout(() => {
        setPlaceholder((prev) => prev + current[cIndex]);
        setCIndex(cIndex + 1);
      }, 60);
      return () => clearTimeout(timer);
    } else {
      const pause = setTimeout(() => {
        setPlaceholder("");
        setCIndex(0);
        setPIndex((pIndex + 1) % placeholderTexts.length);
      }, 1200);
      return () => clearTimeout(pause);
    }
  }, [cIndex, pIndex, question]);

  /* ---------------- Ask AI (Backend) ---------------- */

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("Error: Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Teach-Back (ChatGPT ONLY) ---------------- */

  const explainToChatGPT = () => {
    const topic = question || "the explained concept";

    const prompt = `
Instruction for the assistant:
You are a patient teacher.

A student is going to explain the topic:
"${topic}"

Your task:
1. Encourage the student first
2. Check conceptual correctness
3. Identify missing points
4. Correct misunderstandings simply
5. Do NOT give a full lecture unless openly asked
6. Keep it friendly and supportive
7. Ask the user to keep trying

Student explanation starts now:
(explain here ---> Dude - explain your understanding of the topic in detail):
Make sure that you are explaining it in your own words, think it of, explaining to your friend

    `.trim();

    const encodedPrompt = encodeURIComponent(prompt);
    const chatGPTUrl = `https://chat.openai.com/?prompt=${encodedPrompt}`;

    window.open(chatGPTUrl, "_blank");
  };

  /* ---------------- UI ---------------- */

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

        <p style={{ color: "#b5b5b5", marginBottom: "20px" }}>
          Ask any Anna University question you struggle with — I’ll solve it using
          real-world analogies.
        </p>

        <textarea
          rows="4"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholder || "Ask an Anna University exam question"}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            resize: "none"
          }}
        />

        <button
          onClick={askAI}
          disabled={loading}
          style={{
            marginTop: "12px",
            padding: "10px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            width: "100%",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          {loading ? "Structuring your answer…" : "Ask"}
        </button>

        {answer && (
          <>
            <div
              style={{
                marginTop: "20px",
                background: "#f9f9f9",
                color: "#111",
                padding: "16px",
                borderRadius: "8px",
                lineHeight: "1.7"
              }}
            >
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>

            {/* Slow Mode Explanation */}
            <div
              style={{
                marginTop: "18px",
                padding: "14px",
                background: "#111827",
                borderRadius: "8px",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#d1d5db"
              }}
            >
              <b style={{ color: "#93c5fd" }}>Slow Mode</b>
              <br />
              If you are not in exam pressure, you are okay with time, and want to
              deeply understand the concept, use this feature.
              <br />
              Understanding matters more than speed,
              Explain what you learnt — think of ChatGPT as your friend - Have a try, dude!
            </div>

            {/* Teach-Back Button */}
            <button
              onClick={explainToChatGPT}
              style={{
                marginTop: "14px",
                padding: "10px",
                fontSize: "15px",
                borderRadius: "6px",
                border: "1px solid #2563eb",
                background: "transparent",
                color: "#2563eb",
                cursor: "pointer",
                width: "100%"
              }}
            >
              Explain this answer to ChatGPT (Slow Mode)
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
