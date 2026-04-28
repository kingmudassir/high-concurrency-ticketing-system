"use client";

import { MapPin, Clock, Tag } from 'lucide-react';
import type { TicketItem } from './CheckoutContainer';

interface Props {
    tickets: TicketItem[];
    subtotal: number;
    gst: number;
    gstPercent: number;
    serviceFee: number;
    serviceFeePercent: number;
    total: number;
}

function fmt(n: number) {
    return `₨ ${n.toLocaleString()}`;
}

export default function OrderSummary({ tickets, subtotal, gst, gstPercent, serviceFee, serviceFeePercent, total }: Props) {
    return (
        <div className="border border-zinc-200 bg-white">
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-100">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Order Summary</p>
            </div>

            {/* Ticket list */}
            <div className="divide-y divide-zinc-100">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="flex gap-4 p-5">
                        {/* Image */}
                        <div className="w-16 h-16 shrink-0 overflow-hidden bg-zinc-100">
                            <img
                                src={ticket.image || '/placeholder-event.jpg'}
                                alt={ticket.eventTitle}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-event.jpg';
                                }}
                            />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-zinc-950 leading-tight truncate">{ticket.eventTitle}</p>
                            <div className="flex items-center gap-1.5 mt-1 text-zinc-400">
                                <Tag className="w-2.5 h-2.5 shrink-0" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{ticket.tierName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 text-zinc-400">
                                <Clock className="w-2.5 h-2.5 shrink-0" />
                                <span className="text-[10px] font-medium">{ticket.eventDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-zinc-400">
                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                <span className="text-[10px] font-medium truncate">{ticket.venue}, {ticket.city}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2.5">
                                <span className="text-[10px] font-bold text-zinc-400">Qty: {ticket.quantity}</span>
                                <span className="text-sm font-black text-zinc-950">{fmt(ticket.price * ticket.quantity)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fee breakdown */}
            <div className="px-5 py-4 border-t border-zinc-100 space-y-2.5">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 font-medium">Subtotal</span>
                    <span className="text-xs font-bold text-zinc-950">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 font-medium">GST ({gstPercent}%)</span>
                    <span className="text-xs font-bold text-zinc-950">{fmt(gst)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 font-medium">Service fee ({serviceFeePercent}%)</span>
                    <span className="text-xs font-bold text-zinc-950">{fmt(serviceFee)}</span>
                </div>
            </div>

            {/* Total */}
            <div className="px-5 py-4 border-t border-zinc-200 bg-zinc-50 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total</span>
                <span className="text-xl font-black tracking-tight text-zinc-950">{fmt(total)}</span>
            </div>

            {/* Security note */}
            <div className="px-5 py-3 border-t border-zinc-100">
                <p className="text-[10px] text-zinc-400 font-medium text-center">
                    🔒 256-bit SSL encrypted & secure
                </p>
            </div>
        </div>
    );
}
