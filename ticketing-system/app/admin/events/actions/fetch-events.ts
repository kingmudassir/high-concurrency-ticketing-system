"use server";

import { getPrisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

export async function fetchAllEventsWithTickets() {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    // 1. Optional: Security Check
    // If only admins should see the full ticket breakdown, keep this.
    if (!accessToken) {
        return { success: false, error: "UNAUTHORIZED" };
    }

    try {
        // 2. Database Query with Include
        const events = await prisma.event.findMany({
            include: {
                tickets: {
                    select: {
                        id: true,
                        status: true,
                        userId: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: {
                startDate: 'asc' // Sort by upcoming events
            }
        });

        // 3. Data Transformation (Optional)
        // We can map the data to make it easier for the frontend to consume
        const formattedEvents = events.map(event => ({
            id: event.id,
            name: event.title,
            description: event.description,
            location: event.location,
            price: event.price,
            totalCapacity: event.totalTickets,
            date: event.startDate,
            ticketsSold: event.tickets.length,
            tickets: event.tickets, // All individual ticket details
        }));

        return { success: true, data: formattedEvents };

    } catch (error) {
        console.error("FETCH_EVENTS_ERROR:", error);
        return { success: false, error: "FAILED TO FETCH EVENT DATA" };
    }
}