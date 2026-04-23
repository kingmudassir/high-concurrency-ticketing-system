"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Zap, ShieldCheck, ArrowRight, Flame, Lock } from 'lucide-react';

interface TicketTier {
    id: string;
    name: string;
    description: string | null;
    price: number;
    capacity: number;
    sold: number;
}

interface RealEvent {
    id: string;
    title: string;
    isSoldOut: boolean;
    isHot: boolean;
    ticketTiers?: TicketTier[];
    gstPercent?: number;
    serviceFeePercent?: number;
    price?: number; // For backward compatibility
}

interface Props {
    event: RealEvent;
    selectedTier: number;
    quantity: number;
    onTierChange: (i: number) => void;
    onQuantityChange: (q: number) => void;
}

// Helper to calculate remaining tickets
const getRemainingTickets = (tier: TicketTier): number => {
    return tier.capacity - tier.sold;
};

// Helper to check if tier is available
const isTierAvailable = (tier: TicketTier): boolean => {
    return getRemainingTickets(tier) > 0;
};

export default function TicketPanel({ event, selectedTier, quantity, onTierChange, onQuantityChange }: Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [queued, setQueued] = useState(false);

    // Use real ticket tiers from the event, or fallback to derived tiers if none exist
    const tiers = event.ticketTiers && event.ticketTiers.length > 0
        ? event.ticketTiers.map(tier => ({
            id: tier.id,
            name: tier.name,
            price: tier.price,
            description: tier.description || (tier.name === 'VIP' ? 'Premium access and perks' : 'Standard entry'),
            available: isTierAvailable(tier),
            remaining: getRemainingTickets(tier),
        }))
        : [];

    // If no tiers are available, show a message
    if (tiers.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="border border-zinc-200 bg-white shadow-lg shadow-zinc-100/60 p-8 text-center"
            >
                <Lock className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-base font-black uppercase tracking-tighter text-zinc-950 mb-2">No Tickets Available</p>
                <p className="text-xs text-zinc-400">Ticket tiers are not set up for this event yet.</p>
            </motion.div>
        );
    }

    const tier = tiers[selectedTier];
    const subtotal = tier.price * quantity;
    
    // Calculate fees based on actual GST and service fee percentages from the event
    const gstPercent = event.gstPercent || 0;
    const serviceFeePercent = event.serviceFeePercent || 0;
    const gstAmount = Math.round(subtotal * (gstPercent / 100));
    const serviceFeeAmount = Math.round(subtotal * (serviceFeePercent / 100));
    const fees = gstAmount + serviceFeeAmount;
    const total = subtotal + fees;

    const handleBuy = async () => {
        if (event.isSoldOut || !tier.available) return;
        setIsProcessing(true);
        // Simulate queue joining — replace with real checkout logic
        await new Promise((r) => setTimeout(r, 1400));
        setIsProcessing(false);
        setQueued(true);
    };

    // Format price in PKR
    const formatPrice = (price: number) => {
        return `₨ ${price.toLocaleString()}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="border border-zinc-200 bg-white shadow-lg shadow-zinc-100/60"
        >
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400">Tickets</p>
                    <p className="text-sm font-black text-zinc-950 tracking-tight mt-0.5 line-clamp-1">{event.title}</p>
                </div>
                {event.isHot && !event.isSoldOut && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">High demand</span>
                    </div>
                )}
            </div>

            <div className="p-5 space-y-5">

                {/* Sold Out State */}
                {event.isSoldOut ? (
                    <div className="text-center py-6">
                        <div className="w-14 h-14 bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6 text-zinc-400" />
                        </div>
                        <p className="text-base font-black uppercase tracking-tighter text-zinc-950 mb-1">Sold Out</p>
                        <p className="text-xs text-zinc-400">This event is fully sold out.</p>
                        <button className="mt-5 w-full py-4 border border-zinc-200 text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors">
                            Join Waitlist
                        </button>
                    </div>
                ) : queued ? (
                    /* Queued success state */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6"
                    >
                        <div className="w-14 h-14 bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-base font-black uppercase tracking-tighter text-zinc-950 mb-1">You're in the queue!</p>
                        <p className="text-xs text-zinc-500">We'll hold your spot. Complete checkout when it's your turn.</p>
                        <div className="mt-4 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                            Est. wait: ~2 minutes
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Tier Selection */}
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">Select Tier</p>
                            <div className="space-y-2">
                                {tiers.map((t, i) => {
                                    const isAvailable = t.available;
                                    const remaining = t.remaining;
                                    const isLowStock = remaining <= 20 && remaining > 0;
                                    
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => isAvailable && onTierChange(i)}
                                            disabled={!isAvailable}
                                            className={`w-full text-left p-3.5 border transition-all ${
                                                !isAvailable
                                                    ? 'border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed'
                                                    : selectedTier === i
                                                        ? 'border-zinc-950 bg-zinc-950 text-white'
                                                        : 'border-zinc-200 hover:border-zinc-400 text-zinc-700 cursor-pointer'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className={`text-sm font-black tracking-tight ${
                                                        !isAvailable 
                                                            ? 'text-zinc-400' 
                                                            : selectedTier === i 
                                                                ? 'text-white' 
                                                                : 'text-zinc-950'
                                                    }`}>
                                                        {t.name}
                                                        {!isAvailable && <span className="ml-2 text-[9px] font-normal">(Sold Out)</span>}
                                                    </p>
                                                    <p className={`text-[10px] font-medium mt-0.5 ${
                                                        !isAvailable 
                                                            ? 'text-zinc-400' 
                                                            : selectedTier === i 
                                                                ? 'text-white/60' 
                                                                : 'text-zinc-400'
                                                    }`}>
                                                        {t.description}
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className={`text-base font-black ${
                                                        !isAvailable 
                                                            ? 'text-zinc-400' 
                                                            : selectedTier === i 
                                                                ? 'text-emerald-400' 
                                                                : 'text-zinc-950'
                                                    }`}>
                                                        {formatPrice(t.price)}
                                                    </p>
                                                    {isLowStock && isAvailable && (
                                                        <p className={`text-[9px] font-bold ${selectedTier === i ? 'text-orange-400' : 'text-orange-500'}`}>
                                                            {remaining} left
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quantity - Only show if tier is available */}
                        {tier.available && (
                            <>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">Quantity</p>
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
                                        <span>{quantity} × {tier.name}</span>
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

                                {/* CTA */}
                                <button
                                    onClick={handleBuy}
                                    disabled={isProcessing}
                                    className="w-full flex items-center justify-center gap-2.5 py-4 bg-emerald-500 text-zinc-950 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 active:scale-[0.99] transition-all disabled:opacity-80"
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                                            Joining Queue...
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
                )}

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Buyer Guarantee</span>
                    </div>
                    <div className="w-px h-3 bg-zinc-200" />
                    <div className="flex items-center gap-1.5 text-zinc-400">
                        <Lock className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Secure Checkout</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}