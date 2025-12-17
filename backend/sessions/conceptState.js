export function createConceptState({
  topic,
  aspectsCovered,
  markLevel,
  coreExplanation,
  keyPoints,
  scopeConstraints,
  examples = [],
  comparisons = {}
}) {
  return {
    topic,
    aspectsCovered,
    markLevel,
    coreExplanation,
    keyPoints,
    scopeConstraints,
    examples,
    comparisons,
    createdAt: Date.now()
  };
}
