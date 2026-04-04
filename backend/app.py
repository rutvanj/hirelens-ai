# Run using:
# python app.py
# or double-click run_backend.bat

import os
import io
import requests
import pdfplumber
import pytesseract
from PIL import Image
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Internal Modules ---
from resume_checker import analyze_resume

# Load environment variables
load_dotenv()

BRIGHT_DATA_API_KEY = os.getenv("BRIGHT_DATA_API_KEY")
BRIGHT_DATA_DATASET_ID = os.getenv("BRIGHT_DATA_DATASET_ID", "gd_l1vsh664197as6562c")

app = Flask(__name__)

# Allow cross-origin requests from the future Vercel domain and local dev
# Configure CORS for local development (Vite ports) and wildcard for hackathon safety
CORS(app, resources={r"/*": {
    "origins": [
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "*" 
    ],
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}}) 

@app.before_request
def log_request_info():
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('Body: %s', request.get_data())
    print(f"--- Inbound Request: {request.method} {request.path} ---")

# -------- BASE ROUTES --------

@app.route("/", methods=["GET"])
def index():
    """Root route for local verification."""
    return jsonify({
        "status": "ok",
        "message": "HireLens backend is running"
    }), 200

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy"
    }), 200

# -------- PDF TEXT EXTRACTION --------

def extract_text_from_pdf(file):
    text = ""
    try:
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
    return text

# -------- IMAGE OCR EXTRACTION --------

def extract_text_from_image(file):
    try:
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"Error extracting Image OCR: {e}")
        return ""

# -------- BRIGHT DATA LINKEDIN SCRAPER --------

def fetch_bright_data(linkedin_url):
    if not BRIGHT_DATA_API_KEY or BRIGHT_DATA_API_KEY == "your_bright_data_api_token_here":
        return {"error": "Bright Data API Token not configured"}

    dataset_id = BRIGHT_DATA_DATASET_ID
    url = f"https://api.brightdata.com/datasets/v3/trigger?dataset_id={dataset_id}&include_errors=true"
    token = BRIGHT_DATA_API_KEY.strip() if BRIGHT_DATA_API_KEY else ""
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = [{"url": linkedin_url}]

    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            scrape_url = f"https://api.brightdata.com/datasets/v3/scrape?dataset_id={dataset_id}"
            scrape_response = requests.post(scrape_url, headers=headers, json=payload)
            if scrape_response.status_code == 200:
                return scrape_response.json()
            return {"error": f"Bright Data Scrape Error: {scrape_response.status_code}"}
        return {"error": f"Bright Data API Error: {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}

# -------- MAIN ANALYSIS API --------

@app.route("/analyze", methods=["POST"])
def analyze_api():
    job_desc = request.form.get("job_desc", "").strip()
    resume_text = ""

    # Check for resume file upload
    if "resume_file" in request.files:
        file = request.files["resume_file"]
        if file.filename != "":
            filename = file.filename.lower()
            if filename.endswith(".pdf"):
                resume_text = extract_text_from_pdf(file)
            elif any(filename.endswith(ext) for ext in [".png", ".jpg", ".jpeg"]):
                resume_text = extract_text_from_image(file)

    # Basic Validation
    if not resume_text and not job_desc:
        return jsonify({
            "error": "Resume or job description required"
        }), 400

    # Optional LinkedIn Enrichment
    linkedin_url = request.form.get("linkedin_url", "").strip()
    pdl_data = None
    if linkedin_url:
        pdl_data = fetch_bright_data(linkedin_url)

    # -------- GITHUB ENRICHMENT --------
    github_url = request.form.get("github_url", "")

    # -------- ANALYZE RESUME --------
    try:
        print(f"Starting analysis for resume text length: {len(resume_text)}")
        result = analyze_resume(resume_text, job_desc, pdl_data)
        
        if github_url and github_url.startswith("https://github.com/"):
            print(f"Starting GitHub Analysis for {github_url}")
            try:
                from github_analyzer import analyze_github_repo
                github_result = analyze_github_repo(github_url)
                result["github_analysis"] = github_result
            except Exception as github_err:
                print(f"Error running github analysis: {github_err}")
                result["github_analysis"] = {"error": str(github_err)}

        print("Analysis complete.")
        return jsonify(result), 200
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        return jsonify({"error": f"Intelligence Engine Error: {str(e)}"}), 500

# -------- RUN SERVER --------

if __name__ == "__main__":
    # Use the PORT environment variable provided by Render or default to 10000
    port = int(os.environ.get("PORT", 10000))
    print(f"Starting HireLens Backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)