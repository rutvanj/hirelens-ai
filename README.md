# HireLens AI

HireLens AI is an AI-powered resume analysis platform built to help users evaluate how well their resume matches a given job description. Refactored into a modern, fully separated architecture featuring a React (Vite+Tailwind) frontend and a Python Flask backend.

This project was originally developed by **Team Yuktava** as a hackathon project.

---

## ✨ Features

- Resume upload support (PDF & Images)
- Job description matching
- ATS-style resume analysis (Skill extraction, Keyword detection)
- LinkedIn Profile enrichment via Bright Data
- Aesthetically premium dark themed frontend

---

## 🛠 Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router 
- Chart.js (Radar Charts)
- Framer Motion & Lucide React

### Backend
- Python
- Flask
- Flask-CORS
- PDFPlumber & PyTesseract for Extraction

---

## 📂 Project Structure

```bash
HireLens-AI/
│
├── backend/             # Python Flask API
│   ├── app.py           # Main backend entrypoint
│   ├── resume_checker.py # Core analysis logic
│   ├── requirements.txt # Python dependencies
│   └── render.yaml      # Render deployment config
│
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── components/  # React reusable components
│   │   ├── pages/       # Next-gen pages: Landing, Analyze, Results
│   │   └── App.jsx      # Frontend router setup
│   └── vite.config.js   # Vite configuration
│
└── README.md
```

---

## 🚀 Local Development

### 1. Backend
```bash
cd backend
python -m venv venv
# Enable venv here
pip install -r requirements.txt
# Set environment variables (.env file inside /backend)
python app.py
```
*(Backend runs on `localhost:10000` by default)*

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
*(Frontend runs on `localhost:5173` typically)*

---

## ☁️ Deployment Guides

### Deploying Frontend (Vercel)
1. Import the repository into Vercel.
2. Set **Framework Preset** to `Vite`.
3. Set **Root Directory** to `frontend`.
4. Build Command: `npm run build` | Output Directory: `dist`.
5. Environment Variables:
   - `VITE_BACKEND_URL` -> URL of your deployed Render backend API.

### Deploying Backend (Render)
1. Import repository into Render as a **Web Service**.
2. Connect to the repository, Render will auto-detect configurations from `backend/render.yaml`.
3. In actual Render UI, ensure you override the Root Directory to `backend/` if required, although `render.yaml` specifies it.
4. Set required Environment Variables: `BRIGHT_DATA_API_KEY`.
