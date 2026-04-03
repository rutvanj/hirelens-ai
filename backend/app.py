import os
import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from resume_checker import analyze_resume
load_dotenv()
BRIGHT_DATA_API_KEY = os.getenv("BRIGHT_DATA_API_KEY")
BRIGHT_DATA_DATASET_ID = os.getenv("BRIGHT_DATA_DATASET_ID", "gd_l1vsh664197as6562c")

import pdfplumber
import pytesseract
from PIL import Image
import io

app = Flask(__name__)
CORS(app)


# -------- PDF TEXT EXTRACTION --------
def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
    return text


# -------- IMAGE OCR EXTRACTION --------
def extract_text_from_image(file):

    image_bytes = file.read()
    image = Image.open(io.BytesIO(image_bytes))

    text = pytesseract.image_to_string(image)

    return text


# -------- BRIGHT DATA LINKEDIN SCRAPER --------
def fetch_bright_data(linkedin_url):
    if not BRIGHT_DATA_API_KEY or BRIGHT_DATA_API_KEY == "your_bright_data_api_token_here":
        return {"error": "Bright Data API Token not configured"}

    # Bright Data Trigger Endpoint
    dataset_id = BRIGHT_DATA_DATASET_ID
    url = f"https://api.brightdata.com/datasets/v3/trigger?dataset_id={dataset_id}&include_errors=true"
    
    # Ensure token is stripped of any accidental whitespace
    token = BRIGHT_DATA_API_KEY.strip() if BRIGHT_DATA_API_KEY else ""
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = [{"url": linkedin_url}]

    try:
        # Trigger the scraper
        with open("api_debug.log", "a") as f:
            f.write(f"\n--- API Call ---\n")
            f.write(f"URL: {url}\n")
            f.write(f"Token: {token[:4]}...{token[-4:] if len(token) > 8 else ''}\n")
        
        response = requests.post(url, headers=headers, json=payload)
        
        with open("api_debug.log", "a") as f:
            f.write(f"Status: {response.status_code}\n")
            f.write(f"Response: {response.text}\n")
        
        if response.status_code == 200:
            # ...
            scrape_url = f"https://api.brightdata.com/datasets/v3/scrape?dataset_id={dataset_id}"
            scrape_response = requests.post(scrape_url, headers=headers, json=payload)
            with open("api_debug.log", "a") as f:
                f.write(f"Scrape Status: {scrape_response.status_code}\n")
            if scrape_response.status_code == 200:
                return scrape_response.json()
            return {"error": f"Bright Data Scrape Error: {scrape_response.status_code}"}
        elif response.status_code == 401:
            try:
                err_json = response.json()
                return {"error": f"Bright Data Auth Error (401): {err_json.get('error', 'Unauthorized')}"}
            except:
                return {"error": "Invalid Bright Data API Token (401)"}
        else:
            try:
                err_json = response.json()
                return {"error": f"Bright Data API Error ({response.status_code}): {err_json.get('error', 'Unknown')}"}
            except:
                return {"error": f"Bright Data API Error: {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}
@app.route("/analyze", methods=["POST"])
def analyze_api():

    job_desc = request.form.get("job_desc", "")
    resume_text = ""

        # -------- CHECK FILE UPLOAD --------
        if "resume_file" in request.files:

            file = request.files["resume_file"]

            if file.filename != "":

                filename = file.filename.lower()

                # PDF
                if filename.endswith(".pdf"):
                    resume_text = extract_text_from_pdf(file)

                # Image
                elif filename.endswith(".png") or filename.endswith(".jpg") or filename.endswith(".jpeg"):
                    resume_text = extract_text_from_image(file)

        # -------- LINKEDIN ENRICHMENT --------
        linkedin_url = request.form.get("linkedin_url", "")
        pdl_data = None
        if linkedin_url:
            pdl_data = fetch_bright_data(linkedin_url)

        # -------- ANALYZE RESUME --------
        result = analyze_resume(resume_text, job_desc, pdl_data)
        
        return jsonify(result), 200

    return jsonify({"error": "Invalid request"}), 400

# -------- RUN SERVER --------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)