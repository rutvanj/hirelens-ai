import subprocess, os, uuid, stat

# Simulate what analyzer.py does at runtime under uvicorn
fake_file = os.path.abspath("app/analyzer.py")
job_id = str(uuid.uuid4())
temp_dir = os.path.join(os.path.dirname(fake_file), "..", "temp_repos", job_id)
temp_dir = os.path.abspath(temp_dir)

print("temp_dir:", temp_dir)
print("temp_dir parent exists:", os.path.isdir(os.path.dirname(temp_dir)))
print("temp_dir itself exists BEFORE clone:", os.path.isdir(temp_dir))

import glob as _glob
appdata_local = os.environ.get("LOCALAPPDATA", "")
pattern = os.path.join(appdata_local, "GitHubDesktop", "app-*", "resources", "app", "git", "cmd", "git.exe")
matches = sorted(_glob.glob(pattern), reverse=True)
git_exe = matches[0] if matches else None
print("Git exe:", git_exe)

os.makedirs(os.path.dirname(temp_dir), exist_ok=True)
env = os.environ.copy()
env["GIT_TERMINAL_PROMPT"] = "0"

result = subprocess.run(
    [git_exe, "clone", "--depth=1", "https://github.com/mauryas69/student-project-analyzer", temp_dir],
    capture_output=True, text=True, timeout=60, env=env
)
print("Clone return code:", result.returncode)
print("Clone STDERR:", result.stderr[:400])
print("temp_dir exists AFTER clone:", os.path.isdir(temp_dir))

if os.path.isdir(temp_dir):
    all_files = [(root, files) for root, dirs, files in os.walk(temp_dir)]
    total = sum(len(f) for _, f in all_files)
    print("Total files after clone:", total)
    print("Top-level contents:", os.listdir(temp_dir)[:10])

    import shutil
    shutil.rmtree(temp_dir, onerror=lambda f,p,e: (os.chmod(p, stat.S_IWRITE), f(p)))
