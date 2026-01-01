/**
 * conceptState.js
 *
 * Represents the learned concept identity for a session.
 * This must be STABLE across Doubt / Teach-back modes.
 *
 * NOTE:
 * - This is NOT an answer store
 * - This is a concept anchor for context continuity
 */

export function createConceptState({
  // Core identity (MANDATORY)
  subject,              // e.g., "EEE - Electrical Machines", "CSE - DSA"
  topic,                // Original cleaned topic string
  entity = null,        // e.g., "Alternator", "Binary Search"
  scope = [],           // e.g., ["Construction", "Working"]

  // Academic metadata
  aspectsCovered = [],
  markLevel = 13,

  // Light reference only (NOT for reasoning)
  coreExplanation = "",
  keyPoints = [],
  scopeConstraints = [],

  // Optional enrichments
  keywords = [],        // e.g., ["frequency", "synchronous speed"]
  examples = [],
  comparisons = {}
}) {
  return {
    // Identity
    subject,
    topic,
    entity,
    scope,

    // Metadata
    aspectsCovered,
    markLevel,

    // Reference (do NOT treat as truth source)
    coreExplanation,
    keyPoints,
    scopeConstraints,

    // Anchors for question reconstruction
    keywords,

    // Extras
    examples,
    comparisons,

    // Timestamps
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
