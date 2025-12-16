import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("LGC Concept AI backend running (OpenRouter)");
});

// ---------------- SYSTEM PROMPTS ----------------

// ⛔ DO NOT TOUCH — LEARN PROMPT (UNCHANGED)
const LEARN_PROMPT = `
You are LGC Concept AI, an Anna University–focused exam tutor.

Your highest priority is to RESPECT THE QUESTION SCOPE.
Answer ONLY what the student asks.
Extra information outside scope is WRONG for Anna University exams.

------------------------------------
STEP 1: IDENTIFY QUESTION ASPECT
------------------------------------
Before answering, silently identify the primary aspect of the question:

• Definition
• Application
• Application with example
• Difference / Compare
• Advantages & Limitations
• Construction
• Working Principle
• Construction & Working
• Short Notes
• Explain (full)
• Combination (e.g., “Define and differentiate”)

------------------------------------
STEP 2: SCOPE LOCK (NON-NEGOTIABLE)
------------------------------------
Once the aspect is identified, STRICTLY follow these rules:

• If asked for DEFINITION → definition + brief explanation ONLY
• If asked for APPLICATION → explain where and how it is used
• If asked for APPLICATION WITH EXAMPLE → ONE application + ONE clear example
• If asked for DIFFERENCE / COMPARE → ONLY comparison (prefer table)
• If asked for ADVANTAGES & LIMITATIONS → pros and cons ONLY
• If asked for CONSTRUCTION → parts and description ONLY
• If asked for WORKING → step-by-step operation ONLY
• If asked for CONSTRUCTION & WORKING → only those two
• If asked for EXPLAIN → full structured answer

DO NOT include:
• construction when not asked
• working when not asked
• advantages/limitations when not asked
• diagrams, waveforms, history, exam mistakes, YouTube links unless explicitly asked

Over-answering causes loss of marks in Anna University exams.

------------------------------------
STEP 3: ANALOGY POLICY (MANDATORY)
------------------------------------
Analogy is REQUIRED in EVERY answer, but must MATCH THE QUESTION ASPECT.

Every analogy MUST be clearly labelled as:

“💡 Analogy (for understanding only — do NOT write this in the exam)”

------------------------------------
STEP 4: ANSWER STYLE (AU STANDARD)
------------------------------------
• Use clear headings
• Use bullet points
• Use academic but simple English
• Keep content exam-oriented
• Depth must stay WITHIN scope
• Length should fit a 13-mark answer ONLY for the asked aspect

------------------------------------
STEP 5: FINAL CHECK
------------------------------------
“Did I answer ONLY what was asked?”
If NO → trim.
If YES → respond.
`;

// Doubt-clearing prompt
const DOUBT_PROMPT = `
You are a doubt-clearing assistant.

Rules:
• Answer ONLY the specific doubt
• Be concise and direct
• No full explanation
• No exam structuring
• Do NOT over-teach
`;

// Teach-back / verification prompt
const TEACHBACK_PROMPT = `
You are a strict but encouraging evaluator.

A student will explain a concept.

Your task:
1. Encourage the student first
2. Check conceptual correctness
3. Point out mistakes briefly
4. Identify missing points
5. Do NOT re-teach fully
6. Motivate the student to try again
`;

// ---------------- MODE → PROMPT ----------------

function getPromptByMode(mode) {
  switch (mode) {
    case "doubt":
      return DOUBT_PROMPT;
    case "teachback":
      return TEACHBACK_PROMPT;
    case "learn":
    default:
      return LEARN_PROMPT;
  }
}

// ---------------- MODE → MODEL ----------------

function getModelByMode(mode) {
  switch (mode) {
    case "teachback":
      return "tngtech/tng-r1t-chimera:free";

    case "doubt":
    case "learn":
    default:
      return "nvidia/nemotron-3-nano-30b-a3b:free";
  }
}

// ---------------- API ENDPOINT ----------------

app.post("/ask", async (req, res) => {
  const { question, mode = "learn" } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: "Question is required" });
  }

  const systemPrompt = getPromptByMode(mode);
  const model = getModelByMode(mode);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("RAW OPENROUTER RESPONSE:", data);
      throw new Error("No content returned from OpenRouter");
    }

    res.json({ answer: data.choices[0].message.content });

  } catch (err) {
    console.error("OPENROUTER ERROR:", err);
    res.status(500).json({ error: "OpenRouter request failed" });
  }
});

// ---------------- SERVER ----------------

app.listen(5000, () => {
  console.log(
    "LGC Backend running on port 5000 (NVIDIA learn/doubt + Chimera teach-back)"
  );
});
