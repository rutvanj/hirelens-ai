# AI Resume Analyzer

AI Resume Analyzer is a web application that analyzes resumes against job descriptions to help candidates improve their chances of passing Applicant Tracking Systems (ATS).

The system extracts text from resumes, detects relevant skills, identifies missing skills based on job descriptions, and provides actionable suggestions to improve the resume.

##Live Demo

The application is deployed on Render.

Live Application:
https://ai-resume-analyzer-ugm0.onrender.com



Features

- ATS-style resume scoring
- Job description matching
- Automatic skill detection
- Missing skills analysis
- Skill radar chart visualization
- Resume improvement suggestions
- Resume upload support (PDF / image)
- OCR-based text extraction for scanned resumes



Tech Stack

Backend

- Python
- Flask

Frontend

- HTML
- CSS
- Chart.js

Resume Processing

- pdfplumber
- Tesseract OCR
- Pillow

Deployment

- Render (Cloud Hosting)
- GitHub (Version Control)



Installation

Clone the repository:

git clone https://github.com/rutvanj/ai-resume-analyzer.git
cd ai-resume-analyzer

Install dependencies:

pip install flask pdfplumber pillow pytesseract



Running the Application Locally

Start the Flask server:

python app.py

Open your browser and go to:

http://127.0.0.1:5000



Deployment

The backend is deployed on Render.
Render automatically redeploys the application when new code is pushed to GitHub.

The Flask server runs using:

app.run(host="0.0.0.0", port=os.environ.get("PORT",10000))



Future Improvements

- AI-based resume rewriting
- ATS keyword optimization
- NLP-based resume scoring
- Job recommendation engine
- LinkedIn profile analysis



Author

Rutva Jakhiya
B.Tech Information Technology
A. D. Patel Institute of Technology
