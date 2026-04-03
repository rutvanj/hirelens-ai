import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from backend/.env
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise RuntimeError(
        "GROQ_API_KEY is not set. Please create backend/.env and define GROQ_API_KEY."
    )

client = Groq(api_key=api_key)
