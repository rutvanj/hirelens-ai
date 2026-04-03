from resume_checker import analyze_resume

resume_text = "Python developer with 5 years experience in machine learning and SQL"
job_desc = "Python, SQL, Machine Learning"

result = analyze_resume(resume_text, job_desc, None) # No LinkedIn data for this test

print(f"Resume Skills: {result['skills']}")
print(f"Matched Skills: { [s for s in result['skills'] if s in [ "python", "sql", "machine learning" ]] }")
print(f"Resume Score: {result['resume_score']}%")
print(f"Match Score: {result['match_score']}%")
