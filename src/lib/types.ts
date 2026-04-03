export interface Breakdown {
    code_quality: number;
    architecture: number;
    documentation: number;
    testing: number;
    scalability: number;
}

export interface ResumeSuggestion {
    original: string;
    improved: string;
}

export interface InterviewQuestions {
    basic: string[];
    intermediate: string[];
    advanced: string[];
}

export interface Metrics {
    total_lines: number;
    avg_function_length: number;
    complexity_score: number;
    comment_density: number;
    tests_detected: boolean;
    readme_present: boolean;
    languages_detected: string[];
}

export interface AnalysisResult {
    industry_score: number;
    status: string;
    breakdown: Breakdown;
    strengths: string[];
    weaknesses: string[];
    resume_suggestions: ResumeSuggestion[];
    interview_questions: InterviewQuestions;
    metrics: Metrics;
}
