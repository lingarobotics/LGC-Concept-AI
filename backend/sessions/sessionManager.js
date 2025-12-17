import crypto from "crypto";
import {
  createSession,
  getSession,
  hasSession
} from "./sessionStore.js";

function generateSessionId() {
  return crypto.randomUUID();
}

export function getOrCreateSession(sessionIdFromClient) {
  // If client sent a valid sessionId and we have it → reuse
  if (sessionIdFromClient && hasSession(sessionIdFromClient)) {
    return {
      sessionId: sessionIdFromClient,
      session: getSession(sessionIdFromClient),
      isNew: false
    };
  }

  // Otherwise create a new session
  const newSessionId = generateSessionId();

  const newSession = {
    sessionId: newSessionId,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),

    // Analytics counters (future use)
    learnCount: 0,
    doubtCount: 0,
    teachBackCount: 0,

    // Placeholder for ConceptState (added later)
    conceptState: null,

    // Placeholder for Q&A history (email feature later)
    interactions: []
  };

  createSession(newSessionId, newSession);

  return {
    sessionId: newSessionId,
    session: newSession,
    isNew: true
  };
}
