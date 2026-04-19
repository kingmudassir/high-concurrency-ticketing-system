"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Activity } from "lucide-react";
import { AuthButton } from "@/app/globalcomponents/AuthButton";

export default function Hero() {
    const [count, setCount] = useState(0);
    const [sold, setSold] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        let current = 0;
        let soldCurrent = 0;
        const target = 9847;
        const soldTarget = 47;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        const soldIncrement = soldTarget / steps;

        intervalRef.current = setInterval(() => {
        current = Math.min(current + increment, target);
        soldCurrent = Math.min(soldCurrent + soldIncrement, soldTarget);
        setCount(Math.floor(current));
        setSold(Math.floor(soldCurrent));
        if (current >= target) clearInterval(intervalRef.current!);
        }, duration / steps);

        return () => clearInterval(intervalRef.current!);
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col bg-zinc-50 overflow-hidden">
        {/* pt-32 for mobile, pt-44 for desktop to clear navbar */}
        <div className="relative z-10 max-w-425 mx-auto px-6 sm:px-10 w-full pt-32 sm:pt-44 pb-20">
            
            {/* Minimalist Status Header */}
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-16">
            <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span className="text-zinc-400 font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase whitespace-nowrap">
                Production Ready
                </span>
            </div>
            <div className="h-px w-8 sm:w-12 bg-zinc-200" />
            <span className="text-zinc-400 font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase">
                v1.0.4 Stable
            </span>
            </div>

            {/* Massive Typographic Headline - Responsive Scaling */}
            <div className="max-w-5xl">
            <h1 className="text-5xl md:text-7xl lg:text-[140px] font-bold text-zinc-950 leading-[0.9] sm:leading-[0.8] tracking-[-0.05em] sm:tracking-[-0.07em] uppercase">
                When everyone <br />
                <span className="text-zinc-300">wants in</span> <br />
                at once.
            </h1>
            </div>

            {/* Content & Action Row */}
            <div className="mt-12 sm:mt-16 grid lg:grid-cols-[1fr_auto] items-end gap-10 sm:gap-12 pb-12 sm:pb-16 border-b border-zinc-200">
            <div className="max-w-2xl">
                <p className="text-zinc-500 text-lg sm:text-2xl leading-relaxed font-medium tracking-tight">
                RushTicket is high-concurrency event infrastructure. Built on atomic 
                Redis locks and isolated distributed queues to ensure the last seat 
                goes to exactly one person.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mt-10">

                <AuthButton 
                showIcon={true}
                className="w-full sm:w-auto bg-zinc-950 text-white px-10 py-5 font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 rounded-sm"
                />
                
                <button className="group flex items-center gap-3 text-zinc-400 hover:text-zinc-950 transition-colors font-bold text-xs uppercase tracking-[0.2em]">
                    <div className="w-10 h-10 border border-zinc-200 flex items-center justify-center group-hover:border-zinc-950 transition-colors">
                    <Play className="w-3 h-3 fill-current" />
                    </div>
                    Watch Load Test
                </button>
                </div>
            </div>

            {/* Precision Stats - Stacked on Mobile */}
            <div className="flex flex-row sm:flex-row gap-10 sm:gap-16 lg:gap-24 border-t border-zinc-100 pt-10 lg:pt-0 lg:border-t-0">
                <div className="flex flex-col gap-2">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                    Requests_Sec
                </span>
                <span className="text-4xl sm:text-5xl font-bold text-zinc-950 tracking-tighter tabular-nums">
                    {count.toLocaleString()}
                </span>
                </div>

                <div className="w-px h-12 sm:h-16 bg-zinc-200" />

                <div className="flex flex-col gap-2">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                    Tickets_Sold
                </span>
                <span className="text-4xl sm:text-5xl font-bold text-emerald-600 tracking-tighter tabular-nums">
                    {sold}
                </span>
                </div>
            </div>
            </div>

            {/* Footer Technical Metadata - Hidden/Condensed on Mobile */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div className="flex gap-8 sm:gap-12 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                <div className="flex flex-col gap-1 shrink-0">
                <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest font-bold">Latency</span>
                <span className="text-xs sm:text-sm font-bold text-zinc-600 font-mono">0.004ms</span>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest font-bold">Uptime</span>
                <span className="text-xs sm:text-sm font-bold text-zinc-600 font-mono">99.99%</span>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest font-bold">Nodes</span>
                <span className="text-xs sm:text-sm font-bold text-zinc-600 font-mono">Dist.</span>
                </div>
            </div>
            
            <div className="flex items-center gap-3 text-zinc-300">
                <Activity className="w-4 h-4" />
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">System_Pulse_Active</span>
            </div>
            </div>
        </div>
        </section>
    );
}