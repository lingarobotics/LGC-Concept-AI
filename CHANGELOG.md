# Changelog

All notable changes to **LGC Concept AI** are documented in this file.

This system follows **Semantic Versioning (MAJOR.MINOR.PATCH)**.

- MAJOR → Architectural shift or breaking change
- MINOR → Feature addition or structural enhancement (non-breaking)
- PATCH → Fixes, stability improvements, automation, or internal refactoring

---

# Major Version 2 — Mode-Based Learning Architecture

---

## v2.3.0 — Progressive Web App (PWA) Enablement
Date: 2026-03-13

### Added
- Progressive Web App (PWA) capability for LGC Concept AI
- Install prompt component enabling users to install the application
- Web App Manifest configuration for mobile and desktop installation
- Application icons and metadata for installable experience
- Offline-ready service worker integration

### Improved
- App accessibility across devices including mobile and desktop
- Faster load performance through service worker caching
- Native-like user experience when installed as a standalone app
- Consistent launch experience via installable application shell

### UX Enhancements
- Users can now install LGC Concept AI directly from the browser
- Application launches in standalone mode when installed
- Improved mobile usability for learning sessions

### Architecture
- No breaking API contract changes
- No backend logic changes
- Frontend infrastructure extended with PWA support

---
## v2.2.1 – Authentication UX & Password Reset Improvements

### ✨ Added
- Complete **Forgot Password / Reset Password** flow with secure token handling
- Password reset screen with:
  - Confirm password
  - Show / hide password toggle
  - Strength validation feedback
- Password strength validation during **user registration**

### 🔐 Improved
- Password handling consistency across registration and reset flows
- Visual feedback for weak, medium, and strong passwords
- Safer UX by blocking weak passwords at input level

### 🎯 UX Refinements
- Authentication-related pages remain focused without unnecessary distractions
- Reset password and register screens now feel consistent and intentional

### 🛡️ Security & Stability
- No auto-login introduced to preserve email verification model
- No breaking changes to existing users
- No new dependencies added

This release focuses on improving **account recovery, password safety, and authentication user experience** while keeping the system secure and predictable.

---

## v2.2.0 — Unified AI Fallback & Infrastructure Stability Upgrade
Date: 2026-02-22

### Added
- Unified multi-model fallback stack:
  - Llama 3.3 70B (primary)
  - Nemotron 30B (secondary)
  - Gemma 27B (tertiary)
  - Gemini 2.5 Flash (stable fallback)
- Provider abstraction layer (OpenRouter + Gemini)
- 429 retry handling with exponential backoff
- Per-request timeout using AbortController
- Structured request-level logging with unique requestId tracing
- Global launch transition system for controlled navigation
- Animated loading overlay with dot + progress feedback

### Improved
- Rate-limit resilience across all learning modes
- Graceful degradation when providers are overloaded
- Observability of model selection and failure paths
- Frontend transition smoothness when entering Learn mode
- System-level UX coherence

### Changed
- Replaced single-model dependency with unified fallback architecture
- Standardized model stack across all learning modes
- Improved API error handling (503 on total failure instead of generic 500)

### Architecture
- No breaking API contract changes
- No learning logic or prompt modifications
- Backend stability layer significantly strengthened
- Frontend transition logic elevated to App-level state management

---


## v2.1.0 — Refined Learning Flow Architecture
Date: 2026-02-18

### Added
- `/explore` page to frame learning as situational
- `/why` page to clarify system philosophy
- `ModeSwitchCTA` reusable bottom navigation component
- Structured entry flow via simplified Home page

### Changed
- Simplified learning mode descriptions
- Removed roadmap statements and version labeling from UI
- Standardized bottom navigation across modes
- Reduced cognitive and visual noise
- Improved frontend flow coherence

### Removed
- Redundant instructional text
- Top-level universal navigation clutter
- Showcase-oriented language

### Architecture
- No backend modifications
- No API contract changes
- No authentication changes
- Frontend structural refinement only

---

## v2.0.3 — Backend Modularization & Stability
Date: 2026-02-17

### Changed
- Separated server bootstrap into `server.js` and `app.js`
- Isolated MongoDB connection into configuration layer
- Extracted AI logic into `services/aiService.js`
- Modularized `/ask` route handling
- Updated CORS configuration to match Vite development server
- Cleaned dependency state after Vite optimization corruption
- Removed unnecessary SECURITY.md automation workflow

### Result
Improved separation of concerns, cleaner backend structure,
stable frontend-backend communication, and simplified release flow.

---

## v2.0.2 — CI Workflow Correction
Date: 2026-01-28

### Fixed
- Corrected SECURITY.md version tag automation workflow

---

## v2.0.1 — Security Hardening
Date: 2026-01-28

### Added
- Middleware-level protection improvements

### Improved
- Security posture and request validation

---

## v2.0.0 — Mode-Based Learning Architecture
Date: 2026-01-25

### Added
- Learn Mode
- Fast Learn Mode
- Doubt Mode
- Teach-Back Mode
- Mode-specific backend routing logic

### Architecture Shift
Transitioned from single-response AI system to
structured mode-based learning architecture.

Established learning as situational:
- Depth
- Speed
- Precision
- Articulation

This marked a MAJOR architectural milestone.

---

# Major Version 1 — Foundation & Identity Layer

---

## v1.2.1 — Email Verification Stabilization
Date: 2026-01-18

### Fixed
- Stabilized email verification flow
- Improved frontend routing reliability

---

## v1.2.0 — Email Verification & Auth Hardening
Date: 2026-01-08

### Added
- Email verification system
- Auth hardening
- Input validation improvements

### Improved
- Security and trust layer of the application

---

## v1.1.1 — Environment Configuration Refactor
Date: 2026-01-07

### Changed
- Switched MongoDB connection to environment-based configuration

---

## v1.1.0 — Auth-Gated User Tracking
Date: 2026-01-06

### Added
- Authentication-gated usage tracking
- Activity logging per user
- Structured backend logging

Introduced identity-aware interaction layer.

---

## v1.0.1 — Backend Wiring & Live Integration
Date: 2026-01-02

### Added
- Frontend wired to live backend
- Relaxed mandatory analogy enforcement

---

## v1.0.0 — Initial System Foundation
Date: 2026-01-01

### Added
- Initial AI response handling
- Basic frontend-backend communication
- Core request-response structure

Established the foundational system behavior.
