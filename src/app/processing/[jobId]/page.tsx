"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Circle, Code2, Loader2, Database, Shield, FileText } from "lucide-react";

const STEPS = [
    { id: "fetch", label: "Fetching repository data", icon: Database },
    { id: "stack", label: "Detecting technology stack", icon: FileText },
    { id: "ast", label: "Running AST static analysis", icon: Code2 },
    { id: "architecture", label: "Evaluating architecture patterns", icon: Shield },
    { id: "calculate", label: "Calculating industry score", icon: CheckCircle2 },
];

export default function ProcessingPage() {
    const params = useParams();
    const router = useRouter();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        let stepInterval: NodeJS.Timeout;
        let pollInterval: NodeJS.Timeout; // eslint-disable-line prefer-const

        // Animate steps visually while polling backend
        stepInterval = setInterval(() => {
            setCurrentStepIndex(prev => {
                if (prev < STEPS.length - 1) return prev + 1;
                return prev;
            });
        }, 2000);

        // Poll backend for completion
        const poll = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const res = await fetch(`${API_URL}/analysis-status/${params.jobId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === "completed") {
                        clearInterval(stepInterval);
                        clearInterval(pollInterval);
                        setCurrentStepIndex(STEPS.length);
                        setTimeout(() => router.push(`/results/${params.jobId}`), 500);
                    }
                }
            } catch {
                // Backend not ready yet — keep polling
            }
        };

        // Start polling immediately, then every 2s
        poll();
        pollInterval = setInterval(poll, 2000);

        return () => {
            clearInterval(stepInterval);
            clearInterval(pollInterval);
        };
    }, [params.jobId, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-2xl mx-auto w-full px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-white mb-2">Analyzing Project</h1>
                <p className="text-muted-foreground font-mono text-sm">JOB ID: {params.jobId}</p>
            </div>

            <div className="w-full bg-card border border-border rounded-xl p-8 shadow-sm">
                <div className="space-y-8">
                    {STEPS.map((step, index) => {
                        const isCompleted = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="flex flex-row items-center relative">

                                {/* Connecting Line */}
                                {index !== STEPS.length - 1 && (
                                    <div
                                        className={`absolute left-5 top-10 w-0.5 h-full -ml-[1px] transition-colors duration-500
                    ${isCompleted ? "bg-emerald-500" : "bg-border"}
                  `} />
                                )}

                                {/* Status Indicator */}
                                <div className="relative z-10 flex-shrink-0 mr-6">
                                    {isCompleted ? (
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    ) : isCurrent ? (
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground">
                                            <Circle className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>

                                {/* Main Content */}
                                <div className="flex-1">
                                    <h3 className={`text-lg font-medium transition-colors duration-300 flex items-center
                    ${isCompleted ? "text-emerald-400" : isCurrent ? "text-white" : "text-slate-500"}
                  `}>
                                        <Icon className="w-4 h-4 mr-2 opacity-70" />
                                        {step.label}
                                    </h3>
                                    {isCurrent && (
                                        <p className="text-sm tracking-widest uppercase text-blue-400 mt-1 animate-pulse ease-in-out">
                                            Processing...
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
