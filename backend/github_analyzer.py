import os
import shutil
import uuid
import stat
import subprocess
import json
import requests
from urllib.parse import urlparse
from radon.complexity import cc_visit
from groq import Groq
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

def _find_git() -> str:
    """Locate git executable — checks PATH first, then common install locations."""
    import glob as _glob

    git = shutil.which("git")
    if git:
        return git

    # GitHub Desktop bundles git under a versioned app-X.Y.Z folder — glob for resilience
    appdata_local = os.environ.get("LOCALAPPDATA", r"C:\Users\Maurya shah\AppData\Local")
    github_desktop_pattern = os.path.join(appdata_local, "GitHubDesktop", "app-*", "resources", "app", "git", "cmd", "git.exe")
    matches = sorted(_glob.glob(github_desktop_pattern), reverse=True)  # newest version first
    if matches:
        return matches[0]

    # Other known locations
    candidates = [
        r"C:\Program Files\Git\cmd\git.exe",
        r"C:\Program Files (x86)\Git\cmd\git.exe",
        os.path.join(appdata_local, "Programs", "Git", "cmd", "git.exe"),
    ]
    for c in candidates:
        if os.path.isfile(c):
            return c

    raise RuntimeError(
        "git executable not found. Please install Git or GitHub Desktop, or add git to your PATH."
    )

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
        # 1. Clone using subprocess (avoids GitPython PATH dependency)
        git_exe = _find_git()
        print(f"Cloning {repo_url} into {temp_dir} using {git_exe}...")
        os.makedirs(os.path.dirname(temp_dir), exist_ok=True)

        env = os.environ.copy()
        env["GIT_TERMINAL_PROMPT"] = "0"  # Prevent credential prompt from hanging

        result = subprocess.run(
            [git_exe, "clone", "--depth=1", repo_url, temp_dir],
            capture_output=True, text=True, timeout=120, env=env
        )
        if result.returncode != 0:
            raise RuntimeError(f"git clone failed: {result.stderr.strip()}")

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
            client = Groq(api_key=api_key)
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
            try:
                completion = client.chat.completions.create(
                    model="llama3-8b-8192",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7
                )
                content = completion.choices[0].message.content.strip()
                if content.startswith("```json"):
                    content = content[7:-3].strip()
                elif content.startswith("```"):
                    content = content[3:-3].strip()
                llm_output = json.loads(content)
            except Exception as e:
                print(f"LLM Parsing Failed: {e}")
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
