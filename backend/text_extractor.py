import pdfplumber
import pytesseract
from PIL import Image
import io
import os

# Optional: Configure Tesseract path if it's not in the PATH
# Default Windows installation path
TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

def extract_text_from_pdf(file_stream):
    """
    Extracts text from all pages of a PDF file.
    """
    text = ""
    try:
        with pdfplumber.open(file_stream) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""

def extract_text_from_image(file_stream):
    """
    Extracts text from an image file using OCR.
    """
    try:
        # Open the image using PIL
        img = Image.open(file_stream)
        
        # Perform OCR
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        # Check if it's a Tesseract not found error
        if "TesseractNotFound" in str(type(e)):
            return "[Error]: Tesseract OCR engine not found on the server. Please install it to process images."
        print(f"Error extracting image text: {e}")
        return ""
