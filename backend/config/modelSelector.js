export function getModelByMode(mode) {
  const openRouterKeyPrimary = process.env.OPENROUTER_API_KEY_1;
  const openRouterKeySecondary = process.env.OPENROUTER_API_KEY_2;
  const geminiKey = process.env.GEMINI_API_KEY;

  const unifiedStack = [
    {
      name: "llama-70b-primary",
      model: "meta-llama/llama-3.3-70b-instruct:free",
      apiKey: `Bearer ${openRouterKeyPrimary}`,
      provider: "openrouter",
    },
    {
      name: "nemotron-30b-secondary",
      model: "nvidia/nemotron-3-nano-30b-a3b:free",
      apiKey: `Bearer ${openRouterKeySecondary}`,
      provider: "openrouter",
    },
    {
      name: "gemma-27b",
      model: "google/gemma-3-27b-it:free",
      apiKey: `Bearer ${openRouterKeySecondary}`,
      provider: "openrouter",
    },
    {
      name: "gemini-2.5-flash",
      model: "gemini-2.5-flash",
      apiKey: geminiKey,
      provider: "gemini",
    },
  ];

  switch (mode) {
    case "learn":
    case "learn-core":
    case "fast-learn":
    case "doubt":
    case "teachback":
    default:
      return unifiedStack;
  }
}