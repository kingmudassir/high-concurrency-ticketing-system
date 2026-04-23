"use server";

import { getPrisma } from "@/lib/db/prisma";

export async function fetchPublicEvents() {
    const prisma = getPrisma();

    try {
        const now = new Date();

        // Fetch only upcoming and ongoing events (not ended)
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
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        capacity: true,
                        sold: true,
                    }
                }
            },
            orderBy: {
                startDate: 'asc'
            }
        });

        // Data Transformation for public view (exclude sensitive data)
        const formattedEvents = events.map(event => ({
            id: event.id,
            title: event.title,
            subtitle: event.subtitle,
            description: event.description,
            imageUrl: event.imageUrl,
            category: event.category,
            tags: event.tags,
            location: event.location,
            city: event.city,
            startDate: event.startDate,
            endDate: event.endDate,
            totalCapacity: event.totalTickets,
            ticketsSold: event.ticketsSold,
            ticketTiers: event.ticketTiers.map(tier => ({
                id: tier.id,
                name: tier.name,
                price: tier.price,
                capacity: tier.capacity,
                sold: tier.sold,
            })),
        }));

        return { success: true, data: formattedEvents };

    } catch (error) {
        console.error("FETCH_PUBLIC_EVENTS_ERROR:", error);
        return { success: false, error: "FAILED TO FETCH EVENT DATA" };
    }
}