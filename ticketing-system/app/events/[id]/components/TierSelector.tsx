"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ArrowRight } from "lucide-react";
import { NormalisedTier, formatPrice } from "./ticket-panel.types";

interface Props {
    tiers: NormalisedTier[];
    selectedTier: number;
    quantity: number;
    gstPercent: number;
    serviceFeePercent: number;
    isProcessing: boolean;
    onTierChange: (i: number) => void;
    onQuantityChange: (q: number) => void;
    onBuyClick: () => void;
}

export default function TierSelector({
    tiers,
    selectedTier,
    quantity,
    gstPercent,
    serviceFeePercent,
    isProcessing,
    onTierChange,
    onQuantityChange,
    onBuyClick,
}: Props) {
    const tier = tiers[selectedTier];

    const subtotal = tier.price * quantity;
    const gstAmount = Math.round(subtotal * (gstPercent / 100));
    const serviceFeeAmount = Math.round(subtotal * (serviceFeePercent / 100));
    const total = subtotal + gstAmount + serviceFeeAmount;

    return (
        <>
            {/* Tier buttons */}
            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">Select Tier</p>
                <div className="space-y-2">
                    {tiers.map((t, i) => {
                        const isLowStock = t.remaining <= 20 && t.remaining > 0;
                        return (
                            <button
                                key={t.id}
                                onClick={() => t.available && onTierChange(i)}
                                disabled={!t.available}
                                className={`w-full text-left p-3.5 border transition-all ${
                                    !t.available
                                        ? "border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed"
                                        : selectedTier === i
                                        ? "border-zinc-950 bg-zinc-950 text-white"
                                        : "border-zinc-200 hover:border-zinc-400 text-zinc-700 cursor-pointer"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p
                                            className={`text-sm font-black tracking-tight ${
                                                !t.available
                                                    ? "text-zinc-400"
                                                    : selectedTier === i
                                                    ? "text-white"
                                                    : "text-zinc-950"
                                            }`}
                                        >
                                            {t.name}
                                            {!t.available && (
                                                <span className="ml-2 text-[9px] font-normal">(Sold Out)</span>
                                            )}
                                        </p>
                                        <p
                                            className={`text-[10px] font-medium mt-0.5 ${
                                                !t.available
                                                    ? "text-zinc-400"
                                                    : selectedTier === i
                                                    ? "text-white/60"
                                                    : "text-zinc-400"
                                            }`}
                                        >
                                            {t.description}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p
                                            className={`text-base font-black ${
                                                !t.available
                                                    ? "text-zinc-400"
                                                    : selectedTier === i
                                                    ? "text-emerald-400"
                                                    : "text-zinc-950"
                                            }`}
                                        >
                                            {formatPrice(t.price)}
                                        </p>
                                        {isLowStock && t.available && (
                                            <p
                                                className={`text-[9px] font-bold ${
                                                    selectedTier === i ? "text-orange-400" : "text-orange-500"
                                                }`}
                                            >
                                                {t.remaining} left
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quantity + breakdown + CTA — only when tier is available */}
            {tier.available && (
                <>
                    {/* Quantity stepper */}
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">
                            Quantity
                        </p>
                        <div className="flex items-center gap-0 border border-zinc-200">
                            <button
                                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                                className="w-12 h-12 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 transition-colors border-r border-zinc-200"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <div className="flex-1 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={quantity}
                                        initial={{ y: -8, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 8, opacity: 0 }}
                                        transition={{ duration: 0.12 }}
                                        className="text-lg font-black text-zinc-950"
                                    >
                                        {quantity}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                            <button
                                onClick={() => onQuantityChange(Math.min(8, quantity + 1))}
                                className="w-12 h-12 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 transition-colors border-l border-zinc-200"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[9px] text-zinc-400 mt-1.5">Max 8 tickets per order</p>
                    </div>

                    {/* Price breakdown */}
                    <div className="space-y-2 pt-2 border-t border-zinc-100">
                        <div className="flex justify-between text-xs text-zinc-500">
                            <span>
                                {quantity} × {tier.name}
                            </span>
                            <span className="font-semibold">{formatPrice(subtotal)}</span>
                        </div>
                        {gstPercent > 0 && (
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>GST ({gstPercent}%)</span>
                                <span>{formatPrice(gstAmount)}</span>
                            </div>
                        )}
                        {serviceFeePercent > 0 && (
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>Service fee ({serviceFeePercent}%)</span>
                                <span>{formatPrice(serviceFeeAmount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-zinc-100">
                            <span className="text-sm font-black text-zinc-950">Total</span>
                            <span className="text-lg font-black text-zinc-950">{formatPrice(total)}</span>
                        </div>
                    </div>

                    {/* CTA button */}
                    <button
                        onClick={onBuyClick}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2.5 py-4 bg-emerald-500 text-zinc-950 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 active:scale-[0.99] transition-all disabled:opacity-80"
                    >
                        {isProcessing ? (
                            <>
                                <span className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                                Reserving...
                            </>
                        ) : (
                            <>
                                Get Tickets
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </>
            )}
        </>
    );
}
