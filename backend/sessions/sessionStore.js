// backend/sessions/sessionStore.js

export const sessions = new Map();

export function createSession(sessionId, sessionData) {
  sessions.set(sessionId, sessionData);
}

export function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

export function updateSession(sessionId, sessionData) {
  sessions.set(sessionId, sessionData);
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

export function hasSession(sessionId) {
  return sessions.has(sessionId);
}
