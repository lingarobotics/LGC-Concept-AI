# LGC Concept AI 🎓🤖  
**Learning Concepts. Writing Exams. Building Confidence.**

LGC Concept AI is an **Anna University–oriented AI learning assistant** built to help engineering students **understand theory deeply**, **structure answers correctly**, and **write confident 13-mark responses** in the expected university exam format.

The system prioritizes **concept clarity, exam relevance, and mental confidence**, making it especially effective for **slow learners, first-generation engineers, and theory-heavy subjects**.

---

## 🚀 Project Vision

Many engineering students struggle not because concepts are impossible, but because explanations are:

- Too abstract  
- Not exam-oriented  
- Poorly structured for Anna University evaluation  

**LGC Concept AI solves this gap** by behaving like a patient senior or tutor who explains concepts:

- Clearly  
- Step-by-step  
- In a **marks-aware, exam-ready structure**

The goal is **not just answer generation**, but learning that **survives exam pressure**.

---

## ✨ What’s New in Version 2.0

Version **2.0** introduces a **mode-driven learning system**, separating learning behaviors clearly and intentionally.

### 🔹 Fast Learn Mode (New)

- Designed for **quick clarity and last-minute revision**
- Provides **key takeaways only**
- No long explanations or exam structuring
- Ideal when time is limited

> ⚠️ Not suitable for deep learning or coding questions  
> 👉 Users are guided to **Learn Mode** when depth is required

---

### 🔹 Learn Mode (Enhanced)

- Fully **exam-oriented**
- Strict **Anna University question scope enforcement**
- Structured answers suitable for **13-mark questions**
- Aspect-aware answering:
  - Definition
  - Construction
  - Working
  - Comparison
  - Applications
  - Advantages / Limitations

**New in v2.0:**  
➡️ **Core Points / Mental Model Extraction**  
After a full explanation, students can extract **5–7 memory-friendly core points** to reinforce understanding and revision.

---

### 🔹 Clear Doubt Mode (Standardized)

- Designed for **micro-clarifications**
- Answers **only the specific doubt**
- Short, direct, and focused
- Avoids re-teaching the entire topic

Perfect when:
- You mostly understand the concept
- You’re stuck at one small point
- You need clarity without overload

---

### 🔹 Verify Understanding (Teach-Back Mode — Core Philosophy)

One of the strongest pillars of LGC Concept AI is **learning by explaining**.

In Teach-Back Mode:

1. The student explains a concept in their own words  
2. The AI:
   - Encourages first
   - Checks conceptual correctness
   - Identifies missing logic
   - Points out mistakes briefly
   - Motivates the student to retry  

> “If you can explain it clearly, you understand it.”

This mode verifies **real understanding**, not memorization.

---

## 🧠 Answer Structure (Anna University Preferred)

In Learn Mode, responses follow a **marks-aware structure**:

- Definition (≈2 marks)
- Construction / Components (≈3 marks)
- Working Principle (≈4–5 marks)
- Applications
- Advantages & Limitations
- One clearly marked **analogy (not for exam writing)**

Answers strictly match what is asked — **nothing extra, nothing missing**.

---

## 🔁 Learning Experience Design

- Scroll-based long answers
- Previous responses remain visible
- Continuous learning flow (not form-based)
- Reduced cognitive load and exam anxiety

---

## 🏗️ Tech Stack

### Frontend
- React + Vite
- Clean, distraction-free UI
- Mobile-friendly layout

### Backend
- Node.js + Express
- Mode-based routing
- Prompt isolation per learning mode

---

## 🤖 AI Strategy (Mode-Wise)

LGC Concept AI uses **mode-isolated prompts and behaviors** to prevent
learning intent from being mixed.

Each mode is deliberately constrained.

### Learn Mode
- Model: NVIDIA Nemotron
- Behavior:
  - Full exam-oriented explanations
  - Aspect-aware (definition, working, applications, etc.)
  - Strict Anna University scope control
  - Supports Core Points / Mental Model extraction

### Fast Learn Mode
- Model: NVIDIA Nemotron
- Behavior:
  - Key takeaways only
  - No long explanations
  - No exam structuring
  - No analogies
- Purpose:
  - Quick clarity
  - Last-minute revision
  - Time-constrained learning

> Fast Learn is intentionally **not designed for coding or deep theory**.
> Users are guided to Learn Mode when depth is required.

### Clear Doubt Mode
- Model: NVIDIA Nemotron
- Behavior:
  - Answers only the specific doubt
  - Short, direct, and focused
  - No re-teaching

### Verify Understanding (Teach-Back Mode)
- Reasoning-focused evaluation
- Encourages first, then evaluates
- Identifies mistakes and missing logic
- Does not re-teach the concept

This separation prevents **mode-bleeding** and preserves learning intent.

---

## 🔐 Privacy & Cost Philosophy

- No forced subscriptions
- No hidden monetization
- Minimal data storage
- Lightweight and sustainable architecture

> Learning needs investment in **time and consistency**, not money.

---

## 🎯 Target Audience

- Anna University engineering students
- Slow learners struggling with theory
- Students who understand concepts but panic in exams
- Learners who want **clarity over shortcuts**

---

## 📖 Future Enhancements (Planned)

- Reflection prompts (“What did I correct?”)
- Non-gamified learning streaks
- Subject-wise structuring
- Offline revision mode
- Conversational chat-like UI

---

## 🙏 Acknowledgements

- Anna University exam pattern & evaluation style  
- Open learning communities  
- OpenRouter API (NVIDIA and open models)  
- Brevo API (transactional email delivery)