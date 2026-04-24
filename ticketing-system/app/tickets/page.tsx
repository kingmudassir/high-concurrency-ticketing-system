"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Timer, CheckCircle, XCircle, Inbox, Bookmark } from "lucide-react";
import TicketCard, { type TicketCardData, type TicketStatus } from "./components/Ticketcard";
import { useAuth } from "@/app/hooks/auth/useAuth";
import { getUserTickets } from "./actions/get-user-tickets";
import { getUserSavedEvents } from "./actions/get-saved-events";
import { useCancelReservation } from "../hooks/cancel_reservation/useCancelReservation";
import { useDeleteCancelledTickets } from "../hooks/delete-cancelled-tickets/useDeleteCancelledTickets";

// ─── FILTER TABS ──────────────────────────────────────────────────────────────
type FilterTab = "all" | "PENDING" | "CONFIRMED" | "EXPIRED" | "SAVED";

const TABS: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
    { id: "all",       label: "All",       icon: <Ticket className="w-3 h-3" /> },
    { id: "PENDING",   label: "Reserved",  icon: <Timer className="w-3 h-3" /> },
    { id: "CONFIRMED", label: "Confirmed", icon: <CheckCircle className="w-3 h-3" /> },
    { id: "EXPIRED",   label: "Expired",   icon: <XCircle className="w-3 h-3" /> },
    { id: "SAVED",     label: "Saved",     icon: <Bookmark className="w-3 h-3" /> },
];

// ─── GROUPED TICKET CARD DATA ─────────────────────────────────────────────────
export interface GroupedTicketCardData {
    id: string;
    eventId: string;
    eventTitle: string;
    eventImageUrl: string | null;
    eventVenue: string;
    eventCity: string;
    eventStartDate: Date;
    tierName: string;
    quantity: number;
    totalPricePaid: number;
    totalGstPaid: number;
    totalServiceFeePaid: number;
    status: TicketStatus;
    ticketIds: string[];
    expiresAt?: Date | null;
    purchasedAt?: Date | null;
}

// ─── TRANSFORM AND GROUP TICKETS ──────────────────────────────────────────────
function groupAndTransformTickets(tickets: any[]): GroupedTicketCardData[] {
    if (!tickets || tickets.length === 0) return [];
    
    const grouped = new Map<string, GroupedTicketCardData>();
    
    for (const ticket of tickets) {
        const groupKey = `${ticket.eventId}_${ticket.tierId}_${ticket.status}`;
        
        if (grouped.has(groupKey)) {
            const existing = grouped.get(groupKey)!;
            existing.quantity += 1;
            existing.totalPricePaid += ticket.pricePaid;
            existing.totalGstPaid += ticket.gstPaid;
            existing.totalServiceFeePaid += ticket.serviceFeePaid;
            existing.ticketIds.push(ticket.id);
        } else {
            grouped.set(groupKey, {
                id: groupKey,
                eventId: ticket.eventId,
                eventTitle: ticket.event.title,
                eventImageUrl: ticket.event.imageUrl || "/placeholder-event.jpg",
                eventVenue: ticket.event.location,
                eventCity: ticket.event.city || "TBD",
                eventStartDate: new Date(ticket.event.startDate),
                tierName: ticket.tier.name,
                quantity: 1,
                totalPricePaid: ticket.pricePaid,
                totalGstPaid: ticket.gstPaid,
                totalServiceFeePaid: ticket.serviceFeePaid,
                status: ticket.status as TicketStatus,
                ticketIds: [ticket.id],
                expiresAt: ticket.expiresAt ? new Date(ticket.expiresAt) : undefined,
                purchasedAt: new Date(ticket.createdAt),
            });
        }
    }
    
    return Array.from(grouped.values());
}

function transformSavedEvents(savedEvents: any[]): TicketCardData[] {
    if (!savedEvents || savedEvents.length === 0) return [];
    
    return savedEvents.map((savedEvent: any) => ({
        id: savedEvent.id,
        eventId: savedEvent.eventId,
        eventTitle: savedEvent.event.title,
        eventImageUrl: savedEvent.event.imageUrl || "/placeholder-event.jpg",
        eventVenue: savedEvent.event.location,
        eventCity: savedEvent.event.city || "TBD",
        eventStartDate: new Date(savedEvent.event.startDate),
        tierName: "Not purchased",
        pricePaid: 0,
        gstPaid: 0,
        serviceFeePaid: 0,
        status: "SAVED" as TicketStatus,
        purchasedAt: new Date(savedEvent.savedAt),
        isSaved: true,
    }));
}

// ─── STATS ────────────────────────────────────────────────────────────────────
function Stats({ tickets }: { tickets: GroupedTicketCardData[] }) {
    const confirmed = tickets.filter(t => t.status === "CONFIRMED").length;
    const pending   = tickets.filter(t => t.status === "PENDING").length;
    const totalSpent = tickets
        .filter(t => t.status === "CONFIRMED")
        .reduce((acc, t) => acc + t.totalPricePaid + t.totalGstPaid + t.totalServiceFeePaid, 0);

    return (
        <div className="grid grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 mb-8">
            {[
                { label: "Total Tickets", value: confirmed, sub: "confirmed orders" },
                { label: "Pending",       value: pending,   sub: "awaiting payment" },
                { label: "Total Spent",   value: `₨ ${totalSpent.toLocaleString()}`, sub: "confirmed only" },
            ].map((s) => (
                <div key={s.label} className="bg-white px-6 py-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-1">{s.label}</p>
                    <p className="text-2xl font-black tracking-tighter text-zinc-950">{s.value}</p>
                    <p className="text-[9px] text-zinc-400 mt-0.5">{s.sub}</p>
                </div>
            ))}
        </div>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function TicketsPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<FilterTab>("all");
    const [groupedTickets, setGroupedTickets] = useState<GroupedTicketCardData[]>([]);
    const [savedEvents, setSavedEvents] = useState<TicketCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { cancelReservation, isCancelling } = useCancelReservation();
    const { deleteCancelledTickets, isDeleting } = useDeleteCancelledTickets();

    // Add these logs
    console.log("=== TicketsPage Debug ===");
    console.log("authLoading:", authLoading);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("user:", user);

    useEffect(() => {
        // Only run if auth is done loading
        if (authLoading) return;
        
        if (!isAuthenticated || !user) {
            setIsLoading(false);
            return;
        }

        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const [ticketsResult, savedEventsResult] = await Promise.all([
                    getUserTickets(user.id),
                    getUserSavedEvents()
                ]);
                
                if (ticketsResult.success && ticketsResult.tickets) {
                    const grouped = groupAndTransformTickets(ticketsResult.tickets);
                    setGroupedTickets(grouped);
                } else {
                    console.error("Failed to fetch tickets:", ticketsResult.error);
                }
                
                if (savedEventsResult.success && savedEventsResult.savedEvents) {
                    setSavedEvents(transformSavedEvents(savedEventsResult.savedEvents));
                } else {
                    console.error("Failed to fetch saved events:", savedEventsResult.error);
                }
            } catch (err) {
                setError("Failed to load your tickets. Please try again.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [authLoading, isAuthenticated, user]);

    // Handle delete single ticket
    const handleDeleteTicket = async (ticketId: string) => {
        const success = await deleteCancelledTickets([ticketId]);
        if (success) {
            window.location.reload();
        }
    };

    // Handle delete group of tickets
    const handleDeleteGroup = async (ticketIds: string[]) => {
        const success = await deleteCancelledTickets(ticketIds);
        if (success) {
            window.location.reload();
        }
    };

    // Combine grouped tickets and saved events based on active tab
    const allItems = [...groupedTickets, ...savedEvents];
    
    const filtered = allItems.filter(item => {
        if (activeTab === "all") return item.status !== "SAVED";
        if (activeTab === "SAVED") return item.status === "SAVED";
        return item.status === activeTab;
    });

    const tabCount = (tab: FilterTab) => {
        if (tab === "all") return groupedTickets.length;
        if (tab === "SAVED") return savedEvents.length;
        return groupedTickets.filter(t => t.status === tab).length;
    };

    // Show loading state while checking auth
    if (authLoading) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-8 h-8 border-2 border-zinc-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
                    <p className="text-sm text-zinc-500">Authenticating...</p>
                </div>
            </div>
        );
    }
    
    // If not authenticated, return null (middleware will redirect)
    if (!isAuthenticated) {
        console.log("Not authenticated, returning null");
        return null;
    }

    // Loading state while fetching tickets
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-8 h-8 border-2 border-zinc-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
                    <p className="text-sm text-zinc-500">Loading your tickets...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex flex-col items-center justify-center py-24 text-center border border-red-200 bg-red-50">
                    <XCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-base font-black uppercase tracking-tight text-red-700 mb-2">Error Loading Tickets</p>
                    <p className="text-sm text-red-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-6 px-6 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Page header */}
            <div className="mb-8">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Account</p>
                <h1 className="text-3xl font-black uppercase tracking-[-0.04em] text-zinc-950">My Tickets</h1>
            </div>

            {/* Stats */}
            <Stats tickets={groupedTickets} />

            {/* Filter tabs */}
            <div className="flex items-center gap-0 border border-zinc-200 bg-white mb-6 overflow-x-auto">
                {TABS.map((tab) => {
                    const count = tabCount(tab.id);
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3.5 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border-r border-zinc-200 last:border-r-0 ${
                                isActive
                                    ? "bg-zinc-950 text-white"
                                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {count > 0 && (
                                <span className={`px-1.5 py-0.5 text-[8px] font-black rounded-sm ${
                                    isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                                }`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Ticket list */}
            <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-24 text-center border border-zinc-200 bg-white"
                    >
                        <Inbox className="w-10 h-10 text-zinc-200 mb-4" />
                        <p className="text-sm font-black uppercase tracking-tight text-zinc-300">No items here</p>
                        <p className="text-xs text-zinc-400 mt-1">
                            {activeTab === "SAVED" 
                                ? "Save events you're interested in to see them here" 
                                : "Browse events to reserve your spot"}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-4"
                    >
                        {filtered.map((item, i) => {
                            const isGrouped = item.status !== "SAVED";
                            const isPending = item.status === "PENDING";
                            const isCancelledOrExpired = item.status === "EXPIRED" || item.status === "CANCELLED";
                            
                            return (
                                <TicketCard 
                                    key={item.id} 
                                    ticket={item} 
                                    index={i}
                                    isGrouped={isGrouped}
                                    onCancelReservation={isPending && 'ticketIds' in item ? async () => {
                                        const success = await cancelReservation((item as any).ticketIds);
                                        if (success) {
                                            window.location.reload();
                                        }
                                    } : undefined}
                                    onDeleteTicket={isCancelledOrExpired && !isGrouped ? handleDeleteTicket : undefined}
                                    onDeleteGroup={isCancelledOrExpired && isGrouped ? handleDeleteGroup : undefined}
                                    isDeleting={isDeleting}
                                />
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}