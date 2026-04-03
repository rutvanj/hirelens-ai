import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# xAI (Grok) is OpenAI-compatible — same code, different endpoint + model
XAI_MODE = GROQ_API_KEY and GROQ_API_KEY.startswith("xai-")


def _call_llm(prompt, label="LLM"):
    """Shared internal helper: sends a prompt to Groq/xAI; returns parsed JSON dict or None."""
    if not GROQ_API_KEY:
        print(f"WARNING: GROQ_API_KEY not found. Skipping {label}.")
        return None

    if XAI_MODE:
        url = "https://api.x.ai/v1/chat/completions"
        model = "grok-3-mini"
    else:
        url = "https://api.groq.com/openai/v1/chat/completions"
        model = "llama-3.3-70b-versatile"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1,
        "response_format": {"type": "json_object"}
    }

    print(f"\n--- [DEBUG] Groq Call: {label} ---")
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        if response.status_code == 200:
            content = response.json()["choices"][0]["message"]["content"]
            print(f"[DEBUG] {label} Raw Response: {content.strip()[:200]}")
            return json.loads(content)
        else:
            print(f"[ERROR] {label} API error {response.status_code}: {response.text[:200]}")
            return None
    except json.JSONDecodeError as e:
        print(f"[ERROR] {label} JSON parse error: {e}")
        return None
    except Exception as e:
        print(f"[ERROR] {label} Exception: {e}")
        return None


def validate_percentage(value):
    """Ensure a value is a valid integer between 0 and 100. Returns safe clamped int."""
    try:
        v = int(float(value))
        return max(0, min(100, v))
    except (TypeError, ValueError):
        return 0


def extract_candidate_skills(text):
    """Extract professional skills from free-form text. Returns list of lowercase strings."""
    if not text or not text.strip():
        return []

    prompt = f"""Extract all professional skills (programming languages, frameworks, tools, platforms, methodologies, cloud services, databases) from the following text.
Return ONLY valid JSON in this exact format:
{{ "skills": ["skill1", "skill2"] }}

Text:
{text[:3000]}"""

    result = _call_llm(prompt, "ExtractSkills")
    if result:
        skills = result.get("skills", [])
        normalized = [str(s).lower().strip() for s in skills if isinstance(s, str) and s.strip()]
        print(f"[DEBUG] ExtractSkills Result: {normalized}")
        return normalized
    return []


def normalize_skills(skills_list):
    """Normalize a list of skills to standard industry names, removing duplicates."""
    if not skills_list:
        return []

    skills_str = ", ".join(skills_list)
    prompt = f"""Normalize these skills into standard industry names. Rules:
- Merge duplicates (ReactJS, React.js, React → react)
- Lowercase all
- Use the most widely accepted form (e.g. "node.js" not "nodejs")
- Remove any non-skill words
Return ONLY valid JSON:
{{ "normalized_skills": ["skill1", "skill2"] }}

Skills: {skills_str}"""

    result = _call_llm(prompt, "NormalizeSkills")
    if result:
        normalized = result.get("normalized_skills", skills_list)
        normalized = [str(s).lower().strip() for s in normalized if isinstance(s, str) and s.strip()]
        # Deduplicate while preserving order
        seen = set()
        deduped = [s for s in normalized if not (s in seen or seen.add(s))]
        print(f"[DEBUG] NormalizeSkills Result: {deduped}")
        return deduped
    return skills_list


def extract_job_requirements(job_description):
    """Extract structured job requirements from a job description."""
    if not job_description or not job_description.strip():
        return {"required_skills": [], "nice_to_have": [], "role": "", "seniority": ""}

    prompt = f"""Analyze this job description and extract structured requirements.
Return ONLY valid JSON in this exact format:
{{
  "required_skills": ["skill1", "skill2"],
  "nice_to_have": ["skill3", "skill4"],
  "role": "Job title / role name",
  "seniority": "junior|mid|senior|lead|principal"
}}

Job Description:
{job_description[:3000]}"""

    result = _call_llm(prompt, "ExtractJobReqs")
    if result:
        # Normalize skill arrays
        result["required_skills"] = [str(s).lower().strip() for s in result.get("required_skills", []) if s]
        result["nice_to_have"] = [str(s).lower().strip() for s in result.get("nice_to_have", []) if s]
        print(f"[DEBUG] ExtractJobReqs Result: role={result.get('role')}, seniority={result.get('seniority')}, required={result.get('required_skills')}")
        return result
    return {"required_skills": [], "nice_to_have": [], "role": "", "seniority": ""}


def generate_suggestions(candidate_skills, missing_skills, role="", seniority=""):
    """Generate personalized career improvement suggestions."""
    if not missing_skills and not candidate_skills:
        return {"resume_tips": [], "skills_to_learn": []}

    prompt = f"""You are an expert career coach and recruiter. Based on this candidate profile, generate specific, actionable suggestions.

Candidate Skills: {", ".join(candidate_skills[:30]) if candidate_skills else "None"}
Missing Skills (from job requirements): {", ".join(missing_skills[:15]) if missing_skills else "None"}
Target Role: {role or "Not specified"}
Seniority Level: {seniority or "Not specified"}

Return ONLY valid JSON:
{{
  "resume_tips": [
    "Specific tip 1 about resume formatting or content",
    "Specific tip 2"
  ],
  "skills_to_learn": [
    "Skill name: Why it matters and how to learn it",
    "Skill name: Why it matters and how to learn it"
  ]
}}

Make tips specific to the role and missing skills. Maximum 4 items each."""

    result = _call_llm(prompt, "GenerateSuggestions")
    if result:
        print(f"[DEBUG] GenerateSuggestions: tips={len(result.get('resume_tips', []))}, skills={len(result.get('skills_to_learn', []))}")
        return {
            "resume_tips": result.get("resume_tips", [])[:4],
            "skills_to_learn": result.get("skills_to_learn", [])[:4]
        }
    return {"resume_tips": [], "skills_to_learn": []}


def estimate_hiring_probability(candidate_skills, missing_skills, experience_summary="", job_role=""):
    """Estimate the probability of a candidate being hired for a role."""
    fallback = {"hiring_probability": 50, "reasoning": "Estimation unavailable — using neutral default.", "confidence": 50}
    if not candidate_skills:
        return fallback

    prompt = f"""You are a senior technical recruiter with 10+ years of experience. Analyze this candidate and estimate their hiring probability.

Candidate Skills: {", ".join(candidate_skills[:30]) if candidate_skills else "None"}
Missing Skills (required by job): {", ".join(missing_skills[:15]) if missing_skills else "None"}
Experience Summary: {experience_summary[:500] if experience_summary else "Not provided"}
Target Role: {job_role or "Not specified"}

Consider:
- Skill coverage ratio (most important)
- Seniority signals from experience
- Criticality of missing skills
- Market demand for candidate's existing skills

Return ONLY valid JSON with exactly these three keys:
{{
  "hiring_probability": <integer 0-100>,
  "confidence": <integer 0-100, how confident you are in this estimate>,
  "reasoning": "<2-3 sentences explaining the score, be specific about strengths and gaps>"
}}"""

    try:
        result = _call_llm(prompt, "HiringProbability")
        if result:
            prob = validate_percentage(result.get("hiring_probability", 50))
            confidence = validate_percentage(result.get("confidence", 50))
            reasoning = str(result.get("reasoning", "")).strip()
            if not reasoning:
                reasoning = fallback["reasoning"]
            print(f"[DEBUG] HiringProbability: {prob}% (confidence {confidence}%) — {reasoning[:80]}")
            return {"hiring_probability": prob, "reasoning": reasoning, "confidence": confidence}
        return fallback
    except Exception as e:
        print(f"[ERROR] estimate_hiring_probability crashed: {e}")
        return fallback


def suggest_career_paths(candidate_skills):
    """Suggest career paths based on candidate's current skill set."""
    fallback = {"jobs_now": [], "jobs_after_learning": []}
    if not candidate_skills:
        return fallback

    prompt = f"""You are a career advisor. Based on these skills, suggest realistic career opportunities.

Candidate Skills: {", ".join(candidate_skills[:30])}

Return ONLY valid JSON:
{{
  "jobs_now": [
    {{"title": "Job Title", "match_reason": "Why they qualify now"}},
    {{"title": "Job Title", "match_reason": "Why they qualify now"}}
  ],
  "jobs_after_learning": [
    {{"title": "Job Title", "skills_needed": ["skill1", "skill2"], "potential": "High/Medium/Low"}},
    {{"title": "Job Title", "skills_needed": ["skill1", "skill2"], "potential": "High/Medium/Low"}}
  ]
}}

Provide 3-4 items per category. Be specific and realistic."""

    result = _call_llm(prompt, "CareerPaths")
    if result:
        jobs_now = result.get("jobs_now", [])[:4]
        jobs_after = result.get("jobs_after_learning", [])[:4]
        print(f"[DEBUG] CareerPaths: {len(jobs_now)} now, {len(jobs_after)} after learning")
        return {"jobs_now": jobs_now, "jobs_after_learning": jobs_after}
    return fallback

