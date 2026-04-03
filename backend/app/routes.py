import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.schemas import AnalysisResult, Breakdown, ResumeSuggestion, InterviewQuestions, Metrics
from app.analyzer import analyze_repository
from app.llm import client

router = APIRouter()

# In-memory storage for hackathon synchronous flow
ANALYSIS_DB = {}

class AnalyzeRequest(BaseModel):
    repo_url: str

@router.post("/analyze")
async def analyze(req: AnalyzeRequest):
    if not req.repo_url.startswith("https://github.com/"):
        raise HTTPException(status_code=400, detail="Invalid GitHub URL")
        
    try:
        report = analyze_repository(req.repo_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze repository: {str(e)}")
        
    metrics = report["metrics"]
    
    cd = metrics["comment_density"]
    total_lines = metrics["total_lines"]
    tests_detected = metrics["tests_detected"]
    readme_present = metrics["readme_present"]
    total_files = metrics.get("total_files", 0)
    
    # Deterministic scoring logic
    code_quality = max(0, min(100, int(60 + cd * 40)))
    documentation = 85 if readme_present else 40
    testing = 90 if tests_detected else 30
    architecture = 80 if total_files > 5 else 50
    scalability = 75 if total_lines > 500 else 55
    
    industry_score = int((code_quality + documentation + testing + architecture + scalability) / 5)
    
    if industry_score >= 85:
        status = "Exceptional"
    elif industry_score >= 65:
        status = "Internship Ready"
    else:
        status = "Needs Improvement"
    
    # ----------------------------------------------------
    # LLM Parsing Layer with Groq (Llama 3 8B)
    # ----------------------------------------------------
    prompt = f"""You are a strict senior engineer reviewing a student GitHub project.
Metrics:
- Total lines: {total_lines}
- Languages: {', '.join(metrics.get("languages_detected", []))}
- Comment density: {cd}
- Tests detected: {tests_detected}
- README present: {readme_present}
- Complexity score: {metrics.get("complexity_score", 0)}

Return JSON ONLY in format:
{{
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "resume_suggestions": [
    {{"original": "...", "improved": "..."}}
  ],
  "interview_questions": {{
    "basic": ["...", "..."],
    "intermediate": ["...", "..."],
    "advanced": ["...", "..."]
  }}
}}"""

    llm_output = {}
    if client:
        try:
            completion = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            content = completion.choices[0].message.content.strip()
            # Failsafe against markdown formats common in LLMs
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
            llm_output = json.loads(content)
        except Exception as e:
            print(f"LLM Parsing Failed: {e}")
            llm_output = {}
    
    # Safely extract LLM outputs with fallbacks ensuring pure typescript schema compliance
    strengths = llm_output.get("strengths") or [
        "Modular functional setup", 
        "Valid architectural structures mapped", 
        "Codebases structured explicitly"
    ]
    weaknesses = llm_output.get("weaknesses") or [
        "Test coverage needs strict improvement",
        "README documentation could detail setup steps more extensively",
        "Variable typing requires stricter casting"
    ]
    
    resume_raw = llm_output.get("resume_suggestions", [
        {"original": "Created an app", "improved": f"Architected a multi-tier application containing {total_lines} LOC."},
        {"original": "Used coding environments", "improved": "Bootstrapped component trees executing safely via optimized logical blocks."}
    ])
    
    resume_suggestions = [ResumeSuggestion(**res) for res in resume_raw]

    questions_raw = llm_output.get("interview_questions", {})
    interview_questions = InterviewQuestions(
        basic=questions_raw.get("basic", ["Can you explain the directory patterns used?"]),
        intermediate=questions_raw.get("intermediate", ["Why did you choose this schema validation pipeline?"]),
        advanced=questions_raw.get("advanced", ["How would you rewrite the main loops to achieve higher temporal locality?"])
    )

    result = AnalysisResult(
        industry_score=industry_score,
        status=status,
        breakdown=Breakdown(
            code_quality=code_quality,
            architecture=architecture,
            documentation=documentation,
            testing=testing,
            scalability=scalability
        ),
        strengths=strengths,
        weaknesses=weaknesses,
        resume_suggestions=resume_suggestions,
        interview_questions=interview_questions,
        metrics=Metrics(
            total_lines=total_lines,
            avg_function_length=metrics.get("avg_function_length", 0),
            complexity_score=metrics.get("complexity_score", 0),
            comment_density=cd,
            tests_detected=tests_detected,
            readme_present=readme_present,
            languages_detected=metrics.get("languages_detected", [])
        )
    )
    
    ANALYSIS_DB[report["job_id"]] = result
    
    return {"job_id": report["job_id"]}

@router.get("/analysis-status/{job_id}")
async def analysis_status(job_id: str):
    if job_id not in ANALYSIS_DB:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"status": "completed"}

@router.get("/analysis-result/{job_id}", response_model=AnalysisResult)
async def analysis_result(job_id: str):
    if job_id not in ANALYSIS_DB:
        raise HTTPException(status_code=404, detail="Job not found")
    return ANALYSIS_DB[job_id]
