"use client";

import React from "react";
import { Banknote, Info } from "lucide-react";
import { SectionHeader, FieldLabel, Input } from "./ui";
import type { TicketTier } from "../types";

interface FeesSectionProps {
    gstPercent: string;
    serviceFeePercent: string;
    onGstChange: (val: string) => void;
    onServiceFeeChange: (val: string) => void;
    // Pass first tier for the live preview
    firstTier: TicketTier | undefined;
}

export function FeesSection({
    gstPercent,
    serviceFeePercent,
    onGstChange,
    onServiceFeeChange,
    firstTier,
}: FeesSectionProps) {
    // Compute live preview values
    const base = parseInt(firstTier?.price || "0") || 0;
    const gst  = Math.round(base * (parseInt(gstPercent) || 0) / 100);
    const fee  = Math.round(base * (parseInt(serviceFeePercent) || 0) / 100);
    const total = base + gst + fee;
    const showPreview = base > 0;

    return (
        <section>
            <SectionHeader
                number="07"
                label="Taxes & Fees"
                icon={<Banknote className="w-3.5 h-3.5" />}
            />

            {/* Info banner */}
            <div className="bg-amber-50 border border-amber-100 px-4 py-3 mb-5 flex items-start gap-3">
                <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[9px] font-mono text-amber-700 leading-relaxed">
                    Fees are applied as percentages on top of each tier's base price. A 17% GST on
                    a ₨1,000 ticket adds ₨170. Leave at 0 to disable.
                </p>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <FieldLabel optional>GST (%)</FieldLabel>
                    <div className="relative">
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            value={gstPercent}
                            onChange={(e) => onGstChange(e.target.value)}
                            placeholder="0"
                            className="pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-zinc-400">
                            %
                        </span>
                    </div>
                </div>
                <div>
                    <FieldLabel optional>Service Fee (%)</FieldLabel>
                    <div className="relative">
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            value={serviceFeePercent}
                            onChange={(e) => onServiceFeeChange(e.target.value)}
                            placeholder="0"
                            className="pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-zinc-400">
                            %
                        </span>
                    </div>
                </div>
            </div>

            {/* Live preview — only shown when first tier has a price */}
            {showPreview && (
                <div className="mt-5 bg-white border border-zinc-200 p-4">
                    <p className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3">
                        Price Preview — {firstTier?.name || "Tier 01"}
                    </p>
                    <div className="space-y-1.5 text-[9px] font-mono">
                        <div className="flex justify-between text-zinc-500">
                            <span>Base price</span>
                            <span>₨ {base.toLocaleString()}</span>
                        </div>
                        {gst > 0 && (
                            <div className="flex justify-between text-zinc-400">
                                <span>GST ({gstPercent}%)</span>
                                <span>+ ₨ {gst.toLocaleString()}</span>
                            </div>
                        )}
                        {fee > 0 && (
                            <div className="flex justify-between text-zinc-400">
                                <span>Service fee ({serviceFeePercent}%)</span>
                                <span>+ ₨ {fee.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-zinc-950 border-t border-zinc-100 pt-1.5 mt-1.5">
                            <span>Buyer pays</span>
                            <span>₨ {total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
