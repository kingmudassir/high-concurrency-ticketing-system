"use client";

import { useState } from "react";
import { Search, Download, CheckCircle2, XCircle, Clock, MoreHorizontal, RefreshCcw } from "lucide-react";

const tickets = [
    { id: "TK-008412", event: "Taylor Swift — Eras Tour", user: "Muhammad Bilal", seat: "B-14", price: "₨ 8,500", purchased: "2026-04-18 14:22", status: "confirmed" },
    { id: "TK-008411", event: "F1 Grand Prix Karachi", user: "Sara Ahmed", seat: "VIP-03", price: "₨ 15,000", purchased: "2026-04-18 13:50", status: "confirmed" },
    { id: "TK-008410", event: "Coke Studio Live", user: "Ali Raza", seat: "A-07", price: "₨ 3,200", purchased: "2026-04-17 20:11", status: "used" },
    { id: "TK-008409", event: "Taylor Swift — Eras Tour", user: "Fatima Malik", seat: "D-32", price: "₨ 8,500", purchased: "2026-04-17 11:05", status: "refunded" },
    { id: "TK-008408", event: "PSL Finals 2026", user: "Usman Tariq", seat: "G-88", price: "₨ 5,000", purchased: "2026-04-16 09:30", status: "used" },
    { id: "TK-008407", event: "DevCon Islamabad 2026", user: "Zara Hussain", seat: "C-21", price: "₨ 1,500", purchased: "2026-04-15 18:44", status: "pending" },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    confirmed: { label: "Confirmed", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CheckCircle2 },
    used:      { label: "Used",      color: "text-zinc-400 bg-zinc-50 border-zinc-100",          icon: CheckCircle2 },
    refunded:  { label: "Refunded",  color: "text-red-500 bg-red-50 border-red-100",             icon: XCircle },
    pending:   { label: "Pending",   color: "text-zinc-400 bg-zinc-50 border-zinc-100",          icon: Clock },
};

export default function TicketsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const filtered = tickets.filter((t) => {
        const matchSearch =
            t.id.toLowerCase().includes(search.toLowerCase()) ||
            t.user.toLowerCase().includes(search.toLowerCase()) ||
            t.event.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || t.status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="p-6 sm:p-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <p className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em]">
                        {tickets.length} Total_Tickets
                    </p>
                </div>
                <button className="flex items-center gap-2 border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950 hover:border-zinc-950 px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors">
                    <Download className="w-3 h-3" />
                    Export CSV
                </button>
            </div>

            {/* Summary Chips */}
            <div className="flex flex-wrap gap-3">
                {[
                    { label: "Confirmed", count: 2, color: "text-emerald-600 border-emerald-200 bg-emerald-50" },
                    { label: "Used", count: 2, color: "text-zinc-500 border-zinc-200 bg-zinc-50" },
                    { label: "Refunded", count: 1, color: "text-red-500 border-red-100 bg-red-50" },
                    { label: "Pending", count: 1, color: "text-zinc-400 border-zinc-100 bg-white" },
                ].map((chip) => (
                    <div key={chip.label} className={`flex items-center gap-2 px-3 py-1.5 border text-[9px] font-mono font-bold uppercase tracking-widest ${chip.color}`}>
                        <span>{chip.label}</span>
                        <span className="opacity-60">{chip.count}</span>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 border border-zinc-200 bg-white px-3 py-2.5 w-full sm:w-64">
                    <Search className="w-3 h-3 text-zinc-300 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="text-[10px] font-mono bg-transparent outline-none text-zinc-600 placeholder-zinc-300 w-full uppercase tracking-widest"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {["all", "confirmed", "used", "refunded", "pending"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-2 text-[8px] font-mono font-bold uppercase tracking-widest border transition-colors ${
                                filter === f
                                    ? "bg-zinc-950 text-white border-zinc-950"
                                    : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-zinc-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50">
                                {["Ticket ID", "Event", "User", "Seat", "Price", "Purchased", "Status", ""].map((h) => (
                                    <th key={h} className="text-left px-6 py-3 text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((t) => {
                                const cfg = statusConfig[t.status];
                                const StatusIcon = cfg.icon;
                                return (
                                    <tr key={t.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors group">
                                        <td className="px-6 py-4 text-[10px] font-mono font-bold text-zinc-950">{t.id}</td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-zinc-700 uppercase tracking-tight max-w-[180px]">
                                            <p className="truncate">{t.event}</p>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-mono text-zinc-500">{t.user}</td>
                                        <td className="px-6 py-4 text-[10px] font-mono font-bold text-zinc-950">{t.seat}</td>
                                        <td className="px-6 py-4 text-[10px] font-mono font-bold text-zinc-950 tabular-nums">{t.price}</td>
                                        <td className="px-6 py-4 text-[9px] font-mono text-zinc-400 whitespace-nowrap">{t.purchased}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest border ${cfg.color}`}>
                                                <StatusIcon className="w-2.5 h-2.5" />
                                                {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {t.status === "confirmed" && (
                                                    <button className="flex items-center gap-1 text-[8px] font-mono font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors">
                                                        <RefreshCcw className="w-3 h-3" />
                                                        Refund
                                                    </button>
                                                )}
                                                <button className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-zinc-950 transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                        Showing {filtered.length} of {tickets.length} tickets
                    </span>
                    <div className="flex gap-1">
                        {[1, 2, 3].map((p) => (
                            <button key={p} className={`w-7 h-7 text-[10px] font-mono font-bold border transition-colors ${
                                p === 1 ? "bg-zinc-950 text-white border-zinc-950" : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400"
                            }`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}