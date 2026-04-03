import re

# STEP 1: Skill Database
# Modular list of common skills for matching
SKILL_DATABASE = {
    # Programming Languages
    'python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'go', 'php', 'swift', 'kotlin', 'typescript', 'rust',
    # Web Technologies
    'react', 'angular', 'vue', 'node.js', 'flask', 'django', 'express', 'html', 'css', 'sass', 'tailwind',
    # Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'git', 'github', 'gitlab',
    # Databases
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'cassandra', 'elasticsearch', 'oracle',
    # Data & AI
    'pandas', 'numpy', 'scipy', 'tensorflow', 'pytorch', 'scikit-learn', 'data analysis', 'machine learning', 'nlp',
    # Tools & Others
    'linux', 'unix', 'rest api', 'graphql', 'grpc', 'agile', 'scrum', 'jira'
}

def normalize_text(text):
    """
    Normalizes text for better skill matching:
    - Lowercase
    - Remove non-alphanumeric characters (except common ones like .Net, C++, Node.js)
    """
    if not text:
        return ""
    text = text.lower()
    # Keep alphanumeric characters and common special skill markers
    text = re.sub(r'[^a-zA-Z0-9\s.+#-]', ' ', text)
    return text

def extract_skills(text):
    """
    Extracts known skills from the provided text using keyword matching.
    """
    normalized = normalize_text(text)
    # Use word boundaries to avoid partial matches
    found_skills = set()
    for skill in SKILL_DATABASE:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, normalized):
            found_skills.add(skill)
    return found_skills

def analyze_resume(resume_text, job_description):
    """
    Main analysis engine that calculates scores, gaps, and recommendations.
    """
    # 1. Extract Skills
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)
    
    # 2. Match Scores
    matched_skills = resume_skills.intersection(job_skills)
    missing_skills = job_skills - resume_skills
    
    # Match Score: (Matched / Required) * 100
    if len(job_skills) > 0:
        match_score = (len(matched_skills) / len(job_skills)) * 100
    else:
        match_score = 0
        
    # Resume Score: (Unique Skill Count * 10), capped at 100
    resume_score = min(len(resume_skills) * 10, 100)
    
    # 3. Recommendations
    recommendations = []
    if len(resume_skills) < 5:
        recommendations.append("Your resume seems light on technical skills. Try to add more relevant technologies.")
    
    if len(missing_skills) > 0:
        priority_skills = list(missing_skills)[:3]
        recommendations.append(f"Focus on learning these priority missing skills: {', '.join(priority_skills)}.")
        
    if match_score < 50:
        recommendations.append("This resume has a low match for the job description. Consider tailoring your experience more closely.")
    elif match_score >= 80:
        recommendations.append("Strong match! You have most of the required skills for this role.")
    else:
        recommendations.append("Good start! Adding a few more matching skills could significantly boost your ATS score.")

    return {
        "match_score": round(match_score),
        "resume_score": round(resume_score),
        "matched_skills": sorted(list(matched_skills)),
        "missing_skills": sorted(list(missing_skills)),
        "recommendations": recommendations,
        "resume_skill_count": len(resume_skills)
    }
