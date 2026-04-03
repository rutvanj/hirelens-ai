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
            "linkedin_error": str(e)
        }

from llm_service import extract_candidate_skills

def _analyze_logic(resume, job_desc, pdl_data=None):
    resume = resume.lower() if resume else ""
    job_desc = job_desc.lower() if job_desc else ""

    print("\n--- LLM EXTRACTION PHASE ---")
    resume_skills = extract_candidate_skills(resume)
    job_skills = extract_candidate_skills(job_desc)

    # -------- BRIGHT DATA PROCESSING --------
    linkedin_skills = []
    linkedin_profile = None
    linkedin_suggestions = []
    linkedin_error = None

    if pdl_data:
        # Bright Data often returns a list
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

            # Normalizing Experience and Education for LLM Extraction
            linkedin_text = ""
            if data.get("headline"):
                linkedin_text += data.get("headline") + "\n"
            
            experience = data.get("experience", [])
            if isinstance(experience, list):
                for exp in experience:
                    if isinstance(exp, dict):
                        linkedin_text += exp.get("title", "") + " " + exp.get("description", "") + "\n"
                        
            education = data.get("education", [])
            if isinstance(education, list):
                for edu in education:
                    if isinstance(edu, dict):
                        linkedin_text += edu.get("field_of_study", "") + " " + edu.get("degree", "") + "\n"
            
            # Combine any hardcoded skills returned
            raw_li_skills = []
            if data.get("skills"):
                 raw_li_skills = [s.get("name") for s in data.get("skills") if isinstance(s, dict)]
            
            # LLM Dynamic Extraction
            extracted_li = []
            if linkedin_text.strip():
                extracted_li = extract_candidate_skills(linkedin_text)

            # Deduplicate
            linkedin_skills = sorted(list(set(raw_li_skills + extracted_li)))

            # Suggestions
            if not data.get("headline"):
                linkedin_suggestions.append("Improve your LinkedIn headline to be more descriptive.")
            if not data.get("about") and not data.get("summary"):
                linkedin_suggestions.append("Add an 'About' section to your LinkedIn profile.")
            
            skills_list = data.get("skills", [])
            if isinstance(skills_list, list) and len(skills_list) < 5:
                linkedin_suggestions.append("Add more skills to your LinkedIn profile.")
            
            if not experience:
                linkedin_suggestions.append("Add work history to your LinkedIn profile.")

    # -------- MERGE SKILLS --------
    merged_skills = sorted(list(set(resume_skills + linkedin_skills)))

    matched = [skill for skill in job_skills if skill in merged_skills]
    missing = [skill for skill in job_skills if skill not in merged_skills]

    # -------- SCORING --------
    if len(job_skills) > 0:
        match_score = int((len(matched) / len(job_skills)) * 100)
    else:
        match_score = 0

    unique_li_skills = [s for s in linkedin_skills if s not in resume_skills]
    linkedin_bonus = min(len(unique_li_skills) * 5, 20)

    resume_score = min((len(resume_skills) * 10) + linkedin_bonus, 100)

    for m in missing[:3]:
        if m not in linkedin_skills:
            linkedin_suggestions.append(f"Consider adding '{m.upper()}' to your LinkedIn skills.")

    return {
        "resume_score": resume_score,
        "match_score": match_score,
        "skills": merged_skills,
        "missing": missing,
        "linkedin_profile": linkedin_profile,
        "linkedin_raw_data": data if 'data' in locals() else None,
        "linkedin_skills": linkedin_skills,
        "linkedin_suggestions": linkedin_suggestions[:6],
        "linkedin_error": linkedin_error
    }