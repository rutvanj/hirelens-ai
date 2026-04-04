# HireLens AI

**HireLens AI** is an AI-assisted resume analysis platform that helps evaluate how well a candidate fits a specific job role.

It combines **resume parsing**, **job description comparison**, and **profile enrichment** to generate a structured candidate report with:
- match scoring
- skill gap analysis
- resume improvement suggestions
- upskilling guidance
- career role alignment

The goal is to make candidate screening **faster, clearer, and more grounded** for hiring and self-evaluation.

---

## 🚀 Live Demo

- **Frontend (Vercel):** https://hirelens-ai-two.vercel.app
- **Backend (Render):** https://hirelens-backend-ly7r.onrender.com

> ⚠️ Note: Since the backend is hosted on **Render**, the API may take a few seconds to wake up on first request.

---

## 💡 Why HireLens AI?

HireLens AI was built to reduce the gap between **candidate potential** and **job readiness**.

Instead of only telling users whether they are a fit or not, it explains:
- what aligns
- what is missing
- how to improve
- what roles they can realistically target next

This makes it useful not only for **recruiters**, but also for **students and job seekers** trying to improve their resume strategically.

---

## 📌 Problem Statement

Recruiters and hiring teams often spend significant time manually comparing resumes against job descriptions.

At the same time, students and job seekers struggle to understand:
- how well their resume fits a role
- what skills are missing
- what they should improve before applying

**HireLens AI** solves this by providing a structured, AI-assisted evaluation of a candidate profile against a target job role.

---

## ✨ Features

### 📄 Resume Upload & Parsing
- Upload resumes in **PDF or image format**
- Extracts and processes candidate information for analysis

### 🧠 AI-Based Candidate Evaluation
- Compares resume content against a given **job description**
- Generates a **candidate suitability report**

### 🎯 Match Scoring
- Provides an overall **fit / suitability score**
- Includes ATS-style evaluation indicators

### 🧩 Skill Gap Analysis
- Highlights:
  - **matched skills**
  - **missing skills**
  - technical alignment

### 💡 Resume Improvement Suggestions
- Gives practical suggestions to improve role alignment
- Helps candidates tailor their resume more effectively

### 📈 Upskilling Recommendations
- Suggests what to learn next based on missing requirements
- Includes a roadmap-style section for improvement

### 💼 Career Role Insights
- Shows:
  - **immediate role matches**
  - **future growth opportunities**

### 🔗 LinkedIn Profile Enrichment
- Optional LinkedIn profile input
- Displays enriched professional profile details such as:
  - profile summary
  - confirmed skills
  - academic record
  - shared activity snapshot

### 📥 PDF Report Export
- Download the generated report for sharing or review

---

## 🖼️ UI / Design Highlights

HireLens AI follows a **Soft Premium** design system with:

- light, human-centered visual styling
- soft pastel background tones
- teal accent highlights
- rounded cards and clean layouts
- structured dashboard-style results
- modern micro-interactions and transitions

---

## 🛠️ Tech Stack

### Frontend
- **React**
- **Vite**
- **Tailwind CSS**
- **Framer Motion**
- **Chart.js**
- **Lucide React**

### Backend
- **Python**
- **Flask**
- **pdfplumber**
- **PyTesseract**
- **OCR / parsing pipeline**
- **AI / LLM-based evaluation logic**

### Deployment
- **Frontend:** Vercel
- **Backend:** Render

---

## 🧱 Project Structure

```bash
HireLens-AI/
│
├── frontend/              # React + Vite frontend
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/               # Flask backend
│   ├── app.py
│   ├── routes/
│   ├── utils/
│   └── ...
│
└── README.md
