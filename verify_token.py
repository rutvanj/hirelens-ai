import requests
import os
from dotenv import load_dotenv

load_dotenv()
token = os.getenv("BRIGHT_DATA_API_KEY")

print(f"Testing Token (Length: {len(token) if token else 0})")
url = "https://api.brightdata.com/profile"
headers = {"Authorization": f"Bearer {token}"}

try:
    response = requests.get(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
