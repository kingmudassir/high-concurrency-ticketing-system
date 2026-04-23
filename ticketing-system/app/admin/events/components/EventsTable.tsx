"use client";

import { format } from "date-fns";
import { MapPin, CalendarDays, Ticket, ExternalLink, MoreHorizontal, TrendingUp } from "lucide-react";

interface ProcessedEvent {
    id: string;
    name?: string;
    title?: string;
    location?: string;
    startDate?: string | Date | null;
    date?: string | Date | null;
    ticketsSold: number;
    totalCapacity: number;
    ticketTiers?: { price: number }[];
    price?: number;
    category?: string;
    calculatedStatus: string;
    eventDate: Date | null;
}

interface EventsTableProps {
    events: ProcessedEvent[];
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
    active:   { label: "Live",     cls: "text-emerald-700 bg-emerald-50 border-emerald-200",  dot: "bg-emerald-500" },
    sold_out: { label: "Sold Out", cls: "text-amber-700  bg-amber-50  border-amber-200",    dot: "bg-amber-400" },
    upcoming: { label: "Upcoming", cls: "text-sky-700    bg-sky-50    border-sky-200",      dot: "bg-sky-400" },
    ended:    { label: "Ended",    cls: "text-zinc-400   bg-zinc-50   border-zinc-200",     dot: "bg-zinc-300" },
};

const CAPACITY_COLOR = (pct: number) => {
    if (pct >= 100) return "bg-zinc-950";
    if (pct >= 80)  return "bg-amber-500";
    if (pct >= 50)  return "bg-emerald-500";
    return "bg-emerald-400";
};

function formatEventDate(date: Date | string | null | undefined): string {
    if (!date) return "TBD";
    try {
        const d = typeof date === "string" ? new Date(date) : date;
        if (isNaN(d.getTime())) return "—";
        return format(d, "dd MMM yyyy");
    } catch { return "—"; }
}

function formatEventTime(date: Date | string | null | undefined): string {
    if (!date) return "";
    try {
        const d = typeof date === "string" ? new Date(date) : date;
        if (isNaN(d.getTime())) return "";
        return format(d, "h:mm a");
    } catch { return ""; }
}

function getPriceDisplay(event: ProcessedEvent): string {
    if (event.ticketTiers && event.ticketTiers.length > 0) {
        const prices = event.ticketTiers.map((t) => t.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        if (min === max) return `₨ ${min.toLocaleString()}`;
        return `₨ ${min.toLocaleString()} – ${max.toLocaleString()}`;
    }
    if (event.price) return `₨ ${event.price.toLocaleString()}`;
    return "Free";
}

const COL_HEADERS = ["#", "Event", "Venue & Date", "Capacity", "Pricing", "Status", ""];

export function EventsTable({ events }: EventsTableProps) {
    return (
        <div className="bg-white border border-zinc-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-zinc-950 text-white">
                            {COL_HEADERS.map((h) => (
                                <th
                                    key={h}
                                    className="text-left px-5 py-3.5 text-[8px] font-black font-mono uppercase tracking-[0.25em] whitespace-nowrap first:pl-6 last:pr-6"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {events.map((e, idx) => {
                            const pct = e.totalCapacity > 0
                                ? Math.round((e.ticketsSold / e.totalCapacity) * 100)
                                : 0;
                            const cfg = STATUS_CONFIG[e.calculatedStatus] ?? STATUS_CONFIG.upcoming;
                            const eventName = e.name || e.title || "Untitled Event";
                            const priceDisplay = getPriceDisplay(e);
                            const dateStr = formatEventDate(e.startDate ?? e.date);
                            const timeStr = formatEventTime(e.startDate ?? e.date);

                            return (
                                <tr
                                    key={e.id}
                                    className="group hover:bg-zinc-50/80 transition-colors cursor-pointer"
                                    onClick={() => window.open(`/admin/events/${e.id}`, "_blank")}
                                >
                                    {/* Row number */}
                                    <td className="pl-6 pr-3 py-5 w-12">
                                        <span className="text-[10px] font-black font-mono text-zinc-300 tabular-nums">
                                            {String(idx + 1).padStart(2, "0")}
                                        </span>
                                    </td>

                                    {/* Event name + ID + category */}
                                    <td className="px-5 py-5 max-w-xs">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-zinc-950 leading-snug truncate group-hover:text-emerald-700 transition-colors">
                                                {eventName}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="text-[8px] font-mono text-zinc-400 hover:text-zinc-600 transition-colors cursor-help border-b border-dotted border-zinc-300"
                                                    title={e.id}
                                                >
                                                    {e.id.slice(0, 8)}…
                                                </span>
                                                {e.category && (
                                                    <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-100 px-1.5 py-0.5">
                                                        {e.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Venue + Date combined */}
                                    <td className="px-5 py-5">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                                                <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                                                <span className="truncate max-w-40">{e.location || "TBD"}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="w-3 h-3 text-zinc-400 shrink-0" />
                                                <span className="text-xs text-zinc-600 font-medium tabular-nums">{dateStr}</span>
                                                {timeStr && (
                                                    <span className="text-[9px] font-mono text-zinc-400">{timeStr}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Capacity bar */}
                                    <td className="px-5 py-5 w-48">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <Ticket className="w-3 h-3 text-zinc-400" />
                                                    <span className="text-xs font-black tabular-nums text-zinc-950">
                                                        {(e.ticketsSold ?? 0).toLocaleString()}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-400 font-mono">
                                                        / {(e.totalCapacity ?? 0).toLocaleString()}
                                                    </span>
                                                </div>
                                                <span className={`text-[9px] font-black font-mono tabular-nums ${
                                                    pct >= 80 ? "text-amber-600" : "text-zinc-500"
                                                }`}>
                                                    {pct}%
                                                </span>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="w-full h-1.5 bg-zinc-100 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${CAPACITY_COLOR(pct)}`}
                                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Price */}
                                    <td className="px-5 py-5 whitespace-nowrap">
                                        <span className="text-sm font-black text-zinc-950 tabular-nums">
                                            {priceDisplay}
                                        </span>
                                    </td>

                                    {/* Status badge */}
                                    <td className="px-5 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-[9px] font-black font-mono uppercase tracking-widest whitespace-nowrap ${cfg.cls}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                                            {cfg.label}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="pr-6 pl-3 py-5 w-12">
                                        <button
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                window.open(`/admin/events/${e.id}`, "_blank");
                                            }}
                                            className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-zinc-950 hover:bg-zinc-100 transition-all"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}