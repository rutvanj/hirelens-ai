import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from text_extractor import extract_text_from_pdf, extract_text_from_image
from resume_analyzer import analyze_resume

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "AI Resume Analyzer API is running",
        "version": "1.0.0"
    })

# Configure allowed extensions
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    # Check if a file was sent
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file part"}), 400
    
    file = request.files['file']
    
    # If no file is selected
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400
    
    # Validate file type
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        
        # Get file extension
        ext = filename.rsplit('.', 1)[1].lower()
        
        # Perform Text Extraction
        extracted_text = ""
        if ext == 'pdf':
            extracted_text = extract_text_from_pdf(file)
        elif ext in ['png', 'jpg', 'jpeg']:
            extracted_text = extract_text_from_image(file)
        
        # Return results with preview
        return jsonify({
            "status": "success", 
            "message": f"Successfully processed {filename}",
            "filename": filename,
            "extracted_text": extracted_text,
            "extracted_text_preview": extracted_text[:200] + "..." if len(extracted_text) > 200 else extracted_text
        })
    else:
        return jsonify({"status": "error", "message": "Invalid file type. Allowed: PDF, PNG, JPG"}), 400

@app.route('/api/analyze', methods=['POST'])
def analyze():
    # 1. Parse JSON body
    data = request.get_json()
    
    if not data:
        return jsonify({"status": "error", "message": "Missing request body"}), 400
        
    resume_text = data.get('resume_text', '')
    job_description = data.get('job_description', '')
    
    # 2. Basic Validation
    if not resume_text:
        return jsonify({"status": "error", "message": "Resume text is empty. Please upload a resume first."}), 400
    if not job_description:
        return jsonify({"status": "error", "message": "Job description is empty. Please provide one for matching."}), 400
        
    # 3. Perform Analysis
    analysis_results = analyze_resume(resume_text, job_description)
    
    # 4. Return results
    return jsonify({
        "status": "success",
        "results": analysis_results
    })

if __name__ == '__main__':
    # Default Flask port is 5000, user requested 10000
    port = int(os.getenv('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=True)
