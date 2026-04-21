"use client";

import React, { useState } from "react";
import { Mic2, Plus, X, Clock, Sparkles, Calendar, Star, Crown } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

const uid = () => Math.random().toString(36).slice(2, 9);

const ROLE_OPTIONS: { value: LineupRole; label: string; icon: React.ElementType; linear: string }[] = [
    { value: "HEADLINER", label: "Headliner", icon: Crown, linear: "from-purple-500 to-pink-500" },
    { value: "SUPPORT", label: "Support", icon: Star, linear: "from-blue-500 to-cyan-500" },
    { value: "OPENER", label: "Opener", icon: Sparkles, linear: "from-emerald-500 to-teal-500" },
    { value: "SPECIAL_GUEST", label: "Special Guest", icon: Calendar, linear: "from-amber-500 to-orange-500" },
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

export function LineupSection({ lineup, onChange }: LineupSectionProps) {
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

    const getRoleConfig = (role: LineupRole) => {
        return ROLE_OPTIONS.find(r => r.value === role) || ROLE_OPTIONS[0];
    };

    return (
        <section className="relative space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Floating orbs for atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[30%] right-[20%] w-96 h-96 bg-linear-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[25%] left-[15%] w-80 h-80 bg-linear-to-r from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl animate-pulse delay-1000" />
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
                                <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-pink-500 rounded-2xl blur-xl opacity-50" />
                                <div className="relative w-12 h-12 rounded-2xl bg-linear-to-r from-purple-400 via-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                                    <Mic2 className="w-6 h-6 text-black" />
                                </div>
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold tracking-tight bg-linear-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                    Lineup
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Artists, performers, or speakers — shown publicly on the event page
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Flowing accent line */}
                    <svg className="w-32 h-12 opacity-30 hidden md:block" viewBox="0 0 120 40" fill="none">
                        <path d="M0 20 Q 30 0, 60 20 T 120 20" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"/>
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Lineup Cards */}
            <AnimatePresence mode="popLayout">
                {lineup.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative overflow-hidden rounded-3xl py-16 text-center"
                        style={{
                            background: "rgba(255, 255, 255, 0.6)",
                            backdropFilter: "blur(20px)",
                            border: "1px dashed rgba(168, 85, 247, 0.3)"
                        }}
                    >
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                                <Mic2 className="w-8 h-8 text-purple-400" />
                            </div>
                            <p className="text-sm font-semibold text-stone-600 mb-1">No acts added yet</p>
                            <p className="text-[10px] font-mono text-stone-400">Optional — skip if not applicable</p>
                        </div>
                    </motion.div>
                ) : (
                    <Reorder.Group axis="y" values={lineup} onReorder={onChange} className="space-y-4">
                        {lineup.map((act, idx) => {
                            const roleConfig = getRoleConfig(act.role);
                            const Icon = roleConfig.icon;
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
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                                            isFocused ? 'shadow-xl scale-[1.01]' : 'shadow-md hover:shadow-lg'
                                        }`}
                                        style={{
                                            background: "rgba(255, 255, 255, 0.9)",
                                            backdropFilter: "blur(20px)",
                                            border: isFocused ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(0, 0, 0, 0.05)'
                                        }}
                                    >
                                        {/* Act Header */}
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/50">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                                        <span className="text-[10px] font-black text-purple-600">
                                                            {String(idx + 1).padStart(2, "0")}
                                                        </span>
                                                    </div>
                                                    <div className={`px-3 py-1.5 rounded-full bg-linear-to-r ${roleConfig.linear} shadow-md`}>
                                                        <div className="flex items-center gap-1.5">
                                                            <Icon className="w-3 h-3 text-black" />
                                                            <span className="text-[8px] font-black uppercase tracking-wider text-black">
                                                                {roleConfig.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {act.name && (
                                                    <>
                                                        <span className="text-stone-300">|</span>
                                                        <span className="text-sm font-semibold text-stone-700">{act.name}</span>
                                                    </>
                                                )}
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                type="button"
                                                onClick={() => removeAct(act.id)}
                                                className="w-7 h-7 flex items-center justify-center rounded-full text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </motion.button>
                                        </div>

                                        {/* Fields */}
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                                {/* Act Name */}
                                                <div className="md:col-span-1">
                                                    <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-600 uppercase mb-2">
                                                        Act / Artist Name
                                                        <span className="text-[9px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">REQUIRED</span>
                                                    </label>
                                                    <input
                                                        value={act.name}
                                                        onChange={(e) => updateAct(act.id, "name", e.target.value)}
                                                        placeholder="The Neon Collective"
                                                        className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base font-medium py-2 border-b border-stone-200 focus:border-purple-400 transition-colors"
                                                    />
                                                </div>

                                                {/* Role Select */}
                                                <div className="md:col-span-1">
                                                    <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-600 uppercase mb-2">
                                                        Role
                                                        <span className="text-[9px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">REQUIRED</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={act.role}
                                                            onChange={(e) => updateAct(act.id, "role", e.target.value as LineupRole)}
                                                            className="w-full bg-transparent border-b border-stone-200 py-2 pr-8 text-sm font-medium text-stone-700 focus:outline-none focus:border-purple-400 transition-colors appearance-none cursor-pointer"
                                                        >
                                                            {ROLE_OPTIONS.map((opt) => (
                                                                <option key={opt.value} value={opt.value} className="text-stone-800">
                                                                    {opt.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <div className={`w-5 h-5 rounded-full bg-linear-to-r ${roleConfig.linear} opacity-50`} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Stage Time */}
                                                <div className="md:col-span-1">
                                                    <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-600 uppercase mb-2">
                                                        <Clock className="w-3 h-3" />
                                                        Stage Time
                                                        <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-full">OPTIONAL</span>
                                                    </label>
                                                    <input
                                                        value={act.startTime}
                                                        onChange={(e) => updateAct(act.id, "startTime", e.target.value)}
                                                        placeholder="10:00 PM"
                                                        className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base font-medium py-2 border-b border-stone-200 focus:border-purple-400 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Animated linear border on focus */}
                                        {isFocused && (
                                            <div className="absolute inset-0 rounded-2xl p-px bg-linear-to-r from-purple-500 via-pink-500 to-rose-500 opacity-50 pointer-events-none" />
                                        )}
                                        
                                        {/* Hover glow effect */}
                                        {isHovered && !isFocused && (
                                            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5 pointer-events-none" />
                                        )}
                                    </motion.div>
                                </Reorder.Item>
                            );
                        })}
                    </Reorder.Group>
                )}
            </AnimatePresence>

            {/* Add Act Button - Premium */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={addAct}
                className="relative w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-sm font-bold font-mono text-purple-600 uppercase tracking-wider transition-all overflow-hidden group"
                style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    border: "1px dashed rgba(168, 85, 247, 0.3)"
                }}
            >
                <div className="absolute inset-0 bg-linear-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Plus className="w-4 h-4" />
                <span>Add Act</span>
                <Mic2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            {/* Helper Text */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 border border-stone-200">
                    <Mic2 className="w-3 h-3 text-purple-500" />
                    <p className="text-[9px] font-mono text-stone-500 tracking-[0.15em] uppercase">
                        Drag to reorder acts • Lineup appears in event schedule
                    </p>
                </div>
            </motion.div>
        </section>
    );
}