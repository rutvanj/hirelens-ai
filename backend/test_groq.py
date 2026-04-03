import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from llm_service import extract_candidate_skills

# Test 1: Uncommon skills (Next.js, FastAPI, Redis)
resume_text = """
Senior Full Stack Developer with 5 years of experience.
Built scalable APIs using FastAPI and deployed them with Docker on AWS.
Frontend work in Next.js, TypeScript and Tailwind CSS.
Managed Redis caches, PostgreSQL databases, and used Celery for task queues.
"""

print("=== TEST: LLM Dynamic Skill Extraction ===\n")
print("Input Text:", resume_text.strip()[:100], "...")
skills = extract_candidate_skills(resume_text)
print(f"\n✅ Extracted {len(skills)} skills: {skills}")

# Test 2: Job Description Extraction
job_text = "We need a developer skilled in React, Node.js, GraphQL, and Kubernetes."
print("\n--- Test 2: Job Description ---")
job_skills = extract_candidate_skills(job_text)
print(f"✅ Job Skills: {job_skills}")

# Test 3: Verify matching logic
print("\n--- Test 3: Matching Resume vs Job ---")
resume_skills2 = extract_candidate_skills("Experience with React, TypeScript, Node.js and REST APIs.")
matched = [s for s in job_skills if s in resume_skills2]
missing = [s for s in job_skills if s not in resume_skills2]
print(f"✅ Matched: {matched}")
print(f"⚠️  Missing: {missing}")
