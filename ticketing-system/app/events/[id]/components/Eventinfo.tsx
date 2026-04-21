"use client";

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Tag, Share2, Heart, AlertCircle, Clock } from 'lucide-react';
import type { Event } from '../../Mockdata';

interface Props {
    event: Event;
}

// Fake lineup data keyed by event id — swap with real data from your backend
const LINEUP: Record<string, { name: string; role: string; time: string }[]> = {
    e1: [
        { name: 'The Neon Collective', role: 'Headliner', time: '10:00 PM' },
        { name: 'Drift Signal', role: 'Support', time: '8:30 PM' },
        { name: 'Coastal Ruins', role: 'Opener', time: '7:00 PM' },
    ],
    e3: [
        { name: 'Los Angeles Lakers', role: 'Home', time: '9:00 PM' },
        { name: 'Boston Celtics', role: 'Away', time: '9:00 PM' },
    ],
    e5: [
        { name: 'Skrillex', role: 'Headliner — Night 1', time: '11:30 PM' },
        { name: 'Fisher', role: 'Headliner — Night 2', time: '11:00 PM' },
        { name: 'Chris Lake', role: 'Co-headliner', time: '9:30 PM' },
        { name: 'Vintage Culture', role: 'Stage 2', time: '8:00 PM' },
    ],
};

const DEFAULT_LINEUP = (artist: string) => [
    { name: artist, role: 'Headliner', time: '9:00 PM' },
    { name: 'Special Guest TBA', role: 'Support', time: '7:30 PM' },
];

const VENUE_DETAILS: Record<string, { address: string; transport: string; parking: string }> = {
    'Madison Square Garden': {
        address: '4 Pennsylvania Plaza, New York, NY 10001',
        transport: 'A, C, E trains to 34th St–Penn Station',
        parking: 'MSG Parking Garage — $45/night',
    },
    "Crypto.com Arena": {
        address: '1111 S Figueroa St, Los Angeles, CA 90015',
        transport: 'Metro Blue/Expo Line to Staples Center',
        parking: 'On-site lot — $35–$60',
    },
};

const DEFAULT_VENUE = (venue: string, city: string) => ({
    address: `${venue}, ${city}`,
    transport: 'Check local transit options',
    parking: 'Limited parking available nearby',
});

export default function EventInfo({ event }: Props) {
    const lineup = LINEUP[event.id] ?? DEFAULT_LINEUP(event.artist);
    const venue = VENUE_DETAILS[event.venue] ?? DEFAULT_VENUE(event.venue, event.city);

    const capacity = event.totalCapacity;
    const sold = event.soldCount;
    const remaining = capacity - sold;
    const pct = Math.round((sold / capacity) * 100);

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-10"
        >
        {/* Actions row */}
        <div className="flex items-center gap-3 pt-1">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-zinc-200 text-zinc-500 hover:border-zinc-950 hover:text-zinc-950 text-[10px] font-black uppercase tracking-widest transition-all">
            <Heart className="w-3.5 h-3.5" /> Save
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-zinc-200 text-zinc-500 hover:border-zinc-950 hover:text-zinc-950 text-[10px] font-black uppercase tracking-widest transition-all">
            <Share2 className="w-3.5 h-3.5" /> Share
            </button>
        </div>

        {/* About */}
        <Section title="About This Event">
            <p className="text-zinc-600 leading-relaxed text-sm">
            Experience {event.title} live at {event.venue} in {event.city}. This is one of the most
            anticipated events of the year, with demand running at {event.demand}% — don't miss your
            chance to be there. {event.tags.join(', ')} fans will not want to miss this.
            </p>
            <p className="text-zinc-600 leading-relaxed text-sm mt-4">
            Doors open 90 minutes before showtime. All ages welcome unless otherwise stated. Please
            bring a valid photo ID. No re-entry after exit.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-5">
            {event.tags.map((tag) => (
                <span
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest"
                >
                <Tag className="w-2.5 h-2.5" />
                {tag}
                </span>
            ))}
            </div>
        </Section>

        {/* Capacity / live demand */}
        <Section title="Live Demand">
            <div className="space-y-3">
            <div className="flex justify-between items-end">
                <div>
                <p className="text-3xl font-black tracking-tighter text-zinc-950">
                    {sold.toLocaleString()}<span className="text-zinc-300 text-xl"> / {capacity.toLocaleString()}</span>
                </p>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">tickets sold</p>
                </div>
                <div className="text-right">
                <p className={`text-2xl font-black ${pct >= 95 ? 'text-red-500' : pct >= 80 ? 'text-orange-500' : 'text-emerald-600'}`}>
                    {remaining.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">remaining</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-zinc-100 w-full overflow-hidden">
                <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className={`h-full ${pct >= 95 ? 'bg-red-500' : pct >= 80 ? 'bg-orange-400' : 'bg-emerald-500'}`}
                />
            </div>

            {pct >= 90 && (
                <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <p className="text-xs font-bold">Nearly sold out — fewer than {Math.ceil(remaining / 100) * 100} tickets left.</p>
                </div>
            )}
            </div>
        </Section>

        {/* Lineup */}
        <Section title="Lineup">
            <div className="divide-y divide-zinc-100">
            {lineup.map((act, i) => (
                <div key={i} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-zinc-100 flex items-center justify-center text-xs font-black text-zinc-400">
                    {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                    <p className="text-sm font-black text-zinc-950">{act.name}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{act.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-bold">{act.time}</span>
                </div>
                </div>
            ))}
            </div>
        </Section>

        {/* Venue */}
        <Section title="Venue & Getting There">
            <div className="grid sm:grid-cols-3 gap-4">
            <VenueDetail icon={<MapPin className="w-4 h-4" />} label="Address" value={venue.address} />
            <VenueDetail icon={<Users className="w-4 h-4" />} label="Public Transport" value={venue.transport} />
            <VenueDetail icon={<Calendar className="w-4 h-4" />} label="Parking" value={venue.parking} />
            </div>
        </Section>

        {/* Know before you go */}
        <Section title="Know Before You Go">
            <ul className="space-y-3">
            {[
                'Valid photo ID required for entry',
                'No re-entry once you have exited the venue',
                'Bag policy: only bags smaller than 14" × 14" × 6" permitted',
                'Cameras with detachable lenses are not permitted',
                'Doors open 90 minutes before showtime',
            ].map((rule, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                {rule}
                </li>
            ))}
            </ul>
        </Section>
        </motion.div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
        <div className="flex items-center gap-3 mb-5">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">{title}</p>
            <div className="flex-1 h-px bg-zinc-100" />
        </div>
        {children}
        </div>
    );
}

function VenueDetail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="p-4 bg-zinc-50 border border-zinc-100">
        <div className="flex items-center gap-2 text-zinc-400 mb-2">
            {icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-xs font-semibold text-zinc-700 leading-relaxed">{value}</p>
        </div>
    );
}