# LGC Concept AI 🎓🤖  
**Learning Concepts. Writing Exams. Building Confidence.**

LGC Concept AI is an **Anna University–oriented AI learning assistant** built to help engineering students **understand theory deeply**, **structure answers correctly**, and **write confident 13-mark responses** in the expected university exam format.

The system prioritizes **concept clarity, exam relevance, and mental confidence**, making it especially effective for **slow learners, first-generation engineers, and theory-heavy subjects**.

---

# 📱 Progressive Web App (PWA)

LGC Concept AI is delivered as a **Progressive Web App**, allowing students to install the platform like a native application on mobile and desktop devices.

## PWA Capabilities

- Installable on **Android, iOS, Windows, and Desktop**
- Runs in **standalone app mode**
- **Service worker caching** for faster loading
- Works smoothly on **mobile browsers**
- **Home screen installation** support
- Reduced repeated network load for static assets

Once installed, the application behaves like a **native learning app**, allowing faster access during study sessions.

## Installing the App

### On Mobile (Chrome / Edge)

1. Open the LGC Concept AI website  
2. Tap the **Install** prompt  
3. Select **Add to Home Screen**

### On Desktop (Chrome / Edge)

1. Open the website  
2. Click the **Install icon** in the address bar  
3. Confirm installation

The application will now launch like a **native desktop app**.

---

# 🚀 Project Vision

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

# Major Version 2 — Mode-Based Learning Architecture

Version 2 established learning as **situational and intentional**, not generic.

Learning is separated by intent:

- Depth  
- Speed  
- Precision  
- Articulation  

---

# ✨ Learning Modes

## 🔹 Learn Mode (Primary)

- Fully **exam-oriented**
- Strict **Anna University scope enforcement**
- Structured answers suitable for **13-mark questions**

Aspect-aware answering:

- Definition  
- Construction  
- Working  
- Comparison  
- Applications  
- Advantages  
- Limitations  

### Core Points / Mental Model Extraction

After a full explanation, students can extract **5–7 memory-friendly core points** for revision and long-term retention.

---

## 🔹 Fast Learn Mode

Designed for **quick clarity and last-minute revision**.

Characteristics:

- Key takeaways only  
- No long explanations  
- No exam structuring  
- No analogies  

⚠️ Not suitable for coding or derivation-heavy subjects.  
Users are automatically guided to **Learn Mode** when deeper explanations are required.

---

## 🔹 Clear Doubt Mode

Used for **micro-clarifications**.

Characteristics:

- Answers only the **specific doubt**  
- Short and focused responses  
- Avoids re-teaching the entire topic  

Useful when:

- You mostly understand the concept  
- One step is confusing  
- You need quick clarification  

---

## 🔹 Verify Understanding (Teach-Back Mode)

One of the **core philosophies** of LGC Concept AI.

Students explain the concept in their **own words**.

The AI then:

- Encourages first  
- Checks conceptual correctness  
- Identifies missing reasoning  
- Points out mistakes briefly  
- Motivates retry  

> **“If you can explain it clearly, you understand it.”**

This verifies **real understanding**, not memorization.

---

# 🧠 Answer Structure (Anna University Pattern)

In Learn Mode, answers follow a **marks-aware exam structure**:

- Definition (~2 marks)  
- Construction / Components (~3 marks)  
- Working Principle (~4-5 marks)  
- Applications  
- Advantages  
- Limitations  
- One clearly marked **analogy (not for exam writing)**  

Answers strictly match **what the question asks**.

---

# 🔁 Learning Experience Design

- Scroll-based explanations  
- Previous responses remain visible  
- Continuous learning flow  
- Reduced cognitive overload  
- Mode-based learning transitions  
- Exam-friendly structured outputs  

---

# ⚙️ Infrastructure & Reliability (v2.2+)

Version 2.2 introduced a major **backend reliability upgrade**.

LGC Concept AI does not rely on a **single AI provider**.

---

## 🔁 Multi-Model AI Fallback System

Provider order:

1. Llama 3.3 70B  
2. Nemotron 30B  
3. Gemma 27B  
4. Gemini 2.5 Flash  

If a provider fails:

- Retries occur automatically  
- Exponential backoff applied  
- Next provider selected  
- Graceful failure only if all providers fail  

This ensures **controlled degradation instead of system collapse**.

---

# 🏗️ Tech Stack

## Frontend

- React  
- Vite  
- PWA support (`vite-plugin-pwa`)  
- Custom install prompt  
- Mobile-friendly UI  
- Mode-based rendering logic  

## Backend

- Node.js  
- Express  
- Mode-based routing  
- Prompt isolation per learning mode  
- Multi-provider AI abstraction  
- Structured logging system  

---

# 📱 PWA Architecture

LGC Concept AI uses:

- **Web App Manifest**
- **Service Worker**
- **vite-plugin-pwa**
- **Custom Install Prompt**

Key files include:

- `vite.config.js`
- `InstallPrompt.jsx`
- Service worker generated using **Workbox**

---

# 📂 Project Structure

```
LGC-Concept-AI
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── modes
│   │   ├── services
│   │   └── App.jsx
│   │
│   ├── public
│   │   └── icons
│   │
│   └── vite.config.js
│
├── backend
│   ├── routes
│   ├── services
│   ├── aiProviders
│   └── server.js
│
└── README.md
```

---

# 🛠 Local Development Setup

Clone the repository:

```bash
git clone https://github.com/<username>/LGC-Concept-AI.git
cd LGC-Concept-AI
```

Install dependencies.

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

Application will run at:

```
http://localhost:5173
```

---

# 🔐 Privacy & Cost Philosophy

- No forced subscriptions  
- No hidden monetization  
- Minimal user data storage  
- Lightweight architecture  
- Free-model prioritization  

> **Learning needs investment in time and consistency, not money.**

---

# 🎯 Target Audience

- Anna University engineering students  
- Slow learners struggling with theory  
- Students who panic in exams  
- Learners seeking **concept clarity instead of shortcuts**

---

# 📖 Future Enhancements

- Mathematical rendering engine (v2.3)  
- Structured markdown + equation formatting  
- Reflection prompts  
- Subject-wise learning organization  
- Offline revision mode  
- Conversational AI interface  

---

# 🙏 Acknowledgements

- Anna University exam structure  
- Open learning communities  
- OpenRouter API  
- Google Gemini API  
- Open-source model ecosystem  
- Brevo API  

---

# 📜 License

This project is licensed under the **MIT License**.

---

# Final Philosophy

LGC Concept AI is **not a shortcut tool**.

It is a structured learning companion designed to build:

- Concept clarity  
- Discipline  
- Exam confidence  