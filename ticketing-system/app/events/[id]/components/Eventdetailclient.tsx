"use client";

import { useState } from 'react';
import EventHero from './Eventhero';
import EventInfo from './Eventinfo';
import TicketPanel from './Ticketpanel';
import RelatedEvents from './Relatedevents';

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

// Complete RealEvent interface matching what EventInfo expects
interface RealEvent {
    id: string;
    title: string;
    artist?: string;
    description: string | null;  // Keep as string | null
    image?: string;
    imageUrl?: string;
    category: string;
    tags: string[];
    venue: string;
    city: string;
    address?: string | null;
    transport?: string | null;
    parking?: string | null;
    venueNotes?: string | null;
    startDate?: Date | string;
    endDate?: Date | string | null;
    doorsOpen?: Date | string | null;
    dateLabel?: string;
    price: number;
    priceRange?: number[];
    totalCapacity: number;
    ticketsSold: number;
    soldCount?: number;
    capacity?: number;
    demand: number;
    isHot: boolean;
    isSoldOut: boolean;
    ticketTiers?: TicketTier[];
    lineupActs?: LineupAct[];
    instructions?: string[];
    gstPercent?: number;
    serviceFeePercent?: number;
}

interface RelatedEvent {
    id: string;
    title: string;
    image: string;
    category: string;
    venue: string;
    city: string;
    dateLabel: string;
    price: number;
}

interface Props {
    event: RealEvent;
    related: RelatedEvent[];
}

export default function EventDetailClient({ event, related }: Props) {
    const [selectedTier, setSelectedTier] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // Normalize event data to ensure all required fields exist
    const normalizedEvent: RealEvent = {
        ...event,
        tags: event.tags || [],
        totalCapacity: event.totalCapacity || event.capacity || 0,
        ticketsSold: event.ticketsSold || event.soldCount || 0,
        description: event.description ?? '', // Use nullish coalescing to keep null if null, otherwise empty string
        instructions: event.instructions || [],
        lineupActs: event.lineupActs || [],
        ticketTiers: event.ticketTiers || [],
        gstPercent: event.gstPercent || 0,
        serviceFeePercent: event.serviceFeePercent || 0,
        demand: event.demand || 0,
        isHot: event.isHot || false,
        isSoldOut: event.isSoldOut || false,
    };

    // Check if event has ended
    const isEventOver = () => {
        const now = new Date();
        const eventEndDate = normalizedEvent.endDate ? new Date(normalizedEvent.endDate) : new Date(normalizedEvent.startDate || now);
        return eventEndDate < now;
    };

    if (isEventOver()) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Event Has Ended</h1>
                    <p className="text-zinc-600">This event has already concluded.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* 1. Parallax Hero Section */}
            <EventHero event={normalizedEvent} />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* 2. LEFT: Rich Event Details (Lineup, Venue, About) */}
                    <div className="flex-1 min-w-0">
                        <EventInfo event={normalizedEvent} />
                    </div>

                    {/* 3. RIGHT: The "sticky" high-conversion Ticket Panel */}
                    <aside className="w-full lg:w-96 shrink-0">
                        <div className="lg:sticky lg:top-24">
                            <TicketPanel
                                event={normalizedEvent}
                                selectedTier={selectedTier}
                                quantity={quantity}
                                onTierChange={setSelectedTier}
                                onQuantityChange={setQuantity}
                            />
                        </div>
                    </aside>
                </div>
            </div>

            {/* 4. Related Content */}
            {related.length > 0 && (
                <div className="border-t border-zinc-100">
                    <div className="max-w-7xl mx-auto px-6 py-16">
                        <RelatedEvents events={related} />
                    </div>
                </div>
            )}
        </div>
    );
}