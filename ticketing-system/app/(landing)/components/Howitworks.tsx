"use client";

import { useEffect, useRef, useState } from "react";
import { Database, Lock, Terminal, Mail, Zap } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Request Flood",
        subtitle: "10,000 users, one moment",
        description:
        "Users hit the purchase endpoint simultaneously. A K6 load test script simulates real-world stampede traffic with randomized delays and concurrent virtual users.",
        tag: "Load_Testing",
        icon: <Terminal className="w-5 h-5" />,
    },
    {
        number: "02",
        title: "Redis Lock",
        subtitle: "Atomic ticket reservation",
        description:
        "Before writing to Postgres, each request races to acquire a Redis distributed lock on the specific seat ID. Only one request wins; the rest receive a 409 Conflict instantly.",
        tag: "Redis_L6",
        icon: <Lock className="w-5 h-5" />,
    },
    {
        number: "03",
        title: "DB Write",
        subtitle: "Guaranteed single commit",
        description:
        "The winner writes the reservation to Postgres inside a transaction with a SELECT FOR UPDATE guard as a secondary safety net. Two-layer protection, zero duplication.",
        tag: "Postgres_Prisma",
        icon: <Database className="w-5 h-5" />,
    },
    {
        number: "04",
        title: "Queue Dispatch",
        subtitle: "Non-blocking confirmation",
        description:
        "A BullMQ job is enqueued for email confirmation. The API returns 200 immediately — the email worker processes asynchronously, keeping p99 latency under 50ms.",
        tag: "BullMQ_Worker",
        icon: <Mail className="w-5 h-5" />,
    },
];

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={sectionRef} className="bg-zinc-50 py-24 sm:py-32 border-t border-zinc-200">
        <div className="max-w-425 mx-auto px-6 sm:px-10">
            
            {/* Section label */}
            <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-px bg-emerald-600" />
            <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-zinc-400">
                System_Architecture
            </span>
            </div>

            <div className="grid lg:grid-cols-[1fr_450px] gap-16 lg:gap-32 items-start">
            
            {/* Left Side: Dynamic Display */}
            <div className="flex flex-col h-full justify-between">
                <div>
                <h2 className="text-5xl sm:text-7xl font-bold text-zinc-950 leading-[0.9] tracking-[-0.05em] uppercase">
                    Four layers. <br />
                    <span className="text-zinc-300">Zero race conditions.</span>
                </h2>
                <p className="mt-8 text-zinc-500 text-lg sm:text-xl leading-relaxed max-w-xl font-medium tracking-tight">
                    Every ticket purchase flows through a precise pipeline designed 
                    around one constraint: <span className="text-zinc-950 underline decoration-emerald-500 underline-offset-4">absolute atomicity</span> at scale.
                </p>
                </div>

                {/* Step Content Card - No Soft Shadows, Minimalist Border */}
                <div className="mt-16 sm:mt-24 border-l-2 border-emerald-600 pl-8 sm:pl-12 py-2">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-zinc-950 text-white px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
                    {steps[activeStep].tag}
                    </div>
                    <div className="h-px flex-1 bg-zinc-200" />
                    <span className="text-4xl font-bold text-zinc-200 font-mono italic">
                    /{steps[activeStep].number}
                    </span>
                </div>
                
                <h3 className="text-3xl font-bold text-zinc-950 uppercase tracking-tight mb-4">
                    {steps[activeStep].title}
                </h3>
                <p className="text-zinc-500 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium">
                    {steps[activeStep].description}
                </p>

                {/* Step Progress Indicators */}
                <div className="mt-12 flex gap-3">
                    {steps.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`h-1 transition-all duration-500 rounded-none ${
                        i === activeStep ? "w-12 bg-emerald-600" : "w-4 bg-zinc-200 hover:bg-zinc-300"
                        }`}
                    />
                    ))}
                </div>
                </div>
            </div>

            {/* Right Side: Technical Selection List */}
            <div className="flex flex-col border-t border-zinc-200 lg:border-t-0">
                {steps.map((step, i) => (
                <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`group flex items-start gap-6 p-8 border-b border-zinc-200 text-left transition-all duration-300 ${
                    i === activeStep 
                        ? "bg-zinc-950" 
                        : "bg-transparent hover:bg-zinc-100"
                    }`}
                >
                    <div className={`mt-1 transition-colors duration-300 ${
                    i === activeStep ? "text-emerald-500" : "text-zinc-300"
                    }`}>
                    {step.icon}
                    </div>

                    <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${
                        i === activeStep ? "text-white" : "text-zinc-950"
                        }`}>
                        {step.title}
                        </span>
                        <span className={`font-mono text-[10px] transition-colors duration-300 ${
                        i === activeStep ? "text-emerald-500/50" : "text-zinc-300"
                        }`}>
                        {step.number}
                        </span>
                    </div>
                    <p className={`text-xs font-medium leading-relaxed transition-colors duration-300 ${
                        i === activeStep ? "text-zinc-500" : "text-zinc-400"
                    }`}>
                        {step.subtitle}
                    </p>
                    </div>
                    
                    {i === activeStep && (
                    <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500 self-center" />
                    )}
                </button>
                ))}

                {/* Final System Status Metadata */}
                <div className="p-6 bg-zinc-100 flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                    Pipeline_Integrity: 100%
                </span>
                <div className="flex gap-1">
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className={`w-1 h-1 ${idx <= activeStep ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                    ))}
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
}