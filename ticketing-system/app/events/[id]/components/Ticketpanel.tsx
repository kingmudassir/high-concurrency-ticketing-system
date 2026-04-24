"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Zap, ShieldCheck, ArrowRight, Flame, Lock, Ticket, XCircle } from 'lucide-react';
import { useAuth } from '@/app/hooks/auth/useAuth';
import { useBuyTicket } from '@/app/hooks/buyticket/useBuyTicket';
import { useCancelReservation } from '@/app/hooks/cancel_reservation/useCancelReservation';

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
    price?: number;
}

interface Props {
    event: RealEvent;
    selectedTier: number;
    quantity: number;
    onTierChange: (i: number) => void;
    onQuantityChange: (q: number) => void;
    refreshEvent?: () => Promise<void>;
}

const getRemainingTickets = (tier: TicketTier): number => {
    return tier.capacity - tier.sold;
};

const isTierAvailable = (tier: TicketTier): boolean => {
    return getRemainingTickets(tier) > 0;
};

export default function TicketPanel({ event, selectedTier, quantity, onTierChange, onQuantityChange, refreshEvent }: Props) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { buyTickets, isProcessing, error: buyError, reset: resetBuyError } = useBuyTicket();
    const [queued, setQueued] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [hasPendingReservation, setHasPendingReservation] = useState(false);
    const [pendingTicketIds, setPendingTicketIds] = useState<string[]>([]);
    const [pendingExpiresAt, setPendingExpiresAt] = useState<Date | null>(null);
    const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
    const [isCheckingReservation, setIsCheckingReservation] = useState(true);
    const { cancelReservation, isCancelling } = useCancelReservation();

    // Check for pending reservation on mount - from localStorage + server validation
    useEffect(() => {
        const checkPendingReservation = async () => {
            setIsCheckingReservation(true);
            
            // First, check localStorage (for quick display)
            const storedTicketIds = localStorage.getItem(`pending_tickets_${event.id}`);
            const storedExpiresAt = localStorage.getItem(`pending_expires_${event.id}`);
            
            let hasValidLocalStorage = false;
            
            if (storedTicketIds && storedExpiresAt) {
                const expiresAt = new Date(storedExpiresAt);
                const now = new Date();
                
                if (expiresAt > now) {
                    // Verify with server
                    try {
                        const response = await fetch('/api/tickets/verify-reservation', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                ticketIds: JSON.parse(storedTicketIds),
                                eventId: event.id 
                            })
                        });
                        
                        const data = await response.json();
                        
                        if (data.valid && data.tickets && data.tickets.length > 0) {
                            hasValidLocalStorage = true;
                            setHasPendingReservation(true);
                            setPendingTicketIds(JSON.parse(storedTicketIds));
                            setPendingExpiresAt(expiresAt);
                            setQueued(true);
                            setIsCheckingReservation(false);
                            return;
                        }
                    } catch (error) {
                        console.error("Failed to verify localStorage reservation:", error);
                    }
                }
                
                // Clear invalid localStorage
                if (!hasValidLocalStorage) {
                    localStorage.removeItem(`pending_tickets_${event.id}`);
                    localStorage.removeItem(`pending_expires_${event.id}`);
                }
            }
            
            // ALWAYS check the database for pending tickets
            try {
                const response = await fetch(`/api/tickets/user/pending?eventId=${event.id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                
                const data = await response.json();
                
                if (data.success && data.tickets && data.tickets.length > 0) {
                    const ticketIds = data.tickets.map((t: any) => t.id);
                    const expiresAt = new Date(data.tickets[0].expiresAt);
                    
                    setHasPendingReservation(true);
                    setPendingTicketIds(ticketIds);
                    setPendingExpiresAt(expiresAt);
                    setQueued(true);
                    
                    // Store in localStorage for future quick access
                    localStorage.setItem(`pending_tickets_${event.id}`, JSON.stringify(ticketIds));
                    localStorage.setItem(`pending_expires_${event.id}`, expiresAt.toISOString());
                } else {
                    setHasPendingReservation(false);
                    setQueued(false);
                    setPendingTicketIds([]);
                    setPendingExpiresAt(null);
                }
            } catch (error) {
                console.error("Failed to check pending tickets from database:", error);
                setHasPendingReservation(false);
                setQueued(false);
                setPendingTicketIds([]);
                setPendingExpiresAt(null);
            } finally {
                setIsCheckingReservation(false);
            }
        };
        
        if (event.id) {
            checkPendingReservation();
        }
    }, [event.id]);

    // Countdown timer for pending reservation - separate useEffect
    useEffect(() => {
        if (!pendingExpiresAt || !hasPendingReservation) return;
        
        const updateRemainingTime = () => {
            const now = new Date();
            const remaining = Math.max(0, Math.floor((pendingExpiresAt.getTime() - now.getTime()) / 1000));
            setRemainingSeconds(remaining);
            
            // Auto-clear if expired
            if (remaining <= 0) {
                localStorage.removeItem(`pending_tickets_${event.id}`);
                localStorage.removeItem(`pending_expires_${event.id}`);
                setHasPendingReservation(false);
                setPendingTicketIds([]);
                setPendingExpiresAt(null);
                setQueued(false);
                refreshEvent?.();
            }
        };
        
        updateRemainingTime();
        const interval = setInterval(updateRemainingTime, 1000);
        
        return () => clearInterval(interval);
    }, [pendingExpiresAt, hasPendingReservation, event.id, refreshEvent]);

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
    
    const gstPercent = event.gstPercent || 0;
    const serviceFeePercent = event.serviceFeePercent || 0;
    const gstAmount = Math.round(subtotal * (gstPercent / 100));
    const serviceFeeAmount = Math.round(subtotal * (serviceFeePercent / 100));
    const fees = gstAmount + serviceFeeAmount;
    const total = subtotal + fees;

    const handleBuyClick = async () => {
        if (event.isSoldOut || !tier.available) return;
        
        resetBuyError();
        
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }
        
        console.log("Buying tickets...", { eventId: event.id, tierId: tier.id, quantity });
        
        await buyTickets({
            eventId: event.id,
            tierId: tier.id,
            quantity: quantity,
            gstPercent: event.gstPercent || 0,
            serviceFeePercent: event.serviceFeePercent || 0,
            onSuccess: (ticketIds, expiresAt) => {
                console.log("Reservation successful!", { ticketIds, expiresAt });
                setQueued(true);
                setHasPendingReservation(true);
                setPendingTicketIds(ticketIds);
                setPendingExpiresAt(expiresAt);
                localStorage.setItem(`pending_tickets_${event.id}`, JSON.stringify(ticketIds));
                localStorage.setItem(`pending_expires_${event.id}`, expiresAt.toISOString());
            },
            onError: (error) => {
                console.error("Reservation failed:", error);
            }
        });
    };

    const handleViewMyTickets = () => {
        router.push('/tickets');
    };

    const handleCancelReservation = async () => {
        if (!pendingTicketIds.length) return;
        
        const success = await cancelReservation(pendingTicketIds);
        
        if (success) {
            setHasPendingReservation(false);
            setQueued(false);
            setPendingTicketIds([]);
            setPendingExpiresAt(null);
            localStorage.removeItem(`pending_tickets_${event.id}`);
            localStorage.removeItem(`pending_expires_${event.id}`);
            window.location.reload();
        }
    };

    const formatPrice = (price: number) => {
        return `₨ ${price.toLocaleString()}`;
    };

    const formatRemainingTime = () => {
        if (remainingSeconds <= 0) return "";
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatRemainingMinutes = () => {
        if (remainingSeconds <= 0) return "";
        const minutes = Math.floor(remainingSeconds / 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    };

    const getErrorMessage = () => {
        if (!buyError) return null;
        
        if (buyError.includes("pending reservation")) {
            return "You already have a pending reservation for this event. You can view it in 'My Tickets' or cancel it to make a new reservation.";
        }
        if (buyError.includes("capacity")) {
            return "Sorry, these tickets are no longer available. Please try a different quantity or tier.";
        }
        if (buyError.includes("event has already started")) {
            return "This event has already started. Tickets are no longer available for purchase.";
        }
        return buyError;
    };

    // Show loading state while checking reservation
    if (isCheckingReservation) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="border border-zinc-200 bg-white shadow-lg shadow-zinc-100/60 p-8 text-center"
            >
                <div className="w-8 h-8 border-2 border-zinc-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs text-zinc-400">Checking your reservation...</p>
            </motion.div>
        );
    }

    return (
        <>
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
                    {event.isHot && !event.isSoldOut && !hasPendingReservation && (
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">High demand</span>
                        </div>
                    )}
                </div>

                <div className="p-5 space-y-5">
                    {/* Error Message Display */}
                    {getErrorMessage() && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-red-700 mb-1">Reservation Failed</p>
                                    <p className="text-xs text-red-600">{getErrorMessage()}</p>
                                    {buyError?.includes("pending reservation") && (
                                        <button
                                            onClick={handleViewMyTickets}
                                            className="mt-3 text-xs font-bold text-red-700 underline hover:text-red-800"
                                        >
                                            View My Pending Tickets →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

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
                    ) : hasPendingReservation || queued ? (
                        // Pending Reservation State - Show action buttons with timer
                        <div className="text-center py-4">
                            <div className="w-14 h-14 bg-emerald-100 flex items-center justify-center mx-auto mb-4 rounded-full">
                                <Ticket className="w-6 h-6 text-emerald-600" />
                            </div>
                            <p className="text-base font-black uppercase tracking-tighter text-zinc-950 mb-1">Tickets Reserved!</p>
                            <p className="text-xs text-zinc-500 mb-2">
                                You have a pending reservation for {quantity} ticket{quantity !== 1 ? 's' : ''}.
                            </p>
                            
                            {/* Timer Display */}
                            {remainingSeconds > 0 && (
                                <div className="mb-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                        <span className="text-[11px] font-mono font-bold text-amber-700">
                                            Reservation expires in:
                                        </span>
                                        <span className="text-base font-black text-amber-800 tabular-nums">
                                            {formatRemainingTime()}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-amber-600 mt-1">
                                        {formatRemainingMinutes()} remaining to complete payment
                                    </p>
                                </div>
                            )}
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={handleViewMyTickets}
                                    className="flex-1 py-3 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-600 transition-all"
                                >
                                    My Tickets
                                </button>
                                <button
                                    onClick={handleCancelReservation}
                                    disabled={isCancelling}
                                    className="flex-1 py-3 border border-red-200 text-red-600 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCancelling ? "Cancelling..." : "Cancel"}
                                </button>
                            </div>
                        </div>
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

                            {/* Quantity */}
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
                                        onClick={handleBuyClick}
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

            {/* Auth Required Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <div className="text-center mb-6">
                            <Lock className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-zinc-950 mb-2">Login Required</h3>
                            <p className="text-sm text-zinc-500">Please login to purchase tickets for this event.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="flex-1 py-3 border border-zinc-200 text-zinc-600 font-bold text-sm rounded-xl hover:bg-zinc-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.setItem('returnUrl', `/events/${event.id}`);
                                    localStorage.setItem('selectedTier', selectedTier.toString());
                                    localStorage.setItem('quantity', quantity.toString());
                                    router.push(`/login?returnUrl=${encodeURIComponent(`/events/${event.id}`)}`);
                                }}
                                className="flex-1 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}