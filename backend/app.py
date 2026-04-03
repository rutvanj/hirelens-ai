import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

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

if __name__ == '__main__':
    # Default Flask port is 5000, user requested 10000
    port = int(os.getenv('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=True)
