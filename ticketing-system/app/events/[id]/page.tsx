import { notFound } from 'next/navigation';
import EventDetailClient from './components/Eventdetailclient';
import { getPrisma } from '@/lib/db/prisma';
import { fetchPublicEventById } from './actions/fetch-event';

interface Props {
    params: Promise<{ id: string }>;
}

// Generate metadata dynamically from real event data
export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const result = await fetchPublicEventById(id);
    
    if (!result.success || !result.data) {
        return { title: 'Event Not Found — RushTicket' };
    }
    
    const event = result.data;
    return {
        title: `${event.title} — RushTicket`,
        description: event.description || `Get tickets for ${event.title} at ${event.location}.`,
    };
}

export default async function EventDetailPage({ params }: Props) {
    const { id } = await params;
    const result = await fetchPublicEventById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const event = result.data;

    // Helper function to format date
    function formatEventDate(date: Date | string): string {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Transform the real event data to match what EventDetailClient expects
    const transformedEvent = {
        id: event.id,
        title: event.title,
        artist: event.title, // Use title as artist name since schema doesn't have separate artist field
        description: event.description || '',
        image: event.imageUrl || '/placeholder-event.jpg',
        category: event.category,
        tags: event.tags || [], // Add tags
        venue: event.location,
        city: event.city || 'TBD',
        date: event.startDate,
        dateLabel: formatEventDate(event.startDate),
        price: Math.min(...(event.ticketTiers?.map(t => t.price) || [0])),
        priceRange: event.ticketTiers?.map(t => t.price) || [],
        soldCount: event.ticketsSold,
        capacity: event.totalTickets,
        totalCapacity: event.totalTickets, // Add totalCapacity
        ticketsSold: event.ticketsSold, // Add ticketsSold
        demand: event.totalTickets > 0 ? Math.round((event.ticketsSold / event.totalTickets) * 100) : 0,
        isHot: event.totalTickets > 0 && (event.ticketsSold / event.totalTickets) >= 0.8,
        isSoldOut: event.ticketsSold >= event.totalTickets,
        ticketTiers: event.ticketTiers,
        lineupActs: event.lineupActs,
        instructions: event.instructions,
        gstPercent: event.gstPercent,
        serviceFeePercent: event.serviceFeePercent,
        startDate: event.startDate,
        endDate: event.endDate,
        doorsOpen: event.doorsOpen,
        address: event.address,
        transport: event.transport,
        parking: event.parking,
        venueNotes: event.venueNotes,
    };

    // Fetch related events (same category, exclude current)
    const relatedEvents = await fetchRelatedEvents(event.category, event.id);
    const transformedRelated = relatedEvents.map((e: any) => ({
        id: e.id,
        title: e.title,
        image: e.imageUrl || '/placeholder-event.jpg',
        category: e.category,
        venue: e.location,
        city: e.city || 'TBD',
        dateLabel: formatEventDate(e.startDate),
        price: Math.min(...(e.ticketTiers?.map((t: any) => t.price) || [0])),
    }));

    return <EventDetailClient event={transformedEvent} related={transformedRelated} />;
}

// Helper function to fetch related events
// Helper function to fetch related events (only active/upcoming)
async function fetchRelatedEvents(category: string, currentEventId: string) {
    const prisma = getPrisma();
    const now = new Date();
    
    const events = await prisma.event.findMany({
        where: {
            category: category,
            id: { not: currentEventId },
            status: "PUBLISHED",
            // Only fetch non-expired events
            OR: [
                // Events that haven't started yet
                { startDate: { gt: now } },
                // Events that are currently ongoing (have endDate in the future)
                { 
                    AND: [
                        { startDate: { lte: now } },
                        { endDate: { gt: now } }
                    ]
                },
                // Events with no endDate that are today or in the future
                {
                    endDate: null,
                    startDate: { gte: new Date(now.setHours(0, 0, 0, 0)) }
                }
            ]
        },
        include: {
            ticketTiers: {
                orderBy: { price: 'asc' },
            },
        },
        take: 3,
        orderBy: {
            startDate: 'asc',
        },
    });
    
    return events;
}