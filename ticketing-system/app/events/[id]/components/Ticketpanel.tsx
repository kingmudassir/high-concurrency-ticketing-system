"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, XCircle } from "lucide-react";
import { useAuth } from "@/app/hooks/auth/useAuth";
import { useBuyTicket } from "@/app/hooks/buyticket/useBuyTicket";
import { useCancelReservation } from "@/app/hooks/cancel_reservation/useCancelReservation";

import { RealEvent, isTierAvailable, getRemainingTickets } from "./ticket-panel.types";
import TicketPanelHeader from "./TicketPanelHeader";
import SoldOutState from "./SoldOutState";
import ReservationStatus from "./ReservationStatus";
import TierSelector from "./TierSelector";
import AuthModal from "./AuthModal";

interface Props {
    event: RealEvent;
    selectedTier: number;
    quantity: number;
    onTierChange: (i: number) => void;
    onQuantityChange: (q: number) => void;
    refreshEvent?: () => Promise<void>;
}

export default function TicketPanel({
    event,
    selectedTier,
    quantity,
    onTierChange,
    onQuantityChange,
    refreshEvent,
}: Props) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { buyTickets, isProcessing, error: buyError, reset: resetBuyError } = useBuyTicket();
    const { cancelReservation, isCancelling } = useCancelReservation();

    const [queued, setQueued] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [hasPendingReservation, setHasPendingReservation] = useState(false);
    const [pendingTicketIds, setPendingTicketIds] = useState<string[]>([]);
    const [pendingExpiresAt, setPendingExpiresAt] = useState<Date | null>(null);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [isCheckingReservation, setIsCheckingReservation] = useState(true);

    // ── 1. Check for an existing pending reservation on mount ─────────────────
    useEffect(() => {
        const checkPendingReservation = async () => {
            setIsCheckingReservation(true);

            // Quick check via localStorage
            const storedTicketIds = localStorage.getItem(`pending_tickets_${event.id}`);
            const storedExpiresAt = localStorage.getItem(`pending_expires_${event.id}`);
            let hasValidLocalStorage = false;

            if (storedTicketIds && storedExpiresAt) {
                const expiresAt = new Date(storedExpiresAt);
                if (expiresAt > new Date()) {
                    try {
                        const res = await fetch("/api/tickets/verify-reservation", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                ticketIds: JSON.parse(storedTicketIds),
                                eventId: event.id,
                            }),
                        });
                        const data = await res.json();
                        if (data.valid && data.tickets?.length > 0) {
                            hasValidLocalStorage = true;
                            setHasPendingReservation(true);
                            setPendingTicketIds(JSON.parse(storedTicketIds));
                            setPendingExpiresAt(expiresAt);
                            setQueued(true);
                            setIsCheckingReservation(false);
                            return;
                        }
                    } catch (err) {
                        console.error("Failed to verify localStorage reservation:", err);
                    }
                }
                if (!hasValidLocalStorage) {
                    localStorage.removeItem(`pending_tickets_${event.id}`);
                    localStorage.removeItem(`pending_expires_${event.id}`);
                }
            }

            // Authoritative check from the database
            try {
                const res = await fetch(`/api/tickets/user/pending?eventId=${event.id}`);
                const data = await res.json();

                if (data.success && data.tickets?.length > 0) {
                    const ids = data.tickets.map((t: any) => t.id);
                    const expiresAt = new Date(data.tickets[0].expiresAt);
                    setHasPendingReservation(true);
                    setPendingTicketIds(ids);
                    setPendingExpiresAt(expiresAt);
                    setQueued(true);
                    localStorage.setItem(`pending_tickets_${event.id}`, JSON.stringify(ids));
                    localStorage.setItem(`pending_expires_${event.id}`, expiresAt.toISOString());
                } else {
                    setHasPendingReservation(false);
                    setQueued(false);
                    setPendingTicketIds([]);
                    setPendingExpiresAt(null);
                }
            } catch (err) {
                console.error("Failed to check pending tickets from database:", err);
                setHasPendingReservation(false);
                setQueued(false);
            } finally {
                setIsCheckingReservation(false);
            }
        };

        if (event.id) checkPendingReservation();
    }, [event.id]);

    // ── 2. Countdown timer ────────────────────────────────────────────────────
    useEffect(() => {
        if (!pendingExpiresAt || !hasPendingReservation) return;

        const tick = () => {
            const secs = Math.max(
                0,
                Math.floor((pendingExpiresAt.getTime() - Date.now()) / 1000)
            );
            setRemainingSeconds(secs);

            if (secs <= 0) {
                localStorage.removeItem(`pending_tickets_${event.id}`);
                localStorage.removeItem(`pending_expires_${event.id}`);
                setHasPendingReservation(false);
                setPendingTicketIds([]);
                setPendingExpiresAt(null);
                setQueued(false);
                refreshEvent?.();
            }
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [pendingExpiresAt, hasPendingReservation, event.id, refreshEvent]);

    // ── 3. Normalise tiers ────────────────────────────────────────────────────
    const tiers =
        event.ticketTiers && event.ticketTiers.length > 0
            ? event.ticketTiers.map((t) => ({
                  id: t.id,
                  name: t.name,
                  price: t.price,
                  description:
                      t.description ||
                      (t.name === "VIP" ? "Premium access and perks" : "Standard entry"),
                  available: isTierAvailable(t),
                  remaining: getRemainingTickets(t),
              }))
            : [];

    // ── 4. Handlers ───────────────────────────────────────────────────────────
    const handleBuyClick = async () => {
        if (event.isSoldOut || !tiers[selectedTier]?.available) return;
        resetBuyError();

        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        await buyTickets({
            eventId: event.id,
            tierId: tiers[selectedTier].id,
            quantity,
            gstPercent: event.gstPercent || 0,
            serviceFeePercent: event.serviceFeePercent || 0,
            onSuccess: (ticketIds, expiresAt) => {
                setQueued(true);
                setHasPendingReservation(true);
                setPendingTicketIds(ticketIds);
                setPendingExpiresAt(expiresAt);
                localStorage.setItem(`pending_tickets_${event.id}`, JSON.stringify(ticketIds));
                localStorage.setItem(`pending_expires_${event.id}`, expiresAt.toISOString());
                // Refresh event data to update ticket counts
                refreshEvent?.();
            },
            onError: (err) => console.error("Reservation failed:", err),
        });
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
            // Use refreshEvent instead of hard reload
            if (refreshEvent) {
                await refreshEvent();
            }
        }
    };

    const getErrorMessage = (): string | null => {
        if (!buyError) return null;
        if (buyError.includes("pending reservation"))
            return "You already have a pending reservation for this event. View it in 'My Tickets' or cancel it to make a new one.";
        if (buyError.includes("capacity"))
            return "Sorry, these tickets are no longer available. Try a different quantity or tier.";
        if (buyError.includes("event has already started"))
            return "This event has already started. Tickets are no longer available.";
        return buyError;
    };

    // ── 5. Loading skeleton ───────────────────────────────────────────────────
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

    // ── 6. No tiers configured ────────────────────────────────────────────────
    if (tiers.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="border border-zinc-200 bg-white shadow-lg shadow-zinc-100/60 p-8 text-center"
            >
                <Lock className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-base font-black uppercase tracking-tighter text-zinc-950 mb-2">
                    No Tickets Available
                </p>
                <p className="text-xs text-zinc-400">Ticket tiers are not set up for this event yet.</p>
            </motion.div>
        );
    }

    // ── 7. Main panel ─────────────────────────────────────────────────────────
    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="border border-zinc-200 bg-white shadow-lg shadow-zinc-100/60"
            >
                <TicketPanelHeader
                    title={event.title}
                    isHot={event.isHot}
                    isSoldOut={event.isSoldOut}
                    hasPendingReservation={hasPendingReservation}
                />

                <div className="p-5 space-y-5">
                    {/* Error banner */}
                    {getErrorMessage() && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-red-700 mb-1">Reservation Failed</p>
                                    <p className="text-xs text-red-600">{getErrorMessage()}</p>
                                    {buyError?.includes("pending reservation") && (
                                        <button
                                            onClick={() => router.push("/tickets")}
                                            className="mt-3 text-xs font-bold text-red-700 underline hover:text-red-800"
                                        >
                                            View My Pending Tickets →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Body — three mutually exclusive states */}
                    {event.isSoldOut ? (
                        <SoldOutState />
                    ) : hasPendingReservation || queued ? (
                        <ReservationStatus
                            quantity={quantity}
                            remainingSeconds={remainingSeconds}
                            isCancelling={isCancelling}
                            onViewTickets={() => router.push("/tickets")}
                            onCancelReservation={handleCancelReservation}
                        />
                    ) : (
                        <TierSelector
                            tiers={tiers}
                            selectedTier={selectedTier}
                            quantity={quantity}
                            gstPercent={event.gstPercent || 0}
                            serviceFeePercent={event.serviceFeePercent || 0}
                            isProcessing={isProcessing}
                            onTierChange={onTierChange}
                            onQuantityChange={onQuantityChange}
                            onBuyClick={handleBuyClick}
                        />
                    )}

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 pt-1">
                        <div className="flex items-center gap-1.5 text-zinc-400">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">
                                Buyer Guarantee
                            </span>
                        </div>
                        <div className="w-px h-3 bg-zinc-200" />
                        <div className="flex items-center gap-1.5 text-zinc-400">
                            <Lock className="w-3 h-3 text-emerald-500" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">
                                Secure Checkout
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {showAuthModal && (
                <AuthModal
                    eventId={event.id}
                    selectedTier={selectedTier}
                    quantity={quantity}
                    onClose={() => setShowAuthModal(false)}
                />
            )}
        </>
    );
}