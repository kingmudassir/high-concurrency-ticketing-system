"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    CalendarDays,
    MapPin,
    Ticket,
    Pencil,
    Trash2,
    ArrowLeft,
    Users,
    DollarSign,
    Activity,
    ShieldAlert,
    CheckCircle2,
    Clock,
    XCircle,
    Search,
    ChevronLeft,
    ChevronRight,
    Zap,
    TrendingUp,
} from "lucide-react";
import { format } from "date-fns";

import { deleteEventAction } from "../actions/delete-event";
import { useEvent } from "@/app/hooks/Admin-Hooks/Fetch-Events/useEvent";
import EditEventModal from "./EditEventModal";

const TICKETS_PER_PAGE = 10;

const ticketStatusConfig: Record<string, { label: string; color: string; icon: any }> = {
    CONFIRMED: { label: "Confirmed", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CheckCircle2 },
    PENDING:   { label: "Pending",   color: "text-zinc-400 bg-zinc-50 border-zinc-100",          icon: Clock },
    USED:      { label: "Used",      color: "text-zinc-400 bg-zinc-50 border-zinc-100",          icon: CheckCircle2 },
    EXPIRED:   { label: "Expired",   color: "text-red-400 bg-red-50 border-red-100",             icon: XCircle },
    CANCELLED: { label: "Cancelled", color: "text-red-500 bg-red-50 border-red-100",             icon: XCircle },
};

function getEventStatus(event: { startDate: Date; ticketsSold: number; totalTickets: number }) {
    const now = new Date();
    const eventDate = new Date(event.startDate);
    if (eventDate < now) return { label: "Ended",    color: "text-zinc-300 bg-white border-zinc-100" };
    if (event.ticketsSold >= event.totalTickets) return { label: "Sold Out", color: "text-zinc-600 bg-zinc-100 border-zinc-200" };
    if (eventDate > new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) return { label: "Upcoming", color: "text-zinc-400 bg-zinc-50 border-zinc-100" };
    return { label: "Active", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
}

interface Props {
    eventId: string;
}

export default function EventDetailClient({ eventId }: Props) {
    const { data: event, isLoading, isError } = useEvent(eventId);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [ticketSearch, setTicketSearch] = useState("");
    const [ticketPage, setTicketPage] = useState(1);
    const [ticketFilter, setTicketFilter] = useState("all");

    const router = useRouter();
    const queryClient = useQueryClient();

    // ─── Loading / Error ────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-950 rounded-full animate-spin" />
                    <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em] animate-pulse">
                        Fetching Event Data...
                    </p>
                </div>
            </div>
        );
    }

    if (isError || !event) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 text-center">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                    <div>
                        <p className="text-sm font-bold text-zinc-950 uppercase tracking-tight">
                            Event Not Found
                        </p>
                        <p className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-widest">
                            ID: {eventId}
                        </p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-400 hover:text-zinc-950 uppercase tracking-widest transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    // ─── Derived Data ────────────────────────────────────────────────────────────
    const status = getEventStatus(event);
    const soldPct = Math.round((event.ticketsSold / event.totalTickets) * 100);
    const revenue = event.ticketsSold * event.price;
    const remaining = event.totalTickets - event.ticketsSold;

    // Ticket breakdown
    const statusCounts = event.tickets.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const filteredTickets = event.tickets.filter((t) => {
        const matchSearch =
            t.user.username.toLowerCase().includes(ticketSearch.toLowerCase()) ||
            t.user.email.toLowerCase().includes(ticketSearch.toLowerCase()) ||
            t.id.toLowerCase().includes(ticketSearch.toLowerCase());
        const matchFilter = ticketFilter === "all" || t.status === ticketFilter;
        return matchSearch && matchFilter;
    });

    const totalTicketPages = Math.ceil(filteredTickets.length / TICKETS_PER_PAGE);
    const ticketStart = (ticketPage - 1) * TICKETS_PER_PAGE;
    const paginatedTickets = filteredTickets.slice(ticketStart, ticketStart + TICKETS_PER_PAGE);

    // ─── Delete Handler ──────────────────────────────────────────────────────────
    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteEventAction(event!.id);
        if (result.success) {
            toast.success("EVENT DELETED");
            queryClient.invalidateQueries({ queryKey: ["events", "all"] });
            router.push("/admin/events");
        } else {
            toast.error(result.error || "DELETE FAILED");
            setIsDeleting(false);
            setIsDeleteConfirm(false);
        }
    }

    // ─── Render ──────────────────────────────────────────────────────────────────
    return (
        <>
            <div className="min-h-screen bg-zinc-50">
                
                {/* ── Top Nav Bar ─────────────────────────────────────────────── */}
                <div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between gap-4">
                        <button
                            onClick={() => router.back()}
                            className="group flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors"
                        >
                            <div className="w-7 h-7 border border-zinc-200 group-hover:border-zinc-950 flex items-center justify-center transition-colors">
                                <ArrowLeft className="w-3 h-3" />
                            </div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest hidden sm:block">
                                All Events
                            </span>
                        </button>

                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-1 text-[8px] font-mono font-bold uppercase tracking-widest border ${status.color}`}>
                                {status.label}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-300 hidden sm:block">
                                {event.id}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="flex items-center gap-2 border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950 hover:border-zinc-950 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors"
                            >
                                <Pencil className="w-3 h-3" />
                                <span className="hidden sm:block">Edit</span>
                            </button>
                            <button
                                onClick={() => setIsDeleteConfirm(true)}
                                className="flex items-center gap-2 border border-red-100 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors"
                            >
                                <Trash2 className="w-3 h-3" />
                                <span className="hidden sm:block">Delete</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 space-y-10">

                    {/* ── Event Header ────────────────────────────────────────── */}
                    <div className="bg-white border border-zinc-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-950" />
                        <div className="p-8 sm:p-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-px bg-emerald-600" />
                                <span className="text-[9px] font-mono font-bold tracking-[0.4em] uppercase text-zinc-400">
                                    Event_Profile
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl font-bold text-zinc-950 uppercase tracking-tighter leading-[0.9] mb-6">
                                {event.title}
                            </h1>

                            {event.description && (
                                <p className="text-zinc-500 text-base leading-relaxed max-w-2xl mb-8 font-medium">
                                    {event.description}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-mono text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-zinc-300" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-3 h-3 text-zinc-300" />
                                    <span>{format(new Date(event.startDate), "dd MMM yyyy, HH:mm")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-zinc-300" />
                                    <span>Created {format(new Date(event.createdAt), "dd MMM yyyy")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Stat Cards ──────────────────────────────────────────── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                label: "Revenue",
                                value: `₨ ${revenue.toLocaleString()}`,
                                sub: `${event.ticketsSold} × ₨${event.price.toLocaleString()}`,
                                icon: DollarSign,
                                accent: "bg-emerald-500",
                            },
                            {
                                label: "Tickets_Sold",
                                value: event.ticketsSold.toString(),
                                sub: `${soldPct}% of capacity`,
                                icon: Ticket,
                                accent: soldPct === 100 ? "bg-zinc-950" : "bg-emerald-500",
                            },
                            {
                                label: "Remaining",
                                value: remaining.toString(),
                                sub: `of ${event.totalTickets} total`,
                                icon: TrendingUp,
                                accent: remaining === 0 ? "bg-red-500" : "bg-zinc-300",
                            },
                            {
                                label: "Total_Buyers",
                                value: new Set(event.tickets.map(t => t.user.id)).size.toString(),
                                sub: "Unique users",
                                icon: Users,
                                accent: "bg-zinc-300",
                            },
                        ].map((card) => (
                            <div key={card.label} className="bg-white border border-zinc-200 p-6 relative hover:border-zinc-400 transition-colors">
                                <div className={`absolute top-0 left-0 w-full h-0.5 ${card.accent}`} />
                                <div className="w-8 h-8 bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-4">
                                    <card.icon className="w-4 h-4 text-zinc-400" />
                                </div>
                                <p className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em] mb-1">
                                    {card.label}
                                </p>
                                <p className="text-2xl font-bold text-zinc-950 tracking-tighter tabular-nums leading-none">
                                    {card.value}
                                </p>
                                <p className="text-[9px] font-mono text-zinc-400 mt-1.5">{card.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Capacity Bar ────────────────────────────────────────── */}
                    <div className="bg-white border border-zinc-200 p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em]">
                                    Capacity_Utilization
                                </p>
                                <p className="text-xs font-bold text-zinc-950 mt-1">
                                    {event.ticketsSold.toLocaleString()} / {event.totalTickets.toLocaleString()} tickets sold
                                </p>
                            </div>
                            <span className="text-3xl font-bold text-zinc-950 tabular-nums tracking-tighter">
                                {soldPct}%
                            </span>
                        </div>
                        <div className="h-2 bg-zinc-100 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${soldPct === 100 ? "bg-zinc-950" : "bg-emerald-500"}`}
                                style={{ width: `${soldPct}%` }}
                            />
                        </div>
                        {/* Status breakdown chips */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            {Object.entries(statusCounts).map(([status, count]) => {
                                const cfg = ticketStatusConfig[status] ?? { label: status, color: "text-zinc-400 bg-zinc-50 border-zinc-100" };
                                return (
                                    <div key={status} className={`flex items-center gap-2 px-3 py-1.5 border text-[9px] font-mono font-bold uppercase tracking-widest ${cfg.color}`}>
                                        <span>{cfg.label}</span>
                                        <span className="opacity-60">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Ticket Ledger ────────────────────────────────────────── */}
                    <div className="bg-white border border-zinc-200">
                        <div className="px-6 sm:px-8 py-5 border-b border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold text-zinc-950 uppercase tracking-tight">Ticket_Ledger</p>
                                <p className="text-[9px] font-mono text-zinc-400 mt-0.5 uppercase tracking-widest">
                                    {event.tickets.length} total issued tickets
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                                {/* Search */}
                                <div className="flex items-center gap-2 border border-zinc-200 bg-zinc-50 px-3 py-2 w-full sm:w-56">
                                    <Search className="w-3 h-3 text-zinc-300 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search buyer or ID..."
                                        value={ticketSearch}
                                        onChange={(e) => { setTicketSearch(e.target.value); setTicketPage(1); }}
                                        className="text-[10px] font-mono bg-transparent outline-none text-zinc-600 placeholder-zinc-300 w-full"
                                    />
                                </div>
                                {/* Filter */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {["all", "CONFIRMED", "PENDING", "USED", "EXPIRED", "CANCELLED"].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => { setTicketFilter(f); setTicketPage(1); }}
                                            className={`px-2.5 py-1.5 text-[8px] font-mono font-bold uppercase tracking-widest border transition-colors ${
                                                ticketFilter === f
                                                    ? "bg-zinc-950 text-white border-zinc-950"
                                                    : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400"
                                            }`}
                                        >
                                            {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {paginatedTickets.length === 0 ? (
                            <div className="px-8 py-16 text-center">
                                <Ticket className="w-6 h-6 text-zinc-200 mx-auto mb-3" />
                                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                                    No tickets match criteria
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-zinc-100 bg-zinc-50">
                                            {["Ticket ID", "Buyer", "Email", "Purchased", "Expires", "Status"].map((h) => (
                                                <th key={h} className="text-left px-6 py-3 text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedTickets.map((ticket) => {
                                            const cfg = ticketStatusConfig[ticket.status] ?? {
                                                label: ticket.status,
                                                color: "text-zinc-400 bg-zinc-50 border-zinc-100",
                                                icon: Clock,
                                            };
                                            const StatusIcon = cfg.icon;
                                            return (
                                                <tr key={ticket.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className="text-[9px] font-mono text-zinc-400 cursor-help border-b border-dotted border-zinc-200"
                                                            title={ticket.id}
                                                        >
                                                            {ticket.id.slice(0, 8)}...
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-[10px] font-bold text-zinc-950 uppercase tracking-tight whitespace-nowrap">
                                                        {ticket.user.username}
                                                    </td>
                                                    <td className="px-6 py-4 text-[9px] font-mono text-zinc-400">
                                                        {ticket.user.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-[9px] font-mono text-zinc-400 whitespace-nowrap">
                                                        {format(new Date(ticket.createdAt), "dd MMM yy, HH:mm")}
                                                    </td>
                                                    <td className="px-6 py-4 text-[9px] font-mono text-zinc-400 whitespace-nowrap">
                                                        {format(new Date(ticket.expiresAt), "dd MMM yy, HH:mm")}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest border ${cfg.color}`}>
                                                            <StatusIcon className="w-2.5 h-2.5" />
                                                            {cfg.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Ticket pagination */}
                        {totalTicketPages > 1 && (
                            <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between">
                                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                                    {ticketStart + 1}–{Math.min(ticketStart + TICKETS_PER_PAGE, filteredTickets.length)} of {filteredTickets.length}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setTicketPage(p => Math.max(p - 1, 1))}
                                        disabled={ticketPage === 1}
                                        className="w-7 h-7 flex items-center justify-center border border-zinc-200 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                                    >
                                        <ChevronLeft className="w-3 h-3" />
                                    </button>
                                    {Array.from({ length: Math.min(totalTicketPages, 5) }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setTicketPage(p)}
                                            className={`w-7 h-7 text-[10px] font-mono font-bold border transition-colors ${
                                                ticketPage === p
                                                    ? "bg-zinc-950 text-white border-zinc-950"
                                                    : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setTicketPage(p => Math.min(p + 1, totalTicketPages))}
                                        disabled={ticketPage === totalTicketPages}
                                        className="w-7 h-7 flex items-center justify-center border border-zinc-200 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                                    >
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
                            <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                                Pipeline_Integrity: 100%
                            </span>
                            <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                        </div>
                    </div>

                    {/* System footer */}
                    <div className="flex items-center justify-between border-t border-zinc-200 pt-6">
                        <span className="text-[8px] font-mono text-zinc-300 uppercase tracking-widest">
                            Last Updated: {format(new Date(event.updatedAt), "dd MMM yyyy, HH:mm:ss")}
                        </span>
                        <span className="text-[8px] font-mono text-zinc-300 uppercase tracking-widest">
                            Verification_Hash: {event.id.slice(-8)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Edit Modal ─────────────────────────────────────────────────── */}
            <EditEventModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                event={event}
            />

            {/* ── Delete Confirmation Overlay ───────────────────────────────── */}
            {isDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
                        onClick={() => !isDeleting && setIsDeleteConfirm(false)}
                    />
                    <div className="relative w-full max-w-md bg-white border border-zinc-200 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                        <div className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                                    <ShieldAlert className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-tighter">
                                        Confirm Deletion
                                    </h3>
                                    <p className="text-[10px] font-mono text-zinc-400 mt-1 leading-relaxed uppercase tracking-wide">
                                        This will permanently delete the event and all {event.tickets.length} associated tickets. This action cannot be undone.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-zinc-50 border border-zinc-100 p-4 mb-6">
                                <p className="text-[10px] font-bold text-zinc-950 uppercase tracking-tight truncate">
                                    {event.title}
                                </p>
                                <p className="text-[9px] font-mono text-zinc-400 mt-1">
                                    {event.id}
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <button
                                    onClick={() => setIsDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="text-[10px] font-mono font-bold text-zinc-400 hover:text-zinc-950 uppercase tracking-widest transition-colors disabled:opacity-40"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className={`flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                                        isDeleting
                                            ? "bg-zinc-400 text-white cursor-not-allowed"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-red-300 border-t-white rounded-full animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-3 h-3" />
                                            Delete Event
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}