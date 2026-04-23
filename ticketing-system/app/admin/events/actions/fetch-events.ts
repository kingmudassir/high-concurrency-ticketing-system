"use server";

import { getPrisma } from "@/lib/db/prisma";

export async function fetchAllEventsWithTickets() {
    const prisma = getPrisma();

    try {
        const now = new Date();

        // Database Query with Include - Only fetch non-expired events
        const events = await prisma.event.findMany({
            where: {
                status: "PUBLISHED",
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
                    // Events with no endDate that haven't passed (single day events not yet started)
                    {
                        endDate: null,
                        startDate: { gt: now }
                    }
                ]
            },
            include: {
                tickets: {
                    select: {
                        id: true,
                        status: true,
                        userId: true,
                        createdAt: true,
                        pricePaid: true,
                        tierId: true,
                    }
                },
                ticketTiers: {
                    orderBy: { price: 'asc' },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        capacity: true,
                        sold: true,
                        sortOrder: true,
                    }
                }
            },
            orderBy: {
                startDate: 'asc'
            }
        });

        // Data Transformation
        const formattedEvents = events.map(event => ({
            id: event.id,
            name: event.title,
            title: event.title, // Add title for consistency
            subtitle: event.subtitle,
            description: event.description,
            imageUrl: event.imageUrl,
            category: event.category,
            tags: event.tags,
            location: event.location,
            address: event.address,
            city: event.city,
            transport: event.transport,
            parking: event.parking,
            venueNotes: event.venueNotes,
            startDate: event.startDate,
            endDate: event.endDate,
            doorsOpen: event.doorsOpen,
            gstPercent: event.gstPercent,
            serviceFeePercent: event.serviceFeePercent,
            instructions: event.instructions,
            totalCapacity: event.totalTickets,
            ticketsSold: event.ticketsSold,
            status: event.status,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            ticketTiers: event.ticketTiers,
            price: event.ticketTiers.length > 0 
                ? Math.min(...event.ticketTiers.map(t => t.price))
                : 0,
            tickets: event.tickets,
        }));

        return { success: true, data: formattedEvents };

    } catch (error) {
        console.error("FETCH_EVENTS_ERROR:", error);
        return { success: false, error: "FAILED TO FETCH EVENT DATA" };
    }
}