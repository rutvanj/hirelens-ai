import requests
import json

url = "http://localhost:10000/api/analyze"
payload = {
    "resume_text": "Experienced Developer with Python, SQL, and React skills. Strong in problem solving.",
    "job_description": "Looking for a Software Engineer proficient in Python, Docker, and AWS. React is a plus."
}
headers = {'Content-Type': 'application/json'}

try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
