"use client";

import React, { useState } from "react";
import { Tag, Music, Dumbbell, Theater, Palette, Gamepad2, Globe, Coffee, Heart, Camera, Check, X, Plus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CATEGORY_TAGS: Record<string, { label: string; icon: React.ElementType; sub: string[] }> = {
    concert:    { label: "Concert",      icon: Music,     sub: ["Rock", "Pop", "Indie", "Jazz", "Classical", "Hip-Hop", "R&B", "Electronic", "Folk", "Metal", "Live Band", "Acoustic"] },
    festival:   { label: "Festival",     icon: Sparkles,  sub: ["Music Festival", "Food & Drink", "Cultural", "Art", "Film", "Literary", "Tech", "Fashion"] },
    sports:     { label: "Sports",       icon: Dumbbell,  sub: ["Cricket", "Football", "Basketball", "Tennis", "Athletics", "Martial Arts", "Esports", "Wrestling"] },
    theatre:    { label: "Theatre",      icon: Theater,   sub: ["Drama", "Musical", "Comedy", "Stand-Up", "Improv", "Opera", "Dance", "Spoken Word"] },
    exhibition: { label: "Exhibition",   icon: Palette,   sub: ["Art", "Photography", "Design", "Science", "History", "Technology", "Fashion"] },
    gaming:     { label: "Gaming",       icon: Gamepad2,  sub: ["Tournament", "LAN Party", "Launch Event", "Convention", "Cosplay"] },
    networking: { label: "Networking",   icon: Globe,     sub: ["Tech", "Business", "Startup", "Creative", "Social", "Industry Meetup"] },
    food:       { label: "Food & Drink", icon: Coffee,    sub: ["Tasting", "Pop-Up", "Market", "Workshop", "Competition", "Fine Dining"] },
    wellness:   { label: "Wellness",     icon: Heart,     sub: ["Yoga", "Meditation", "Fitness", "Retreat", "Workshop", "Marathon"] },
    film:       { label: "Film",         icon: Camera,    sub: ["Premiere", "Screening", "Film Festival", "Documentary", "Short Film"] },
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

    return (
        <section className="relative space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                <Tag className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-stone-800">
                                    Category & Tags
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Define your event's identity
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Selection */}
            <div className="relative flex flex-wrap gap-2 justify-center">
                {Object.entries(CATEGORY_TAGS).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const isActive = category === key;

                    return (
                        <motion.button
                            key={key}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onHoverStart={() => setHoveredCategory(key)}
                            onHoverEnd={() => setHoveredCategory(null)}
                            onClick={() => onCategoryChange(key)}
                            className={`relative px-5 py-2.5 rounded-full transition-all duration-300 ${
                                isActive 
                                    ? "bg-emerald-600 text-white shadow-md" 
                                    : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
                            }`}
                        >
                            <div className="relative flex items-center gap-2 z-10">
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium whitespace-nowrap">
                                    {cfg.label}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Tags Panel */}
            <AnimatePresence mode="wait">
                {category && (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="relative overflow-hidden bg-white rounded-2xl border border-stone-200 shadow-md"
                    >
                        {/* Content */}
                        <div className="relative p-6 space-y-6">
                            {/* Category header */}
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        {React.createElement(CATEGORY_TAGS[category].icon, { className: "w-5 h-5 text-emerald-600" })}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-stone-800">
                                            {CATEGORY_TAGS[category].label}
                                        </h4>
                                        <p className="text-xs text-stone-500">Select tags that define your event</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-xs font-mono text-stone-600">
                                        {selectedTags.length} selected
                                    </span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="relative">
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORY_TAGS[category].sub.map((tag, idx) => {
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                            <motion.button
                                                key={tag}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.01 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => onTagToggle(tag)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                                    isSelected 
                                                        ? "bg-emerald-600 text-white shadow-sm" 
                                                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                                }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {isSelected && <Check className="w-3.5 h-3.5" />}
                                                    {tag}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Custom Tag Input */}
                            <div className="relative pt-2">
                                <div className="border-t border-stone-200 pt-4">
                                    <div className="flex items-center gap-2 bg-stone-50 rounded-full border border-stone-200 p-1 pl-4 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                        <input
                                            value={customTag}
                                            onChange={(e) => onCustomTagChange(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && onCustomTagAdd()}
                                            placeholder="Add a custom tag..."
                                            className="flex-1 bg-transparent border-0 focus:outline-none text-stone-700 placeholder-stone-400 text-sm py-2"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={onCustomTagAdd}
                                            disabled={!customTag.trim()}
                                            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                                                customTag.trim()
                                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                    : "bg-stone-200 text-stone-400 cursor-not-allowed"
                                            }`}
                                        >
                                            Add
                                            <Plus className="w-3.5 h-3.5" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Tags */}
                            {selectedTags.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-2 space-y-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-px bg-stone-300" />
                                        <span className="text-[10px] uppercase tracking-wide text-stone-400 font-medium">Selected Tags</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTags.map((tag, idx) => (
                                            <motion.div
                                                key={tag}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.02 }}
                                                className="relative"
                                            >
                                                <div className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-stone-100 border border-stone-200">
                                                    <span className="text-sm text-stone-700">{tag}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => onTagToggle(tag)}
                                                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 transition-colors"
                                                    >
                                                        <X className="w-3 h-3 text-stone-500 hover:text-red-600 transition-colors" />
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