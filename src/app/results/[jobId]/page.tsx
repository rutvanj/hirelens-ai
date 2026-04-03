"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip
} from "recharts";
import { Check, Copy, ChevronDown, ChevronRight, AlertTriangle, Lightbulb, TrendingUp, MessagesSquare, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { AnalysisResult } from "@/lib/types";

export default function ResultsDashboard() {
    const params = useParams();
    const [data, setData] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Specific UI States
    const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [metricsExpanded, setMetricsExpanded] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${API_URL}/analysis-result/${params.jobId}`, {
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch analysis: ${res.statusText}`);
            }

            const json: AnalysisResult = await res.json();
            setData(json);
        } catch (err: unknown) {
            console.error("Fetch error:", err);
            setError(err instanceof Error ? err.message : "An unexpected error occurred while loading results.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [params.jobId]);

    const toggleAccordion = (key: string) => {
        setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const copyToClipboard = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-primary animate-spin"></div>
                <p className="text-slate-400 font-medium animate-pulse">Retrieving technical analysis...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
                <div className="bg-card border border-danger/30 rounded-xl p-8 max-w-lg text-center shadow-lg">
                    <AlertTriangle className="w-12 h-12 text-danger mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
                    <p className="text-slate-400 mb-6 font-medium">
                        {error || "The analysis result could not be retrieved at this time."}
                    </p>
                    <button
                        onClick={() => fetchData()}
                        className="inline-flex h-11 items-center justify-center rounded-md bg-primary/10 text-primary px-6 font-semibold transition-colors hover:bg-primary/20 border border-primary/30"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    // Formatting Radar Chart data from API breakdown
    const radarData = [
        { subject: 'Code Quality', A: data.breakdown.code_quality, fullMark: 100 },
        { subject: 'Architecture', A: data.breakdown.architecture, fullMark: 100 },
        { subject: 'Documentation', A: data.breakdown.documentation, fullMark: 100 },
        { subject: 'Testing', A: data.breakdown.testing, fullMark: 100 },
        { subject: 'Scalability', A: data.breakdown.scalability, fullMark: 100 },
    ];

    return (
        <div className="flex flex-col gap-10 max-w-6xl mx-auto pb-16">

            {/* 1. Score Overview */}
            <section className="bg-card border border-border rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 mt-2 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]"></div>
                <div className="z-10">
                    <h2 className="text-xl font-bold text-slate-300 mb-2">Overall Industry Score</h2>
                    <div className="flex items-baseline gap-4">
                        <span className="text-6xl font-black text-white">{data.industry_score}</span>
                        <span className="text-xl text-muted-foreground font-medium">/ 100</span>
                    </div>
                </div>
                <div className="z-10 flex flex-col items-center">
                    <div className="inline-flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-6 py-2 text-sm font-bold uppercase tracking-widest mb-4">
                        {data.status}
                    </div>
                    <Link href="/analyze" className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4">
                        Analyze another project
                    </Link>
                </div>
            </section>

            {/* 2. Breakdown Chart */}
            <section className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-border pb-4">Architectural Breakdown</h3>
                <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#334155" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 13 }} />
                            <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#3b82f6' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* 3. Strength Weakness Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                        <TrendingUp className="text-emerald-500 w-5 h-5" />
                        <h3 className="text-lg font-bold text-white">Identified Strengths</h3>
                    </div>
                    <ul className="space-y-4">
                        {data.strengths.map((s, i) => (
                            <li key={i} className="flex gap-3 text-slate-300 text-sm">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                        <AlertTriangle className="text-amber-500 w-5 h-5" />
                        <h3 className="text-lg font-bold text-white">Critical Weaknesses</h3>
                    </div>
                    <ul className="space-y-4">
                        {data.weaknesses.map((w, i) => (
                            <li key={i} className="flex gap-3 text-slate-300 text-sm">
                                <div className="min-w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                <span>{w}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 4. Interview Questions Accordion */}
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                    <MessagesSquare className="text-blue-500 w-5 h-5" />
                    <h3 className="text-lg font-bold text-white">Predicted Interview Questions</h3>
                </div>
                <div className="space-y-3">
                    {Object.entries(data.interview_questions).map(([level, questions]) => (
                        <div key={level} className="border border-border rounded-lg overflow-hidden bg-background">
                            <button
                                onClick={() => toggleAccordion(level)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors"
                            >
                                <span className="font-semibold text-white capitalize">{level} Technical Check</span>
                                {openAccordions[level] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                            </button>
                            {openAccordions[level] && (
                                <div className="p-4 pt-0 border-t border-border mt-1">
                                    <ul className="list-disc pl-5 space-y-2 mt-3 text-sm text-slate-300">
                                        {(questions as string[]).map((q, i) => (
                                            <li key={i} className="leading-relaxed">{q}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Resume Suggestion Cards */}
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                    <Lightbulb className="text-amber-400 w-5 h-5" />
                    <h3 className="text-lg font-bold text-white">Resume Impact Optimization</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.resume_suggestions.map((s, i) => (
                        <div key={i} className="flex flex-col border border-border rounded-lg bg-background overflow-hidden relative group">
                            <div className="p-4 border-b border-border/50">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Original phrasing</p>
                                <p className="text-sm text-slate-400 line-through decoration-slate-600">{s.original}</p>
                            </div>
                            <div className="p-4 bg-blue-500/5 relative">
                                <p className="text-xs uppercase tracking-wider text-blue-400 mb-2 font-medium">Suggested phrasing</p>
                                <p className="text-sm text-slate-100 font-medium leading-relaxed pr-10">{s.improved}</p>
                                <button
                                    onClick={() => copyToClipboard(s.improved, i)}
                                    className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-white transition-colors"
                                    title="Copy to clipboard"
                                >
                                    {copiedIndex === i ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. Detailed Metrics Expandable */}
            <section className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                <button
                    onClick={() => setMetricsExpanded(!metricsExpanded)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/50 transition-colors"
                >
                    <h3 className="text-lg font-bold text-white">Raw Technical Metrics</h3>
                    {metricsExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </button>

                {metricsExpanded && (
                    <div className="p-6 pt-0 border-t border-border">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            {Object.entries(data.metrics).map(([k, v]) => (
                                <div key={k} className="p-4 rounded-lg bg-background border border-border/50">
                                    <p className="text-xs text-muted-foreground uppercase mb-1 truncate" title={k.replace(/_/g, " ")}>
                                        {k.replace(/_/g, " ")}
                                    </p>
                                    <p className="text-lg font-mono font-medium text-slate-200">
                                        {Array.isArray(v) ? v.join(", ") : typeof v === 'boolean' ? (v ? "Yes" : "No") : v}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

        </div>
    );
}

