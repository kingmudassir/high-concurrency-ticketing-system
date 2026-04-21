"use client";

import React, { useState } from "react";
import { Ticket, Plus, X, GripVertical, Sparkles, Crown, Star, Zap } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

const PRESETS = [
    { name: "General Admission", description: "Standard entry. Standing area. Access to main stage.", price: "", capacity: "", icon: Zap },
    { name: "Premium", description: "Reserved seating with premium sightlines. Priority entry.", price: "", capacity: "", icon: Star },
    { name: "VIP", description: "VIP lounge access, priority entry, complimentary drinks, exclusive merch.", price: "", capacity: "", icon: Crown },
    { name: "VVIP / Platinum", description: "Front-row experience, meet & greet, exclusive merch, hospitality suite.", price: "", capacity: "", icon: Sparkles },
];

const uid = () => Math.random().toString(36).slice(2, 9);

interface TicketTier {
    id: string;
    name: string;
    description: string;
    price: string;
    capacity: string;
}

interface TicketTiersSectionProps {
    tiers: TicketTier[];
    onChange: (tiers: TicketTier[]) => void;
}

export function TicketTiersSection({ tiers, onChange }: TicketTiersSectionProps) {
    const [focusedTier, setFocusedTier] = useState<string | null>(null);
    const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);

    function addPreset(preset: typeof PRESETS[0]) {
        onChange([...tiers, { id: uid(), name: preset.name, description: preset.description, price: preset.price, capacity: preset.capacity }]);
    }

    function addEmpty() {
        onChange([...tiers, { id: uid(), name: "", description: "", price: "", capacity: "" }]);
    }

    function updateTier(id: string, field: keyof TicketTier, value: string) {
        onChange(tiers.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
    }

    function removeTier(id: string) {
        if (tiers.length === 1) return;
        onChange(tiers.filter((t) => t.id !== id));
    }

    return (
        <section className="relative space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Floating orbs for atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[30%] right-[20%] w-96 h-96 bg-linear-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[20%] left-[15%] w-80 h-80 bg-linear-to-r from-indigo-200/15 to-violet-200/15 rounded-full blur-3xl animate-pulse delay-1000" />
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
                                    <Ticket className="w-6 h-6 text-black" />
                                </div>
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold tracking-tight bg-linear-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                    Ticket Tiers
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Define pricing tiers — at least one required
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

            {/* Quick-add presets - Premium Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PRESETS.map((preset, idx) => {
                    const Icon = preset.icon;
                    const isHovered = hoveredPreset === preset.name;
                    
                    return (
                        <motion.button
                            key={preset.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onHoverStart={() => setHoveredPreset(preset.name)}
                            onHoverEnd={() => setHoveredPreset(null)}
                            onClick={() => addPreset(preset)}
                            className="group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300"
                            style={{
                                background: "rgba(255, 255, 255, 0.9)",
                                backdropFilter: "blur(20px)",
                                border: isHovered ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(0, 0, 0, 0.05)',
                                boxShadow: isHovered ? '0 10px 25px -5px rgba(168, 85, 247, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md transition-all duration-300 ${
                                    isHovered ? 'scale-110' : ''
                                }`}>
                                    <Icon className="w-4 h-4 text-black" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-stone-800 mb-0.5">{preset.name}</h4>
                                    <p className="text-[10px] text-stone-500 line-clamp-2">{preset.description}</p>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </motion.button>
                    );
                })}
            </div>

            {/* Tier Cards */}
            <AnimatePresence mode="popLayout">
                <Reorder.Group axis="y" values={tiers} onReorder={onChange} className="space-y-4">
                    {tiers.map((tier, idx) => (
                        <Reorder.Item
                            key={tier.id}
                            value={tier}
                            onFocus={() => setFocusedTier(tier.id)}
                            onBlur={() => setFocusedTier(null)}
                        >
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                                    focusedTier === tier.id ? 'shadow-xl scale-[1.01]' : 'shadow-md hover:shadow-lg'
                                }`}
                                style={{
                                    background: "rgba(255, 255, 255, 0.9)",
                                    backdropFilter: "blur(20px)",
                                    border: focusedTier === tier.id ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                {/* Tier header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="cursor-grab active:cursor-grabbing">
                                            <GripVertical className="w-4 h-4 text-stone-400" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                                <span className="text-[9px] font-black text-purple-600">
                                                    {String(idx + 1).padStart(2, "0")}
                                                </span>
                                            </div>
                                            {tier.name && (
                                                <>
                                                    <span className="text-stone-300">|</span>
                                                    <span className="text-sm font-semibold text-stone-700">{tier.name}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() => removeTier(tier.id)}
                                        disabled={tiers.length === 1}
                                        className="w-7 h-7 flex items-center justify-center rounded-full text-stone-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-20 transition-all"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </motion.button>
                                </div>

                                {/* Fields */}
                                <div className="p-6 space-y-5">
                                    {/* Tier Name */}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-600 uppercase mb-2">
                                            Tier Name
                                            <span className="text-[9px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">REQUIRED</span>
                                        </label>
                                        <input
                                            value={tier.name}
                                            onChange={(e) => updateTier(tier.id, "name", e.target.value)}
                                            placeholder="General Admission"
                                            className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base font-medium py-2 border-b border-stone-200 focus:border-purple-400 transition-colors"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-600 uppercase mb-2">
                                            Perks / Description
                                            <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-full">OPTIONAL</span>
                                        </label>
                                        <textarea
                                            value={tier.description}
                                            onChange={(e) => updateTier(tier.id, "description", e.target.value)}
                                            rows={2}
                                            placeholder="What's included with this tier..."
                                            className="w-full bg-transparent text-stone-600 placeholder:text-stone-300 outline-none text-sm resize-none py-2 border-b border-stone-200 focus:border-purple-400 transition-colors"
                                        />
                                    </div>

                                    {/* Price & Capacity Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-600 uppercase mb-2">
                                                Price (PKR)
                                                <span className="text-[9px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">REQUIRED</span>
                                            </label>
                                            <div className="flex items-center border-b border-stone-200 focus-within:border-purple-400">
                                                <span className="text-base font-bold text-stone-400 mr-2 select-none">₨</span>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    value={tier.price}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/[^0-9]/g, "");
                                                        updateTier(tier.id, "price", val);
                                                    }}
                                                    placeholder="0"
                                                    className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base font-medium p-2"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-600 uppercase mb-2">
                                                Capacity
                                                <span className="text-[9px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">REQUIRED</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={tier.capacity}
                                                onChange={(e) => updateTier(tier.id, "capacity", e.target.value)}
                                                placeholder="Max tickets available"
                                                className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base font-medium py-2 border-b border-stone-200 focus:border-purple-400 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Animated linear border on focus */}
                                {focusedTier === tier.id && (
                                    <div className="absolute inset-0 rounded-2xl p-px bg-linear-to-r from-purple-500 via-pink-500 to-rose-500 opacity-50 pointer-events-none" />
                                )}
                            </motion.div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </AnimatePresence>

            {/* Add tier CTA - Premium Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={addEmpty}
                className="relative w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-sm font-bold font-mono text-purple-600 uppercase tracking-wider transition-all overflow-hidden group"
                style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    border: "1px dashed rgba(168, 85, 247, 0.3)"
                }}
            >
                <div className="absolute inset-0 bg-linear-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Plus className="w-4 h-4" />
                <span>Add Custom Tier</span>
                <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            {/* Helper Text */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 border border-stone-200">
                    <Ticket className="w-3 h-3 text-purple-500" />
                    <p className="text-[9px] font-mono text-stone-500 tracking-[0.15em] uppercase">
                        At least one ticket tier is required • Drag to reorder tiers
                    </p>
                </div>
            </motion.div>
        </section>
    );
}