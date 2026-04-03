import { NextResponse } from "next/server";
import { AnalysisResult } from "@/lib/types";

export async function GET() {
    const mockData: AnalysisResult = {
        industry_score: 87,
        status: "Exceptional",
        breakdown: {
            code_quality: 92,
            architecture: 88,
            documentation: 75,
            testing: 94,
            scalability: 89
        },
        strengths: [
            "Modular components with clear responsibility patterns",
            "Robust state management using modern React hooks",
            "High test coverage across critical business logic",
            "Efficient performance optimization via code splitting"
        ],
        weaknesses: [
            "Missing automated documentation for internal utility functions",
            "Potential for memory leaks in long-running polling mechanisms",
            "Limited usage of error boundaries in nested children"
        ],
        resume_suggestions: [
            {
                original: "Developed a Next.js application",
                improved: "Engineered a high-performance Next.js SaaS architecture featuring real-time data visualization and 90% test coverage."
            },
            {
                original: "Used React hooks for state",
                improved: "Implemented advanced React state management patterns reducing re-render overhead by 35%."
            },
            {
                original: "Implemented API polling",
                improved: "Architected a resource-efficient async job processing pipeline with status polling and error recovery."
            }
        ],
        interview_questions: {
            basic: [
                "What was the biggest technical challenge you faced with this project?",
                "How did you manage global styles across the application?"
            ],
            intermediate: [
                "Why did you choose a client-side polling approach instead of WebSockets or SSE?",
                "How do you ensure your components remain performant when data updates frequently?"
            ],
            advanced: [
                "Explain the trade-offs of using Recharts in a production-scale dashboard.",
                "How would you implement a circuit-breaker pattern if the analysis backend becomes unresponsive?"
            ]
        },
        metrics: {
            total_lines: 24500,
            avg_function_length: 14,
            complexity_score: 3.8,
            comment_density: 0.18,
            tests_detected: true,
            readme_present: true,
            languages_detected: ["TypeScript", "Next.js", "Tailwind CSS", "Recharts"]
        }
    };

    return NextResponse.json(mockData);
}
