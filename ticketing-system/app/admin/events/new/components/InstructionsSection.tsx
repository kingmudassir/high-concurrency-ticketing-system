"use client";

import React from "react";
import { ShieldCheck, Check, X } from "lucide-react";
import { SectionHeader, FieldLabel, Textarea } from "./ui";

// ─── Default instruction library ────────────────────────────────────────────

export const DEFAULT_INSTRUCTIONS = [
    "Valid photo ID required for entry.",
    "No re-entry once you have exited the venue.",
    "Bag policy: only bags smaller than 14\" × 14\" × 6\" permitted.",
    "Cameras with detachable lenses are not permitted.",
    "Doors open 90 minutes before showtime.",
    "No outside food or beverages permitted.",
    "The event organiser reserves the right to refuse entry.",
    "Persons under 18 must be accompanied by a guardian.",
    "All sales are final. No refunds or exchanges.",
    "In case of emergency, follow staff instructions immediately.",
];

// ─── Component ───────────────────────────────────────────────────────────────

interface InstructionsSectionProps {
    instructions: string[];
    customInstruction: string;
    onToggle: (instr: string) => void;
    onCustomChange: (val: string) => void;
    onCustomAdd: () => void;
}

export function InstructionsSection({
    instructions,
    customInstruction,
    onToggle,
    onCustomChange,
    onCustomAdd,
}: InstructionsSectionProps) {
    return (
        <section>
            <SectionHeader
                number="09"
                label="Entry Instructions"
                icon={<ShieldCheck className="w-3.5 h-3.5" />}
            />

            <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-5">
                Select standard rules or write your own. These appear on the event page and printed tickets.
            </p>

            {/* Selectable defaults */}
            <div className="space-y-2 mb-5">
                {DEFAULT_INSTRUCTIONS.map((instr) => {
                    const active = instructions.includes(instr);
                    return (
                        <button
                            key={instr}
                            type="button"
                            onClick={() => onToggle(instr)}
                            className={`w-full flex items-start gap-3 px-4 py-3 border text-left transition-all ${
                                active
                                    ? "bg-zinc-950 border-zinc-950 text-white"
                                    : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400"
                            }`}
                        >
                            {/* Checkbox */}
                            <div
                                className={`w-4 h-4 shrink-0 mt-0.5 border flex items-center justify-center transition-colors ${
                                    active ? "border-white bg-white" : "border-zinc-300"
                                }`}
                            >
                                {active && <Check className="w-2.5 h-2.5 text-zinc-950" />}
                            </div>
                            <span className="text-[9px] font-mono leading-relaxed">{instr}</span>
                        </button>
                    );
                })}
            </div>

            {/* Custom instruction input */}
            <div className="border-t border-zinc-100 pt-5">
                <FieldLabel optional>Custom Instruction</FieldLabel>
                <div className="flex items-start gap-2">
                    <Textarea
                        value={customInstruction}
                        onChange={(e) => onCustomChange(e.target.value)}
                        rows={2}
                        placeholder="Write a custom entry rule..."
                    />
                    <button
                        type="button"
                        onClick={onCustomAdd}
                        className="px-4 py-3 bg-zinc-950 text-white text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors shrink-0"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Selected instructions summary */}
            {instructions.length > 0 && (
                <div className="mt-5 bg-zinc-950 p-5">
                    <p className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3">
                        {instructions.length} instruction{instructions.length > 1 ? "s" : ""} selected
                    </p>
                    <ol className="space-y-2">
                        {instructions.map((instr, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="text-[8px] font-mono text-zinc-600 tabular-nums shrink-0 mt-0.5">
                                    {String(idx + 1).padStart(2, "0")}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-400 leading-relaxed flex-1">
                                    {instr}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onToggle(instr)}
                                    className="text-zinc-700 hover:text-rose-400 transition-colors shrink-0"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </section>
    );
}
