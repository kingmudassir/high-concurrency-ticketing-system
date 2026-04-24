"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Ticket, XCircle, CheckCircle, Timer, ArrowRight, QrCode, Bookmark, X, Trash2 } from "lucide-react";
import Link from "next/link";

export type TicketStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED" | "SAVED";

// Base ticket data interface
export interface BaseTicketData {
    id: string;
    eventId: string;
    eventTitle: string;
    eventImageUrl?: string | null;
    eventVenue: string;
    eventCity: string;
    eventStartDate: Date | string;
    tierName: string;
    status: TicketStatus;
    expiresAt?: Date | string | null;
    purchasedAt?: Date | string | null;
    ticketIds?: string[];
    isSaved?: boolean;
}

// For individual tickets (non-grouped)
export interface TicketCardData extends BaseTicketData {
    pricePaid: number;
    gstPaid: number;
    serviceFeePaid: number;
    quantity?: number;
}

// For grouped tickets
export interface GroupedTicketCardData extends BaseTicketData {
    quantity: number;
    totalPricePaid: number;
    totalGstPaid: number;
    totalServiceFeePaid: number;
    ticketIds: string[];
}

type PropsTicket = TicketCardData | GroupedTicketCardData;

interface Props {
    ticket: PropsTicket;
    index: number;
    isGrouped?: boolean;
    onCancelReservation?: (ticketIds: string[]) => void;
    onRemoveSaved?: (eventId: string) => void;
    onDeleteTicket?: (ticketId: string) => void;
    onDeleteGroup?: (ticketIds: string[]) => void;
    isDeleting?: boolean;
}

// Helper to get price values regardless of type
function getPriceValues(ticket: PropsTicket, isGrouped: boolean) {
    if (isGrouped) {
        const grouped = ticket as GroupedTicketCardData;
        return {
            quantity: grouped.quantity,
            totalPrice: grouped.totalPricePaid,
            totalGst: grouped.totalGstPaid,
            totalServiceFee: grouped.totalServiceFeePaid,
            ticketIds: grouped.ticketIds,
        };
    }
    const individual = ticket as TicketCardData;
    return {
        quantity: individual.quantity || 1,
        totalPrice: individual.pricePaid,
        totalGst: individual.gstPaid,
        totalServiceFee: individual.serviceFeePaid,
        ticketIds: [individual.id],
    };
}

const STATUS_CONFIG: Record<TicketStatus, {
    label: string;
    icon: React.ReactNode;
    bg: string;
    text: string;
    border: string;
    barColor: string;
}> = {
    PENDING: {
        label: "Reserved",
        icon: <Timer className="w-3 h-3" />,
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        barColor: "bg-amber-400",
    },
    CONFIRMED: {
        label: "Confirmed",
        icon: <CheckCircle className="w-3 h-3" />,
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        barColor: "bg-emerald-500",
    },
    CANCELLED: {
        label: "Cancelled",
        icon: <XCircle className="w-3 h-3" />,
        bg: "bg-zinc-100",
        text: "text-zinc-400",
        border: "border-zinc-200",
        barColor: "bg-zinc-300",
    },
    EXPIRED: {
        label: "Expired",
        icon: <XCircle className="w-3 h-3" />,
        bg: "bg-red-50",
        text: "text-red-500",
        border: "border-red-200",
        barColor: "bg-red-400",
    },
    SAVED: {
        label: "Saved",
        icon: <Bookmark className="w-3 h-3" />,
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        barColor: "bg-blue-400",
    },
};

function formatDate(date: Date | string | undefined | null): string {
    if (!date) return "Date TBD";
    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function formatPrice(n: number) {
    return `₨ ${n.toLocaleString()}`;
}

function getRemainingMinutes(expiresAt: Date | string | null | undefined): number {
    if (!expiresAt) return 0;
    return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 60000));
}

export default function TicketCard({ 
    ticket, 
    index, 
    isGrouped = false, 
    onCancelReservation, 
    onRemoveSaved,
    onDeleteTicket,
    onDeleteGroup,
    isDeleting = false
}: Props) {
    const cfg = STATUS_CONFIG[ticket.status];
    const isSaved = ticket.status === "SAVED";
    const isCancelledOrExpired = ticket.status === "CANCELLED" || ticket.status === "EXPIRED";
    const isPending = ticket.status === "PENDING";
    
    // Get price values using helper
    const { quantity, totalPrice, totalGst, totalServiceFee, ticketIds: ticketIdsFromGroup } = getPriceValues(ticket, isGrouped);
    const total = totalPrice + totalGst + totalServiceFee;
    const effectiveTicketIds = isGrouped ? ticketIdsFromGroup : [ticket.id];
    
    const remainingMins = isPending ? getRemainingMinutes(ticket.expiresAt) : 0;
    const isEventPassed = new Date(ticket.eventStartDate) < new Date();

    const getPendingText = () => {
        if (quantity > 1) {
            return `⏱ ${quantity} tickets reserved • Complete payment within ${remainingMins} min`;
        }
        return `⏱ Complete payment within ${remainingMins} min`;
    };

    const handleDelete = () => {
        if (isGrouped && onDeleteGroup) {
            onDeleteGroup(effectiveTicketIds);
        } else if (onDeleteTicket) {
            onDeleteTicket(ticket.id);
        }
    };

    const handleCancel = () => {
        if (onCancelReservation) {
            onCancelReservation(effectiveTicketIds);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.4) }}
            className={`relative bg-white border ${isCancelledOrExpired ? "border-zinc-200 opacity-60" : "border-zinc-200"} overflow-hidden`}
        >
            {/* Status bar — top strip */}
            <div className={`h-1 w-full ${cfg.barColor}`} />

            {/* Quantity badge for grouped tickets */}
            {isGrouped && quantity > 1 && !isSaved && !isCancelledOrExpired && (
                <div className="absolute -top-1 -right-1 z-20 bg-emerald-500 text-white text-[11px] font-black rounded-full w-7 h-7 flex items-center justify-center shadow-lg border-2 border-white">
                    {quantity}
                </div>
            )}

            <div className="flex flex-col sm:flex-row">
                {/* Left: Event image */}
                <div className="relative w-full sm:w-44 h-36 sm:h-auto shrink-0 overflow-hidden bg-zinc-100">
                    {ticket.eventImageUrl ? (
                        <img
                            src={ticket.eventImageUrl}
                            alt={ticket.eventTitle}
                            className={`w-full h-full object-cover ${isCancelledOrExpired ? "grayscale" : ""}`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            {isSaved ? <Bookmark className="w-8 h-8 text-zinc-300" /> : <Ticket className="w-8 h-8 text-zinc-300" />}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent to-white/10" />
                </div>

                {/* Right: Info */}
                <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            {/* Status badge */}
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${cfg.bg} ${cfg.border} border mb-3`}>
                                <span className={cfg.text}>{cfg.icon}</span>
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${cfg.text}`}>
                                    {cfg.label}
                                </span>
                            </div>

                            {/* Event title */}
                            <h3 className={`text-base font-black tracking-tight leading-snug mb-1 ${isCancelledOrExpired ? "text-zinc-400" : "text-zinc-950"}`}>
                                {ticket.eventTitle}
                            </h3>

                            {/* Tier - only show for non-saved tickets */}
                            {!isSaved && (
                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-3">
                                    {ticket.tierName} Tier
                                </p>
                            )}

                            {/* Meta */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                                <div className="flex items-center gap-1.5 text-zinc-400">
                                    <Clock className="w-3 h-3 shrink-0" />
                                    <span className="text-[10px] font-medium">{formatDate(ticket.eventStartDate)}</span>
                                    {!isEventPassed && !isSaved && !isCancelledOrExpired && (
                                        <span className="text-[8px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full ml-1">
                                            Upcoming
                                        </span>
                                    )}
                                    {isEventPassed && !isSaved && !isCancelledOrExpired && (
                                        <span className="text-[8px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full ml-1">
                                            Passed
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-zinc-400">
                                    <MapPin className="w-3 h-3 shrink-0" />
                                    <span className="text-[10px] font-medium">{ticket.eventVenue}, {ticket.eventCity}</span>
                                </div>
                            </div>
                        </div>

                        {/* Price column - only for non-saved tickets */}
                        {!isSaved && (
                            <div className="text-right shrink-0">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Total Paid</p>
                                <p className={`text-xl font-black tracking-tighter ${isCancelledOrExpired ? "text-zinc-300" : "text-zinc-950"}`}>
                                    {formatPrice(total)}
                                </p>
                                {(totalGst > 0 || totalServiceFee > 0) && (
                                    <p className="text-[9px] text-zinc-400 mt-0.5">incl. taxes & fees</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer row */}
                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-100">
                        <div className="flex-1">
                            {isPending && remainingMins > 0 && (
                                <p className="text-[10px] font-mono font-bold text-amber-600">
                                    {getPendingText()}
                                </p>
                            )}
                            {isSaved && (
                                <p className="text-[9px] font-mono text-blue-600">Saved for later</p>
                            )}
                            {!isPending && !isSaved && !isCancelledOrExpired && (
                                <p className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest">
                                    {quantity > 1 ? `${quantity} tickets` : `#${ticket.id.slice(0, 12)}...`}
                                </p>
                            )}
                            {isCancelledOrExpired && (
                                <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                                    {quantity > 1 ? `${quantity} tickets` : `#${ticket.id.slice(0, 12)}...`}
                                </p>
                            )}
                        </div>

                        {/* Right side buttons */}
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                            {!isCancelledOrExpired && !isEventPassed && (
                                <>
                                    {ticket.status === "CONFIRMED" && (
                                        <button className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 text-zinc-500 hover:border-zinc-950 hover:text-zinc-950 text-[9px] font-black uppercase tracking-widest transition-all rounded">
                                            <QrCode className="w-3 h-3" />
                                            <span className="hidden sm:inline">QR</span>
                                        </button>
                                    )}
                                    {ticket.status === "PENDING" && (
                                        <Link
                                            href={`/checkout?ticketIds=${effectiveTicketIds.join(',')}`}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all rounded"
                                        >
                                            Pay Now
                                            <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    )}
                                    {isSaved && onRemoveSaved && (
                                        <button
                                            onClick={() => onRemoveSaved(ticket.eventId)}
                                            className="flex items-center gap-1.5 px-3 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 text-[9px] font-black uppercase tracking-widest transition-all rounded"
                                        >
                                            <X className="w-3 h-3" />
                                            <span className="hidden sm:inline">Remove</span>
                                        </button>
                                    )}
                                    {isPending && isGrouped && onCancelReservation && (
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-[9px] font-black uppercase tracking-widest transition-all rounded"
                                        >
                                            <XCircle className="w-3 h-3" />
                                            <span className="hidden sm:inline">Cancel</span>
                                        </button>
                                    )}
                                    <Link
                                        href={`/events/${ticket.eventId}`}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all rounded"
                                    >
                                        {isSaved ? "View" : "Details"}
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </>
                            )}

                            {/* For cancelled/expired tickets - show delete button */}
                            {isCancelledOrExpired && (onDeleteTicket || onDeleteGroup) && (
                                <>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-[9px] font-black uppercase tracking-widest transition-all rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                    <Link
                                        href={`/events/${ticket.eventId}`}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all rounded"
                                    >
                                        View <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </>
                            )}

                            {/* For passed events (non-cancelled), just show view event button */}
                            {!isCancelledOrExpired && isEventPassed && !isSaved && (
                                <Link
                                    href={`/events/${ticket.eventId}`}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all rounded"
                                >
                                    View Event <ArrowRight className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticket perforated divider decoration */}
            <div className="absolute left-44 top-0 bottom-0 w-px border-l border-dashed border-zinc-200 hidden sm:block pointer-events-none" />
        </motion.div>
    );
}