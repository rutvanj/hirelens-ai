from resume_checker import analyze_resume

def test_logic():
    # Test Case 1: Simple Resume (No LinkedIn)
    print("Test 1: Simple Resume (No LinkedIn)")
    res = analyze_resume("I know Python and SQL", "Python, SQL, Java")
    print(f"Score: {res['resume_score']}%, Match: {res['match_score']}%")
    print(f"Skills: {res['skills']}")
    
    # Test Case 2: Resume + LinkedIn (New Skills)
    print("\nTest 2: Resume + LinkedIn (New Skills)")
    pdl_data = {
        "data": {
            "full_name": "Test User",
            "headline": "Python Developer",
            "skills": ["Java", "C++"],
            "experience": [{"description": "Worked with TensorFlow"}],
            "education": [{"major": "Machine Learning"}]
        }
    }
    # Resume has Python, LinkedIn adds Java, C++, TensorFlow, Machine Learning
    # unique_li_skills = [Java, C++, TensorFlow, Machine Learning] -> 4 skills -> +20 bonus
    # Original resume score: 10 (Python) -> 10 + 20 = 30
    res = analyze_resume("I know Python", "Python, Java, C++, TensorFlow", pdl_data)
    print(f"Score: {res['resume_score']}% (Expected: 30%)")
    print(f"Match: {res['match_score']}%")
    print(f"Skills: {res['skills']}")
    
    # Test Case 3: API Error Handling
    print("\nTest 3: API Error Handling")
    pdl_error = {"error": "Profile not found"}
    res = analyze_resume("I know Python", "Python", pdl_error)
    print(f"Error: {res['linkedin_error']}")
    print(f"Score: {res['resume_score']}%")

    # Test Case 4: Max Bonus Cap
    print("\nTest 4: Max Bonus Cap")
    pdl_many_skills = {
        "data": {
            "skills": ["Python", "SQL", "Java", "C++", "AWS", "Docker", "Kubernetes"]
        }
    }
    res = analyze_resume("I know Python", "Python", pdl_many_skills)
    # unique = [SQL, Java, C++, AWS, Docker, Kubernetes] -> 6 skills -> +30 bonus -> capped at +20
    # Original: 10 -> 10 + 20 = 30
    print(f"Score: {res['resume_score']}% (Expected: 30%)")

if __name__ == "__main__":
    test_logic()
