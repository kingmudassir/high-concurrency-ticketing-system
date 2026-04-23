"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock } from 'lucide-react';

interface TicketTier {
    id: string;
    name: string;
    price: number;
    capacity: number;
    sold: number;
}

interface RelatedEvent {
    id: string;
    title: string;
    image?: string;
    imageUrl?: string;
    category: string;
    venue: string;
    city: string;
    dateLabel: string;
    startDate?: Date | string;
    price?: number;
    ticketTiers?: TicketTier[];
}

interface Props {
    events: RelatedEvent[];
}

export default function RelatedEvents({ events }: Props) {
    // Helper to get image URL (works with both 'image' and 'imageUrl' fields)
    const getImageUrl = (event: RelatedEvent) => {
        return event.imageUrl || event.image || '/placeholder-event.jpg';
    };

    // Helper to get the lowest price from ticket tiers
    const getEventPrice = (event: RelatedEvent) => {
        if (event.price) return event.price;
        if (event.ticketTiers && event.ticketTiers.length > 0) {
            return Math.min(...event.ticketTiers.map(t => t.price));
        }
        return 0;
    };

    // Helper to format price in PKR
    const formatPrice = (price: number) => {
        return `₨ ${price.toLocaleString()}`;
    };

    if (events.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">More Like This</p>
                <div className="flex-1 h-px bg-zinc-100" />
                <Link
                    href="/events"
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-emerald-600 transition-colors"
                >
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {events.map((event, i) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                    >
                        <Link
                            href={`/events/${event.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block border border-zinc-200 overflow-hidden hover:border-zinc-400 hover:shadow-md hover:shadow-zinc-200/60 transition-all"
                        >
                            {/* Image */}
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={getImageUrl(event)}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder-event.jpg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-zinc-950/60 to-transparent" />
                                <span className="absolute top-2.5 left-2.5 px-2 py-1 bg-white text-[9px] font-black uppercase tracking-widest text-zinc-950">
                                    {event.category}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="text-sm font-black tracking-tight text-zinc-950 mb-3 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                                    {event.title}
                                </h3>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1.5 text-zinc-400">
                                        <Clock className="w-3 h-3 shrink-0" />
                                        <span className="text-[10px] font-medium">
                                            {event.dateLabel || (event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-zinc-400">
                                        <MapPin className="w-3 h-3 shrink-0" />
                                        <span className="text-[10px] font-medium truncate">{event.city || event.venue || 'Location TBD'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
                                    <span className="text-base font-black text-zinc-950">{formatPrice(getEventPrice(event))}</span>
                                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 group-hover:gap-2 transition-all">
                                        View <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}