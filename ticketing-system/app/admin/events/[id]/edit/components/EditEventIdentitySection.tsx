"use client";

import React, { useState } from "react";
import { Type, AlignLeft } from "lucide-react";
import { motion } from "framer-motion";

interface FieldLabelProps {
    required?: boolean;
    optional?: boolean;
    children: React.ReactNode;
}

function FieldLabel({ required, optional, children }: FieldLabelProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-medium tracking-wide text-stone-500">
                {children}
            </span>
            {required && (
                <span className="text-[10px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                    REQUIRED
                </span>
            )}
            {optional && (
                <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                    OPTIONAL
                </span>
            )}
        </div>
    );
}

interface EventIdentitySectionProps {
    title: string;
    subtitle: string;
    description: string;
    onTitleChange: (value: string) => void;
    onSubtitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
}

export function EditEventIdentitySection({ 
    title, 
    subtitle, 
    description, 
    onTitleChange, 
    onSubtitleChange, 
    onDescriptionChange 
}: EventIdentitySectionProps) {
    const [focusedField, setFocusedField] = useState<string | null>(null);

    return (
        <section className="relative space-y-6 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                <Type className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-stone-800">
                                    Event Identity
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Name, subtitle, and description
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Form Card */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-white border border-stone-200 shadow-sm"
            >
                {/* Title Field */}
                <motion.div 
                    className="group relative border-b border-stone-200"
                    onFocus={() => setFocusedField("title")}
                    onBlur={() => setFocusedField(null)}
                >
                    <div className="flex items-start gap-0">
                        <motion.div 
                            animate={{ 
                                width: focusedField === "title" ? 3 : 2,
                                backgroundColor: focusedField === "title" ? "#10b981" : "#e5e7eb"
                            }}
                            transition={{ duration: 0.2 }}
                            className="h-24 shrink-0"
                        />
                        <div className="flex-1 px-6 py-5">
                            <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
                                <FieldLabel required>Event Title</FieldLabel>
                                {title && (
                                    <motion.span 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[10px] font-mono text-stone-400"
                                    >
                                        {title.length} chars
                                    </motion.span>
                                )}
                            </div>
                            <input
                                name="title"
                                required
                                value={title}
                                onChange={(e) => onTitleChange(e.target.value)}
                                placeholder="Enter event title"
                                className="w-full bg-transparent text-xl font-semibold text-stone-800 placeholder:text-stone-300 outline-none"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Subtitle Field */}
                <motion.div 
                    className="group relative border-b border-stone-200"
                    onFocus={() => setFocusedField("subtitle")}
                    onBlur={() => setFocusedField(null)}
                >
                    <div className="flex items-start gap-0">
                        <motion.div 
                            animate={{ width: focusedField === "subtitle" ? 3 : 2 }}
                            transition={{ duration: 0.2 }}
                            className="h-20 shrink-0"
                            style={{ background: focusedField === "subtitle" ? "#10b981" : "#e5e7eb" }}
                        />
                        <div className="flex-1 px-6 py-4">
                            <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
                                <FieldLabel optional>Subtitle</FieldLabel>
                                {subtitle && (
                                    <span className="text-[10px] font-mono text-stone-400">
                                        {subtitle.length} chars
                                    </span>
                                )}
                            </div>
                            <input
                                name="subtitle"
                                value={subtitle}
                                onChange={(e) => onSubtitleChange(e.target.value)}
                                placeholder="Optional subtitle"
                                className="w-full bg-transparent text-base text-stone-600 placeholder:text-stone-300 outline-none"
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
                            animate={{ width: focusedField === "description" ? 3 : 2 }}
                            transition={{ duration: 0.2 }}
                            className="h-auto min-h-40 shrink-0"
                            style={{ background: focusedField === "description" ? "#10b981" : "#e5e7eb" }}
                        />
                        <div className="flex-1 px-6 py-5">
                            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                                <FieldLabel>Description</FieldLabel>
                            </div>
                            
                            <textarea
                                name="description"
                                value={description}
                                onChange={(e) => onDescriptionChange(e.target.value)}
                                rows={5}
                                placeholder="Describe your event..."
                                className="w-full bg-transparent text-sm leading-relaxed text-stone-600 placeholder:text-stone-300 outline-none resize-none"
                            />
                            
                            {/* Character counter */}
                            {description && (
                                <div className="flex justify-end mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1 w-20 rounded-full bg-stone-100 overflow-hidden">
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

            {/* Tip Box */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-xl bg-stone-50 border border-stone-200"
            >
                <div className="relative flex items-stretch gap-0">
                    <div className="w-1 bg-emerald-500 shrink-0" />
                    <div className="flex items-center gap-3 px-5 py-3 flex-1 flex-wrap">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <AlignLeft className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[11px] text-stone-600 leading-relaxed">
                                <span className="font-medium text-emerald-600">Tip:</span>{" "}
                                Detailed descriptions help attendees understand what to expect.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}