"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
    {
        number: "01",
        title: "Request Flood",
        subtitle: "10,000 users, one moment",
        description:
        "Users hit the purchase endpoint simultaneously. A K6 load test script simulates real-world stampede traffic with randomized delays and concurrent virtual users.",
        tag: "Load Testing",
        icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" d="M3 12h4M10 6l-4 6 4 6M14 6l4 6-4 6M21 12h-4" />
        </svg>
        ),
    },
    {
        number: "02",
        title: "Redis Lock",
        subtitle: "Atomic ticket reservation",
        description:
        "Before writing to Postgres, each request races to acquire a Redis distributed lock on the specific seat ID. Only one request wins; the rest receive a 409 Conflict instantly.",
        tag: "Redis",
        icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
        </svg>
        ),
    },
    {
        number: "03",
        title: "DB Write",
        subtitle: "Guaranteed single commit",
        description:
        "The winner writes the reservation to Postgres inside a transaction with a SELECT FOR UPDATE guard as a secondary safety net. Two-layer protection, zero duplication.",
        tag: "Prisma + Postgres",
        icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
        ),
    },
    {
        number: "04",
        title: "Queue Dispatch",
        subtitle: "Non-blocking confirmation",
        description:
        "A BullMQ job is enqueued for email confirmation. The API returns 200 immediately — the email worker processes asynchronously, keeping p99 latency under 50ms.",
        tag: "BullMQ",
        icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
            <path d="M22 7l-8 5-8-5" />
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 12h4M6 16h2" strokeLinecap="round" />
        </svg>
        ),
    },
];

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={sectionRef} className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-amber-400" />
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-amber-500">Architecture</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: headline + description */}
            <div>
            <h2 className="section-heading text-ink">
                Four layers.<br />
                <span className="text-ink/35">Zero race conditions.</span>
            </h2>
            <p className="mt-6 text-ink/50 text-base leading-relaxed max-w-md">
                Every ticket purchase flows through a precise pipeline designed around one constraint: atomicity at scale. Here's how a winning request looks.
            </p>

            {/* Step indicators */}
            <div className="mt-10 flex gap-2">
                {steps.map((_, i) => (
                <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                    i === activeStep ? "w-8 bg-amber-400" : "w-3 bg-ink/15"
                    }`}
                />
                ))}
            </div>

            {/* Active step detail */}
            <div className="mt-8 p-6 border border-ink/8 rounded-2xl bg-ink/[0.02] min-h-[160px] relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[80px] font-mono text-ink/[0.04] leading-none font-bold select-none">
                {steps[activeStep].number}
                </div>
                <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full text-xs font-mono text-amber-500 tracking-wider mb-3">
                {steps[activeStep].tag}
                </div>
                <h3 className="text-lg font-semibold text-ink mb-1">{steps[activeStep].title}</h3>
                <p className="text-sm text-ink/40 leading-relaxed">{steps[activeStep].description}</p>
            </div>
            </div>

            {/* Right: vertical steps */}
            <div className="space-y-0">
            {steps.map((step, i) => (
                <div
                key={i}
                className={`group cursor-pointer flex gap-6 p-5 rounded-xl transition-all duration-300 ${
                    i === activeStep ? "bg-ink text-cream" : "hover:bg-ink/4"
                }`}
                onClick={() => setActiveStep(i)}
                >
                {/* Number + connector */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                    <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                        i === activeStep
                        ? "bg-amber-400 text-ink"
                        : "bg-ink/8 text-ink/40 group-hover:bg-ink/12"
                    }`}
                    >
                    {step.number}
                    </div>
                    {i < steps.length - 1 && (
                    <div className={`w-px flex-1 min-h-[24px] transition-all duration-300 ${i === activeStep ? "bg-amber-400/30" : "bg-ink/10"}`} />
                    )}
                </div>

                {/* Content */}
                <div className="pb-4">
                    <div className="flex items-center gap-3 mb-1">
                    <span className={`transition-colors duration-300 ${i === activeStep ? "text-amber-400" : "text-ink/30"}`}>
                        {step.icon}
                    </span>
                    <span className={`font-semibold text-sm transition-colors duration-300 ${i === activeStep ? "text-cream" : "text-ink"}`}>
                        {step.title}
                    </span>
                    </div>
                    <p className={`text-xs leading-relaxed transition-colors duration-300 ${i === activeStep ? "text-cream/60" : "text-ink/40"}`}>
                    {step.subtitle}
                    </p>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
}