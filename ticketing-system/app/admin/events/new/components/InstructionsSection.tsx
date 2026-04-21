"use client";

import { useState } from "react";
import { ShieldCheck, Check, X, Plus, Sparkles, AlertCircle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const DEFAULT_INSTRUCTIONS = [
    "Valid photo ID required for entry.",
    "No re-entry once you have exited the venue.",
    "Bag policy: only bags smaller than 14\" × 14\" × 6\" permitted.",
    "Cameras with detachable lenses are not permitted.",
    "Doors open 90 minutes before showtime.",
    "No outside food or beverages permitted.",
    "The event organiser reserves the right to refuse entry.",
    "Persons under 18 must be accompanied by a guardian.",
    "All sales are final. No refunds or exchanges.",
    "In case of emergency, follow staff instructions immediately.",
];

interface InstructionsSectionProps {
    instructions: string[];
    customInstruction: string;
    onToggle: (instr: string) => void;
    onCustomChange: (val: string) => void;
    onCustomAdd: () => void;
}

export function InstructionsSection({
    instructions, customInstruction,
    onToggle, onCustomChange, onCustomAdd,
}: InstructionsSectionProps) {
    const [hoveredInstruction, setHoveredInstruction] = useState<string | null>(null);
    const [focusedCustom, setFocusedCustom] = useState(false);

    return (
        <section className="relative space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Floating orbs for atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[20%] left-[10%] w-80 h-80 bg-linear-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[30%] right-[15%] w-96 h-96 bg-linear-to-r from-sky-200/15 to-cyan-200/15 rounded-full blur-3xl animate-pulse delay-1000" />
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
                                <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-50" />
                                <div className="relative w-12 h-12 rounded-2xl bg-linear-to-r from-blue-400 via-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
                                    <ShieldCheck className="w-6 h-6 text-black" />
                                </div>
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold tracking-tight bg-linear-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                    Entry Instructions
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Select standard rules or write your own — printed on tickets and event page
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Flowing accent line */}
                    <svg className="w-32 h-12 opacity-30 hidden md:block" viewBox="0 0 120 40" fill="none">
                        <path d="M0 20 Q 30 0, 60 20 T 120 20" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"/>
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Instructions Grid - Premium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DEFAULT_INSTRUCTIONS.map((instr, i) => {
                    const active = instructions.includes(instr);
                    const isHovered = hoveredInstruction === instr;

                    return (
                        <motion.button
                            key={instr}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                            onHoverStart={() => setHoveredInstruction(instr)}
                            onHoverEnd={() => setHoveredInstruction(null)}
                            onClick={() => onToggle(instr)}
                            className="group relative text-left"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                                    active 
                                        ? 'shadow-lg' 
                                        : 'shadow-sm hover:shadow-md'
                                }`}
                                style={{
                                    background: active 
                                        ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))"
                                        : "rgba(255, 255, 255, 0.8)",
                                    backdropFilter: "blur(20px)",
                                    border: active 
                                        ? '1px solid rgba(59, 130, 246, 0.3)' 
                                        : isHovered 
                                            ? '1px solid rgba(59, 130, 246, 0.2)' 
                                            : '1px solid rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Index number */}
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                        active 
                                            ? 'bg-linear-to-r from-blue-500 to-indigo-500 shadow-md' 
                                            : 'bg-stone-100 group-hover:bg-stone-200'
                                    }`}>
                                        <span className={`text-[9px] font-black font-mono ${
                                            active ? 'text-white' : 'text-stone-500'
                                        }`}>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>

                                    {/* Instruction text */}
                                    <span className={`text-[11px] font-medium leading-relaxed flex-1 transition-colors ${
                                        active ? 'text-stone-800' : 'text-stone-600 group-hover:text-stone-800'
                                    }`}>
                                        {instr}
                                    </span>

                                    {/* Selection indicator */}
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                                        active 
                                            ? 'border-blue-500 bg-blue-500' 
                                            : 'border-stone-300 group-hover:border-stone-400'
                                    }`}>
                                        {active && <Check className="w-3 h-3 text-black" />}
                                    </div>
                                </div>

                                {/* Animated bottom line for active */}
                                {active && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-indigo-500" />
                                )}
                            </motion.div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Custom Instruction Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onFocus={() => setFocusedCustom(true)}
                onBlur={() => setFocusedCustom(false)}
                className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                    focusedCustom ? 'shadow-xl scale-[1.01]' : 'shadow-md'
                }`}
                style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(20px)",
                    border: focusedCustom ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(0, 0, 0, 0.05)'
                }}
            >
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                            <Plus className="w-4 h-4 text-black" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-stone-800">Custom Instruction</h4>
                            <p className="text-[9px] font-mono text-stone-500">Add your own entry rule</p>
                        </div>
                        <span className="ml-auto text-[9px] font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
                            OPTIONAL
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                value={customInstruction}
                                onChange={(e) => onCustomChange(e.target.value)}
                                rows={2}
                                placeholder="Write a custom entry rule..."
                                className="w-full bg-stone-50 rounded-xl px-4 py-3 text-sm text-stone-700 placeholder:text-stone-400 outline-none resize-none border border-stone-200 focus:border-blue-400 transition-colors"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onCustomAdd}
                            disabled={!customInstruction.trim()}
                            className="px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                        >
                            Add Instruction
                        </motion.button>
                    </div>
                </div>

                {focusedCustom && (
                    <div className="absolute inset-0 rounded-2xl p-px bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50 pointer-events-none" />
                )}
            </motion.div>

            {/* Selected Instructions Panel */}
            <AnimatePresence>
                {instructions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative overflow-hidden rounded-2xl"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-sm" />
                        
                        <div className="relative">
                            {/* Panel Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 animate-pulse" />
                                    <span className="text-[10px] font-black font-mono text-stone-700 uppercase tracking-[0.2em]">
                                        {instructions.length} Rule{instructions.length > 1 ? "s" : ""} Selected
                                    </span>
                                </div>
                                <Sparkles className="w-3 h-3 text-indigo-400" />
                            </div>

                            {/* Selected Rules List */}
                            <div className="divide-y divide-stone-200/50">
                                {instructions.map((instr, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex items-start gap-4 px-6 py-4 group hover:bg-white/30 transition-colors"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0">
                                            <span className="text-[9px] font-black text-blue-600">
                                                {String(idx + 1).padStart(2, "0")}
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-medium text-stone-700 leading-relaxed flex-1">
                                            {instr}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() => onToggle(instr)}
                                            className="w-6 h-6 flex items-center justify-center rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-3 h-3" />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Footer Note */}
                            <div className="px-6 py-3 border-t border-stone-200/50 bg-linear-to-r from-stone-50/50 to-transparent">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3 text-amber-500" />
                                    <p className="text-[8px] font-mono text-stone-500">
                                        These rules will be printed on every ticket
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Helper Text */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 border border-stone-200">
                    <BookOpen className="w-3 h-3 text-blue-500" />
                    <p className="text-[9px] font-mono text-stone-500 tracking-[0.15em] uppercase">
                        Rules appear on event page & printed tickets
                    </p>
                </div>
            </motion.div>
        </section>
    );
}