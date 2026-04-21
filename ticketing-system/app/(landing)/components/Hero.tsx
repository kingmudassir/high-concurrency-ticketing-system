"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ArrowRight, Zap, Users, TrendingUp } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';

const TICKER = [
    "MIDNIGHT CITY REVIVAL — 4.2k tickets/min",
    "SUPERBOWL LIX — Queue exceeds 1M",
    "THE CHRONICLES TOUR — Sold out in 14s",
    "METRO ARENA — Pre-queue opening now",
];

const STATS = [
    { label: "Active queues", value: "142", icon: <Zap className="w-3.5 h-3.5" /> },
    { label: "In line now", value: "12.5k", icon: <Users className="w-3.5 h-3.5" /> },
    { label: "Demand index", value: "98.4%", icon: <TrendingUp className="w-3.5 h-3.5" /> },
];

export default function Hero() {
    const router = useRouter();
    const [tickerIndex, setTickerIndex] = useState(0);
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // The image starts covered by the white overlay, and as you scroll
    // the overlay fades away revealing the concert image underneath
    const overlayOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const imageScale = useTransform(scrollY, [0, 600], [1.05, 1]);
    const contentY = useTransform(scrollY, [0, 400], [0, -80]);
    const contentOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const smoothImageScale = useSpring(imageScale, { stiffness: 60, damping: 20 });

    useEffect(() => {
        const id = setInterval(() => {
        setTickerIndex((i) => (i + 1) % TICKER.length);
        }, 3200);
        return () => clearInterval(id);
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (location) params.set('location', location);
        router.push(`/events?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div ref={containerRef} className="relative" style={{ height: '200vh' }}>
        
        {/* STICKY SCENE — sticks while scrolling through the 200vh container */}
        <div className="sticky top-0 h-screen overflow-hidden">

            {/* BACKGROUND CONCERT IMAGE — always present, revealed by scroll */}
            <motion.div
            style={{ scale: smoothImageScale }}
            className="absolute inset-0 origin-center"
            >
            <img
                src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=85&w=2400"
                alt="Live concert crowd"
                className="w-full h-full object-cover"
            />
            {/* Permanent dark tint so image doesn't look washed out when fully revealed */}
            <div className="absolute inset-0 bg-zinc-950/50" />
            {/* Gradient for readability */}
            <div className="absolute inset-0 bg-linear-to-b from-zinc-950/30 via-transparent to-zinc-950/60" />
            </motion.div>

            {/* WHITE OVERLAY — fades out on scroll, revealing the image */}
            <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-white pointer-events-none z-10"
            />

            {/* GRAIN TEXTURE */}
            <div
            className="absolute inset-0 z-20 pointer-events-none opacity-[0.025]"
            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/noise.png')" }}
            />

            {/* MAIN CONTENT */}
            <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="relative z-30 h-full flex flex-col justify-center items-center px-6 pt-20"
            >
            {/* Live ticker pill */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-10 flex items-center gap-2.5 px-4 py-2 bg-zinc-950/5 border border-zinc-200 backdrop-blur-md"
            >
                <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500">Live</span>
                <div className="w-px h-3 bg-zinc-300" />
                <div className="overflow-hidden h-4 w-64 md:w-80">
                <AnimatedTicker current={tickerIndex} messages={TICKER} />
                </div>
            </motion.div>

            {/* Headline */}
            <div className="text-center mb-10 max-w-5xl mx-auto">
                <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(52px,11vw,130px)] font-black uppercase leading-[0.85] tracking-[-0.04em] text-zinc-950"
                >
                Get your
                <br />
                <span className="relative inline-block">
                    <span className="text-emerald-500 italic">seat.</span>
                    <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                    className="absolute bottom-1 left-0 right-0 h-1.25 md:h-1.75 bg-emerald-500 origin-left"
                    />
                </span>
                </motion.h1>
            </div>

            {/* Search bar */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="w-full max-w-3xl"
            >
                <div className="flex flex-col sm:flex-row gap-0 border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/60">
                {/* Event input */}
                <div className="flex items-center gap-3 flex-1 px-5 py-4 border-b sm:border-b-0 sm:border-r border-zinc-200">
                    <Search className="w-4 h-4 text-emerald-500 shrink-0" />
                    <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Artist, team, or event..."
                    className="bg-transparent outline-none w-full text-sm font-semibold text-zinc-900 placeholder:text-zinc-400"
                    />
                </div>
                {/* Location input */}
                <div className="flex items-center gap-3 flex-1 px-5 py-4 border-b sm:border-b-0 sm:border-r border-zinc-200">
                    <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                    <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="City or venue..."
                    className="bg-transparent outline-none w-full text-sm font-semibold text-zinc-900 placeholder:text-zinc-400"
                    />
                </div>
                {/* CTA Button */}
                <button
                    onClick={handleSearch}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 active:scale-[0.98] transition-all whitespace-nowrap"
                >
                    Search <ArrowRight className="w-3.5 h-3.5" />
                </button>
                </div>

                {/* Live stats row */}
                <div className="flex items-center justify-center gap-6 mt-5">
                {STATS.map((stat, i) => (
                    <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-center gap-1.5"
                    >
                    <span className="text-emerald-600">{stat.icon}</span>
                    <span className="text-sm font-black text-zinc-900">{stat.value}</span>
                    <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">{stat.label}</span>
                    {i < STATS.length - 1 && <span className="ml-5 w-px h-4 bg-zinc-200" />}
                    </motion.div>
                ))}
                </div>
            </motion.div>
            </motion.div>

            {/* SCROLL HINT — fades out on scroll */}
            <motion.div
            style={{ opacity: contentOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
            >
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-[0.3em]">Scroll</span>
            <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-px h-8 bg-linear-to-b from-zinc-400 to-transparent"
            />
            </motion.div>

            {/* REVEALED CONTENT — visible only after scrolling (rendered below white overlay) */}
            <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center pointer-events-none">
            <motion.div
                style={{ opacity: useTransform(scrollY, [150, 350], [0, 1]) }}
                className="text-center"
            >
                <p className="text-white/70 text-sm font-medium tracking-wide">
                Powered by high-concurrency infrastructure — get your seat when it matters.
                </p>
            </motion.div>
            </div>

        </div>
        </div>
    );
}

// Animated ticker sub-component
function AnimatedTicker({ current, messages }: { current: number; messages: string[] }) {
    return (
        <motion.div
        key={current}
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-[10px] font-black text-zinc-900 uppercase tracking-wider whitespace-nowrap"
        >
        {messages[current]}
        </motion.div>
    );
}