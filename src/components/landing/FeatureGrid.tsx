import { Activity, ShieldCheck, MessagesSquare } from "lucide-react";

export function FeatureGrid() {
    const features = [
        {
            title: "Code Quality Scoring",
            description: "Get robust, enterprise-grade static analysis identifying maintainability bottlenecks.",
            icon: Activity,
            color: "text-blue-500",
            bgStyle: "bg-blue-500/10 border-blue-500/20",
        },
        {
            title: "Architecture Evaluation",
            description: "Detect code smells, pattern misuses, and evaluate scalability limits instantly.",
            icon: ShieldCheck,
            color: "text-emerald-500",
            bgStyle: "bg-emerald-500/10 border-emerald-500/20",
        },
        {
            title: "Interview Question Generator",
            description: "Receive targeted technical questions interviewers will ask about your architecture.",
            icon: MessagesSquare,
            color: "text-amber-500",
            bgStyle: "bg-amber-500/10 border-amber-500/20",
        },
    ];

    return (
        <section id="features" className="py-24 bg-background">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
                        Industrial Analysis Engine
                    </h2>
                    <p className="text-muted-foreground mx-auto max-w-2xl">
                        We parse, structure, and evaluate your codebase strictly across three essential domains.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-slate-600"
                        >
                            <div>
                                <div
                                    className={`inline-flex h-12 w-12 items-center justify-center rounded-lg border mb-6 transition-transform group-hover:scale-110 ${feature.bgStyle}`}
                                >
                                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-sm selection:bg-slate-700">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
