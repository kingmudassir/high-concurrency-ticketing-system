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

    // Debug: Log the actual data from the server
    console.log('🔍 EVENT DATA FROM SERVER:', {
        id: event.id,
        title: event.title,
        ticketsSold: event.ticketsSold,
        totalTickets: event.totalTickets,
    });

    // Helper function to format date
    function formatEventDate(date: Date | string): string {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Calculate derived values
    const ticketsSold = event.ticketsSold || 0;
    const totalCapacity = event.totalTickets || 0;
    const demand = totalCapacity > 0 ? Math.round((ticketsSold / totalCapacity) * 100) : 0;
    const isHot = totalCapacity > 0 && (ticketsSold / totalCapacity) >= 0.8;
    const isSoldOut = ticketsSold >= totalCapacity && totalCapacity > 0;

    // Transform the real event data to match what EventDetailClient expects
    const transformedEvent = {
        id: event.id,
        title: event.title,
        artist: event.title,
        description: event.description || '',
        image: event.imageUrl || '/placeholder-event.jpg',
        imageUrl: event.imageUrl || undefined, // Convert null to undefined
        category: event.category,
        tags: event.tags || [],
        venue: event.location,
        location: event.location,
        city: event.city || 'TBD',
        date: event.startDate,
        dateLabel: formatEventDate(event.startDate),
        price: Math.min(...(event.ticketTiers?.map(t => t.price) || [0])),
        priceRange: event.ticketTiers?.map(t => t.price) || [],
        ticketsSold: ticketsSold,
        soldCount: ticketsSold,
        totalCapacity: totalCapacity,
        capacity: totalCapacity,
        demand: demand,
        isHot: isHot,
        isSoldOut: isSoldOut,
        ticketTiers: event.ticketTiers || [],
        lineupActs: event.lineupActs || [],
        instructions: event.instructions || [],
        gstPercent: event.gstPercent || 0,
        serviceFeePercent: event.serviceFeePercent || 0,
        startDate: event.startDate,
        endDate: event.endDate,
        doorsOpen: event.doorsOpen,
        address: event.address,
        transport: event.transport,
        parking: event.parking,
        venueNotes: event.venueNotes,
    };

    // Debug: Log the transformed event
    console.log('🔄 TRANSFORMED EVENT:', {
        ticketsSold: transformedEvent.ticketsSold,
        totalCapacity: transformedEvent.totalCapacity,
        isSoldOut: transformedEvent.isSoldOut,
        demand: transformedEvent.demand,
    });

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

// Helper function to fetch related events (only active/upcoming)
async function fetchRelatedEvents(category: string, currentEventId: string) {
    const prisma = getPrisma();
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const events = await prisma.event.findMany({
        where: {
            category: category,
            id: { not: currentEventId },
            status: "PUBLISHED",
            OR: [
                { startDate: { gt: now } },
                { 
                    AND: [
                        { startDate: { lte: now } },
                        { endDate: { gt: now } }
                    ]
                },
                {
                    endDate: null,
                    startDate: { gte: todayStart }
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