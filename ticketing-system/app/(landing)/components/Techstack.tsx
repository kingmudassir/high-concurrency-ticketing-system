"use client";

import { Shield, Zap, Lock, RefreshCcw, HardDrive, Terminal, Layers, Eye } from "lucide-react";

const stack = [
    {
        category: "01_Runtime",
        icon: <Terminal className="w-4 h-4" />,
        items: [
        { name: "Next.js 14", note: "App Router + Server Actions" },
        { name: "TypeScript", note: "End-to-end type safety" },
        ],
    },
    {
        category: "02_Concurrency",
        icon: <Layers className="w-4 h-4" />,
        items: [
        { name: "Redis", note: "Distributed locking via SET NX" },
        { name: "BullMQ", note: "Background job orchestration" },
        ],
    },
    {
        category: "03_Persistence",
        icon: <HardDrive className="w-4 h-4" />,
        items: [
        { name: "PostgreSQL", note: "SELECT FOR UPDATE guards" },
        { name: "Prisma ORM", note: "Type-safe DB client" },
        ],
    },
    {
        category: "04_Observability",
        icon: <Eye className="w-4 h-4" />,
        items: [
        { name: "K6", note: "Load test up to 10k VUs" },
        { name: "BullMQ Board", note: "Queue monitoring UI" },
        ],
    },
];

const features = [
    {
        title: "Idempotency_Keys",
        description: "Every purchase request carries a unique key. Duplicate retries are short-circuited before hitting the write layer.",
        icon: <Zap className="w-5 h-5" />,
    },
    {
        title: "Lock_TTL_Expiry",
        description: "Redis locks auto-expire. If a service crashes mid-transaction, the lock releases — zero manual intervention required.",
        icon: <Lock className="w-5 h-5" />,
    },
    {
        title: "Dead_Letter_Queues",
        description: "Failed jobs route to a DLQ with exponential backoff. No silent failures, full visibility into dropped confirmations.",
        icon: <Shield className="w-5 h-5" />,
    },
    {
        title: "Graceful_Degradation",
        description: "If Redis fails, system falls back to Postgres-level locking. Slower throughput, but 100% data integrity.",
        icon: <RefreshCcw className="w-5 h-5" />,
    },
];

export default function TechStack() {
    return (
        <section className="py-24 sm:py-32 bg-zinc-950 text-zinc-50 relative border-y border-zinc-900">
        <div className="max-w-425 mx-auto px-6 sm:px-10 relative z-10">
            
            {/* Header Label */}
            <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-px bg-emerald-600" />
            <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-emerald-500">
                System_Manifest
            </span>
            </div>

            {/* Headline Section */}
            <div className="grid lg:grid-cols-[1fr_450px] gap-12 lg:gap-32 mb-24">
            <h2 className="text-5xl sm:text-7xl font-bold leading-[0.9] tracking-[-0.05em] uppercase">
                Production-grade<br />
                <span className="text-zinc-800">from day one.</span>
            </h2>
            <p className="text-zinc-500 text-lg sm:text-xl leading-relaxed self-end font-medium tracking-tight">
                Not a toy demo. Every choice maps to a hardware constraint. 
                Redis isn't added for fluff—it's the only way to achieve 
                <span className="text-zinc-200"> atomic sub-10ms locking</span>.
            </p>
            </div>

            {/* Tech Stack List - Clean Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-32 border-t border-zinc-900 pt-16">
            {stack.map((group) => (
                <div key={group.category}>
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-emerald-500">{group.icon}</span>
                    <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500">
                    {group.category}
                    </p>
                </div>
                <div className="space-y-8">
                    {group.items.map((item) => (
                    <div key={item.name} className="group cursor-default">
                        <p className="text-sm font-bold text-zinc-100 uppercase tracking-tight group-hover:text-emerald-500 transition-colors">
                        {item.name}
                        </p>
                        <p className="text-xs text-zinc-500 leading-snug mt-1 font-mono">
                        // {item.note}
                        </p>
                    </div>
                    ))}
                </div>
                </div>
            ))}
            </div>

            {/* Safety Protocols Label */}
            <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-px bg-emerald-600" />
            <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-emerald-500">
                Safety_Protocols
            </span>
            </div>

            {/* Protocol Grid - Sharp & Minimalist */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900">
            {features.map((f) => (
                <div 
                key={f.title} 
                className="p-8 bg-zinc-950 hover:bg-zinc-900/50 transition-all duration-300 group"
                >
                <div className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {f.icon}
                </div>
                
                <h3 className="text-sm font-bold text-zinc-100 mb-3 uppercase tracking-wider">
                    {f.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                    {f.description}
                </p>
                </div>
            ))}
            </div>

            {/* System Footnote */}
            <div className="mt-12 flex justify-end">
                <span className="text-[9px] font-mono text-zinc-800 uppercase tracking-widest">
                    Verification_Hash: 8f2e_99az_001
                </span>
            </div>
        </div>
        </section>
    );
}