"use client";

import { motion } from 'framer-motion';
import { Check, Download, Mail, ArrowRight, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { ContactInfo, TicketItem } from './CheckoutContainer';

interface Props {
    contactInfo: ContactInfo;
    tickets: TicketItem[];
    total: number;
}

function fmt(n: number) {
    return `₨ ${n.toLocaleString()}`;
}

// Generate a fake booking ref
function generateRef() {
    return 'RSH-' + Math.random().toString(36).toUpperCase().slice(2, 8);
}

export default function CheckoutSuccess({ contactInfo, tickets, total }: Props) {
    const ref = generateRef();
    const firstTicket = tickets[0];

    return (
        <div className="max-w-2xl mx-auto px-6 py-16">
            {/* Success icon */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-16 h-16 bg-emerald-500 flex items-center justify-center mb-8"
            >
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 mb-2">
                    Booking Confirmed
                </p>
                <h1 className="text-3xl font-black tracking-tight text-zinc-950 mb-3">
                    You're all set!
                </h1>
                <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                    Your tickets have been confirmed and sent to{' '}
                    <span className="font-bold text-zinc-950">{contactInfo.email || 'your email'}</span>.
                    Check your inbox (and spam) for the confirmation.
                </p>

                {/* Booking reference card */}
                <div className="border border-zinc-200 mb-8">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Booking Reference</p>
                        <span className="text-base font-black font-mono text-zinc-950 tracking-widest">{ref}</span>
                    </div>

                    {/* Event details */}
                    {firstTicket && (
                        <div className="flex gap-4 p-5">
                            <div className="w-20 h-20 shrink-0 overflow-hidden bg-zinc-100">
                                <img
                                    src={firstTicket.image || '/placeholder-event.jpg'}
                                    alt={firstTicket.eventTitle}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder-event.jpg';
                                    }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-zinc-950 leading-tight">{firstTicket.eventTitle}</p>
                                <div className="flex items-center gap-1.5 mt-2 text-zinc-400">
                                    <Calendar className="w-3 h-3 shrink-0" />
                                    <span className="text-[10px] font-medium">{firstTicket.eventDate}</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1 text-zinc-400">
                                    <MapPin className="w-3 h-3 shrink-0" />
                                    <span className="text-[10px] font-medium">{firstTicket.venue}, {firstTicket.city}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ticket list */}
                    <div className="border-t border-zinc-100 divide-y divide-zinc-100">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between px-5 py-3">
                                <div>
                                    <p className="text-xs font-black text-zinc-950">{ticket.tierName}</p>
                                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Qty: {ticket.quantity}</p>
                                </div>
                                <span className="text-sm font-black text-zinc-950">{fmt(ticket.price * ticket.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="px-5 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Paid</span>
                        <span className="text-lg font-black text-zinc-950">{fmt(total)}</span>
                    </div>
                </div>

                {/* What's next */}
                <div className="border border-zinc-200 mb-8">
                    <div className="px-5 py-4 border-b border-zinc-100">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">What Happens Next</p>
                    </div>
                    <div className="divide-y divide-zinc-100">
                        {[
                            {
                                icon: <Mail className="w-4 h-4 text-emerald-500" />,
                                title: 'Check your email',
                                desc: `Confirmation sent to ${contactInfo.email || 'your email'} with your QR-coded tickets.`,
                            },
                            {
                                icon: <Download className="w-4 h-4 text-emerald-500" />,
                                title: 'Save your tickets',
                                desc: 'Download or screenshot your tickets. You can also find them in your account.',
                            },
                            {
                                icon: <Calendar className="w-4 h-4 text-emerald-500" />,
                                title: 'Show up on the day',
                                desc: 'Bring your QR code — digital or printed. Doors open 90 minutes before showtime.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 px-5 py-4">
                                <div className="w-8 h-8 bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-zinc-950">{item.title}</p>
                                    <p className="text-[11px] text-zinc-500 font-medium mt-0.5 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/events"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-zinc-200 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                        Browse More Events <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" /> Download Tickets
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
