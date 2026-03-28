import crypto from "crypto";
import { getPromptByMode } from "../config/prompts.js";
import { getModelByMode } from "../config/modelSelector.js";

const REQUEST_TIMEOUT_MS = 15000;
const MAX_RETRIES_429 = 2;

/* ---------------- CONTEXT BUILDER (MODE-AWARE, STRONG + SAFE) ---------------- */

function buildContextBlock(mode, context) {
  const safeContext = context?.trim() || "General";

  switch (mode) {

    case "learn":
      return `
DOMAIN CONSTRAINT (LEARN MODE):
- Domain: ${safeContext}

FILTER:
- Keep ALL reasoning intact
- Restrict ONLY examples, applications, and real-world interpretation to ${safeContext}
- If concept spans multiple domains → SELECT ONLY ${safeContext}

PRESERVE:
- Scope identification
- Aspect-based explanation
- Structured explanation
- Analogy usage (if helpful)

INTERPRETATION:
- Interpret the question from ${safeContext} perspective BEFORE answering

FAIL:
- Any cross-domain reference must be excluded
`;

    case "doubt":
      return `
DOMAIN CONSTRAINT (DOUBT MODE):
- Domain: ${safeContext}

FILTER:
- Restrict answer ONLY within ${safeContext}
- Answer ONLY the specific doubt

PRESERVE:
- Logical clarity
- Micro-scope identification

DO NOT:
- Expand to full topic
- Add unrelated domain explanations
`;

    case "fast-learn":
      return `
DOMAIN CONSTRAINT (FAST LEARN):
- Domain: ${safeContext}

FILTER:
- Extract ONLY key idea within ${safeContext}

PRESERVE:
- Core concept clarity

DO NOT:
- Add extra domains
- Expand unnecessarily
`;

    case "teachback":
      return `
DOMAIN CONSTRAINT (TEACHBACK):
- Domain: ${safeContext}

FILTER:
- Evaluate ONLY within ${safeContext}

PRESERVE:
- Scope validation
- Concept correctness check

DO NOT:
- Introduce new domains
`;

    case "learn-core":
      return `
DOMAIN CONSTRAINT (CORE EXTRACTION):
- Domain: ${safeContext}

FILTER:
- Extract ONLY ${safeContext} relevant points

PRESERVE:
- Core concept grouping
`;

    default:
      return "";
  }
}

/* ---------------- MAIN FUNCTION ---------------- */

export async function askAI({
  question,
  explanation,
  mode,
  context = "General"
}) {
  const requestId = crypto.randomUUID();

  const rawInput =
    mode === "learn-core" ? explanation : question;

  if (!rawInput || !rawInput.trim()) {
    throw new Error("Input is required");
  }

  const safeContext = context?.trim() || "General";
  const isStrict = safeContext.toLowerCase() !== "general";

  // ✅ NEVER TOUCH USER INPUT
  const userInput = rawInput;

  console.log(
    `[AI][${requestId}] Mode: ${mode} | Context: ${context}`
  );

  const basePrompt = getPromptByMode(mode);

  let systemPrompt = `
${basePrompt}
`;

  // ✅ MODE-SPECIFIC DOMAIN CONSTRAINT
  if (isStrict) {
    systemPrompt += `
${buildContextBlock(mode, context)}

FINAL OVERRIDE (LAST PRIORITY):
- Domain is strictly: ${safeContext}
- DO NOT override reasoning rules
- DO NOT alter structure or thinking
- ONLY ensure all content belongs to ${safeContext}

ENFORCEMENT:
- If any part of answer is outside ${safeContext}, REMOVE it
`;
  }

  const selectedModels = normalizeModels(
    getModelByMode(mode)
  );

  for (const modelConfig of selectedModels) {
    for (let attempt = 0; attempt <= MAX_RETRIES_429; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS
      );

      const startTime = Date.now();

      try {
        console.log(
          `[AI][${requestId}] Trying ${modelConfig.name} | Provider: ${modelConfig.provider} | Attempt ${attempt + 1}`
        );

        let response;

        if (modelConfig.provider === "openrouter") {
          response = await callOpenRouter(
            modelConfig,
            systemPrompt,
            userInput,
            controller.signal
          );
        } else if (modelConfig.provider === "gemini") {
          response = await callGemini(
            modelConfig,
            systemPrompt,
            userInput,
            controller.signal
          );
        } else {
          throw new Error("Unknown provider");
        }

        clearTimeout(timeout);

        const latency = Date.now() - startTime;

        if (response.status === 429) {
          console.warn(
            `[AI][${requestId}] 429 | ${modelConfig.name} | Attempt ${attempt + 1}`
          );

          if (attempt < MAX_RETRIES_429) {
            await backoff(attempt);
            continue;
          }

          break;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Model ${modelConfig.name} failed: ${response.status} - ${errorText}`
          );
        }

        const parsed = await parseResponse(
          response,
          modelConfig.provider
        );

        console.log(
          `[AI][${requestId}] Success | ${modelConfig.name} | ${latency}ms`
        );

        return {
          answer: parsed,
          modelUsed: modelConfig.name
        };
      } catch (error) {
        clearTimeout(timeout);

        if (error.name === "AbortError") {
          console.warn(
            `[AI][${requestId}] Timeout | ${modelConfig.name}`
          );
        } else {
          console.error(
            `[AI][${requestId}] Error | ${modelConfig.name} | ${error.message}`
          );
        }
      }
    }
  }

  console.error(`[AI][${requestId}] All models failed`);

  throw new Error(
    "AI service temporarily unavailable. Please try again later."
  );
}

/* ---------------- PROVIDERS ---------------- */

async function callOpenRouter(
  modelConfig,
  systemPrompt,
  userInput,
  signal
) {
  return fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: modelConfig.apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: modelConfig.model,
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ]
    }),
    signal
  });
}

async function callGemini(
  modelConfig,
  systemPrompt,
  userInput,
  signal
) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1/models/${modelConfig.model}:generateContent?key=${modelConfig.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `${systemPrompt}\n\n${userInput}` }
            ]
          }
        ]
      }),
      signal
    }
  );
}

async function parseResponse(response, provider) {
  const data = await response.json();

  if (provider === "openrouter") {
    return data?.choices?.[0]?.message?.content || "";
  }

  if (provider === "gemini") {
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      ""
    );
  }

  return "";
}

/* ---------------- UTILITIES ---------------- */

function normalizeModels(modelSelectorOutput) {
  if (Array.isArray(modelSelectorOutput)) return modelSelectorOutput;

  if (typeof modelSelectorOutput === "string") {
    return [
      {
        name: "legacy-single-model",
        model: modelSelectorOutput,
        apiKey: `Bearer ${process.env.OPENROUTER_API_KEY_1}`,
        provider: "openrouter"
      }
    ];
  }

  throw new Error("Invalid model configuration");
}

function backoff(attempt) {
  const delay = 1000 * (attempt + 1);
  return new Promise((resolve) => setTimeout(resolve, delay));
}