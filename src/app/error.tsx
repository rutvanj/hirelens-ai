"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Evaluator Global Alert:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 w-full">
            <div className="bg-card border border-red-500/30 rounded-xl p-8 max-w-lg text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Internal Processor Error</h2>
                <p className="text-slate-400 mb-8 font-medium">
                    The analysis engine encountered a fatal execution error. This is usually due to malformed repository parameters or strict network filtering blocks.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="inline-flex h-11 items-center justify-center rounded-md bg-red-500/10 text-red-500 px-6 font-semibold transition-colors hover:bg-red-500/20 border border-red-500/30"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Retry Execution
                    </button>
                    <Link
                        href="/"
                        className="inline-flex h-11 items-center justify-center rounded-md bg-transparent border border-border text-white px-6 font-semibold transition-colors hover:bg-slate-800"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
