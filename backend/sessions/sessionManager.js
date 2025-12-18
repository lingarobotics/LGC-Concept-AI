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
