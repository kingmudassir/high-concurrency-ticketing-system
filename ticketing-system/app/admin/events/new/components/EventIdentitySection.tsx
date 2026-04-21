"use client";

import React, { useState } from "react";
import { Type, AlignLeft, Sparkles, Bold, Italic, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface FieldLabelProps {
    required?: boolean;
    optional?: boolean;
    children: React.ReactNode;
}

function FieldLabel({ required, optional, children }: FieldLabelProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
                {children}
            </span>
            {required && (
                <span className="text-[10px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">
                    REQUIRED
                </span>
            )}
            {optional && (
                <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-full">
                    OPTIONAL
                </span>
            )}
        </div>
    );
}

export function EventIdentitySection() {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [description, setDescription] = useState("");
    const [focusedField, setFocusedField] = useState<string | null>(null);

    return (
        <section className="relative space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Floating orbs for atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[10%] right-[15%] w-72 h-72 bg-linear-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[20%] left-[5%] w-64 h-64 bg-linear-to-r from-sky-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            {/* Header - Flowing & Organic */}
            <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <motion.div 
                                initial={{ rotate: -10, scale: 0.9 }}
                                animate={{ rotate: 0, scale: 1 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-50" />
                                <div className="relative w-12 h-12 rounded-2xl bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
                                    <Type className="w-6 h-6 text-black" />
                                </div>
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold tracking-tight bg-linear-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                    Event Identity
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Name, subtitle, and description — what the world will see
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Flowing accent line */}
                    <svg className="w-32 h-12 opacity-30 hidden md:block" viewBox="0 0 120 40" fill="none">
                        <path d="M0 20 Q 30 0, 60 20 T 120 20" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"/>
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Main Form Card - Fluid Morphing */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl"
                style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                }}
            >
                {/* Animated linear border */}
                <div className="absolute inset-0 rounded-3xl p-px bg-linear-to-r from-transparent via-emerald-400/30 to-transparent opacity-50" />
                
                {/* Title Field */}
                <motion.div 
                    className="group relative border-b border-stone-200/50"
                    onFocus={() => setFocusedField("title")}
                    onBlur={() => setFocusedField(null)}
                >
                    <div className="flex items-start gap-0">
                        <motion.div 
                            animate={{ 
                                width: focusedField === "title" ? 4 : 2,
                                background: focusedField === "title" 
                                    ? "linear-linear(135deg, #10b981, #06b6d4)" 
                                    : "#e5e7eb"
                            }}
                            className="h-24 shrink-0 transition-all duration-300"
                            style={{ width: focusedField === "title" ? 4 : 2 }}
                        />
                        <div className="flex-1 px-6 py-5">
                            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                                <FieldLabel required>Headline Title</FieldLabel>
                                {title && (
                                    <motion.span 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
                                    >
                                        {title.length} chars
                                    </motion.span>
                                )}
                            </div>
                            <input
                                name="title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="MIDNIGHT CITY REVIVAL"
                                className="w-full bg-transparent text-2xl md:text-3xl font-black tracking-tight text-stone-800 placeholder:text-stone-200 outline-none"
                            />
                            <div className="h-0.5 w-0 group-focus-within:w-full bg-linear-to-r from-emerald-400 to-teal-400 transition-all duration-500 mt-2" />
                        </div>
                    </div>
                </motion.div>

                {/* Subtitle Field */}
                <motion.div 
                    className="group relative border-b border-stone-200/50"
                    onFocus={() => setFocusedField("subtitle")}
                    onBlur={() => setFocusedField(null)}
                >
                    <div className="flex items-start gap-0">
                        <motion.div 
                            animate={{ 
                                width: focusedField === "subtitle" ? 4 : 2,
                                background: focusedField === "subtitle" 
                                    ? "linear-linear(135deg, #10b981, #06b6d4)" 
                                    : "#e5e7eb"
                            }}
                            className="h-20 shrink-0 transition-all duration-300"
                            style={{ width: focusedField === "subtitle" ? 4 : 2 }}
                        />
                        <div className="flex-1 px-6 py-4">
                            <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
                                <FieldLabel optional>Sub-Heading</FieldLabel>
                                {subtitle && (
                                    <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                                        {subtitle.length} chars
                                    </span>
                                )}
                            </div>
                            <input
                                name="subtitle"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                placeholder="A compelling one-liner for the event card..."
                                className="w-full bg-transparent text-base font-medium text-stone-600 placeholder:text-stone-200 outline-none"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Description Field */}
                <motion.div 
                    className="group relative"
                    onFocus={() => setFocusedField("description")}
                    onBlur={() => setFocusedField(null)}
                >
                    <div className="flex items-start gap-0">
                        <motion.div 
                            animate={{ 
                                width: focusedField === "description" ? 4 : 2,
                                background: focusedField === "description" 
                                    ? "linear-linear(135deg, #10b981, #06b6d4)" 
                                    : "#e5e7eb"
                            }}
                            className="h-auto min-h-48 shrink-0 transition-all duration-300"
                            style={{ width: focusedField === "description" ? 4 : 2 }}
                        />
                        <div className="flex-1 px-6 py-5">
                            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                                <FieldLabel>The Experience</FieldLabel>
                                
                                {/* Editor chrome bar - Premium */}
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-stone-50 border border-stone-200">
                                    <button 
                                        type="button" 
                                        className="w-7 h-7 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 hover:bg-white transition-all"
                                    >
                                        <Bold className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        type="button" 
                                        className="w-7 h-7 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 hover:bg-white transition-all"
                                    >
                                        <Italic className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        type="button" 
                                        className="w-7 h-7 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 hover:bg-white transition-all"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="w-px h-4 bg-stone-200 mx-0.5" />
                                    <button 
                                        type="button" 
                                        className="w-7 h-7 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 hover:bg-white transition-all"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            
                            <textarea
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                placeholder="Describe the atmosphere, the lineup, and the exclusive details that make this event unmissable..."
                                className="w-full bg-transparent text-sm leading-relaxed text-stone-600 placeholder:text-stone-200 outline-none resize-none font-medium"
                            />
                            
                            {/* Character counter */}
                            {description && (
                                <div className="flex justify-end mt-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-1 w-20 rounded-full bg-stone-100 overflow-hidden`}>
                                            <motion.div 
                                                animate={{ width: `${Math.min((description.length / 1000) * 100, 100)}%` }}
                                                className={`h-full rounded-full ${
                                                    description.length > 800 
                                                        ? description.length > 1000 ? "bg-rose-500" : "bg-amber-500"
                                                        : "bg-emerald-500"
                                                }`}
                                            />
                                        </div>
                                        <span className={`text-[10px] font-mono ${
                                            description.length > 1000 ? "text-rose-500" : "text-stone-400"
                                        }`}>
                                            {description.length}/1000
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Conversion tip - Premium Glass Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl"
            >
                <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-sm" />
                <div className="relative flex items-stretch gap-0">
                    <div className="w-1 bg-linear-to-b from-emerald-500 via-teal-500 to-cyan-500 shrink-0" />
                    <div className="flex items-center gap-4 px-6 py-4 flex-1 flex-wrap">
                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                            <Sparkles className="w-4 h-4 text-black" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[11px] font-mono text-stone-600 leading-relaxed">
                                <span className="font-bold text-emerald-600">Pro Tip:</span> Events with descriptions over 200 words see a{" "}
                                <span className="text-emerald-600 font-bold">40% higher conversion rate.</span>{" "}
                                Be descriptive, be bold, and paint a picture they can't resist.
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-1">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="w-1 h-1 rounded-full bg-emerald-400/40" />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}