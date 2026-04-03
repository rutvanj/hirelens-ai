import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-background pt-24 pb-32">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

            <div className="relative mx-auto max-w-5xl px-4 md:px-6 text-center">
                <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-primary opacity-75 mr-2 animate-pulse"></span>
                    <span className="text-xs font-medium text-slate-300">v1.0 Engine Now Processing</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                    Know If Your Project <br className="hidden sm:block" />
                    Is <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Interview-Ready.</span>
                </h1>

                <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-400 font-medium mb-10 leading-relaxed">
                    AI-powered technical evaluation aligned with industry expectations.
                    We analyze your code quality, architecture, and testing to produce standard metric dashboards.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/analyze"
                        className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full sm:w-auto"
                    >
                        Analyze My Project
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                        href="#features"
                        className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-transparent px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full sm:w-auto"
                    >
                        Review Metrics
                    </Link>
                </div>
            </div>
        </section>
    );
}
