"use client";

import { AlertCircle } from "lucide-react";

export function EventsErrorState() {
    return (
        <div className="min-h-full bg-zinc-50 p-6 sm:p-8 flex items-center justify-center">
            <div className="bg-white border border-zinc-200 flex flex-col items-center gap-5 py-20 px-12">
                <div className="w-14 h-14 bg-red-50 border border-red-200 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-sm font-bold text-zinc-950">Failed to load events</p>
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                        DATABASE_CONNECTION_ERROR
                    </p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-2.5 bg-zinc-950 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors"
                >
                    Retry
                </button>
            </div>
        </div>
    );
}