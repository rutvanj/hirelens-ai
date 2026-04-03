import os
import shutil
import uuid
import stat
import subprocess
from radon.complexity import cc_visit

# Allowed extensions mapped per hackathon bounds
ALLOWED_EXT = {'.py', '.js', '.ts', '.jsx', '.tsx', '.cpp', '.c', '.java'}
IGNORE_DIRS = {'.git', 'node_modules', 'venv', 'dist', 'build', '__pycache__'}

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

def analyze_repository(repo_url: str):
    """Clones the repo, statically analyzes it, and returns metrics dict."""
    job_id = str(uuid.uuid4())
    temp_dir = os.path.join(os.path.dirname(__file__), "..", "temp_repos", job_id)
    temp_dir = os.path.abspath(temp_dir)

    try:
        # 1. Clone using subprocess (avoids GitPython PATH dependency)
        git_exe = _find_git()
        print(f"Cloning {repo_url} into {temp_dir} using {git_exe}...")
        # Do NOT pre-create temp_dir — git clone creates it itself
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
        extension_counts: dict = {}
        total_complexity = 0
        python_files = 0

        for root, dirs, files in os.walk(temp_dir):
            # Prune ignored directories in-place
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
        avg_func_length = 15  # Static proxy — generalized AST across 8 langs is out of scope
        complexity_score = round(total_complexity / max(python_files, 1)) if python_files else 3

        # Language mapping (sorted by frequency)
        lang_map = {
            '.py': 'Python', '.js': 'JavaScript', '.ts': 'TypeScript',
            '.jsx': 'React JS', '.tsx': 'React TS', '.c': 'C',
            '.cpp': 'C++', '.java': 'Java'
        }
        sorted_exts = sorted(extension_counts, key=extension_counts.get, reverse=True)
        languages_detected = [lang_map.get(e, e) for e in sorted_exts]

        return {
            "job_id": job_id,
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

    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, onerror=remove_readonly)
