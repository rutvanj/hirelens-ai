"use client";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-800"></div>
                    <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0 animate-spin"></div>
                </div>
                <h2 className="text-xl font-bold text-slate-300 mt-6 animate-pulse">Initializing Layout Cache...</h2>
                <p className="text-sm text-slate-500 mt-2 font-mono uppercase tracking-widest">Awaiting Network Sequence</p>
            </div>
        </div>
    );
}
