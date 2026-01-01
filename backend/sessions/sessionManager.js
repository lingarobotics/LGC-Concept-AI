import crypto from "crypto";
import {
  createSession,
  getSession,
  hasSession
} from "./sessionStore.js";

function generateSessionId() {
  return crypto.randomUUID();
}

/**
 * Archives the current concept before replacing it.
 * This preserves C1, C2, ... history safely.
 */
export function archiveConceptIfExists(session) {
  if (session.conceptState) {
    session.conceptHistory.push({
      ...session.conceptState,
      archivedAt: Date.now()
    });
  }
}

export function getOrCreateSession(sessionIdFromClient) {
  // Reuse existing session if valid
  if (sessionIdFromClient && hasSession(sessionIdFromClient)) {
    return {
      sessionId: sessionIdFromClient,
      session: getSession(sessionIdFromClient),
      isNew: false
    };
  }

  // Create new session
  const newSessionId = generateSessionId();

  const newSession = {
    sessionId: newSessionId,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),

    // Analytics counters
    learnCount: 0,
    doubtCount: 0,
    teachBackCount: 0,

    // Active learning context (C1, C2, ...)
    conceptState: null,

    // Archived previous learning contexts
    conceptHistory: [],

    // Short-term conversational memory for Doubt Mode
    doubtContext: {
      lastEntity: null,
      lastComponent: null
    },

    // Placeholder for future session summary / email feature
    interactions: []
  };

  createSession(newSessionId, newSession);

  return {
    sessionId: newSessionId,
    session: newSession,
    isNew: true
  };
}
