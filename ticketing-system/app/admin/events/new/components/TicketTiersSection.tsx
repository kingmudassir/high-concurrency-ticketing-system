"use client";

import React from "react";
import { Ticket, Plus, X, GripVertical } from "lucide-react";
import { SectionHeader, FieldLabel, Input } from "./ui";
import type { TicketTier } from "../types";

// ─── Preset quick-add options ────────────────────────────────────────────────

const PRESETS = [
    { name: "General Admission", description: "Standard entry. Standing area.", price: "", capacity: "" },
    { name: "Premium",           description: "Reserved seating with better sightlines.", price: "", capacity: "" },
    { name: "VIP",               description: "VIP lounge access, priority entry, complimentary drinks.", price: "", capacity: "" },
    { name: "VVIP / Platinum",   description: "Front-row experience, meet & greet, exclusive merchandise.", price: "", capacity: "" },
];

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Component ───────────────────────────────────────────────────────────────

interface TicketTiersSectionProps {
    tiers: TicketTier[];
    onChange: (tiers: TicketTier[]) => void;
}

export function TicketTiersSection({ tiers, onChange }: TicketTiersSectionProps) {
    function addPreset(preset: typeof PRESETS[0]) {
        onChange([...tiers, { id: uid(), ...preset }]);
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
        <section>
            <SectionHeader number="06" label="Ticket Tiers" icon={<Ticket className="w-3.5 h-3.5" />} />

            {/* Quick-add presets */}
            <div className="mb-5">
                <p className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    Quick-add preset
                </p>
                <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.name}
                            type="button"
                            onClick={() => addPreset(preset)}
                            className="px-3 py-1.5 text-[8px] font-mono font-bold uppercase tracking-widest border border-zinc-200 text-zinc-500 bg-white hover:border-emerald-500 hover:text-emerald-700 transition-colors"
                        >
                            + {preset.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tier cards */}
            <div className="space-y-4">
                {tiers.map((tier, idx) => (
                    <div key={tier.id} className="bg-white border border-zinc-200 p-5">
                        {/* Card header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-mono font-bold text-zinc-300 tabular-nums">
                                    TIER {String(idx + 1).padStart(2, "0")}
                                </span>
                                <div className="w-px h-3 bg-zinc-200" />
                                <GripVertical className="w-3 h-3 text-zinc-300" />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeTier(tier.id)}
                                disabled={tiers.length === 1}
                                className="text-zinc-300 hover:text-rose-500 transition-colors disabled:opacity-30"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <FieldLabel>Tier Name</FieldLabel>
                                <Input
                                    value={tier.name}
                                    onChange={(e) => updateTier(tier.id, "name", e.target.value)}
                                    placeholder="General Admission"
                                    required
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <FieldLabel optional>Perks / Description</FieldLabel>
                                <Input
                                    value={tier.description}
                                    onChange={(e) => updateTier(tier.id, "description", e.target.value)}
                                    placeholder="What's included with this tier..."
                                />
                            </div>
                            <div>
                                <FieldLabel>Price (PKR)</FieldLabel>
                                <Input
                                    type="number"
                                    min="0"
                                    value={tier.price}
                                    onChange={(e) => updateTier(tier.id, "price", e.target.value)}
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div>
                                <FieldLabel>Capacity</FieldLabel>
                                <Input
                                    type="number"
                                    min="1"
                                    value={tier.capacity}
                                    onChange={(e) => updateTier(tier.id, "capacity", e.target.value)}
                                    placeholder="Max tickets"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add custom tier */}
            <button
                type="button"
                onClick={addEmpty}
                className="mt-4 w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 py-3 text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest hover:border-zinc-950 hover:text-zinc-950 transition-all"
            >
                <Plus className="w-3 h-3" /> Add Custom Tier
            </button>
        </section>
    );
}
