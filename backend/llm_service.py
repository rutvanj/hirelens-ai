import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# xAI (Grok) is OpenAI-compatible — same code, different endpoint + model
XAI_MODE = GROQ_API_KEY and GROQ_API_KEY.startswith("xai-")

def extract_candidate_skills(text):
    if not text or not text.strip():
        return []
        
    if not GROQ_API_KEY:
        print("WARNING: GROQ_API_KEY not found in .env. Falling back to empty skills list.")
        return []

    if XAI_MODE:
        url = "https://api.x.ai/v1/chat/completions"
        model = "grok-3-mini"
    else:
        url = "https://api.groq.com/openai/v1/chat/completions"
        model = "llama-3.3-70b-versatile"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    # Prompt Engineering for exact JSON parsing mapping
    prompt = f"""
Extract all professional skills (hardware, software, programming languages, libraries, concepts, platforms, methodologies) from the following text.
Return ONLY valid JSON in this exact format, with no markdown wrappers or conversational intro text:
{{ "skills": ["skill1", "skill2"] }}

Text:
{text}
"""

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1,
        "response_format": { "type": "json_object" }
    }

    print(f"\n--- [DEBUG] Calling Groq LLM ---")
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        if response.status_code == 200:
            resp_json = response.json()
            llm_text = resp_json['choices'][0]['message']['content']
            print(f"[DEBUG] Raw LLM Response: {llm_text.strip()}")
            
            data = json.loads(llm_text)
            skills = data.get("skills", [])
            # Normalization
            skills = [str(s).lower() for s in skills if isinstance(s, str)]
            print(f"[DEBUG] Extracted Skills: {skills}")
            return skills
        else:
            print(f"[ERROR] Groq API returned status {response.status_code}: {response.text}")
            return []
            
    except json.JSONDecodeError as e:
        print(f"[ERROR] Failed to parse JSON from Groq LLM: {str(e)}")
        return []
    except Exception as e:
        print(f"[ERROR] Groq LLM Exception: {str(e)}")
        return []
