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
    firstTier: TicketTier | undefined;
}

export function FeesSection({
    gstPercent, serviceFeePercent,
    onGstChange, onServiceFeeChange,
    firstTier,
}: FeesSectionProps) {
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const base = parseInt(firstTier?.price || "0") || 0;
    const gst = Math.round(base * (parseInt(gstPercent) || 0) / 100);
    const fee = Math.round(base * (parseInt(serviceFeePercent) || 0) / 100);
    const total = base + gst + fee;
    const showPreview = base > 0;

    const hasFees = gst > 0 || fee > 0;

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
                key="info-card" // Added unique key
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
                            <span className="font-medium text-emerald-600">How it works:</span> A 17% GST on a ₨1,000 ticket adds ₨170 to the buyer's total. 
                            Set to 0 to disable. Fees are displayed transparently at checkout.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Main Fee Cards */}
            <div key="fee-cards" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GST Card */}
                <motion.div
                    key="gst-card" // Added unique key
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
                                key="gst-badge" // Added unique key
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded inline-block"
                            >
                                {gstPercent}% tax will be applied
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Service Fee Card */}
                <motion.div
                    key="service-card" // Added unique key
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
                                key="service-badge" // Added unique key
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-[9px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded inline-block"
                            >
                                {serviceFeePercent}% service fee will be applied
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Live Price Preview */}
            <AnimatePresence mode="wait">
                <motion.div
                    key="preview-card" // Added unique key
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="relative overflow-hidden rounded-xl bg-white border border-stone-200 shadow-sm"
                >
                    {showPreview ? (
                        <motion.div 
                            key="preview-content" // Added unique key
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative p-5"
                        >
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <Calculator className="w-3.5 h-3.5 text-stone-400" />
                                    <span className="text-[9px] font-medium text-stone-500 uppercase tracking-wide">
                                        Price Preview — {firstTier?.name || "Selected Tier"}
                                    </span>
                                </div>
                                {hasFees && (
                                    <span key="includes-badge" className="text-[8px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                        INCLUDES ALL FEES
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between py-2 border-b border-stone-200">
                                    <span className="text-sm text-stone-600">Base price</span>
                                    <span className="text-lg font-semibold text-stone-800">₨ {base.toLocaleString()}</span>
                                </div>
                                
                                <AnimatePresence mode="wait">
                                    {gst > 0 && (
                                        <motion.div 
                                            key="gst-breakdown" // Added unique key
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="flex items-center justify-between py-1"
                                        >
                                            <span className="text-xs text-stone-500">GST ({gstPercent}%)</span>
                                            <span className="text-sm text-stone-600">+ ₨ {gst.toLocaleString()}</span>
                                        </motion.div>
                                    )}
                                    {fee > 0 && (
                                        <motion.div 
                                            key="fee-breakdown" // Added unique key
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="flex items-center justify-between py-1"
                                        >
                                            <span className="text-xs text-stone-500">Service fee ({serviceFeePercent}%)</span>
                                            <span className="text-sm text-stone-600">+ ₨ {fee.toLocaleString()}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-stone-200">
                                    <div>
                                        <span className="text-[9px] font-medium text-stone-600 uppercase tracking-wide">
                                            Buyer Pays
                                        </span>
                                        {hasFees && (
                                            <p className="text-[8px] text-stone-400 mt-0.5">including all taxes & fees</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-emerald-600">
                                            ₨ {total.toLocaleString()}
                                        </div>
                                        {hasFees && (
                                            <div className="text-[8px] text-stone-400 mt-0.5">
                                                +{Math.round(((total - base) / base) * 100)}% above base
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty-preview" // Added unique key
                            className="relative p-6 text-center"
                        >
                            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mx-auto mb-2">
                                <Calculator className="w-5 h-5 text-stone-400" />
                            </div>
                            <p className="text-[10px] text-stone-400">
                                Enter a ticket price above to see live preview
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Helper Text */}
            <motion.div 
                key="helper-text" // Added unique key
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200">
                    <Banknote className="w-3 h-3 text-stone-400" />
                    <p className="text-[9px] font-mono text-stone-500 tracking-wide uppercase">
                        All fees transparently displayed at checkout
                    </p>
                </div>
            </motion.div>
        </section>
    );
}