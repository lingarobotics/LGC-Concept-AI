export function getModelByMode(mode) {
  switch (mode) {
    case "learn":
    case "doubt":
    case "teachback":
    case "fast-learn":
    case "learn-core":
    default:
      return "nvidia/nemotron-3-nano-30b-a3b:free";
  }
}
