import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()
token = os.getenv("BRIGHT_DATA_API_KEY")
dataset_id = os.getenv("BRIGHT_DATA_DATASET_ID", "gd_l1vsh664197as6562c")

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

url = f"https://api.brightdata.com/datasets/v3/trigger?dataset_id={dataset_id}&include_errors=true"
payload = [{"url": "https://www.linkedin.com/in/williamhgates/"}] # Example profile

print("Triggering Bright Data...")
res = requests.post(url, headers=headers, json=payload)
if res.status_code == 200:
    snap_id = res.json().get('snapshot_id')
    print("Snapshot ID:", snap_id)
    
    # Wait for completion
    for i in range(10):
        print(f"Polling... {i}")
        time.sleep(5)
        poll_res = requests.get(f"https://api.brightdata.com/datasets/v3/snapshot/{snap_id}?format=json", headers=headers)
        if poll_res.status_code == 200:
            data = poll_res.json()
            if isinstance(data, list) and len(data) > 0:
                profile = data[0]
                print("\n--- SCHEMA KEYS ---")
                print(list(profile.keys()))
                
                print("\n--- EXPERIENCE SAMPLE ---")
                print(str(profile.get('experience', profile.get('experiences', profile.get('positions', 'NOT FOUND'))))[:500])
                
                print("\n--- EDUCATION SAMPLE ---")
                print(str(profile.get('education', profile.get('educations', 'NOT FOUND'))))[:500]
                
                print("\n--- SKILLS SAMPLE ---")
                print(str(profile.get('skills', 'NOT FOUND'))[:500])
                break
        else:
            print("Status:", poll_res.status_code)
else:
    print("Trigger Failed:", res.status_code, res.text)
