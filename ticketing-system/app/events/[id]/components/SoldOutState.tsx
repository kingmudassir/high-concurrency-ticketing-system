"use client";

import { Lock } from "lucide-react";

export default function SoldOutState() {
    return (
        <div className="text-center py-6">
            <div className="w-14 h-14 bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-base font-black uppercase tracking-tighter text-zinc-950 mb-1">Sold Out</p>
            <p className="text-xs text-zinc-400">This event is fully sold out.</p>
            <button className="mt-5 w-full py-4 border border-zinc-200 text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors">
                Join Waitlist
            </button>
        </div>
    );
}
