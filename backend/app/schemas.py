from pydantic import BaseModel
from typing import List

class Breakdown(BaseModel):
    code_quality: int
    architecture: int
    documentation: int
    testing: int
    scalability: int

class ResumeSuggestion(BaseModel):
    original: str
    improved: str

class InterviewQuestions(BaseModel):
    basic: List[str]
    intermediate: List[str]
    advanced: List[str]

class Metrics(BaseModel):
    total_lines: int
    avg_function_length: int
    complexity_score: int
    comment_density: float
    tests_detected: bool
    readme_present: bool
    languages_detected: List[str]

class AnalysisResult(BaseModel):
    industry_score: int
    status: str
    breakdown: Breakdown
    strengths: List[str]
    weaknesses: List[str]
    resume_suggestions: List[ResumeSuggestion]
    interview_questions: InterviewQuestions
    metrics: Metrics
