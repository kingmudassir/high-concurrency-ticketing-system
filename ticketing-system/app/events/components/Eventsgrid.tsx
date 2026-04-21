"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Flame, MapPin, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { Event } from '../Mockdata';

interface GridProps {
    events: Event[];
    sort: string;
    onSortChange: (sort: string) => void;
}

export default function EventsGrid({ events, sort, onSortChange }: GridProps) {
    if (events.length === 0) {
        return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-zinc-100 flex items-center justify-center mb-6">
            <TrendingUp className="w-6 h-6 text-zinc-300" />
            </div>
            <p className="text-xl font-black uppercase tracking-tighter text-zinc-300">No events found</p>
            <p className="text-sm text-zinc-400 mt-2">Try adjusting your filters or search query</p>
        </div>
        );
    }

    return (
        <div>
        {/* Result count + inline sort */}
        <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-bold text-zinc-500">
            <span className="text-zinc-950">{events.length}</span> events
            </p>
            <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">Sort:</span>
            <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
                className="text-[11px] font-bold text-zinc-700 bg-white border border-zinc-200 px-3 py-2 outline-none hover:border-zinc-400 transition-colors cursor-pointer"
            >
                <option value="trending">Trending</option>
                <option value="date">Upcoming First</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="popular">Most Popular</option>
            </select>
            </div>
        </div>

        {/* Grid */}
        <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
            <AnimatePresence mode="popLayout">
            {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
            ))}
            </AnimatePresence>
        </motion.div>
        </div>
    );
    }

function EventCard({ event, index }: { event: Event; index: number }) {
    const demandPercent = event.demand;
    const demandColor =
        demandPercent >= 90 ? 'bg-red-500' :
        demandPercent >= 70 ? 'bg-orange-400' :
        'bg-emerald-500';

    return (
        <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
        >
        <Link
            href={`/events/${event.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white border border-zinc-200 overflow-hidden hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-200/60 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative overflow-hidden aspect-[16/9]">
            <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />

            {/* Category pill */}
            <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-white text-[9px] font-black uppercase tracking-[0.2em] text-zinc-950">
                {event.category}
                </span>
            </div>

            {/* Hot badge */}
            {event.isHot && !event.isSoldOut && (
                <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 px-2.5 py-1 bg-zinc-950/80 backdrop-blur-sm">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">Hot</span>
                </div>
                </div>
            )}

            {event.isSoldOut && (
                <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 bg-red-600 text-[9px] font-black uppercase tracking-widest text-white">
                    Sold Out
                </span>
                </div>
            )}

            {/* Date on image */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-white/70" />
                <span className="text-[10px] font-bold text-white/90">{event.dateLabel}</span>
            </div>
            </div>

            {/* Content */}
            <div className="p-4">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{event.artist}</p>
            <h3 className="text-base font-black tracking-tight text-zinc-950 leading-snug mb-3 group-hover:text-emerald-700 transition-colors">
                {event.title}
            </h3>

            <div className="flex items-center gap-1.5 text-zinc-500 mb-4">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="text-xs font-medium truncate">{event.venue}, {event.city}</span>
            </div>

            {/* Demand bar */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Demand</span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${
                    demandPercent >= 90 ? 'text-red-500' : demandPercent >= 70 ? 'text-orange-500' : 'text-emerald-600'
                }`}>{demandPercent}%</span>
                </div>
                <div className="h-1 bg-zinc-100 w-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${demandPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full ${demandColor}`}
                />
                </div>
            </div>

            {/* Footer: Price + CTA */}
            <div className="flex items-center justify-between">
                <div>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Starting at</p>
                <p className="text-lg font-black text-zinc-950">${event.price}</p>
                </div>

                <span
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                    event.isSoldOut
                    ? 'bg-zinc-100 text-zinc-400'
                    : 'bg-zinc-950 text-white group-hover:bg-emerald-600 group-hover:gap-2.5'
                }`}
                >
                {event.isSoldOut ? 'Unavailable' : 'Get Tickets'}
                {!event.isSoldOut && <ArrowRight className="w-3 h-3" />}
                </span>
            </div>
            </div>
        </Link>
        </motion.div>
    );
}