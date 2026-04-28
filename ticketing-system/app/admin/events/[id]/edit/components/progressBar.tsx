"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";

export interface ProgressSection {
    id: string;
    num: string;
    label: string;
    icon: string;
    description: string;
}

interface FormProgressBarProps {
    sections: ProgressSection[];
    completedSections: Set<string>;
    currentSection: string;
    onSectionClick: (sectionId: string) => void;
}

export function FormProgressBar({ 
    sections, 
    completedSections, 
    currentSection,
    onSectionClick 
}: FormProgressBarProps) {
    const totalSections = sections.length;
    const completedCount = completedSections.size;
    const progressPercentage = (completedCount / totalSections) * 100;

    const isSectionCompleted = (sectionId: string) => completedSections.has(sectionId);
    const isSectionActive = (sectionId: string) => currentSection === sectionId;

    return (
        <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-stone-200/50 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-linear-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
                            <Zap className="w-3.5 h-3.5 text-black" />
                        </div>
                        <span className="text-[9px] font-mono font-black text-stone-500 uppercase tracking-[0.2em]">
                            Creation Flow
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-stone-900">{completedCount}</span>
                            <span className="text-[10px] font-mono text-stone-400">/{totalSections}</span>
                        </div>
                        <div className="w-px h-4 bg-stone-200" />
                        <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${progressPercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                            <span className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                                {Math.round(progressPercentage)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section Steps - Horizontal Navigation */}
                <div className="flex justify-between items-start relative">
                    {sections.map((section, idx) => {
                        const isCompleted = isSectionCompleted(section.id);
                        const isActive = isSectionActive(section.id);

                        return (
                            <button
                                key={section.id}
                                onClick={() => onSectionClick(section.id)}
                                className="group relative flex flex-col items-center focus:outline-none"
                                style={{ width: `${100 / sections.length}%` }}
                            >
                                {/* Connecting Line */}
                                {idx < sections.length - 1 && (
                                    <div className="absolute top-4 left-1/2 w-full h-px">
                                        <div className={`w-full h-full transition-all duration-500 ${
                                            isCompleted ? "bg-linear-to-r from-emerald-500 to-teal-500" : "bg-stone-200"
                                        }`} />
                                    </div>
                                )}

                                {/* Step Circle */}
                                <div className="relative z-10 mb-2">
                                    <motion.div
                                        animate={{
                                            scale: isActive ? 1.1 : 1,
                                        }}
                                        transition={{ 
                                            duration: 0.3, 
                                            ease: [0.23, 1, 0.32, 1]
                                        }}
                                        className={`relative flex items-center justify-center transition-all duration-300 ${
                                            isCompleted
                                                ? "bg-linear-to-r from-emerald-500 to-teal-500 text-black shadow-md shadow-emerald-500/25"
                                                : isActive
                                                ? "bg-white border-2 border-emerald-500 text-emerald-600 shadow-lg"
                                                : "bg-stone-100 border border-stone-200 text-stone-400 group-hover:border-emerald-300 group-hover:text-emerald-500"
                                        }`}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 14,
                                        }}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-4 h-4 stroke-[2.5]" />
                                        ) : (
                                            <span className="text-xs font-mono font-bold">
                                                {section.num}
                                            </span>
                                        )}
                                    </motion.div>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"
                                        />
                                    )}
                                </div>

                                {/* Label */}
                                <div className="text-center">
                                    <div className={`font-bold transition-all duration-300 ${
                                        isActive 
                                            ? "text-[10px] text-emerald-600" 
                                            : "text-[9px] text-stone-400 group-hover:text-stone-600"
                                    }`}>
                                        {section.label}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Active Section Description */}
                <motion.div
                    key={currentSection}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 pt-4 text-center border-t border-stone-100"
                >
                    <p className="text-[10px] font-mono text-stone-400">
                        {sections.find(s => s.id === currentSection)?.description || "Complete each section to build your event"}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}