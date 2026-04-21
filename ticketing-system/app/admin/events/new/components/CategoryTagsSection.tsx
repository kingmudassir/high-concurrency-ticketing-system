"use client";

import React from "react";
import {
  Tag, Music, Sparkles, Dumbbell, Theater, Palette,
  Gamepad2, Globe, Coffee, Heart, Camera, Check, X, Plus, Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Category definitions ────────────────────────────────────────────────────

export const CATEGORY_TAGS: Record<string, { label: string; icon: React.ElementType; sub: string[] }> = {
    concert: {
        label: "Concert",
        icon: Music,
        sub: ["Rock", "Pop", "Indie", "Jazz", "Classical", "Hip-Hop", "R&B", "Electronic", "Folk", "Metal", "Live Band", "Acoustic"],
    },
    festival: {
        label: "Festival",
        icon: Sparkles,
        sub: ["Music Festival", "Food & Drink", "Cultural", "Art", "Film", "Literary", "Tech", "Fashion"],
    },
    sports: {
        label: "Sports",
        icon: Dumbbell,
        sub: ["Cricket", "Football", "Basketball", "Tennis", "Athletics", "Martial Arts", "Esports", "Wrestling"],
    },
    theatre: {
        label: "Theatre",
        icon: Theater,
        sub: ["Drama", "Musical", "Comedy", "Stand-Up", "Improv", "Opera", "Dance", "Spoken Word"],
    },
    exhibition: {
        label: "Exhibition",
        icon: Palette,
        sub: ["Art", "Photography", "Design", "Science", "History", "Technology", "Fashion"],
    },
    gaming: {
        label: "Gaming",
        icon: Gamepad2,
        sub: ["Tournament", "LAN Party", "Launch Event", "Convention", "Cosplay"],
    },
    networking: {
        label: "Networking",
        icon: Globe,
        sub: ["Tech", "Business", "Startup", "Creative", "Social", "Industry Meetup"],
    },
    food: {
        label: "Food & Drink",
        icon: Coffee,
        sub: ["Tasting", "Pop-Up", "Market", "Workshop", "Competition", "Fine Dining"],
    },
    wellness: {
        label: "Wellness",
        icon: Heart,
        sub: ["Yoga", "Meditation", "Fitness", "Retreat", "Workshop", "Marathon"],
    },
    film: {
        label: "Film",
        icon: Camera,
        sub: ["Premiere", "Screening", "Film Festival", "Documentary", "Short Film"],
    },
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
    category,
    selectedTags,
    customTag,
    onCategoryChange,
    onTagToggle,
    onCustomTagChange,
    onCustomTagAdd,
    }: CategoryTagsSectionProps) {
    return (
        <section className="space-y-10">
        {/* SECTION HEADER */}
        <div className="flex items-end justify-between border-b border-zinc-100 pb-4">
            <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                <Tag className="w-3 h-3 fill-emerald-500" /> Taxonomy
            </p>
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 uppercase">
                Category & Genre
            </h2>
            </div>
        </div>

        {/* PRIMARY CATEGORY SELECTOR */}
        <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
            Select Primary Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(CATEGORY_TAGS).map(([key, cfg]) => {
                const Icon = cfg.icon;
                const isActive = category === key;
                return (
                <button
                    key={key}
                    type="button"
                    onClick={() => onCategoryChange(key)}
                    className={`relative flex flex-col items-center justify-center gap-3 p-6 transition-all duration-300 group overflow-hidden border ${
                    isActive
                        ? "border-emerald-500 bg-emerald-50/30"
                        : "border-zinc-100 bg-white hover:border-zinc-300"
                    }`}
                >
                    <Icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${
                    isActive ? "text-emerald-600" : "text-zinc-400 group-hover:text-zinc-950"
                    }`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                    isActive ? "text-emerald-700" : "text-zinc-500 group-hover:text-zinc-950"
                    }`}>
                    {cfg.label}
                    </span>
                    {isActive && (
                    <motion.div 
                        layoutId="activeCategory"
                        className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500" 
                    />
                    )}
                </button>
                );
            })}
            </div>
        </div>

        {/* SUB-TAGS EXPLORER */}
        <AnimatePresence mode="wait">
            {category && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-6 bg-zinc-50/50 p-8 border border-zinc-100 rounded-3xl"
            >
                <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                    Refine with Tags
                </label>
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                    Selected: {selectedTags.length}
                </span>
                </div>

                <div className="flex flex-wrap gap-2">
                {CATEGORY_TAGS[category].sub.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => onTagToggle(tag)}
                        className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full border transition-all duration-300 ${
                        isSelected
                            ? "bg-zinc-950 text-white border-zinc-950 ring-4 ring-zinc-950/10"
                            : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-950 hover:text-zinc-950"
                        }`}
                    >
                        {isSelected ? <Check className="w-3 h-3 text-emerald-400" /> : <Hash className="w-3 h-3 text-zinc-300" />}
                        {tag}
                    </button>
                    );
                })}
                </div>

                {/* CUSTOM TAG INPUT */}
                <div className="pt-6 border-t border-zinc-200/60">
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Plus className="w-4 h-4 text-zinc-300 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                        placeholder="ENTER CUSTOM GENRE..."
                        value={customTag}
                        onChange={(e) => onCustomTagChange(e.target.value)}
                        onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            onCustomTagAdd();
                        }
                        }}
                        className="w-full bg-white border border-zinc-200 pl-11 pr-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] placeholder:text-zinc-300 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                    />
                    </div>
                    <button
                    type="button"
                    onClick={onCustomTagAdd}
                    className="px-8 py-4 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 active:scale-95 transition-all shadow-xl shadow-zinc-950/10"
                    >
                    Append
                    </button>
                </div>
                </div>

                {/* SELECTION SUMMARY PILLS */}
                {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4">
                    {selectedTags.map((tag) => (
                    <motion.span
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={tag}
                        className="inline-flex items-center gap-2 pl-3 pr-1 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-tighter rounded-md group"
                    >
                        {tag}
                        <button 
                        type="button" 
                        onClick={() => onTagToggle(tag)}
                        className="p-1 hover:bg-emerald-600 rounded transition-colors"
                        >
                        <X className="w-3 h-3" />
                        </button>
                    </motion.span>
                    ))}
                </div>
                )}
            </motion.div>
            )}
        </AnimatePresence>
        </section>
    );
}