/**
 * contextBinder.js
 *
 * Responsibility:
 *  - Bind ambiguous user questions to a learned concept identity
 *  - Ensure LLM never decides the domain or subject
 *  - Remain domain-agnostic (CSE / EEE / MECH / Coding / Theory)
 *
 * Used ONLY for:
 *  - Doubt Mode
 *  - Teach-Back Mode
 *
 * Learn Mode must NEVER pass through this binder.
 */

/**
 * Validates whether conceptState is usable for binding
 */
function validateConceptState(conceptState) {
  if (!conceptState) {
    throw new Error("ConceptState is missing for contextual binding");
  }

  if (!conceptState.topic || typeof conceptState.topic !== "string") {
    throw new Error("ConceptState.topic is missing or invalid");
  }

  // entity, subject, scope are optional but strongly recommended
}

/**
 * Builds a stable, human-readable concept anchor
 * This anchor is what constrains the LLM
 */
function buildConceptAnchor(conceptState) {
  const parts = [];

  // Academic subject (strongest disambiguator)
  if (conceptState.subject) {
    parts.push(`Subject: ${conceptState.subject}`);
  }

  // Core entity (strongest conceptual anchor)
  if (conceptState.entity) {
    parts.push(`Entity: ${conceptState.entity}`);
  }

  // Scope lock (what aspects are in play)
  if (Array.isArray(conceptState.scope) && conceptState.scope.length > 0) {
    parts.push(`Scope: ${conceptState.scope.join(", ")}`);
  }

  // Fallback topic (from detectTopic)
  parts.push(`Topic Reference: ${conceptState.topic}`);

  // Keywords (used for ambiguity resolution, not explanation)
  if (
    Array.isArray(conceptState.keywords) &&
    conceptState.keywords.length > 0
  ) {
    parts.push(`Key Terms: ${conceptState.keywords.join(", ")}`);
  }

  return parts.join("\n");
}

/**
 * Core binder for Doubt Mode
 *
 * Input:
 *  - question: raw doubt question from frontend
 *  - conceptState: session.conceptState (C1 / C2 ...)
 *
 * Output:
 *  - fully bound question string to send to LLM
 */
export function bindDoubtQuestion({ question, conceptState }) {
  validateConceptState(conceptState);

  if (!question || typeof question !== "string") {
    throw new Error("Invalid doubt question");
  }

  const conceptAnchor = buildConceptAnchor(conceptState);

  return `
The following doubt MUST be answered strictly within the learned concept.

${conceptAnchor}

Rules:
- Do NOT change the subject
- Do NOT generalize
- Do NOT shift context

Doubt Question:
${question}
`.trim();
}

/**
 * Core binder for Teach-Back Mode
 *
 * Input:
 *  - explanation: student's explanation text
 *  - conceptState: session.conceptState (C1 / C2 ...)
 *
 * Output:
 *  - fully bound evaluation instruction to send to LLM
 */
export function bindTeachBackEvaluation({ explanation, conceptState }) {
  validateConceptState(conceptState);

  if (!explanation || typeof explanation !== "string") {
    throw new Error("Invalid teach-back explanation");
  }

  const conceptAnchor = buildConceptAnchor(conceptState);

  return `
The student is explaining the learned concept below.

${conceptAnchor}

Evaluate STRICTLY within this concept.

Check for:
- Conceptual correctness
- Missing key points
- Incorrect assumptions
- Exam-suitable clarity

Rules:
- Do NOT introduce new concepts
- Do NOT evaluate outside this concept
- Do NOT re-teach fully

Student Explanation:
${explanation}
`.trim();
}

/**
 * Helper for debugging / logging
 * Exposes the current locked concept identity
 */
export function getBoundConceptIdentity(conceptState) {
  validateConceptState(conceptState);

  return {
    subject: conceptState.subject || null,
    topic: conceptState.topic,
    entity: conceptState.entity || null,
    scope: conceptState.scope || [],
    keywords: conceptState.keywords || [],
    updatedAt: conceptState.updatedAt || null
  };
}
