"use client";

import React, { useState } from "react";
import { Banknote, Info, Sparkles, TrendingUp, Shield, Calculator } from "lucide-react";
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
        <section className="relative space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Floating orbs for atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[25%] left-[15%] w-80 h-80 bg-linear-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[35%] right-[20%] w-96 h-96 bg-linear-to-r from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl animate-pulse delay-1000" />
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
                                <div className="absolute inset-0 bg-linear-to-r from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-50" />
                                <div className="relative w-12 h-12 rounded-2xl bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
                                    <Banknote className="w-6 h-6 text-black" />
                                </div>
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold tracking-tight bg-linear-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                    Taxes & Fees
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Applied as percentages on top of each tier's base price
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Flowing accent line */}
                    <svg className="w-32 h-12 opacity-30 hidden md:block" viewBox="0 0 120 40" fill="none">
                        <path d="M0 20 Q 30 0, 60 20 T 120 20" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"/>
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Info Card - Premium Glass */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl"
            >
                <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 backdrop-blur-sm" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl" />
                
                <div className="relative flex items-start gap-4 px-6 py-5">
                    <div className="w-8 h-8 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shrink-0">
                        <Info className="w-4 h-4 text-black" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] font-mono text-stone-600 leading-relaxed">
                            <span className="font-bold text-emerald-600">How it works:</span> A 17% GST on a ₨1,000 ticket adds ₨170 to the buyer's total. 
                            Set to 0 to disable. Fees are displayed transparently at checkout.
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                        <Calculator className="w-3 h-3 text-emerald-400" />
                    </div>
                </div>
            </motion.div>

            {/* Main Fee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GST Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onFocus={() => setFocusedField("gst")}
                    onBlur={() => setFocusedField(null)}
                    className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                        focusedField === "gst" ? 'shadow-xl scale-[1.02]' : 'shadow-md hover:shadow-lg'
                    }`}
                    style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(20px)",
                        border: focusedField === "gst" ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                                    <TrendingUp className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-stone-800">GST</h4>
                                    <p className="text-[10px] text-stone-500">Goods & Services Tax</p>
                                </div>
                            </div>
                            <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
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
                                className="w-full bg-transparent text-3xl font-bold text-stone-800 placeholder:text-stone-300 outline-none py-2 pr-16"
                            />
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-lg font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                                %
                            </span>
                        </div>
                        <div className={`h-0.5 bg-linear-to-r from-emerald-400 to-teal-500 transition-all duration-500 mt-2 ${focusedField === "gst" ? 'w-full' : 'w-0'}`} />
                        
                        {parseInt(gstPercent) > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full inline-block"
                            >
                                {gstPercent}% tax will be applied
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Service Fee Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onFocus={() => setFocusedField("service")}
                    onBlur={() => setFocusedField(null)}
                    className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                        focusedField === "service" ? 'shadow-xl scale-[1.02]' : 'shadow-md hover:shadow-lg'
                    }`}
                    style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(20px)",
                        border: focusedField === "service" ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                                    <Shield className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-stone-800">Service Fee</h4>
                                    <p className="text-[10px] text-stone-500">Platform & processing fee</p>
                                </div>
                            </div>
                            <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
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
                                className="w-full bg-transparent text-3xl font-bold text-stone-800 placeholder:text-stone-300 outline-none py-2 pr-16"
                            />
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-lg font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                                %
                            </span>
                        </div>
                        <div className={`h-0.5 bg-linear-to-r from-blue-400 to-cyan-500 transition-all duration-500 mt-2 ${focusedField === "service" ? 'w-full' : 'w-0'}`} />
                        
                        {parseInt(serviceFeePercent) > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block"
                            >
                                {serviceFeePercent}% service fee will be applied
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Live Price Preview - Premium Card */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative overflow-hidden rounded-2xl"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-sm" />
                    
                    {showPreview ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative p-6"
                        >
                            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[9px] font-black font-mono text-stone-500 uppercase tracking-[0.2em]">
                                        Price Preview — {firstTier?.name || "Selected Tier"}
                                    </span>
                                </div>
                                {hasFees && (
                                    <span className="text-[8px] font-mono text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                                        INCLUDES ALL FEES
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-stone-200/50">
                                    <span className="text-sm text-stone-600">Base price</span>
                                    <span className="text-lg font-bold text-stone-800">₨ {base.toLocaleString()}</span>
                                </div>
                                
                                <AnimatePresence>
                                    {gst > 0 && (
                                        <motion.div 
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

                                <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-stone-200">
                                    <div>
                                        <span className="text-[10px] font-black font-mono text-stone-600 uppercase tracking-widest">
                                            Buyer Pays
                                        </span>
                                        {hasFees && (
                                            <p className="text-[8px] text-stone-400 mt-0.5">including all taxes & fees</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                            ₨ {total.toLocaleString()}
                                        </div>
                                        {hasFees && (
                                            <div className="text-[9px] text-stone-400 mt-0.5">
                                                +{Math.round(((total - base) / base) * 100)}% above base
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar visualization */}
                            {hasFees && (
                                <div className="mt-6 pt-4 border-t border-stone-200/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[8px] font-mono text-stone-500 uppercase tracking-wider">Fee breakdown</span>
                                        <div className="flex-1 h-px bg-stone-200" />
                                    </div>
                                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(base / total) * 100}%` }}
                                            className="bg-emerald-500 rounded-l-full"
                                        />
                                        {gst > 0 && (
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(gst / total) * 100}%` }}
                                                className="bg-teal-400"
                                            />
                                        )}
                                        {fee > 0 && (
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(fee / total) * 100}%` }}
                                                className="bg-cyan-400 rounded-r-full"
                                            />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-[8px] font-mono text-stone-400">
                                        <span>Base: {Math.round((base / total) * 100)}%</span>
                                        {gst > 0 && <span>GST: {Math.round((gst / total) * 100)}%</span>}
                                        {fee > 0 && <span>Fee: {Math.round((fee / total) * 100)}%</span>}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="relative p-8 text-center">
                            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-3">
                                <Calculator className="w-6 h-6 text-stone-400" />
                            </div>
                            <p className="text-[11px] font-mono text-stone-400">
                                Enter a ticket price above to see live preview
                            </p>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-stone-300 to-transparent" />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Helper Text */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 border border-stone-200">
                    <Banknote className="w-3 h-3 text-emerald-500" />
                    <p className="text-[9px] font-mono text-stone-500 tracking-[0.15em] uppercase">
                        All fees are transparently displayed at checkout
                    </p>
                </div>
            </motion.div>
        </section>
    );
}