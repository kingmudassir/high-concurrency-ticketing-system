"use client";

import { Flame } from "lucide-react";

interface Props {
    title: string;
    isHot: boolean;
    isSoldOut: boolean;
    hasPendingReservation: boolean;
}

export default function TicketPanelHeader({ title, isHot, isSoldOut, hasPendingReservation }: Props) {
    return (
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400">Tickets</p>
                <p className="text-sm font-black text-zinc-950 tracking-tight mt-0.5 line-clamp-1">{title}</p>
            </div>
            {isHot && !isSoldOut && !hasPendingReservation && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">High demand</span>
                </div>
            )}
        </div>
    );
}
