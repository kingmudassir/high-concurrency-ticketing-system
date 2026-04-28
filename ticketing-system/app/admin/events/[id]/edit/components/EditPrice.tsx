"use client";

import React, { useState } from "react";
import { Ticket, Plus, X, GripVertical } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

const PRESETS = [
    { name: "General Admission", description: "Standard entry. Standing area. Access to main stage.", price: "", capacity: "" },
    { name: "Premium", description: "Reserved seating with premium sightlines. Priority entry.", price: "", capacity: "" },
    { name: "VIP", description: "VIP lounge access, priority entry, complimentary drinks, exclusive merch.", price: "", capacity: "" },
    { name: "VVIP / Platinum", description: "Front-row experience, meet & greet, exclusive merch, hospitality suite.", price: "", capacity: "" },
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

export function EditPrice({ tiers, onChange }: TicketTiersSectionProps) {
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
        <section className="relative space-y-6 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                                <Ticket className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-stone-800">
                                    Ticket Tiers
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Define pricing tiers — at least one required
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick-add presets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PRESETS.map((preset, idx) => {
                    const isHovered = hoveredPreset === preset.name;
                    
                    return (
                        <motion.button
                            type="button"
                            key={preset.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onHoverStart={() => setHoveredPreset(preset.name)}
                            onHoverEnd={() => setHoveredPreset(null)}
                            onClick={() => addPreset(preset)}
                            className={`group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 bg-white border ${
                                isHovered ? 'border-purple-300 shadow-md' : 'border-stone-200 shadow-sm'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Ticket className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-stone-800 mb-0.5">{preset.name}</h4>
                                    <p className="text-[10px] text-stone-500 line-clamp-2">{preset.description}</p>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Tier Cards */}
            <AnimatePresence mode="popLayout">
                <Reorder.Group axis="y" values={tiers} onReorder={onChange} className="space-y-3">
                    {tiers.map((tier, idx) => (
                        <Reorder.Item
                            key={tier.id}
                            value={tier}
                            onFocus={() => setFocusedTier(tier.id)}
                            onBlur={() => setFocusedTier(null)}
                        >
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className={`relative overflow-hidden rounded-xl transition-all duration-300 bg-white border ${
                                    focusedTier === tier.id ? 'shadow-md border-purple-300' : 'shadow-sm border-stone-200'
                                }`}
                            >
                                {/* Tier header */}
                                <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-stone-50">
                                    <div className="flex items-center gap-3">
                                        <div className="cursor-grab active:cursor-grabbing">
                                            <GripVertical className="w-4 h-4 text-stone-400" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                                                <span className="text-[9px] font-bold text-purple-600">
                                                    {String(idx + 1).padStart(2, "0")}
                                                </span>
                                            </div>
                                            {tier.name && (
                                                <>
                                                    <span className="text-stone-300">|</span>
                                                    <span className="text-sm font-medium text-stone-700">{tier.name}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        onClick={() => removeTier(tier.id)}
                                        disabled={tiers.length === 1}
                                        className="w-7 h-7 flex items-center justify-center rounded-full text-stone-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-20 transition-all"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </motion.button>
                                </div>

                                {/* Fields */}
                                <div className="p-5 space-y-4">
                                    {/* Tier Name */}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-medium tracking-wide text-stone-600 uppercase mb-2">
                                            Tier Name
                                            <span className="text-[9px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">REQUIRED</span>
                                        </label>
                                        <input
                                            value={tier.name}
                                            onChange={(e) => updateTier(tier.id, "name", e.target.value)}
                                            placeholder="General Admission"
                                            className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base py-2 border-b border-stone-200 focus:border-purple-400 transition-colors"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-medium tracking-wide text-stone-600 uppercase mb-2">
                                            Perks / Description
                                            <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">OPTIONAL</span>
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-2 text-xs font-medium tracking-wide text-stone-600 uppercase mb-2">
                                                Price (PKR)
                                                <span className="text-[9px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">REQUIRED</span>
                                            </label>
                                            <div className="flex items-center border-b border-stone-200 focus-within:border-purple-400">
                                                <span className="text-base font-medium text-stone-400 mr-2 select-none">₨</span>
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
                                                    className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base py-2"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-xs font-medium tracking-wide text-stone-600 uppercase mb-2">
                                                Capacity
                                                <span className="text-[9px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">REQUIRED</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={tier.capacity}
                                                onChange={(e) => updateTier(tier.id, "capacity", e.target.value)}
                                                placeholder="Max tickets available"
                                                className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base py-2 border-b border-stone-200 focus:border-purple-400 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </AnimatePresence>

            {/* Add tier CTA */}
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={addEmpty}
                className="relative w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-purple-600 uppercase tracking-wide transition-all bg-white border border-dashed border-purple-300 hover:bg-purple-50"
            >
                <Plus className="w-4 h-4" />
                <span>Add Custom Tier</span>
            </motion.button>

            {/* Helper Text */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200">
                    <Ticket className="w-3 h-3 text-stone-400" />
                    <p className="text-[9px] font-mono text-stone-500 tracking-wide uppercase">
                        At least one tier required • Drag to reorder
                    </p>
                </div>
            </motion.div>
        </section>
    );
}