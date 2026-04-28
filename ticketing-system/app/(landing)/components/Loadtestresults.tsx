"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, ShieldCheck, Timer } from "lucide-react";

const metrics = [
    { label: "p50_Latency", value: "12ms", subtext: "Median_Time", bar: 12, maxBar: 200 },
    { label: "p95_Latency", value: "34ms", subtext: "95th_Percentile", bar: 34, maxBar: 200 },
    { label: "p99_Latency", value: "48ms", subtext: "Tail_Latency", bar: 48, maxBar: 200 },
    { label: "Error_Rate", value: "0.00%", subtext: "Under_10k_VUs", bar: 0, maxBar: 100 },
];

const timeline = [
    { second: "0s", vus: 0, rps: 0 },
    { second: "5s", vus: 500, rps: 480 },
    { second: "10s", vus: 2000, rps: 1900 },
    { second: "15s", vus: 5000, rps: 4820 },
    { second: "20s", vus: 10000, rps: 9750 },
    { second: "25s", vus: 10000, rps: 9780 },
    { second: "30s", vus: 5000, rps: 4810 },
    { second: "35s", vus: 0, rps: 0 },
];

export default function LoadTestResults() {
    const [animated, setAnimated] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) setAnimated(true);
        },
        { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const maxRps = Math.max(...timeline.map((t) => t.rps));

    return (
        <section ref={sectionRef} className="bg-zinc-50 py-24 sm:py-32 border-t border-zinc-200">
        <div className="max-w-425 mx-auto px-6 sm:px-10">
            
            {/* Technical Header */}
            <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-px bg-emerald-600" />
            <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-zinc-400">
                Performance_Validation
            </span>
            </div>

            <div className="grid lg:grid-cols-[1fr_550px] gap-16 lg:gap-32 items-start">
            <div>
                <h2 className="text-5xl sm:text-7xl font-bold text-zinc-950 leading-[0.9] tracking-[-0.05em] uppercase">
                Numbers that<br />
                <span className="text-zinc-300">don't lie.</span>
                </h2>
                <p className="mt-8 text-zinc-500 text-lg sm:text-xl leading-relaxed max-w-xl font-medium tracking-tight">
                A K6 ramp test hitting the <code className="text-emerald-700 bg-emerald-50 px-2 py-0.5 font-mono text-sm uppercase">/purchase</code> endpoint at 10,000 VUs. 
                Results confirmed: 50 tickets available, 50 sold, <span className="text-zinc-950 font-bold underline decoration-emerald-500 underline-offset-4">zero oversold</span>.
                </p>

                {/* Metric Bars - Industrial Look */}
                <div className="mt-16 space-y-8">
                {metrics.map((m) => (
                    <div key={m.label} className="group">
                    <div className="flex items-end justify-between mb-3">
                        <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">{m.label}</span>
                        <span className="text-xs font-medium text-zinc-400">{m.subtext}</span>
                        </div>
                        <span className="text-2xl font-bold text-zinc-950 font-mono tabular-nums">{m.value}</span>
                    </div>
                    <div className="h-1 bg-zinc-200 overflow-hidden">
                        <div
                        className="h-full bg-emerald-600 transition-all duration-1000 ease-out"
                        style={{ width: animated ? `${(m.bar / m.maxBar) * 100}%` : "0%" }}
                        />
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Visualization Panel */}
            <div className="border border-zinc-200 bg-white p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
                <div>
                    <p className="text-sm font-bold text-zinc-950 uppercase tracking-tight">Traffic_Distribution</p>
                    <p className="text-xs font-mono text-zinc-400 mt-1">Requests / sec (Peak 10k VUs)</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3" />
                    Validated_Stable
                </div>
                </div>

                {/* Column Chart */}
                <div className="flex items-end gap-1 sm:gap-2 h-48 sm:h-56">
                {timeline.map((point, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                    <div className="w-full flex items-end justify-center h-40 sm:h-48 relative">
                        <div
                        className="w-full bg-zinc-950 transition-all duration-700 ease-out"
                        style={{
                            height: animated ? `${(point.rps / maxRps) * 100}%` : "0%",
                            transitionDelay: `${i * 50}ms`,
                        }}
                        />
                        {/* Value Pop-up on Hover */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] font-mono font-bold bg-zinc-950 text-white px-1.5 py-0.5">
                            {point.rps}
                        </span>
                        </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-zinc-400">{point.second}</span>
                    </div>
                ))}
                </div>

                {/* Bottom Data Grid */}
                <div className="mt-12 pt-8 border-t border-zinc-200 grid grid-cols-3 gap-6 text-left">
                <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-mono font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity className="w-3 h-3" /> Total_Req
                    </p>
                    <p className="text-sm font-bold text-zinc-950 font-mono">284,319</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-mono font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Timer className="w-3 h-3" /> Duration
                    </p>
                    <p className="text-sm font-bold text-zinc-950 font-mono">35.02s</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-mono font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                    Oversold
                    </p>
                    <p className="text-sm font-bold text-emerald-600 font-mono">0.00%</p>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
}