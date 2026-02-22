import crypto from "crypto";
import { getPromptByMode } from "../config/prompts.js";
import { getModelByMode } from "../config/modelSelector.js";

const REQUEST_TIMEOUT_MS = 15000;
const MAX_RETRIES_429 = 2;

export async function askAI({ question, explanation, mode }) {
  const requestId = crypto.randomUUID();

  const userInput = mode === "learn-core" ? explanation : question;

  if (!userInput || !userInput.trim()) {
    throw new Error("Input is required");
  }

  console.log(`[AI][${requestId}] Mode: ${mode}`);

  const systemPrompt = getPromptByMode(mode);
  const selectedModels = normalizeModels(getModelByMode(mode));

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
          modelUsed: modelConfig.name,
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

/* ---------------- Provider Calls ---------------- */

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
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelConfig.model,
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput },
      ],
    }),
    signal,
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\n${userInput}`,
              },
            ],
          },
        ],
      }),
      signal,
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
      data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
    );
  }

  return "";
}

/* ---------------- Utilities ---------------- */

function normalizeModels(modelSelectorOutput) {
  if (Array.isArray(modelSelectorOutput)) {
    return modelSelectorOutput;
  }

  if (typeof modelSelectorOutput === "string") {
    return [
      {
        name: "legacy-single-model",
        model: modelSelectorOutput,
        apiKey: `Bearer ${process.env.OPENROUTER_API_KEY_1}`,
        provider: "openrouter",
      },
    ];
  }

  throw new Error("Invalid model configuration");
}

function backoff(attempt) {
  const delay = 1000 * (attempt + 1);
  return new Promise((resolve) => setTimeout(resolve, delay));
}