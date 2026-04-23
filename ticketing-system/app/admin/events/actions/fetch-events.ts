"use server";

import { getPrisma } from "@/lib/db/prisma";

export async function fetchAllEventsWithTickets() {
    const prisma = getPrisma();

    try {
        // Fetch ALL published events (including ended ones) for admin panel
        const events = await prisma.event.findMany({
            where: {
                status: "PUBLISHED",
                // No date filters - show all events including ended ones
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
                startDate: 'asc' // Sort by start date ascending
            }
        });

        // Data Transformation
        const formattedEvents = events.map(event => ({
            id: event.id,
            name: event.title,
            title: event.title,
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