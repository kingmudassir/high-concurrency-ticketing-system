"use client";

import { useEffect, useRef, useState } from "react";

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
        <section className="hero-section relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 hero-grid opacity-[0.04]" />

        {/* Amber glow blob */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-amber-400 opacity-[0.06] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/5 w-[400px] h-[400px] rounded-full bg-blue-500 opacity-[0.04] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-amber-400/40 bg-amber-400/5 px-4 py-1.5 rounded-full mb-10 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-500 text-xs font-mono tracking-[0.15em] uppercase">Built for 10,000 concurrent users</span>
            </div>

            {/* Main headline */}
            <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h1 className="display-heading text-ink leading-[0.92] tracking-tight">
                <span className="block">When everyone</span>
                <span className="block text-outline">wants in</span>
                <span className="block">at once.</span>
            </h1>
            </div>

            <div className="mt-8 max-w-xl animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <p className="text-ink/50 text-lg leading-relaxed font-light">
                FluxTicket is an event ticketing infrastructure built around atomic Redis locks and distributed queues — so the last seat goes to exactly one person.
            </p>
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <button className="btn-primary group flex items-center gap-3">
                <span>Explore the Architecture</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
            <button className="btn-ghost flex items-center gap-3">
                <span className="w-5 h-5 rounded-full border border-ink/30 flex items-center justify-center">
                <span className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-ink/60 translate-x-px" />
                </span>
                <span>Watch load test</span>
            </button>
            </div>

            {/* Live stats strip */}
            <div className="mt-20 flex flex-wrap gap-px animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <div className="stat-card">
                <span className="stat-number">{count.toLocaleString()}</span>
                <span className="stat-label">Concurrent Requests Simulated</span>
            </div>
            <div className="stat-card">
                <span className="stat-number">{sold}</span>
                <span className="stat-label">Tickets Sold — Zero Oversold</span>
            </div>
            <div className="stat-card">
                <span className="stat-number">&lt;8ms</span>
                <span className="stat-label">Avg. Lock Acquisition Time</span>
            </div>
            <div className="stat-card">
                <span className="stat-number">0</span>
                <span className="stat-label">Race Conditions</span>
            </div>
            </div>
        </div>

        {/* Scrolling ticker */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-ink/8 overflow-hidden">
            <div className="ticker-track flex gap-12 py-3 text-xs font-mono text-ink/25 tracking-widest uppercase whitespace-nowrap">
            {Array(6).fill(null).map((_, i) => (
                <span key={i} className="flex gap-12 shrink-0">
                <span>Redis Distributed Locks</span>
                <span className="text-amber-400/40">✦</span>
                <span>BullMQ Message Queues</span>
                <span className="text-amber-400/40">✦</span>
                <span>Atomic Operations</span>
                <span className="text-amber-400/40">✦</span>
                <span>K6 Load Testing</span>
                <span className="text-amber-400/40">✦</span>
                <span>Next.js App Router</span>
                <span className="text-amber-400/40">✦</span>
                <span>Prisma ORM</span>
                <span className="text-amber-400/40">✦</span>
                </span>
            ))}
            </div>
        </div>
        </section>
    );
}