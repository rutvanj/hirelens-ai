import urllib.request, json, time

payload = json.dumps({"repo_url": "https://github.com/mauryas69/student-project-analyzer"}).encode()
req = urllib.request.Request(
    "http://127.0.0.1:8000/analyze",
    data=payload,
    headers={"Content-Type": "application/json"}
)
print("Sending analyze request...")
start = time.time()
resp = urllib.request.urlopen(req, timeout=120)
job = json.loads(resp.read())
elapsed = time.time() - start
print(f"Job ID: {job['job_id']} (took {elapsed:.1f}s)")

result_resp = urllib.request.urlopen(f"http://127.0.0.1:8000/analysis-result/{job['job_id']}", timeout=10)
result = json.loads(result_resp.read())
print("Industry score:", result["industry_score"])
print("Status:", result["status"])
print("Total lines:", result["metrics"]["total_lines"])
print("Languages:", result["metrics"]["languages_detected"])
print("Strengths[0]:", result["strengths"][0])
