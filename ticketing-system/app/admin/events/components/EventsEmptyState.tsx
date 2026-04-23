"use client";

import { CalendarDays, SearchX } from "lucide-react";

interface EventsEmptyStateProps {
    search: string;
    filter: string;
}

export function EventsEmptyState({ search, filter }: EventsEmptyStateProps) {
    const hasQuery = search || filter !== "all";

    return (
        <div className="bg-white border border-zinc-200 flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-16 h-16 bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                {hasQuery ? (
                    <SearchX className="w-7 h-7 text-zinc-400" />
                ) : (
                    <CalendarDays className="w-7 h-7 text-zinc-400" />
                )}
            </div>
            <div className="text-center space-y-1">
                <p className="text-sm font-bold text-zinc-950">
                    {hasQuery ? "No results found" : "No events yet"}
                </p>
                <p className="text-xs text-zinc-400 font-mono">
                    {hasQuery
                        ? `Nothing matched "${search || filter}" — try adjusting your filters`
                        : "Create your first event to get started"}
                </p>
            </div>
        </div>
    );
}