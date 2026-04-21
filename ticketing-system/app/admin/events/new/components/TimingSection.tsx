"use client";

import React, { useState } from "react";
import { CalendarDays, Clock, Timer, History, Sparkles, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TIME_FIELDS = [
    {
        name: "startDate",
        label: "Event Start",
        icon: Timer,
        required: true,
        linear: "from-emerald-500 via-teal-500 to-cyan-500",
        description: "When the experience begins"
    },
    {
        name: "endDate",
        label: "Event End",
        icon: History,
        required: false,
        linear: "from-stone-400 to-stone-500",
        description: "When the curtains close"
    },
    {
        name: "doorsOpen",
        label: "Doors Open",
        icon: CalendarDays,
        required: false,
        linear: "from-stone-400 to-stone-500",
        description: "Early access & entry time"
    },
];

export function TimingSection() {
    const [selectedDates, setSelectedDates] = useState<Record<string, string>>({
        startDate: "",
        endDate: "",
        doorsOpen: "",
    });
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleDateChange = (name: string, value: string) => {
        setSelectedDates(prev => ({ ...prev, [name]: value }));
    };

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <section className="relative space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Floating orbs for atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[30%] left-[20%] w-64 h-64 bg-linear-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[40%] right-[10%] w-80 h-80 bg-linear-to-r from-cyan-200/15 to-blue-200/15 rounded-full blur-3xl animate-pulse delay-1000" />
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
                                <div className="absolute inset-0 bg-linear-to-r from-emerald-400 to-cyan-500 rounded-2xl blur-xl opacity-50" />
                                <div className="relative w-12 h-12 rounded-2xl bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
                                    <Clock className="w-6 h-6 text-black" />
                                </div>
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold tracking-tight bg-linear-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                    Timing & Access
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    All times are locked to the venue's local timezone automatically
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

            {/* Time Fields Grid - Fluid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIME_FIELDS.map((field, idx) => {
                    const Icon = field.icon;
                    const isActive = selectedDates[field.name];
                    const isFocused = focusedField === field.name;
                    const isRequired = field.required;

                    return (
                        <motion.div
                            key={field.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => setFocusedField(null)}
                            className="group relative"
                        >
                            <div 
                                className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
                                    isFocused ? 'shadow-xl scale-[1.02]' : 'shadow-md hover:shadow-lg'
                                }`}
                                style={{
                                    background: "rgba(255, 255, 255, 0.9)",
                                    backdropFilter: "blur(20px)",
                                    border: isFocused ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                {/* Animated linear border */}
                                {isFocused && (
                                    <div className="absolute inset-0 rounded-2xl p-px bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-500 opacity-50" />
                                )}

                                {/* Field Header */}
                                <div className={`relative px-5 py-4 border-b transition-all duration-300 ${
                                    isRequired ? 'bg-linear-to-r from-stone-900 to-stone-800' : 'bg-stone-50/50'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                            isRequired 
                                                ? 'bg-linear-to-r from-emerald-500 to-teal-500 shadow-lg' 
                                                : 'bg-white border border-stone-200'
                                        }`}>
                                            <Icon className={`w-4 h-4 ${isRequired ? 'text-black' : 'text-stone-500'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <span className={`text-xs font-bold uppercase tracking-wider ${
                                                    isRequired ? 'text-white' : 'text-stone-600'
                                                }`}>
                                                    {field.label}
                                                </span>
                                                {isRequired ? (
                                                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full">
                                                        REQUIRED
                                                    </span>
                                                ) : (
                                                    <span className="text-[8px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                                                        OPTIONAL
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-[10px] mt-1 font-mono ${
                                                isRequired ? 'text-stone-400' : 'text-stone-400'
                                            }`}>
                                                {field.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="relative px-5 py-5">
                                    <div className="relative">
                                        <input
                                            name={field.name}
                                            type="datetime-local"
                                            required={field.required}
                                            value={selectedDates[field.name]}
                                            onChange={(e) => handleDateChange(field.name, e.target.value)}
                                            className={`w-full bg-transparent text-sm font-mono outline-none transition-all duration-300 ${
                                                isRequired 
                                                    ? 'text-stone-900 font-semibold' 
                                                    : 'text-stone-600'
                                            } ${isActive ? 'opacity-100' : 'opacity-70'}`}
                                        />
                                        
                                        {/* Floating label effect when value exists */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    className="absolute -top-6 left-0 text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
                                                >
                                                    {formatDisplayDate(selectedDates[field.name])}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    
                                    {/* Animated bottom line */}
                                    <div className={`h-0.5 bg-linear-to-r from-emerald-400 to-teal-400 transition-all duration-500 mt-3 ${
                                        isFocused ? 'w-full' : 'w-0'
                                    }`} />
                                </div>

                                {/* Decorative corner accent */}
                                <div className="absolute top-3 right-3 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-emerald-400/30 rounded-tr-lg" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* System Note - Premium Glass Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative overflow-hidden rounded-2xl"
            >
                <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 backdrop-blur-sm" />
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-stone-100/30 to-transparent" />
                
                <div className="relative flex items-stretch gap-0">
                    {/* Animated side bar */}
                    <div className="relative w-1 bg-linear-to-b from-emerald-500 via-teal-500 to-cyan-500 shrink-0 overflow-hidden">
                        <div className="absolute inset-0 w-full h-full bg-linear-to-b from-transparent via-white to-transparent animate-pulse" />
                    </div>
                    
                    <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-4 flex-1">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                                <Shield className="w-4 h-4 text-black" />
                            </div>
                            <div>
                                <p className="text-[10px] font-mono font-bold text-stone-700 uppercase tracking-[0.15em]">
                                    Timezone Lock: UTC Offset Auto
                                </p>
                                <p className="text-[9px] font-mono text-stone-400 mt-0.5 tracking-wide">
                                    Synchronized to venue's local coordinate system
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-stone-200/50">
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            <span className="text-[8px] font-mono text-stone-500 tracking-wider">
                                AUTO-SYNC ACTIVE
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Timezone Helper Text */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
            >
                <p className="text-[9px] font-mono text-stone-400 tracking-[0.2em] uppercase">
                    All times displayed in venue's local time • Automatic DST adjustment
                </p>
            </motion.div>
        </section>
    );
}