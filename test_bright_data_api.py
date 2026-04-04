import os
import requests
from dotenv import load_dotenv

load_dotenv()

BRIGHT_DATA_API_KEY = os.getenv("BRIGHT_DATA_API_KEY")
BRIGHT_DATA_DATASET_ID = os.getenv("BRIGHT_DATA_DATASET_ID")

def test_api():
    if not BRIGHT_DATA_API_KEY or BRIGHT_DATA_API_KEY == "your_bright_data_api_token_here":
        print("❌ Error: BRIGHT_DATA_API_KEY is not configured in .env")
        return

    print(f"Testing Bright Data API...")
    print(f"Key: {BRIGHT_DATA_API_KEY[:8]}...")
    print(f"Dataset: {BRIGHT_DATA_DATASET_ID}")

    url = f"https://api.brightdata.com/datasets/v3/trigger?dataset_id={BRIGHT_DATA_DATASET_ID}&include_errors=true"
    headers = {
        "Authorization": f"Bearer {BRIGHT_DATA_API_KEY}",
        "Content-Type": "application/json"
    }
    # Test with a known public profile
    payload = [{"url": "https://www.linkedin.com/in/williamhgates"}]

    try:
        print("Triggering dataset...")
        response = requests.post(url, headers=headers, json=payload)
        print(f"Trigger Status: {response.status_code}")
        print(f"Trigger Response: {response.text}")

        if response.status_code == 200:
            print("✅ Success: Bright Data API is responsive and credentials are valid.")
        else:
            print(f"❌ Failure: API returned status {response.status_code}")
            if response.status_code == 401:
                print("Hint: Check if your API Key is correct and has the right permissions.")
            elif response.status_code == 403:
                print("Hint: Check if the Dataset ID is correct or if your account has access to this dataset.")
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

if __name__ == "__main__":
    test_api()
