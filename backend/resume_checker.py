import traceback

def analyze_resume(resume, job_desc, pdl_data=None):
    try:
        return _analyze_logic(resume, job_desc, pdl_data)
    except Exception as e:
        error_msg = f"Error in analyze_resume: {str(e)}\n{traceback.format_exc()}"
        with open("api_debug.log", "a") as f:
            f.write(f"\n--- LOGIC ERROR ---\n{error_msg}\n")
        return {
            "resume_score": 0,
            "match_score": 0,
            "skills": [],
            "missing": [],
            "linkedin_profile": None,
            "linkedin_skills": [],
            "linkedin_suggestions": [f"Error during analysis: {str(e)}"],
            "linkedin_error": str(e),
            "ai_suggestions": {"resume_tips": [], "skills_to_learn": []},
            "job_role": "",
            "job_seniority": ""
        }

from llm_service import (
    extract_candidate_skills,
    normalize_skills,
    extract_job_requirements,
    generate_suggestions,
    estimate_hiring_probability,
    suggest_career_paths,
    validate_percentage
)

def _analyze_logic(resume, job_desc, pdl_data=None):
    resume = resume.lower() if resume else ""
    job_desc = job_desc.lower() if job_desc else ""

    print("\n--- LLM EXTRACTION PHASE ---")

    # --- Step 1: Extract raw skills ---
    raw_resume_skills = extract_candidate_skills(resume)

    # --- Step 2: Extract structured job requirements ---
    job_reqs = extract_job_requirements(job_desc)
    job_role = job_reqs.get("role", "")
    job_seniority = job_reqs.get("seniority", "")
    job_skills = job_reqs.get("required_skills", [])
    nice_to_have = job_reqs.get("nice_to_have", [])

    # --- Step 3: Normalize resume skills ---
    resume_skills = normalize_skills(raw_resume_skills)

    # -------- BRIGHT DATA PROCESSING --------
    linkedin_skills = []
    linkedin_profile = None
    linkedin_suggestions = []
    linkedin_error = None
    data = None

    if pdl_data:
        if isinstance(pdl_data, list) and len(pdl_data) > 0:
            data = pdl_data[0]
        elif isinstance(pdl_data, dict):
            if "error" in pdl_data:
                linkedin_error = pdl_data["error"]
                data = None
            elif "data" in pdl_data and isinstance(pdl_data["data"], dict):
                data = pdl_data["data"]
            else:
                data = pdl_data
        else:
            data = None

        if data and isinstance(data, dict):
            # Profile Info
            linkedin_profile = {
                "name": data.get("name") or f"{data.get('first_name', '')} {data.get('last_name', '')}".strip(),
                "headline": data.get("headline"),
                "title": data.get("current_company_position") or (data.get("experience", [{}])[0].get("title") if data.get("experience") else None),
                "company": data.get("current_company_name") or (data.get("experience", [{}])[0].get("company") if data.get("experience") else None),
                "location": data.get("location") or data.get("city")
            }

            # Build linkedin text corpus from profile
            linkedin_text = ""
            if data.get("headline"):
                linkedin_text += data.get("headline") + "\n"
            if data.get("about"):
                linkedin_text += data.get("about") + "\n"

            experience = data.get("experience", [])
            if isinstance(experience, list):
                for exp in experience:
                    if isinstance(exp, dict):
                        linkedin_text += exp.get("title", "") + " " + (exp.get("description") or "") + "\n"

            education = data.get("education", [])
            if isinstance(education, list):
                for edu in education:
                    if isinstance(edu, dict):
                        linkedin_text += (edu.get("field_of_study") or "") + " " + (edu.get("degree") or "") + "\n"

            # Get any hardcoded skills from API response
            raw_li_skills = []
            if data.get("skills"):
                if isinstance(data["skills"], list):
                    for s in data["skills"]:
                        if isinstance(s, dict) and s.get("name"):
                            raw_li_skills.append(s["name"].lower())
                        elif isinstance(s, str):
                            raw_li_skills.append(s.lower())

            # LLM extraction from profile text
            extracted_li = []
            if linkedin_text.strip():
                extracted_li = extract_candidate_skills(linkedin_text)

            # Normalize combined linkedin skills
            combined_li = list(set(raw_li_skills + extracted_li))
            linkedin_skills = normalize_skills(combined_li)

            # Basic profile suggestions
            if not data.get("headline"):
                linkedin_suggestions.append("Add a descriptive LinkedIn headline to attract recruiters.")
            if not data.get("about") and not data.get("summary"):
                linkedin_suggestions.append("Write an 'About' section summarizing your experience and goals.")
            if not experience:
                linkedin_suggestions.append("Add your work history to your LinkedIn profile.")

    # -------- MERGE & MATCH --------
    merged_skills = sorted(list(set(resume_skills + linkedin_skills)))

    # Normalize job skills too for fair comparison
    job_skills = normalize_skills(job_skills) if job_skills else []

    matched = [skill for skill in job_skills if skill in merged_skills]
    missing = [skill for skill in job_skills if skill not in merged_skills]

    # -------- SCORING --------
    match_score = int((len(matched) / len(job_skills)) * 100) if job_skills else 0

    # -------- AI SUGGESTIONS --------
    print("\n--- LLM SUGGESTIONS PHASE ---")
    ai_suggestions = generate_suggestions(
        candidate_skills=merged_skills,
        missing_skills=missing,
        role=job_role,
        seniority=job_seniority
    )

    # -------- HIRING PROBABILITY --------
    print("\n--- LLM HIRING PROBABILITY PHASE ---")
    experience_summary = resume[:800] if resume else ""
    hiring_data = estimate_hiring_probability(
        candidate_skills=merged_skills,
        missing_skills=missing,
        experience_summary=experience_summary,
        job_role=job_role
    )
    hiring_probability = validate_percentage(hiring_data.get("hiring_probability", 50))
    confidence = validate_percentage(hiring_data.get("confidence", 50))

    # -------- FINAL SCORE (Hybrid) --------
    final_score = round((0.7 * match_score) + (0.3 * hiring_probability))

    # -------- CAREER PATHS --------
    print("\n--- LLM CAREER PATHS PHASE ---")
    career_data = suggest_career_paths(candidate_skills=merged_skills)

    # Add missing skill hints to linkedin_suggestions
    for m in missing[:3]:
        linkedin_suggestions.append(f"Consider adding '{m.upper()}' to your LinkedIn skills.")

    return {
        "match_score": match_score,
        "final_score": final_score,
        "skills": merged_skills,
        "missing": missing,
        "linkedin_profile": linkedin_profile,
        "linkedin_raw_data": data,
        "linkedin_skills": linkedin_skills,
        "linkedin_suggestions": linkedin_suggestions[:6],
        "linkedin_error": linkedin_error,
        "job_role": job_role,
        "job_seniority": job_seniority,
        "nice_to_have": nice_to_have,
        "ai_suggestions": ai_suggestions,
        "ai_insights": {
            "hiring_probability": hiring_probability,
            "reasoning": hiring_data.get("reasoning", ""),
            "confidence": confidence
        },
        "career_paths": career_data
    }