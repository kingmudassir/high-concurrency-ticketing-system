"use client";

import { useState } from "react";
import { Plus, Search, CalendarDays, MapPin, Ticket, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import CreateEventModal from "./CreateEventModal";
import { useEvents } from "@/app/hooks/events/useEvents";

const statusConfig: Record<string, { label: string; color: string }> = {
    active:   { label: "Active",    color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    sold_out: { label: "Sold Out",  color: "text-zinc-600 bg-zinc-100 border-zinc-200" },
    upcoming: { label: "Upcoming",  color: "text-zinc-400 bg-zinc-50 border-zinc-100" },
    ended:    { label: "Ended",     color: "text-zinc-300 bg-white border-zinc-100" },
};

const ITEMS_PER_PAGE = 10;

export default function EventsPage() {
    const { data: rawEvents = [], isLoading, isError } = useEvents();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) return (
        <div className="p-10 font-mono text-[10px] text-zinc-400 uppercase tracking-widest animate-pulse">
            SYNCHRONIZING_DATABASE...
        </div>
    );
    if (isError) return (
        <div className="p-10 font-mono text-[10px] text-red-500 uppercase tracking-widest">
            DATABASE_CONNECTION_ERROR
        </div>
    );

    const now = new Date();

    const processedEvents = (rawEvents ?? []).map((e) => {
        // Safely parse the date - use startDate instead of date
        const eventDate = e.startDate ? new Date(e.startDate) : null;
        let calculatedStatus = "active";

        if (!eventDate) {
            calculatedStatus = "upcoming";
        } else if (eventDate < now) {
            calculatedStatus = "ended";
        } else if (e.ticketsSold >= e.totalCapacity) {
            calculatedStatus = "sold_out";
        } else if (eventDate > new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) {
            calculatedStatus = "upcoming";
        }

        return { ...e, calculatedStatus, eventDate };
    });

    const filtered = processedEvents.filter((e) => {
        const matchSearch = e.name?.toLowerCase().includes(search.toLowerCase()) || false;
        const matchFilter = filter === "all" || e.calculatedStatus === filter;
        return matchSearch && matchFilter;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedEvents = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Helper function to safely format date
    const formatEventDate = (date: Date | string | null | undefined) => {
        if (!date) return "TBD";
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) return "Invalid date";
            return format(dateObj, "dd MMM yyyy");
        } catch {
            return "Invalid date";
        }
    };

    // Helper to get price display from ticket tiers
    const getPriceDisplay = (event: any) => {
        if (event.ticketTiers && event.ticketTiers.length > 0) {
            const prices = event.ticketTiers.map((t: any) => t.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            if (minPrice === maxPrice) {
                return `₨ ${minPrice.toLocaleString()}`;
            }
            return `₨ ${minPrice.toLocaleString()} - ₨ ${maxPrice.toLocaleString()}`;
        }
        // Fallback to old price field if it exists
        if (event.price) return `₨ ${event.price.toLocaleString()}`;
        return "₨ 0";
    };

    return (
        <div className="p-6 sm:p-10 space-y-8">

            {/* Sticky Controls Header */}
            <div className="sticky top-0 z-50 bg-zinc-50 -mx-6 sm:-mx-10 px-6 sm:px-10 py-6 border-b border-zinc-200 shadow-sm">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em]">
                            {rawEvents.length} TOTAL EVENTS
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-zinc-950 text-white px-5 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                            Create Event
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2 border border-zinc-200 bg-white px-3 py-2.5 w-full sm:w-80">
                            <Search className="w-3 h-3 text-zinc-300 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="text-[10px] font-mono bg-transparent outline-none text-zinc-600 placeholder-zinc-300 w-full uppercase tracking-widest"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {["all", "active", "upcoming", "sold_out", "ended"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => { setFilter(f); setCurrentPage(1); }}
                                    className={`px-3 py-2 text-[8px] font-mono font-bold uppercase tracking-widest border transition-colors ${
                                        filter === f
                                            ? "bg-zinc-950 text-white border-zinc-950"
                                            : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400"
                                    }`}
                                >
                                    {f === "sold_out" ? "Sold Out" : f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-zinc-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50">
                                {["ID", "Event", "Venue", "Date", "Capacity", "Price", "Status", ""].map((h) => (
                                    <th key={h} className="text-left px-6 py-3 text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedEvents.map((e) => {
                                const pct = e.totalCapacity > 0 ? Math.round((e.ticketsSold / e.totalCapacity) * 100) : 0;
                                const cfg = statusConfig[e.calculatedStatus];
                                const priceDisplay = getPriceDisplay(e);

                                return (
                                    <tr
                                        key={e.id}
                                        className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors group cursor-pointer"
                                        onClick={() => window.open(`/admin/events/${e.id}`, "_blank")}
                                    >
                                        <td className="px-6 py-4 text-[9px] font-mono text-zinc-400">
                                            <span
                                                className="cursor-help border-b border-dotted border-zinc-300"
                                                title={e.id}
                                            >
                                                {e.id.slice(0, 5)}...
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-zinc-950 uppercase tracking-tight max-w-50">
                                            <p className="truncate">{e.name || e.title || "Untitled"}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-400">
                                                <MapPin className="w-3 h-3 shrink-0" />
                                                <span className="truncate max-w-35">{e.location || "TBD"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-400">
                                                <CalendarDays className="w-3 h-3 shrink-0" />
                                                {formatEventDate(e.startDate || e.date)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-[9px] font-mono">
                                                    <Ticket className="w-3 h-3 text-zinc-300" />
                                                    <span className="text-zinc-950 font-bold">{e.ticketsSold?.toLocaleString() || 0}</span>
                                                    <span className="text-zinc-300">/</span>
                                                    <span className="text-zinc-400">{e.totalCapacity?.toLocaleString() || 0}</span>
                                                </div>
                                                <div className="w-24 h-0.5 bg-zinc-100">
                                                    <div
                                                        className={`h-full ${pct === 100 ? "bg-zinc-950" : "bg-emerald-500"}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-mono font-bold text-zinc-950 tabular-nums whitespace-nowrap">
                                            {priceDisplay}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest border ${cfg.color}`}>
                                                {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(ev) => ev.stopPropagation()}
                                                className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-zinc-950 transition-colors"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between text-[9px] font-mono">
                        <span className="text-zinc-400 uppercase tracking-widest">
                            Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} events
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-7 h-7 flex items-center justify-center border border-zinc-200 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setCurrentPage(p)}
                                    className={`w-7 h-7 font-bold transition-colors ${
                                        currentPage === p
                                            ? "bg-zinc-950 text-white border-zinc-950"
                                            : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="w-7 h-7 flex items-center justify-center border border-zinc-200 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <CreateEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}