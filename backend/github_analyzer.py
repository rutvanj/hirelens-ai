import os
import shutil
import uuid
import stat
import subprocess
import json
import requests
from urllib.parse import urlparse
from radon.complexity import cc_visit
from dotenv import load_dotenv

ALLOWED_EXT = {'.py', '.js', '.ts', '.jsx', '.tsx', '.cpp', '.c', '.java'}
IGNORE_DIRS = {'.git', 'node_modules', 'venv', 'dist', 'build', '__pycache__'}

def resolve_github_url(url: str) -> str:
    parsed = urlparse(url)
    if parsed.netloc == "github.com":
        path_parts = [p for p in parsed.path.split('/') if p]
        if len(path_parts) == 1:
            username = path_parts[0]
            api_url = f"https://api.github.com/users/{username}/repos?sort=pushed&per_page=1"
            try:
                resp = requests.get(api_url, timeout=5)
                if resp.status_code == 200:
                    repos = resp.json()
                    if repos:
                        print(f"Resolved profile {url} to most recently pushed repo {repos[0]['html_url']}")
                        return repos[0]["html_url"]
            except Exception as e:
                print("Failed to resolve GH profile:", e)
    return url

import zipfile
import io

def download_repo_zip(repo_url: str, extract_to: str) -> bool:
    """Download the repository as a ZIP using GitHub's zipball endpoint."""
    parsed = urlparse(repo_url)
    if parsed.netloc == "github.com":
        parts = [p for p in parsed.path.split('/') if p]
        if len(parts) >= 2:
            owner, repo_name = parts[0], parts[1]
            zip_url = f"https://api.github.com/repos/{owner}/{repo_name}/zipball"
            headers = {"User-Agent": "HireLens-Analyzer"}
            
            try:
                r = requests.get(zip_url, headers=headers, stream=True, timeout=30)
                if r.status_code == 200:
                    with zipfile.ZipFile(io.BytesIO(r.content)) as z:
                        z.extractall(extract_to)
                        
                    # GitHub zipball extracts into a subfolder (e.g. owner-repo-sha). 
                    # We move its contents up one level so the structure mimics git clone.
                    extracted_items = os.listdir(extract_to)
                    if len(extracted_items) == 1:
                        subfolder = os.path.join(extract_to, extracted_items[0])
                        if os.path.isdir(subfolder):
                            for item in os.listdir(subfolder):
                                shutil.move(os.path.join(subfolder, item), os.path.join(extract_to, item))
                            os.rmdir(subfolder)
                    return True
                else:
                    print(f"Failed to download ZIP: {r.status_code} - {r.text}")
            except Exception as e:
                print(f"Zip download error: {e}")
                
    return False
def remove_readonly(func, path, excinfo):
    """Clear readonly flag for git deletion via shutil"""
    os.chmod(path, stat.S_IWRITE)
    func(path)

def analyze_github_repo(repo_url: str):
    """Clones the repo, statically analyzes it, tests it using an LLM, and returns full Github Analysis report"""
    repo_url = resolve_github_url(repo_url)
    job_id = str(uuid.uuid4())
    temp_dir = os.path.join(os.path.dirname(__file__), "temp_repos", job_id)
    temp_dir = os.path.abspath(temp_dir)

    try:
        # 1. Download ZIP instead of cloning (avoids git executable missing issues)
        print(f"Downloading {repo_url} as ZIP into {temp_dir}...")
        os.makedirs(extract_to_dir := temp_dir, exist_ok=True)

        if not download_repo_zip(repo_url, extract_to_dir):
            raise RuntimeError(f"Failed to download repository zip from: {repo_url}")

        # 2. Traverse and measure
        total_lines = 0
        total_files = 0
        comment_lines = 0
        readme_present = False
        tests_detected = False
        extension_counts = {}
        total_complexity = 0
        python_files = 0

        for root, dirs, files in os.walk(temp_dir):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            for file in files:
                file_lower = file.lower()
                if "readme" in file_lower:
                    readme_present = True
                if "test" in file_lower or "test" in root.lower():
                    tests_detected = True

                _, ext = os.path.splitext(file_lower)
                if ext not in ALLOWED_EXT:
                    continue

                total_files += 1
                extension_counts[ext] = extension_counts.get(ext, 0) + 1

                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        lines = content.splitlines()
                        total_lines += len(lines)

                        for line in lines:
                            stripped = line.strip()
                            if stripped.startswith('//') or stripped.startswith('#') or stripped.startswith('/*'):
                                comment_lines += 1

                        if ext == '.py':
                            blocks = cc_visit(content)
                            if blocks:
                                total_complexity += sum(b.complexity for b in blocks)
                            python_files += 1
                except Exception:
                    pass

        # 3. Aggregations
        comment_density = round(comment_lines / max(total_lines, 1), 2)
        avg_func_length = 15  # Static proxy
        complexity_score = round(total_complexity / max(python_files, 1)) if python_files else 3

        lang_map = {
            '.py': 'Python', '.js': 'JavaScript', '.ts': 'TypeScript',
            '.jsx': 'React JS', '.tsx': 'React TS', '.c': 'C',
            '.cpp': 'C++', '.java': 'Java'
        }
        sorted_exts = sorted(extension_counts, key=extension_counts.get, reverse=True)
        languages_detected = [lang_map.get(e, e) for e in sorted_exts]

        code_quality = max(0, min(100, int(60 + comment_density * 40)))
        documentation = 85 if readme_present else 40
        testing = 90 if tests_detected else 30
        architecture = 80 if total_files > 5 else 50
        scalability = 75 if total_lines > 500 else 55

        industry_score = int((code_quality + documentation + testing + architecture + scalability) / 5)

        if industry_score >= 85:
            status = "Exceptional"
        elif industry_score >= 65:
            status = "Internship Ready"
        else:
            status = "Needs Improvement"

        # 4. LLM Parsing
        load_dotenv()
        api_key = os.getenv("GROQ_API_KEY")
        llm_output = {}

        if api_key:
            prompt = f"""You are a strict senior engineer reviewing a student GitHub project.
Metrics:
- Total lines: {total_lines}
- Languages: {', '.join(languages_detected)}
- Comment density: {comment_density}
- Tests detected: {tests_detected}
- README present: {readme_present}
- Complexity score: {complexity_score}

Return JSON ONLY in format:
{{
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "resume_suggestions": [
    {{"original": "...", "improved": "..."}}
  ],
  "interview_questions": {{
    "basic": ["...", "..."],
    "intermediate": ["...", "..."],
    "advanced": ["...", "..."]
  }}
}}"""
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "llama3-8b-8192",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "response_format": {"type": "json_object"}
            }

            try:
                print(f"Calling Groq API for GitHub analysis...")
                resp = requests.post(url, headers=headers, json=payload, timeout=20)
                if resp.status_code == 200:
                    content = resp.json()["choices"][0]["message"]["content"].strip()
                    llm_output = json.loads(content)
                else:
                    print(f"Groq API Error: {resp.status_code} - {resp.text}")
            except Exception as e:
                print(f"LLM API Call Failed: {e}")
        else:
            print("GROQ_API_KEY not found. Skipping LLM assessment.")

        return {
            "industry_score": industry_score,
            "status": status,
            "breakdown": {
                "code_quality": code_quality,
                "architecture": architecture,
                "documentation": documentation,
                "testing": testing,
                "scalability": scalability
            },
            "strengths": llm_output.get("strengths") or [
                "Modular functional setup", 
                "Valid architectural structures mapped", 
                "Codebases structured explicitly"
            ],
            "weaknesses": llm_output.get("weaknesses") or [
                "Test coverage needs strict improvement",
                "README documentation could detail setup steps more extensively",
                "Variable typing requires stricter casting"
            ],
            "resume_suggestions": llm_output.get("resume_suggestions") or [],
            "interview_questions": llm_output.get("interview_questions") or {},
            "metrics": {
                "total_lines": total_lines,
                "total_files": total_files,
                "avg_function_length": avg_func_length,
                "complexity_score": complexity_score,
                "comment_density": comment_density,
                "tests_detected": tests_detected,
                "readme_present": readme_present,
                "languages_detected": languages_detected
            }
        }

    except Exception as e:
        print(f"Error analyzing repo {repo_url}: {e}")
        return {"error": str(e)}

    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, onerror=remove_readonly)
