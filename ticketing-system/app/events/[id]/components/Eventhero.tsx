"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Flame, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Event } from '../../Mockdata';

interface Props {
  event: Event;
}

export default function EventHero({ event }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const demandColor =
    event.demand >= 95 ? 'text-red-400' :
    event.demand >= 80 ? 'text-orange-400' :
    'text-emerald-400';

  return (
    <div ref={ref} className="relative h-[70vh] min-h-130 overflow-hidden">
      {/* Parallax image */}
      <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110 origin-top">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/20" />

      {/* Top nav row */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-24 pb-4">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Events
        </Link>
      </div>

      {/* Content pinned to bottom */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10"
      >
        <div className="max-w-7xl mx-auto">
          {/* Category + Hot badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[9px] font-black uppercase tracking-[0.25em]">
              {event.category}
            </span>
            {event.isHot && !event.isSoldOut && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 border border-orange-400/30 text-orange-400 text-[9px] font-black uppercase tracking-[0.25em]">
                <Flame className="w-3 h-3" /> Hot
              </span>
            )}
            {event.isSoldOut && (
              <span className="px-3 py-1 bg-red-600/30 border border-red-500/40 text-red-400 text-[9px] font-black uppercase tracking-[0.25em]">
                Sold Out
              </span>
            )}
          </div>

          {/* Artist name */}
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-2">
            {event.artist}
          </p>

          {/* Title */}
          <h1 className="text-[clamp(32px,6vw,80px)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-white mb-6">
            {event.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold">{event.dateLabel}</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold">{event.venue}, {event.city}</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <span className={`text-sm font-black ${demandColor}`}>{event.demand}% demand</span>
              <div className="w-16 h-1 bg-white/20 overflow-hidden">
                <div
                  className={`h-full ${event.demand >= 95 ? 'bg-red-400' : event.demand >= 80 ? 'bg-orange-400' : 'bg-emerald-400'}`}
                  style={{ width: `${event.demand}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}