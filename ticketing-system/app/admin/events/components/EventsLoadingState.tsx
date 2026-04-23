"use client";

import { Loader2 } from "lucide-react";

export function EventsLoadingState() {
    return (
        <div className="min-h-full bg-zinc-50 p-6 sm:p-8">
            {/* Skeleton header */}
            <div className="mb-6 space-y-3">
                <div className="h-8 w-48 bg-zinc-200 animate-pulse" />
                <div className="h-4 w-80 bg-zinc-100 animate-pulse" />
            </div>

            {/* Skeleton table */}
            <div className="bg-white border border-zinc-200">
                <div className="bg-zinc-950 h-11" />
                {Array.from({ length: 7 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 px-6 py-5 border-b border-zinc-100"
                        style={{ opacity: 1 - i * 0.1 }}
                    >
                        <div className="w-6 h-3 bg-zinc-100 animate-pulse shrink-0" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-3.5 bg-zinc-200 animate-pulse w-3/4" />
                            <div className="h-2.5 bg-zinc-100 animate-pulse w-1/3" />
                        </div>
                        <div className="hidden sm:block w-32 space-y-1">
                            <div className="h-3 bg-zinc-100 animate-pulse" />
                            <div className="h-3 bg-zinc-100 animate-pulse w-2/3" />
                        </div>
                        <div className="hidden md:flex flex-col gap-1 w-40">
                            <div className="h-3 bg-zinc-100 animate-pulse" />
                            <div className="h-1.5 bg-zinc-100 animate-pulse" />
                        </div>
                        <div className="hidden lg:block w-24 h-3 bg-zinc-100 animate-pulse" />
                        <div className="w-20 h-6 bg-zinc-100 animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Loading label */}
            <div className="flex items-center justify-center gap-2 mt-8">
                <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-[0.25em]">
                    Loading events...
                </span>
            </div>
        </div>
    );
}