"use client";

import { useState } from "react";
import { ShieldCheck, Check, X, Plus, AlertCircle, BookOpen } from "lucide-react";
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
        <section className="relative space-y-6 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-stone-800">
                                    Entry Instructions
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Select standard rules or write your own
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {DEFAULT_INSTRUCTIONS.map((instr, i) => {
                    const active = instructions.includes(instr);
                    const isHovered = hoveredInstruction === instr;

                    return (
                        <motion.button
                            key={instr}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.01 }}
                            onHoverStart={() => setHoveredInstruction(instr)}
                            onHoverEnd={() => setHoveredInstruction(null)}
                            onClick={() => onToggle(instr)}
                            className="group relative text-left"
                        >
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`relative overflow-hidden rounded-lg p-3 transition-all duration-200 ${
                                    active 
                                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                        : 'bg-white border-stone-200 shadow-sm hover:border-stone-300'
                                } border`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Index number */}
                                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                                        active ? 'bg-blue-600' : 'bg-stone-100'
                                    }`}>
                                        <span className={`text-[9px] font-bold ${
                                            active ? 'text-white' : 'text-stone-500'
                                        }`}>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>

                                    {/* Instruction text */}
                                    <span className={`text-[11px] leading-relaxed flex-1 ${
                                        active ? 'text-stone-800' : 'text-stone-600'
                                    }`}>
                                        {instr}
                                    </span>

                                    {/* Selection indicator */}
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                                        active 
                                            ? 'border-blue-500 bg-blue-500' 
                                            : 'border-stone-300'
                                    }`}>
                                        {active && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Custom Instruction Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onFocus={() => setFocusedCustom(true)}
                onBlur={() => setFocusedCustom(false)}
                className={`relative overflow-hidden rounded-xl transition-all duration-300 bg-white border ${
                    focusedCustom ? 'shadow-md border-blue-300' : 'shadow-sm border-stone-200'
                }`}
            >
                <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Plus className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-stone-800">Custom Instruction</h4>
                            <p className="text-[9px] text-stone-500">Add your own entry rule</p>
                        </div>
                        <span className="ml-auto text-[8px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                            OPTIONAL
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <textarea
                                value={customInstruction}
                                onChange={(e) => onCustomChange(e.target.value)}
                                rows={2}
                                placeholder="Write a custom entry rule..."
                                className="w-full bg-stone-50 rounded-lg px-3 py-2 text-sm text-stone-700 placeholder:text-stone-400 outline-none resize-none border border-stone-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="button"
                            onClick={onCustomAdd}
                            disabled={!customInstruction.trim()}
                            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                        >
                            Add Instruction
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Selected Instructions Panel */}
            <AnimatePresence>
                {instructions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative overflow-hidden rounded-xl bg-stone-50 border border-stone-200"
                    >
                        <div className="relative">
                            {/* Panel Header */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span className="text-[9px] font-medium text-stone-700 uppercase tracking-wide">
                                        {instructions.length} Rule{instructions.length > 1 ? "s" : ""} Selected
                                    </span>
                                </div>
                            </div>

                            {/* Selected Rules List */}
                            <div className="divide-y divide-stone-200">
                                {instructions.map((instr, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="flex items-start gap-3 px-5 py-3 group hover:bg-white transition-colors"
                                    >
                                        <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center shrink-0">
                                            <span className="text-[8px] font-bold text-blue-600">
                                                {String(idx + 1).padStart(2, "0")}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-stone-700 leading-relaxed flex-1">
                                            {instr}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            onClick={() => onToggle(instr)}
                                            className="w-5 h-5 flex items-center justify-center rounded text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-3 h-3" />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Footer Note */}
                            <div className="px-5 py-2 border-t border-stone-200 bg-stone-100">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3 text-amber-500" />
                                    <p className="text-[8px] text-stone-500">
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
                transition={{ delay: 0.15 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200">
                    <BookOpen className="w-3 h-3 text-stone-400" />
                    <p className="text-[9px] font-mono text-stone-500 tracking-wide uppercase">
                        Rules appear on event page & tickets
                    </p>
                </div>
            </motion.div>
        </section>
    );
}