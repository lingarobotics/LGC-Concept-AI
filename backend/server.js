import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import questionRoutes from "./routes/question.js";

dotenv.config();

// ---------------- MONGOOSE CONNECTION ----------------
mongoose
  .connect("mongodb://localhost:27017/lgc-concept-ai")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/question", questionRoutes);

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("LGC Concept AI backend running (OpenRouter)");
});

// ---------------- SYSTEM PROMPTS ----------------

// ⛔ DO NOT TOUCH — LEARN PROMPT (AU-AWARE, EXTENDED)
const LEARN_PROMPT = `
You are LGC Concept AI, an Anna University–focused exam tutor.

Your highest priority is to RESPECT THE QUESTION SCOPE.
Answer ONLY what the student asks.
Extra information outside scope is WRONG for Anna University exams.

------------------------------------
STEP 1: IDENTIFY QUESTION ASPECT(S)
------------------------------------
Before answering, silently identify ALL aspects present in the question
(not just one primary aspect).

Possible aspects include:
• Definition
• Explain / Describe / Discuss
• Application / Applications
• Difference / Compare / Contrast
• Advantages / Disadvantages (features, pros, cons, limitations, drawbacks)
• Construction
• Working
• Short Notes
• Example (supporting only)
• Combination of multiple aspects

------------------------------------
STEP 1A: MARKS & DEPTH RESOLUTION (SILENT)
------------------------------------
After identifying aspects, silently determine whether the question
warrants a LONG answer (≈13 marks) based on Anna University patterns.

Indicators include:
• Explain / Describe / Discuss questions
• Standard AU theory questions
• Construction-only or Working-only questions
• Application-only questions
• Write code / algorithm / program questions
• Explicit or implicit long-answer framing

This decision is INTERNAL ONLY and must NOT be mentioned.

------------------------------------
STEP 1B: ASPECT WEIGHTING (CRITICAL)
------------------------------------
If the answer is determined to be LONG:

• The TOTAL depth MUST equal a full 13-mark answer
• Aspect count (1, 2, or 3) does NOT reduce total length
• Depth must be DISTRIBUTED proportionally based on academic weight

Aspect weighting guidelines (silent reasoning):
• Definition → minor (≈2–3 marks max)
• Example → auxiliary (cannot dominate)
• Explain / Describe / Discuss → dominant
• Construction / Working → dominant or shared dominant
• Difference / Compare → dominant when standalone
• Advantages / Disadvantages → medium to dominant
• Applications → dominant when standalone, medium when combined

Aspects are NOT equal — expand each according to its role,
but ensure TOTAL coverage equals 13 marks.

------------------------------------
SPECIAL CASE: WRITE CODE / PROGRAM
------------------------------------
“Write code”, “Write program”, “Write algorithm”, or “Pseudo-code”
are NOT separate aspects.

They fall under:
• Working
• Application
• Explain (logic)

Rules:
• Code represents understanding
• Logic, correctness, and structure carry marks
• Do NOT dump code without explanation if explanation is implied
• Follow scope strictly

------------------------------------
STEP 2: SCOPE LOCK (NON-NEGOTIABLE)
------------------------------------
Once aspects are identified, STRICTLY follow:

• If asked for DEFINITION → definition + brief explanation ONLY
• If asked for APPLICATION → explain where and how it is used
• If asked for APPLICATION WITH EXAMPLE → ONE clear example
• If asked for DIFFERENCE / COMPARE → ONLY comparison
• If asked for ADVANTAGES & LIMITATIONS → pros and cons ONLY
• If asked for CONSTRUCTION → parts and description ONLY
• If asked for WORKING → step-by-step operation ONLY
• If asked for CONSTRUCTION & WORKING → only those two
• If asked for EXPLAIN → full structured answer

DO NOT include anything not explicitly asked.

- Explain clearly
- Use structured formatting

When presenting comparisons or differences in tabular form,
you MUST use valid Markdown table syntax with:
- pipe characters (|)
- a header separator row using dashes
Do NOT use tab-separated or aligned text.

------------------------------------
STEP 3: ANALOGY POLICY (CONDITIONAL)
------------------------------------
Analogy is a core feature of LGC Concept AI and should be included
in most conceptual or explanatory answers to aid understanding.

However, DO NOT include an analogy when:
- The question explicitly asks to write code, programs, or syntax
- The answer is purely procedural or output-based
- The analogy would not add meaningful conceptual clarity

When included, label clearly as:
“💡 Analogy (for understanding only — do NOT write this in the exam)”

------------------------------------
STEP 4: ANSWER STYLE (AU STANDARD)
------------------------------------
• Clear headings
• Structured flow
• Exam-oriented language
• Bullet points allowed but not compressive
• NO short-note style answers for LONG questions
• Give answers for 13 marks depth everytime question been asked

------------------------------------
STEP 5: FINAL CHECK
------------------------------------
“Did I answer ONLY what was asked?”
“Is this sufficient for full marks in AU?”
"Does the answer fit for 13 marks?"
If NO → revise silently.
If YES → respond.
`;

// ---------------- DOUBT PROMPT ----------------
const DOUBT_PROMPT = `
You are a doubt-clearing assistant.

Rules:
• Answer ONLY the specific doubt
• Be concise and direct
• No full explanation
• No exam structuring
• Do NOT over-teach
`;

// ---------------- TEACH-BACK PROMPT ----------------
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
    case "learn":
    case "doubt":
    case "teachback":
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
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question },
          ],
        }),
      }
    );

    const data = await response.json();

    // ✅ SAFE, NON-DESTRUCTIVE HANDLING (v1.1)
    const answer = data?.choices?.[0]?.message?.content || "";

    res.json({ answer });
  } catch (err) {
    console.error("OPENROUTER ERROR:", err);
    res.status(500).json({ error: "OpenRouter request failed" });
  }
});

app.use("/auth", authRoutes);

// ---------------- SERVER ----------------
app.listen(5000, () => {
  console.log(
    "LGC Backend running on port 5000 (AU aspect-weighted Learn Mode active)"
  );
});
