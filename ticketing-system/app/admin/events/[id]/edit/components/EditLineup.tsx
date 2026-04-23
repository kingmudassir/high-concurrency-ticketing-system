"use client";

import React, { useState } from "react";
import { Mic2, Plus, X, Clock } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

const uid = () => Math.random().toString(36).slice(2, 9);

const ROLE_OPTIONS: { value: LineupRole; label: string }[] = [
    { value: "HEADLINER", label: "Headliner" },
    { value: "SUPPORT", label: "Support" },
    { value: "OPENER", label: "Opener" },
    { value: "SPECIAL_GUEST", label: "Special Guest" },
];

interface LineupAct {
    id: string;
    name: string;
    role: LineupRole;
    startTime: string;
}

type LineupRole = "HEADLINER" | "SUPPORT" | "OPENER" | "SPECIAL_GUEST";

interface LineupSectionProps {
    lineup: LineupAct[];
    onChange: (lineup: LineupAct[]) => void;
}

export function EditLineup({ lineup, onChange }: LineupSectionProps) {
    const [focusedAct, setFocusedAct] = useState<string | null>(null);
    const [hoveredAct, setHoveredAct] = useState<string | null>(null);

    function addAct() {
        onChange([...lineup, { id: uid(), name: "", role: "HEADLINER", startTime: "" }]);
    }

    function updateAct(id: string, field: keyof LineupAct, value: string) {
        onChange(lineup.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
    }

    function removeAct(id: string) {
        onChange(lineup.filter((a) => a.id !== id));
    }

    const getRoleLabel = (role: LineupRole) => {
        return ROLE_OPTIONS.find(r => r.value === role)?.label || ROLE_OPTIONS[0].label;
    };

    return (
        <section className="relative space-y-6 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                                <Mic2 className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-stone-800">
                                    Lineup
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Artists, performers, or speakers
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lineup Cards */}
            <AnimatePresence mode="popLayout">
                {lineup.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative overflow-hidden rounded-xl py-12 text-center bg-white border border-dashed border-stone-300"
                    >
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-lg bg-stone-100 flex items-center justify-center mx-auto mb-3">
                                <Mic2 className="w-7 h-7 text-stone-400" />
                            </div>
                            <p className="text-sm font-medium text-stone-600 mb-1">No acts added yet</p>
                            <p className="text-[10px] text-stone-400">Optional — skip if not applicable</p>
                        </div>
                    </motion.div>
                ) : (
                    <Reorder.Group axis="y" values={lineup} onReorder={onChange} className="space-y-3">
                        {lineup.map((act, idx) => {
                            const isFocused = focusedAct === act.id;
                            const isHovered = hoveredAct === act.id;

                            return (
                                <Reorder.Item
                                    key={act.id}
                                    value={act}
                                    onFocus={() => setFocusedAct(act.id)}
                                    onBlur={() => setFocusedAct(null)}
                                    onMouseEnter={() => setHoveredAct(act.id)}
                                    onMouseLeave={() => setHoveredAct(null)}
                                >
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        className={`relative overflow-hidden rounded-xl transition-all duration-300 bg-white border ${
                                            isFocused ? 'shadow-md border-purple-300' : 'shadow-sm border-stone-200'
                                        }`}
                                    >
                                        {/* Act Header */}
                                        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-stone-50">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                                                        <span className="text-[9px] font-bold text-purple-600">
                                                            {String(idx + 1).padStart(2, "0")}
                                                        </span>
                                                    </div>
                                                    <div className="px-2.5 py-1 rounded-full bg-purple-600">
                                                        <span className="text-[8px] font-bold uppercase tracking-wide text-white">
                                                            {getRoleLabel(act.role)}
                                                        </span>
                                                    </div>
                                                </div>
                                                {act.name && (
                                                    <>
                                                        <span className="text-stone-300">|</span>
                                                        <span className="text-sm font-medium text-stone-700">{act.name}</span>
                                                    </>
                                                )}
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="button"
                                                onClick={() => removeAct(act.id)}
                                                className="w-7 h-7 flex items-center justify-center rounded-full text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </motion.button>
                                        </div>

                                        {/* Fields */}
                                        <div className="p-5">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {/* Act Name */}
                                                <div className="md:col-span-1">
                                                    <label className="flex items-center gap-2 text-xs font-medium tracking-wide text-stone-600 uppercase mb-2">
                                                        Act / Artist Name
                                                        <span className="text-[9px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">REQUIRED</span>
                                                    </label>
                                                    <input
                                                        value={act.name}
                                                        onChange={(e) => updateAct(act.id, "name", e.target.value)}
                                                        placeholder="The Neon Collective"
                                                        className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base py-2 border-b border-stone-200 focus:border-purple-400 transition-colors"
                                                    />
                                                </div>

                                                {/* Role Select */}
                                                <div className="md:col-span-1">
                                                    <label className="flex items-center gap-2 text-xs font-medium tracking-wide text-stone-600 uppercase mb-2">
                                                        Role
                                                        <span className="text-[9px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">REQUIRED</span>
                                                    </label>
                                                    <select
                                                        value={act.role}
                                                        onChange={(e) => updateAct(act.id, "role", e.target.value as LineupRole)}
                                                        className="w-full bg-transparent border-b border-stone-200 py-2 text-sm font-medium text-stone-700 focus:outline-none focus:border-purple-400 transition-colors cursor-pointer"
                                                    >
                                                        {ROLE_OPTIONS.map((opt) => (
                                                            <option key={opt.value} value={opt.value} className="text-stone-800">
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Stage Time */}
                                                <div className="md:col-span-1">
                                                    <label className="flex items-center gap-2 text-xs font-medium tracking-wide text-stone-600 uppercase mb-2">
                                                        <Clock className="w-3 h-3" />
                                                        Stage Time
                                                        <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">OPTIONAL</span>
                                                    </label>
                                                    <input
                                                        value={act.startTime}
                                                        onChange={(e) => updateAct(act.id, "startTime", e.target.value)}
                                                        placeholder="10:00 PM"
                                                        className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base py-2 border-b border-stone-200 focus:border-purple-400 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Reorder.Item>
                            );
                        })}
                    </Reorder.Group>
                )}
            </AnimatePresence>

            {/* Add Act Button */}
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={addAct}
                className="relative w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-purple-600 uppercase tracking-wide transition-all bg-white border border-dashed border-purple-300 hover:bg-purple-50"
            >
                <Plus className="w-4 h-4" />
                <span>Add Act</span>
            </motion.button>

            {/* Helper Text */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200">
                    <Mic2 className="w-3 h-3 text-stone-400" />
                    <p className="text-[9px] font-mono text-stone-500 tracking-wide uppercase">
                        Drag to reorder acts
                    </p>
                </div>
            </motion.div>
        </section>
    );
}