"use client";

import React from "react";
import { Mic2, Plus, X, Clock } from "lucide-react";
import { SectionHeader, FieldLabel, Input } from "./ui";
import { LINEUP_ROLE_CONFIG } from "../types";
import type { LineupAct, LineupRole } from "../types";

const uid = () => Math.random().toString(36).slice(2, 9);

interface LineupSectionProps {
    lineup: LineupAct[];
    onChange: (lineup: LineupAct[]) => void;
}

export function LineupSection({ lineup, onChange }: LineupSectionProps) {
    function addAct() {
        onChange([...lineup, { id: uid(), name: "", role: "HEADLINER", startTime: "" }]);
    }

    function updateAct(id: string, field: keyof LineupAct, value: string) {
        onChange(lineup.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
    }

    function removeAct(id: string) {
        onChange(lineup.filter((a) => a.id !== id));
    }

    return (
        <section>
            <SectionHeader number="08" label="Lineup" icon={<Mic2 className="w-3.5 h-3.5" />} />

            <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-5">
                Add artists, performers, or speakers. Shown publicly on the event page.
            </p>

            {/* Empty state */}
            {lineup.length === 0 ? (
                <div className="border border-dashed border-zinc-200 py-10 flex flex-col items-center gap-3 text-center mb-4">
                    <Mic2 className="w-6 h-6 text-zinc-200" />
                    <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                        No acts added yet
                    </p>
                </div>
            ) : (
                <div className="space-y-3 mb-4">
                    {lineup.map((act, idx) => {
                        const roleCfg = LINEUP_ROLE_CONFIG[act.role];
                        return (
                            <div key={act.id} className="bg-white border border-zinc-200 p-4">
                                {/* Card header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-mono font-bold text-zinc-300 tabular-nums">
                                            {String(idx + 1).padStart(2, "0")}
                                        </span>
                                        <span className={`px-2 py-0.5 text-[7px] font-mono font-bold uppercase border ${roleCfg.color}`}>
                                            {roleCfg.label}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAct(act.id)}
                                        className="text-zinc-300 hover:text-rose-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <FieldLabel>Act / Artist Name</FieldLabel>
                                        <Input
                                            value={act.name}
                                            onChange={(e) => updateAct(act.id, "name", e.target.value)}
                                            placeholder="The Neon Collective"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel>Role</FieldLabel>
                                        <select
                                            value={act.role}
                                            onChange={(e) =>
                                                updateAct(act.id, "role", e.target.value as LineupRole)
                                            }
                                            className="w-full bg-zinc-50 border border-zinc-200 py-3 px-4 text-[11px] font-mono text-zinc-800 focus:outline-none focus:border-zinc-950 transition-all"
                                        >
                                            <option value="HEADLINER">Headliner</option>
                                            <option value="SUPPORT">Support</option>
                                            <option value="OPENER">Opener</option>
                                            <option value="SPECIAL_GUEST">Special Guest</option>
                                        </select>
                                    </div>
                                    <div>
                                        <FieldLabel optional>
                                            <Clock className="w-3 h-3" /> Stage Time
                                        </FieldLabel>
                                        <Input
                                            value={act.startTime}
                                            onChange={(e) => updateAct(act.id, "startTime", e.target.value)}
                                            placeholder="10:00 PM"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <button
                type="button"
                onClick={addAct}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 py-3 text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest hover:border-zinc-950 hover:text-zinc-950 transition-all"
            >
                <Plus className="w-3 h-3" /> Add Act
            </button>
        </section>
    );
}
