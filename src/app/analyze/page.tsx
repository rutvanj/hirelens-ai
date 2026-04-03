"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react"; // eslint-disable-line

export default function AnalyzePage() {
    const router = useRouter();
    const [urlInput, setUrlInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRunAnalysis = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const ghPattern = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+(\/?)(\.git)?$/i;

        if (!urlInput.trim()) {
            setError("Please provide a repository URL");
            return;
        }

        if (!ghPattern.test(urlInput)) {
            setError("Invalid GitHub Repository URL. Format: https://github.com/user/repo");
            return;
        }

        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${API_URL}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repo_url: urlInput.trim() }),
            });

            if (!res.ok) {
                const detail = await res.json().catch(() => ({ detail: res.statusText }));
                throw new Error(detail.detail || "Backend returned an error");
            }

            const { job_id } = await res.json();
            router.push(`/processing/${job_id}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to contact analysis engine.");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Initiate Analysis</h1>
                    <p className="text-muted-foreground">Select a repository source for the evaluation engine.</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>

                    <form onSubmit={handleRunAnalysis}>
                        <div className="mb-6">
                            <label htmlFor="repoUrl" className="block text-sm font-medium text-slate-300 mb-2">
                                GitHub Repository URL
                            </label>
                            <input
                                id="repoUrl"
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="https://github.com/username/repo"
                                disabled={loading}
                                className="w-full h-11 px-4 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder:text-muted-foreground"
                            />
                            {error && (
                                <div className="mt-2 flex items-center text-sm text-danger">
                                    <AlertCircle className="w-4 h-4 mr-1.5" />
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="relative flex items-center py-5">
                            <div className="flex-grow border-t border-border"></div>
                            <span className="flex-shrink-0 mx-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">or</span>
                            <div className="flex-grow border-t border-border"></div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Upload ZIP File
                            </label>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-background/50 text-center hover:bg-background/80 transition-colors cursor-pointer opacity-50">
                                <p className="text-sm font-medium text-white mb-1">Click to select file</p>
                                <p className="text-xs text-muted-foreground">Max 50MB. (Feature disabled in v1)</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-md bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white mr-2 animate-spin"></span>
                                    Connecting to Engine...
                                </>
                            ) : (
                                "Analyze Project"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
