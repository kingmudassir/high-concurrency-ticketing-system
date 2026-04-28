"use client";

import { Ticket } from "lucide-react";

interface Props {
    quantity: number;
    remainingSeconds: number;
    isCancelling: boolean;
    onViewTickets: () => void;
    onCancelReservation: () => void;
}

function formatRemainingTime(seconds: number): string {
    if (seconds <= 0) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatRemainingMinutes(seconds: number): string {
    if (seconds <= 0) return "";
    const m = Math.floor(seconds / 60);
    return `${m} minute${m !== 1 ? "s" : ""}`;
}

export default function ReservationStatus({
    quantity,
    remainingSeconds,
    isCancelling,
    onViewTickets,
    onCancelReservation,
}: Props) {
    return (
        <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 flex items-center justify-center mx-auto mb-4 rounded-full">
                <Ticket className="w-6 h-6 text-emerald-600" />
            </div>

            <p className="text-base font-black uppercase tracking-tighter text-zinc-950 mb-1">
                Tickets Reserved!
            </p>
            <p className="text-xs text-zinc-500 mb-2">
                You have a pending reservation for {quantity} ticket{quantity !== 1 ? "s" : ""}.
            </p>

            {/* Countdown timer */}
            {remainingSeconds > 0 && (
                <div className="mb-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-[11px] font-mono font-bold text-amber-700">
                            Reservation expires in:
                        </span>
                        <span className="text-base font-black text-amber-800 tabular-nums">
                            {formatRemainingTime(remainingSeconds)}
                        </span>
                    </div>
                    <p className="text-[9px] text-amber-600 mt-1">
                        {formatRemainingMinutes(remainingSeconds)} remaining to complete payment
                    </p>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={onViewTickets}
                    className="flex-1 py-3 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-600 transition-all"
                >
                    My Tickets
                </button>
                <button
                    onClick={onCancelReservation}
                    disabled={isCancelling}
                    className="flex-1 py-3 border border-red-200 text-red-600 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCancelling ? "Cancelling..." : "Cancel"}
                </button>
            </div>
        </div>
    );
}
