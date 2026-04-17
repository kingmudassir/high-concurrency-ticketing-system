"use client";

const stack = [
    {
        category: "Runtime",
        items: [
        { name: "Next.js 14", note: "App Router + Server Actions", color: "bg-ink" },
        { name: "TypeScript", note: "End-to-end type safety", color: "bg-blue-600" },
        ],
    },
    {
        category: "Concurrency Layer",
        items: [
        { name: "Redis", note: "Distributed locking via SET NX PX", color: "bg-red-500" },
        { name: "BullMQ", note: "Background job queues on Redis", color: "bg-red-400" },
        ],
    },
    {
        category: "Persistence",
        items: [
        { name: "PostgreSQL", note: "SELECT FOR UPDATE guards", color: "bg-blue-500" },
        { name: "Prisma ORM", note: "Type-safe DB client", color: "bg-teal-600" },
        ],
    },
    {
        category: "Observability",
        items: [
        { name: "K6", note: "Load test up to 10k VUs", color: "bg-amber-500" },
        { name: "BullMQ Board", note: "Queue monitoring UI", color: "bg-purple-500" },
        ],
    },
];

const features = [
    {
        title: "Idempotency Keys",
        description: "Every purchase request carries a unique idempotency key. Duplicate retries are detected and short-circuited before hitting the database.",
        icon: "⌥",
    },
    {
        title: "Lock TTL Expiry",
        description: "Redis locks auto-expire after a configurable TTL. If a service crashes mid-transaction, the lock releases — no manual cleanup, no stuck inventory.",
        icon: "⏱",
    },
    {
        title: "Dead Letter Queues",
        description: "Failed email jobs are routed to a DLQ with exponential backoff retry. No silent failures, full visibility into every dropped confirmation.",
        icon: "◈",
    },
    {
        title: "Graceful Degradation",
        description: "If Redis goes down, the system falls back to Postgres-level locking. Slower, but the purchase still completes — one winner, always.",
        icon: "⟳",
    },
];

export default function TechStack() {
    return (
        <section className="py-32 bg-ink text-cream overflow-hidden relative">
        {/* subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] noise-bg pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-amber-400" />
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-amber-400/70">Stack</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <h2 className="section-heading text-cream">
                Production-grade<br />
                <span className="text-cream/25">from day one.</span>
            </h2>
            <p className="text-cream/40 text-base leading-relaxed self-end pb-2">
                Not a toy demo. Every technology choice maps to a real-world constraint. Redis isn't added for résumé padding — it's the only structure that makes sub-10ms locking possible.
            </p>
            </div>

            {/* Stack grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
            {stack.map((group) => (
                <div key={group.category}>
                <p className="text-xs font-mono tracking-[0.15em] uppercase text-cream/25 mb-3">{group.category}</p>
                <div className="space-y-2">
                    {group.items.map((item) => (
                    <div key={item.name} className="flex items-start gap-3 p-3 rounded-xl border border-cream/8 hover:border-cream/16 transition-colors duration-200">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.color}`} />
                        <div>
                        <p className="text-sm font-semibold text-cream">{item.name}</p>
                        <p className="text-xs text-cream/35 leading-snug mt-0.5">{item.note}</p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            ))}
            </div>

            {/* Divider */}
            <div className="border-t border-cream/8 mb-20" />

            {/* Features */}
            <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-px bg-amber-400" />
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-amber-400/70">Safety Mechanisms</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
                <div key={f.title} className="p-6 rounded-2xl border border-cream/8 hover:border-amber-400/20 hover:bg-cream/[0.02] transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-xl mb-5 group-hover:bg-amber-400/20 transition-colors duration-300">
                    {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-cream mb-2">{f.title}</h3>
                <p className="text-xs text-cream/35 leading-relaxed">{f.description}</p>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
}