"use client";

import React, { useState } from "react";
import { Banknote, Info, TrendingUp, Shield, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TicketTier } from "../types";

interface FeesSectionProps {
    gstPercent: string;
    serviceFeePercent: string;
    onGstChange: (val: string) => void;
    onServiceFeeChange: (val: string) => void;
    tiers: TicketTier[]; // Change from firstTier to all tiers
}

export function EditFees({
    gstPercent, serviceFeePercent,
    onGstChange, onServiceFeeChange,
    tiers,
}: FeesSectionProps) {
    const [focusedField, setFocusedField] = useState<string | null>(null);
    
    // Calculate for all tiers
    const tierCalculations = tiers.map(tier => {
        const base = parseInt(tier.price) || 0;
        const gst = Math.round(base * (parseInt(gstPercent) || 0) / 100);
        const fee = Math.round(base * (parseInt(serviceFeePercent) || 0) / 100);
        const total = base + gst + fee;
        return { tier, base, gst, fee, total };
    });

    const hasAnyFees = tierCalculations.some(t => t.gst > 0 || t.fee > 0);
    const hasValidPrices = tierCalculations.some(t => t.base > 0);

    return (
        <section className="relative space-y-6 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                <Banknote className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-stone-800">
                                    Taxes & Fees
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Applied as percentages on top of each tier's base price
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <motion.div 
                key="info-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-stone-50 border border-stone-200"
            >
                <div className="relative flex items-start gap-3 px-5 py-4">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <Info className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                            <span className="font-medium text-emerald-600">How it works:</span> GST and Service Fee are applied as percentages on top of each ticket tier's base price. 
                            Set to 0 to disable. Fees are displayed transparently at checkout.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Main Fee Cards */}
            <div key="fee-cards" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GST Card */}
                <motion.div
                    key="gst-card"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                    onFocus={() => setFocusedField("gst")}
                    onBlur={() => setFocusedField(null)}
                    className={`relative overflow-hidden rounded-xl transition-all duration-300 bg-white border ${
                        focusedField === "gst" ? 'shadow-md border-emerald-300' : 'shadow-sm border-stone-200'
                    }`}
                >
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-stone-800">GST</h4>
                                    <p className="text-[9px] text-stone-500">Goods & Services Tax</p>
                                </div>
                            </div>
                            <span className="text-[8px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                                OPTIONAL
                            </span>
                        </div>

                        <div className="relative mt-2">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={gstPercent}
                                onChange={(e) => onGstChange(e.target.value)}
                                placeholder="0"
                                className="w-full bg-transparent text-2xl font-bold text-stone-800 placeholder:text-stone-300 outline-none py-2 pr-14"
                            />
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-base font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                                %
                            </span>
                        </div>
                        <div className={`h-0.5 bg-emerald-500 transition-all duration-300 mt-2 ${focusedField === "gst" ? 'w-full' : 'w-0'}`} />
                        
                        {parseInt(gstPercent) > 0 && (
                            <motion.div 
                                key="gst-badge"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded inline-block"
                            >
                                {gstPercent}% tax will be applied to all tiers
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Service Fee Card */}
                <motion.div
                    key="service-card"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onFocus={() => setFocusedField("service")}
                    onBlur={() => setFocusedField(null)}
                    className={`relative overflow-hidden rounded-xl transition-all duration-300 bg-white border ${
                        focusedField === "service" ? 'shadow-md border-blue-300' : 'shadow-sm border-stone-200'
                    }`}
                >
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-stone-800">Service Fee</h4>
                                    <p className="text-[9px] text-stone-500">Platform & processing fee</p>
                                </div>
                            </div>
                            <span className="text-[8px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                                OPTIONAL
                            </span>
                        </div>

                        <div className="relative mt-2">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={serviceFeePercent}
                                onChange={(e) => onServiceFeeChange(e.target.value)}
                                placeholder="0"
                                className="w-full bg-transparent text-2xl font-bold text-stone-800 placeholder:text-stone-300 outline-none py-2 pr-14"
                            />
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-base font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                                %
                            </span>
                        </div>
                        <div className={`h-0.5 bg-blue-500 transition-all duration-300 mt-2 ${focusedField === "service" ? 'w-full' : 'w-0'}`} />
                        
                        {parseInt(serviceFeePercent) > 0 && (
                            <motion.div 
                                key="service-badge"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-[9px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded inline-block"
                            >
                                {serviceFeePercent}% service fee will be applied to all tiers
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Live Price Preview for All Tiers */}
            <AnimatePresence mode="wait">
                <motion.div
                    key="preview-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="relative overflow-hidden rounded-xl bg-white border border-stone-200 shadow-sm"
                >
                    {hasValidPrices ? (
                        <motion.div 
                            key="preview-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative p-5"
                        >
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <Calculator className="w-3.5 h-3.5 text-stone-400" />
                                    <span className="text-[9px] font-medium text-stone-500 uppercase tracking-wide">
                                        Price Preview — All Tiers
                                    </span>
                                </div>
                                {hasAnyFees && (
                                    <span key="includes-badge" className="text-[8px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                        INCLUDES ALL FEES
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                {tierCalculations.map(({ tier, base, gst, fee, total }) => (
                                    <div key={tier.id} className="border-b border-stone-200 last:border-0 pb-3 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-stone-800">{tier.name || "Unnamed Tier"}</span>
                                            <span className="text-xs text-stone-500">Base: ₨ {base.toLocaleString()}</span>
                                        </div>
                                        
                                        <div className="space-y-1 pl-4">
                                            {(gst > 0 || fee > 0) ? (
                                                <>
                                                    {gst > 0 && (
                                                        <div className="flex items-center justify-between py-1">
                                                            <span className="text-xs text-stone-500">GST ({gstPercent}%)</span>
                                                            <span className="text-sm text-stone-600">+ ₨ {gst.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    {fee > 0 && (
                                                        <div className="flex items-center justify-between py-1">
                                                            <span className="text-xs text-stone-500">Service fee ({serviceFeePercent}%)</span>
                                                            <span className="text-sm text-stone-600">+ ₨ {fee.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-stone-100">
                                                        <span className="text-xs font-medium text-stone-700">Total with fees</span>
                                                        <span className="text-base font-bold text-emerald-600">₨ {total.toLocaleString()}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-xs text-stone-400 italic py-1">No fees applied</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty-preview"
                            className="relative p-6 text-center"
                        >
                            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mx-auto mb-2">
                                <Calculator className="w-5 h-5 text-stone-400" />
                            </div>
                            <p className="text-[10px] text-stone-400">
                                Enter ticket prices above to see live preview for all tiers
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Helper Text */}
            <motion.div 
                key="helper-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200">
                    <Banknote className="w-3 h-3 text-stone-400" />
                    <p className="text-[9px] font-mono text-stone-500 tracking-wide uppercase">
                        Fees are applied to each ticket tier individually
                    </p>
                </div>
            </motion.div>
        </section>
    );
}