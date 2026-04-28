"use client";

import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Tag, Share2, Heart, AlertCircle, Clock, Bookmark, Check } from 'lucide-react';
import { useSaveEvent } from "@/app/hooks/saved-events/useSaveEvent";
import { useAuth } from "@/app/hooks/auth/useAuth";
import { checkIfSavedAction } from "../actions/check-if-saved";

interface TicketTier {
    id: string;
    name: string;
    description: string | null;
    price: number;
    capacity: number;
    sold: number;
}

interface LineupAct {
    id: string;
    name: string;
    role: string;
    startTime: string | null;
}

interface RealEvent {
    id: string;
    title: string;
    artist?: string;
    description: string | null;
    tags: string[];
    venue: string;
    city: string;
    address?: string | null;
    transport?: string | null;
    parking?: string | null;
    venueNotes?: string | null;
    totalCapacity: number;
    ticketsSold: number;
    demand?: number;
    ticketTiers?: TicketTier[];
    lineupActs?: LineupAct[];
    instructions?: string[];
    startDate?: Date | string;
    doorsOpen?: Date | string | null;
}

interface Props {
    event: RealEvent;
    isSaved?: boolean;
    onSaveStatusChange?: () => void;
}

export default function EventInfo({ event, isSaved: initialIsSaved = false, onSaveStatusChange }: Props) {
    const { isAuthenticated } = useAuth();
    const { saveEvent, unsaveEvent, isSaving, isUnsaving } = useSaveEvent();
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [showAuthTooltip, setShowAuthTooltip] = useState(false);

    // Debug: Log the event data to see what's coming in
    useEffect(() => {
        console.log('📊 EventInfo received event:', {
            id: event.id,
            title: event.title,
            ticketsSold: event.ticketsSold,
            totalCapacity: event.totalCapacity,
        });
    }, [event]);

    // Check if event is saved when component mounts
    useEffect(() => {
        const checkIfSaved = async () => {
            if (!isAuthenticated) return;
            
            try {
                const result = await checkIfSavedAction(event.id);
                if (result.success) {
                    setIsSaved(result.isSaved);
                }
            } catch (error) {
                console.error("Failed to check saved status:", error);
            }
        };
        
        checkIfSaved();
    }, [event.id, isAuthenticated]);

    const handleSaveClick = async () => {
        if (!isAuthenticated) {
            setShowAuthTooltip(true);
            setTimeout(() => setShowAuthTooltip(false), 3000);
            return;
        }

        if (isSaved) {
            const success = await unsaveEvent(event.id);
            if (success) {
                setIsSaved(false);
                onSaveStatusChange?.();
            }
        } else {
            const success = await saveEvent(event.id);
            if (success) {
                setIsSaved(true);
                onSaveStatusChange?.();
            }
        }
    };

    // Use real lineup data from the event
    const lineup = event.lineupActs && event.lineupActs.length > 0
        ? event.lineupActs.map(act => ({
            name: act.name,
            role: act.role,
            time: act.startTime || 'TBA',
        }))
        : [];

    // Use real venue details from the event
    const venue = {
        address: event.address || `${event.venue}, ${event.city}`,
        transport: event.transport || 'Check local transit options',
        parking: event.parking || 'Limited parking available nearby',
        notes: event.venueNotes,
    };

    // Use real instructions from the event, or fallback to defaults
    const instructions = event.instructions && event.instructions.length > 0
        ? event.instructions
        : [
            'Valid photo ID required for entry',
            'No re-entry once you have exited the venue',
            'Bag policy: only bags smaller than 14" × 14" × 6" permitted',
            'Cameras with detachable lenses are not permitted',
            `Doors open ${event.doorsOpen ? new Date(event.doorsOpen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '90 minutes'} before showtime`,
        ];

    // Ensure we have valid numbers for calculations
    const capacity = event.totalCapacity || 0;
    const sold = event.ticketsSold || 0;
    const remaining = Math.max(0, capacity - sold);
    const pct = capacity > 0 ? Math.min(100, Math.round((sold / capacity) * 100)) : 0;

    // Helper to format date
    const formatDate = (date: Date | string | undefined) => {
        if (!date) return 'Date TBD';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
        >
            {/* Actions row */}
            <div className="flex items-center gap-3 pt-1 relative">
                <div className="relative">
                    <button
                        onClick={handleSaveClick}
                        disabled={isSaving || isUnsaving}
                        className={`flex items-center gap-2 px-4 py-2.5 border transition-all text-[10px] font-black uppercase tracking-widest ${
                            isSaved
                                ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600'
                                : 'border-zinc-200 text-zinc-500 hover:border-zinc-950 hover:text-zinc-950'
                        }`}
                    >
                        {isSaving || isUnsaving ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isSaved ? (
                            <Check className="w-3.5 h-3.5" />
                        ) : (
                            <Heart className="w-3.5 h-3.5" />
                        )}
                        {isSaved ? "Saved" : "Save"}
                    </button>
                    
                    {/* Auth tooltip */}
                    {showAuthTooltip && (
                        <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-zinc-950 text-white text-[10px] font-mono rounded shadow-lg whitespace-nowrap z-10">
                            Login to save events
                            <div className="absolute -top-1 left-4 w-2 h-2 bg-zinc-950 rotate-45" />
                        </div>
                    )}
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2.5 border border-zinc-200 text-zinc-500 hover:border-zinc-950 hover:text-zinc-950 text-[10px] font-black uppercase tracking-widest transition-all">
                    <Share2 className="w-3.5 h-3.5" /> Share
                </button>
            </div>

            {/* Event Date */}
            <Section title="Event Date">
                <div className="flex items-center gap-3 text-zinc-600">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-semibold">{formatDate(event.startDate)}</span>
                </div>
            </Section>

            {/* About */}
            <Section title="About This Event">
                <p className="text-zinc-600 leading-relaxed text-sm">
                    {event.description || `Experience ${event.title} live at ${event.venue} in ${event.city}. Don't miss your chance to be there.`}
                </p>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
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
                )}
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
                            <p className="text-xs font-bold">Nearly sold out — fewer than {Math.max(1, Math.ceil(remaining / 100) * 100)} tickets left.</p>
                        </div>
                    )}
                </div>
            </Section>

            {/* Lineup */}
            {lineup.length > 0 && (
                <Section title="Lineup">
                    <div className="divide-y divide-zinc-100">
                        {lineup.map((act, i) => (
                            <div key={act.name} className="flex items-center justify-between py-4">
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
            )}

            {/* Venue */}
            <Section title="Venue & Getting There">
                <div className="grid sm:grid-cols-3 gap-4">
                    <VenueDetail icon={<MapPin className="w-4 h-4" />} label="Address" value={venue.address} />
                    <VenueDetail icon={<Users className="w-4 h-4" />} label="Public Transport" value={venue.transport} />
                    <VenueDetail icon={<Calendar className="w-4 h-4" />} label="Parking" value={venue.parking} />
                </div>
                {venue.notes && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
                        {venue.notes}
                    </div>
                )}
            </Section>

            {/* Know before you go */}
            <Section title="Know Before You Go">
                <ul className="space-y-3">
                    {instructions.map((rule, i) => (
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