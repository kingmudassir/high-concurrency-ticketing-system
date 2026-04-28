"use client";

import { Plus, CalendarDays, TrendingUp, Users, XCircle } from "lucide-react";
import Link from "next/link";

interface EventsHeaderProps {
    totalEvents: number;
    stats: {
        total: number;
        active: number;
        upcoming: number;
        ended: number;
        sold_out: number;
    };
}

const STAT_ITEMS = [
    { key: "total",    label: "Total",    color: "text-zinc-900", dot: "bg-zinc-400" },
    { key: "active",   label: "Live Now", color: "text-emerald-600", dot: "bg-emerald-500" },
    { key: "upcoming", label: "Upcoming", color: "text-sky-600", dot: "bg-sky-400" },
    { key: "sold_out", label: "Sold Out", color: "text-amber-600", dot: "bg-amber-400" },
    { key: "ended",    label: "Ended",    color: "text-zinc-400", dot: "bg-zinc-300" },
] as const;

export function EventsHeader({ totalEvents, stats }: EventsHeaderProps) {
    return (
        <div className="px-6 sm:px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                {/* Left: Title + Stats */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-emerald-500" />
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tight text-zinc-950 leading-none">
                                Events
                            </h1>
                            <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-[0.25em] mt-0.5">
                                Administration Console
                            </p>
                        </div>
                    </div>

                    {/* Stat pills */}
                    <div className="flex items-center gap-1 flex-wrap">
                        {STAT_ITEMS.map(({ key, label, color, dot }) => (
                            <div
                                key={key}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-zinc-200 rounded-full"
                            >
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                                <span className={`text-[10px] font-black tabular-nums ${color}`}>
                                    {stats[key as keyof typeof stats]}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: CTA */}
                <Link
                    href="/admin/events/new"
                    className="group inline-flex items-center gap-2.5 bg-zinc-950 hover:bg-emerald-600 text-white px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-200 shrink-0 self-start sm:self-auto"
                >
                    <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
                    Create Event
                </Link>
            </div>
        </div>
    );
}