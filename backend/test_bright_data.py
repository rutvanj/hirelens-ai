from resume_checker import analyze_resume

def test_bright_data_logic():
    # Mock Bright Data Response (List format)
    bright_data = [
        {
            "name": "Bright User",
            "headline": "Full Stack Engineer | Python Expert",
            "current_company_name": "Tech Corp",
            "skills": ["Python", "SQL", "Docker"],
            "experience": [
                {
                    "title": "Backend Lead",
                    "company": "Tech Corp",
                    "description": "Building scalable microservices with Kubernetes and AWS"
                }
            ],
            "education": [
                {
                    "degree": "B.S. Computer Science",
                    "field_of_study": "Machine Learning"
                }
            ]
        }
    ]

    print("--- Test: Bright Data Parsing ---")
    res = analyze_resume("I know C++", "Python, AWS, Kubernetes, Machine Learning", bright_data)
    
    print(f"Resume Score: {res['resume_score']}%")
    print(f"Match Score: {res['match_score']}%")
    print(f"Skills: {res['skills']}")
    print(f"Profile: {res['linkedin_profile']['name']} @ {res['linkedin_profile']['company']}")
    
    # Verify score boost
    # Resume: C++ (10)
    # LinkedIn unique: Python, SQL, Docker, Kubernetes, AWS, Machine Learning (6) -> +20 bonus
    # Total: 10 + 20 = 30
    assert res['resume_score'] == 30
    print("✅ Score Boost Verified (Capped at 20)")

    # Verify skill merge
    assert "python" in res['skills']
    assert "kubernetes" in res['skills']
    assert "machine learning" in res['skills']
    print("✅ Skill Merging Verified")

if __name__ == "__main__":
    test_bright_data_logic()
