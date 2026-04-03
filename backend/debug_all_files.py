import subprocess, os, uuid, stat, glob as _glob

appdata_local = os.environ.get("LOCALAPPDATA", "")
pattern = os.path.join(appdata_local, "GitHubDesktop", "app-*", "resources", "app", "git", "cmd", "git.exe")
git_exe = sorted(_glob.glob(pattern), reverse=True)[0]

job_id = str(uuid.uuid4())
fake_file = os.path.abspath("app/analyzer.py")
temp_dir = os.path.join(os.path.dirname(fake_file), "..", "temp_repos", job_id)
temp_dir = os.path.abspath(temp_dir)

os.makedirs(os.path.dirname(temp_dir), exist_ok=True)
env = os.environ.copy()
env["GIT_TERMINAL_PROMPT"] = "0"
subprocess.run([git_exe, "clone", "--depth=1", "https://github.com/mauryas69/student-project-analyzer", temp_dir],
               capture_output=True, text=True, timeout=60, env=env)

print("ALL files in clone (no filtering):")
for root, dirs, files in os.walk(temp_dir):
    for f in files:
        rel = os.path.relpath(os.path.join(root, f), temp_dir)
        print(" ", rel)

import shutil
shutil.rmtree(temp_dir, onerror=lambda f,p,e: (os.chmod(p, stat.S_IWRITE), f(p)))
