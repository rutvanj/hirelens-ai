# Use official Python 3.11 slim image
FROM python:3.11-slim

# Install system dependencies for Tesseract OCR and Magick (for pdfplumber/tesseract)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# Set environment variables for Render (default port is 10000)
ENV PORT=10000

# Run the app with gunicorn for production stability
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT} app:app"]
