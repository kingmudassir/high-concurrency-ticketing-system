"use client";

import { useEffect, useRef, useState } from "react";

const metrics = [
    { label: "p50 Latency", value: "12ms", subtext: "Median response time", bar: 12, maxBar: 200 },
    { label: "p95 Latency", value: "34ms", subtext: "95th percentile", bar: 34, maxBar: 200 },
    { label: "p99 Latency", value: "48ms", subtext: "99th percentile", bar: 48, maxBar: 200 },
    { label: "Error Rate", value: "0.0%", subtext: "Under 10k VUs", bar: 0, maxBar: 100 },
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
        { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const maxRps = Math.max(...timeline.map((t) => t.rps));

    return (
        <section ref={sectionRef} className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-amber-400" />
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-amber-500">K6 Load Test Results</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
            <h2 className="section-heading text-ink">
                Numbers that<br />
                <span className="text-ink/35">don't lie.</span>
            </h2>
            <p className="mt-6 text-ink/50 text-base leading-relaxed max-w-md">
                A K6 ramp test hitting the /purchase endpoint at peak 10,000 virtual users. Tickets: 50. Purchases completed: 50. Oversold: 0.
            </p>

            {/* Metric bars */}
            <div className="mt-10 space-y-5">
                {metrics.map((m) => (
                <div key={m.label}>
                    <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono text-ink/40 tracking-wide">{m.label}</span>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-ink/30">{m.subtext}</span>
                        <span className="text-sm font-semibold font-mono text-ink">{m.value}</span>
                    </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-ink/8 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-1000 ease-out"
                        style={{ width: animated ? `${(m.bar / m.maxBar) * 100}%` : "0%" }}
                    />
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* Chart */}
            <div className="p-6 rounded-2xl border border-ink/8 bg-ink/[0.02]">
            <div className="flex items-center justify-between mb-6">
                <div>
                <p className="text-sm font-semibold text-ink">Requests / sec over time</p>
                <p className="text-xs text-ink/35 mt-0.5">Peak 10,000 VUs ramp test</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-green-500 bg-green-500/8 border border-green-500/20 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                PASSED
                </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-2 h-40">
                {timeline.map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex items-end justify-center" style={{ height: "120px" }}>
                    <div
                        className="w-full rounded-t-md bg-amber-400/30 border-t border-amber-400/50 transition-all duration-700 ease-out relative group"
                        style={{
                        height: animated ? `${(point.rps / maxRps) * 100}%` : "0%",
                        transitionDelay: `${i * 80}ms`,
                        }}
                    >
                        {point.rps > 0 && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono text-ink/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {point.rps.toLocaleString()}
                        </div>
                        )}
                    </div>
                    </div>
                    <span className="text-[9px] font-mono text-ink/25">{point.second}</span>
                </div>
                ))}
            </div>

            {/* Summary row */}
            <div className="mt-6 pt-5 border-t border-ink/8 grid grid-cols-3 gap-4 text-center">
                <div>
                <p className="text-xs text-ink/35 mb-1">Total Requests</p>
                <p className="text-sm font-mono font-bold text-ink">284,319</p>
                </div>
                <div>
                <p className="text-xs text-ink/35 mb-1">Duration</p>
                <p className="text-sm font-mono font-bold text-ink">35s</p>
                </div>
                <div>
                <p className="text-xs text-ink/35 mb-1">Tickets Oversold</p>
                <p className="text-sm font-mono font-bold text-green-500">0</p>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
}