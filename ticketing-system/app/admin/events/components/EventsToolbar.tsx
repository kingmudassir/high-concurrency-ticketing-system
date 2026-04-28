"use client";

import { Search, X } from "lucide-react";

interface EventsToolbarProps {
    search: string;
    filter: string;
    onSearch: (val: string) => void;
    onFilter: (val: string) => void;
}

const FILTERS = [
    { key: "all",      label: "All Events" },
    { key: "active",   label: "Live" },
    { key: "upcoming", label: "Upcoming" },
    { key: "sold_out", label: "Sold Out" },
    { key: "ended",    label: "Ended" },
];

export function EventsToolbar({ search, filter, onSearch, onFilter }: EventsToolbarProps) {
    return (
        <div className="px-6 sm:px-8 py-3 border-t border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex items-center gap-2 bg-white border border-zinc-200 focus-within:border-zinc-950 transition-colors w-full sm:w-72 px-3 py-2.5 shrink-0">
                <Search className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                <input
                    type="text"
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    className="text-[11px] font-mono bg-transparent outline-none text-zinc-700 placeholder-zinc-300 w-full"
                />
                {search && (
                    <button onClick={() => onSearch("")} className="text-zinc-300 hover:text-zinc-600 transition-colors">
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {FILTERS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => onFilter(key)}
                        className={`px-3.5 py-2 text-[9px] font-mono font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-150 border ${
                            filter === key
                                ? "bg-zinc-950 text-white border-zinc-950"
                                : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400 hover:text-zinc-700"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}