import { getPromptByMode } from "../config/prompts.js";
import { getModelByMode } from "../config/modelSelector.js";

export async function askAI({ question, explanation, mode }) {
  const userInput =
    mode === "learn-core" ? explanation : question;

  if (!userInput || !userInput.trim()) {
    throw new Error("Input is required");
  }

  const systemPrompt = getPromptByMode(mode);
  const model = getModelByMode(mode);

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
          { role: "user", content: userInput },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter error: ${errorText}`);
  }

  const data = await response.json();

  return data?.choices?.[0]?.message?.content || "";
}
