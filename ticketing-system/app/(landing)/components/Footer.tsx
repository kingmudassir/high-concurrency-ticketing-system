"use client";

import { FileText, ChevronRight } from "lucide-react";

export default function Footer() {
    return (
        <>
        {/* CTA Section */}
            <section className="py-32 px-6 lg:px-12 max-w-425 mx-auto text-center relative overflow-hidden">
                {/* Removed amber glows, replaced with a subtle architectural rule */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-emerald-600 to-transparent" />
                
                <div className="relative max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-3 border border-zinc-200 bg-white px-4 py-1.5 mb-10">
                    <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-400">
                    Repository_Status: Public
                    </span>
                </div>

                <h2 className="text-5xl sm:text-7xl font-bold text-zinc-950 leading-[0.9] tracking-[-0.05em] uppercase mb-8">
                    Clone it.<br />
                    <span className="text-zinc-300">Break it. Learn it.</span>
                </h2>

                <p className="text-zinc-500 text-lg sm:text-xl leading-relaxed mb-12 max-w-xl mx-auto font-medium tracking-tight">
                    A technical demonstration of distributed systems. The full source — 
                    Redis lock logic, BullMQ workers, and K6 stress scripts — 
                    is available for audit on GitHub.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-0 bg-zinc-950 p-1">
                    <button className="flex items-center gap-3 bg-zinc-950 text-white hover:bg-zinc-900 text-sm font-bold uppercase tracking-widest py-4 px-10 transition-colors border border-transparent">
                    <svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-4 h-4"
                    >
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    <span>View_Source</span>
                    </button>
                    <div className="w-px h-8 bg-zinc-800 hidden sm:block" />
                    <button className="flex items-center gap-2 bg-zinc-950 text-emerald-500 hover:text-emerald-400 text-sm font-bold uppercase tracking-widest py-4 px-10 transition-colors border border-transparent">
                    <FileText className="w-4 h-4" />
                    <span>Documentation</span>
                    <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                </div>
            </section>

        {/* Footer Metadata */}
            <footer className="border-t border-zinc-200 py-12 px-6 lg:px-10 bg-white">
                <div className="max-w-425 mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-zinc-950 flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-500" />
                    </div>
                    <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-950 uppercase tracking-tighter">RushTicket</span>
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">System_v1.0.4_Stable</span>
                    </div>
                </div>

                <div className="flex items-center gap-8 text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em]">
                    <span className="hover:text-zinc-950 cursor-default transition-colors">Next.js</span>
                    <span className="hover:text-zinc-950 cursor-default transition-colors">Redis</span>
                    <span className="hover:text-zinc-950 cursor-default transition-colors">PostgreSQL</span>
                    <span className="hover:text-zinc-950 cursor-default transition-colors">BullMQ</span>
                    <span className="hover:text-zinc-950 cursor-default transition-colors">K6</span>
                </div>

                <div className="text-[9px] font-mono text-zinc-300">
                    © 2026 // Distributed_Systems_Lab
                </div>
                
                </div>
            </footer>
        </>
    );
}