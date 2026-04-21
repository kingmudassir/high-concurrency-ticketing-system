"use client";

import React, { useState, useEffect } from "react";
import {
    Tag, Music, Sparkles, Dumbbell, Theater, Palette,
    Gamepad2, Globe, Coffee, Heart, Camera, Check, X, Plus,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CATEGORY_TAGS: Record<string, { label: string; icon: React.ElementType; sub: string[]; linear: string; glow: string }> = {
    concert:    { label: "Concert",      icon: Music,     sub: ["Rock", "Pop", "Indie", "Jazz", "Classical", "Hip-Hop", "R&B", "Electronic", "Folk", "Metal", "Live Band", "Acoustic"], linear: "from-rose-400 via-pink-500 to-purple-500", glow: "shadow-rose-500/40" },
    festival:   { label: "Festival",     icon: Sparkles,  sub: ["Music Festival", "Food & Drink", "Cultural", "Art", "Film", "Literary", "Tech", "Fashion"], linear: "from-amber-400 via-orange-400 to-red-500", glow: "shadow-orange-500/40" },
    sports:     { label: "Sports",       icon: Dumbbell,  sub: ["Cricket", "Football", "Basketball", "Tennis", "Athletics", "Martial Arts", "Esports", "Wrestling"], linear: "from-blue-400 via-cyan-400 to-emerald-500", glow: "shadow-blue-500/40" },
    theatre:    { label: "Theatre",      icon: Theater,   sub: ["Drama", "Musical", "Comedy", "Stand-Up", "Improv", "Opera", "Dance", "Spoken Word"], linear: "from-indigo-400 via-purple-400 to-fuchsia-500", glow: "shadow-purple-500/40" },
    exhibition: { label: "Exhibition",   icon: Palette,   sub: ["Art", "Photography", "Design", "Science", "History", "Technology", "Fashion"], linear: "from-teal-400 via-emerald-400 to-green-500", glow: "shadow-emerald-500/40" },
    gaming:     { label: "Gaming",       icon: Gamepad2,  sub: ["Tournament", "LAN Party", "Launch Event", "Convention", "Cosplay"], linear: "from-violet-400 via-purple-400 to-fuchsia-500", glow: "shadow-violet-500/40" },
    networking: { label: "Networking",   icon: Globe,     sub: ["Tech", "Business", "Startup", "Creative", "Social", "Industry Meetup"], linear: "from-sky-400 via-blue-400 to-indigo-500", glow: "shadow-blue-500/40" },
    food:       { label: "Food & Drink", icon: Coffee,    sub: ["Tasting", "Pop-Up", "Market", "Workshop", "Competition", "Fine Dining"], linear: "from-amber-400 via-yellow-400 to-orange-500", glow: "shadow-amber-500/40" },
    wellness:   { label: "Wellness",     icon: Heart,     sub: ["Yoga", "Meditation", "Fitness", "Retreat", "Workshop", "Marathon"], linear: "from-emerald-400 via-teal-400 to-cyan-500", glow: "shadow-emerald-500/40" },
    film:       { label: "Film",         icon: Camera,    sub: ["Premiere", "Screening", "Film Festival", "Documentary", "Short Film"], linear: "from-red-400 via-rose-400 to-pink-500", glow: "shadow-rose-500/40" },
};

interface CategoryTagsSectionProps {
    category: string;
    selectedTags: string[];
    customTag: string;
    onCategoryChange: (cat: string) => void;
    onTagToggle: (tag: string) => void;
    onCustomTagChange: (val: string) => void;
    onCustomTagAdd: () => void;
}

export function CategoryTagsSection({
    category, selectedTags, customTag,
    onCategoryChange, onTagToggle, onCustomTagChange, onCustomTagAdd,
}: CategoryTagsSectionProps) {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const currentlinear = category ? CATEGORY_TAGS[category]?.linear : "from-rose-400 to-orange-400";

    return (
        <section className="relative space-y-12 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Floating orbs for atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-linear-to-r from-rose-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[30%] right-[5%] w-80 h-80 bg-linear-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
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
                                <div className="absolute inset-0 bg-linear-to-r from-rose-400 to-orange-400 rounded-2xl blur-xl opacity-50" />
                                <div className="relative w-12 h-12 rounded-2xl bg-linear-to-r from-rose-400 via-orange-400 to-amber-400 flex items-center justify-center shadow-lg">
                                    <Tag className="w-6 h-6 text-black" />
                                </div>
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold tracking-tight bg-linear-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                    Shape the vibe
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Every event has a soul — give it a voice
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Flowing accent line */}
                    <svg className="w-32 h-12 opacity-30 hidden md:block" viewBox="0 0 120 40" fill="none">
                        <path d="M0 20 Q 30 0, 60 20 T 120 20" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"/>
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#f43f5e" />
                                <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Category Selection - Floating Pills */}
            <div className="relative flex flex-wrap gap-2 justify-center">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-stone-100/50 to-transparent blur-2xl -z-10" />
                {Object.entries(CATEGORY_TAGS).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const isActive = category === key;
                    const isHovered = hoveredCategory === key;

                    return (
                        <motion.button
                            key={key}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.96 }}
                            onHoverStart={() => setHoveredCategory(key)}
                            onHoverEnd={() => setHoveredCategory(null)}
                            onClick={() => onCategoryChange(key)}
                            className={`relative px-6 py-3 rounded-full transition-all duration-500 group ${
                                isActive 
                                    ? "shadow-2xl" 
                                    : "hover:shadow-lg"
                            }`}
                            style={{
                                background: isActive 
                                    ? `linear-linear(135deg, ${cfg.linear.split(' ')[1]}, ${cfg.linear.split(' ')[3]})`
                                    : "white",
                                boxShadow: isActive ? `0 20px 35px -12px ${cfg.glow.split(' ')[0]}` : "0 2px 8px rgba(0,0,0,0.05)"
                            }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeBg"
                                    className="absolute inset-0 rounded-full"
                                    style={{ background: `linear-linear(135deg, ${cfg.linear.split(' ')[1]}, ${cfg.linear.split(' ')[3]})` }}
                                    initial={false}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <div className="relative flex items-center gap-2.5 z-10">
                                <div className={`transition-all duration-300 ${isActive ? "text-black" : "text-stone-500 group-hover:text-stone-700"}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className={`text-sm font-medium whitespace-nowrap transition-all ${isActive ? "text-black" : "text-stone-600"}`}>
                                    {cfg.label}
                                </span>
                                {!isActive && (
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: isHovered ? 1 : 0 }}
                                        className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-linear-to-r from-rose-400 to-orange-400"
                                    />
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Tags Panel - Fluid Morphing Card */}
            <AnimatePresence mode="wait">
                {category && (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, borderRadius: "2rem", scale: 0.98 }}
                        animate={{ opacity: 1, borderRadius: "1.5rem", scale: 1 }}
                        exit={{ opacity: 0, borderRadius: "3rem", scale: 0.96 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="relative overflow-hidden"
                        style={{
                            background: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                        }}
                    >
                        {/* Animated linear border */}
                        <div className="absolute inset-0 rounded-2xl p-px bg-linear-to-r from-transparent via-current to-transparent opacity-20" />
                        
                        {/* Content */}
                        <div className="relative p-8 space-y-8">
                            {/* Category header with dynamic linear */}
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <motion.div 
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className={`w-10 h-10 rounded-xl bg-linear-to-r ${CATEGORY_TAGS[category].linear} flex items-center justify-center shadow-lg`}
                                    >
                                        {React.createElement(CATEGORY_TAGS[category].icon, { className: "w-5 h-5 text-black" })}
                                    </motion.div>
                                    <div>
                                        <h4 className="text-xl font-bold text-stone-800">
                                            {CATEGORY_TAGS[category].label}
                                        </h4>
                                        <p className="text-xs text-stone-500">Select the flavors that define it</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100">
                                    <div className={`w-1.5 h-1.5 rounded-full bg-linear-to-r ${CATEGORY_TAGS[category].linear}`}>
                                        <div className="w-full h-full rounded-full animate-ping opacity-50" />
                                    </div>
                                    <span className="text-xs font-mono text-stone-600">
                                        {selectedTags.length} selected
                                    </span>
                                </div>
                            </div>

                            {/* Tags - Organic Flow */}
                            <div className="relative min-h-50">
                                <div className="absolute inset-0 bg-linear-to-br from-stone-50/50 to-transparent rounded-2xl -z-10" />
                                <div className="flex flex-wrap gap-2.5">
                                    {CATEGORY_TAGS[category].sub.map((tag, idx) => {
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                            <motion.button
                                                key={tag}
                                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                transition={{ delay: idx * 0.02 }}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => onTagToggle(tag)}
                                                className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden group ${
                                                    isSelected 
                                                        ? "text-black shadow-lg" 
                                                        : "text-stone-600 bg-white/80 hover:bg-white shadow-sm"
                                                }`}
                                                style={{
                                                    background: isSelected 
                                                        ? `linear-linear(135deg, ${CATEGORY_TAGS[category].linear.split(' ')[1]}, ${CATEGORY_TAGS[category].linear.split(' ')[3]})`
                                                        : "rgba(255, 255, 255, 0.9)"
                                                }}
                                            >
                                                {isSelected && (
                                                    <motion.div 
                                                        layoutId={`selected-${tag}`}
                                                        className="absolute inset-0"
                                                        style={{ background: `linear-linear(135deg, ${CATEGORY_TAGS[category].linear.split(' ')[1]}, ${CATEGORY_TAGS[category].linear.split(' ')[3]})` }}
                                                        initial={false}
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                )}
                                                <span className="relative z-10 flex items-center gap-2">
                                                    {isSelected && <Check className="w-3.5 h-3.5" />}
                                                    {tag}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Custom Tag - Minimal & Flowing */}
                            <div className="relative pt-4">
                                <div className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-stone-300 to-transparent" />
                                <div className="pt-6">
                                    <div className="flex items-center gap-2 bg-white/50 rounded-full border border-stone-200/50 p-1.5 pl-5 focus-within:border-transparent focus-within:ring-2 transition-all duration-300"
                                        style={{
                                            boxShadow: customTag.trim() ? `0 0 0 2px ${CATEGORY_TAGS[category].glow.split(' ')[0].replace('shadow', 'rgba').replace('/40', '0.2)')}` : "none"
                                        }}
                                    >
                                        <input
                                            value={customTag}
                                            onChange={(e) => onCustomTagChange(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && onCustomTagAdd()}
                                            placeholder="Add something unique..."
                                            className="flex-1 bg-transparent border-0 focus:outline-none text-stone-700 placeholder-stone-400 text-sm py-2.5 px-2.5"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={onCustomTagAdd}
                                            disabled={!customTag.trim()}
                                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                                                customTag.trim()
                                                    ? `bg-linear-to-r ${CATEGORY_TAGS[category].linear} text-black shadow-md`
                                                    : "bg-stone-100 text-stone-400"
                                            }`}
                                        >
                                            Add
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Tags - Floating Bubbles */}
                            {selectedTags.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-4 space-y-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-px bg-linear-to-r from-stone-400 to-transparent" />
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">Active Tags</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTags.map((tag, idx) => (
                                            <motion.div
                                                key={tag}
                                                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="group relative"
                                            >
                                                <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    style={{ background: `linear-linear(135deg, ${CATEGORY_TAGS[category].linear.split(' ')[1]}, ${CATEGORY_TAGS[category].linear.split(' ')[3]})` }}
                                                />
                                                <div className="relative flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm group-hover:shadow-md transition-all">
                                                    <span className="text-sm text-stone-700">{tag}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => onTagToggle(tag)}
                                                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors group/btn"
                                                    >
                                                        <X className="w-3 h-3 text-stone-400 group-hover/btn:text-red-500 transition-colors" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}