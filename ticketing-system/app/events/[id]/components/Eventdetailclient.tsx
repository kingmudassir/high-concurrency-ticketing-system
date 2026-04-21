"use client";

import { useState } from 'react';
import type { Event } from '../../Mockdata';
import EventHero from './Eventhero'; // Point this to Eventhero.tsx
import EventInfo from './Eventinfo'; // Point this to Eventinfo.tsx
import TicketPanel from './Ticketpanel';
import RelatedEvents from './Relatedevents';

interface Props {
    event: Event;
    related: Event[];
}

export default function EventDetailClient({ event, related }: Props) {
    const [selectedTier, setSelectedTier] = useState(0);
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="min-h-screen bg-white">
        {/* 1. Parallax Hero Section */}
        <EventHero event={event} />

        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
            {/* 2. LEFT: Rich Event Details (Lineup, Venue, About) */}
            <div className="flex-1 min-w-0">
                <EventInfo event={event} />
            </div>

            {/* 3. RIGHT: The "sticky" high-conversion Ticket Panel */}
            <aside className="w-full lg:w-95 shrink-0">
                <div className="lg:sticky lg:top-24">
                <TicketPanel
                    event={event}
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