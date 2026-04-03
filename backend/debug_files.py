import subprocess, os, uuid, stat, glob as _glob

appdata_local = os.environ.get("LOCALAPPDATA", "")
pattern = os.path.join(appdata_local, "GitHubDesktop", "app-*", "resources", "app", "git", "cmd", "git.exe")
matches = sorted(_glob.glob(pattern), reverse=True)
git_exe = matches[0]

ALLOWED_EXT = {'.py', '.js', '.ts', '.jsx', '.tsx', '.cpp', '.c', '.java'}
IGNORE_DIRS = {'.git', 'node_modules', 'venv', 'dist', 'build', '__pycache__'}

job_id = str(uuid.uuid4())
fake_file = os.path.abspath("app/analyzer.py")
temp_dir = os.path.join(os.path.dirname(fake_file), "..", "temp_repos", job_id)
temp_dir = os.path.abspath(temp_dir)

os.makedirs(os.path.dirname(temp_dir), exist_ok=True)
env = os.environ.copy()
env["GIT_TERMINAL_PROMPT"] = "0"

subprocess.run([git_exe, "clone", "--depth=1", "https://github.com/mauryas69/student-project-analyzer", temp_dir],
               capture_output=True, text=True, timeout=60, env=env)

print("=== ALL FILES IN CLONE ===")
total_files = 0
total_lines = 0
for root, dirs, files in os.walk(temp_dir):
    dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
    for f in files:
        _, ext = os.path.splitext(f.lower())
        if ext in ALLOWED_EXT:
            total_files += 1
            fp = os.path.join(root, f)
            lines = open(fp, encoding='utf-8', errors='ignore').read().splitlines()
            total_lines += len(lines)
            print(f"  {os.path.relpath(fp, temp_dir)} ({len(lines)} lines)")

print(f"\ntotal_files: {total_files}, total_lines: {total_lines}")

import shutil
shutil.rmtree(temp_dir, onerror=lambda f,p,e: (os.chmod(p, stat.S_IWRITE), f(p)))
