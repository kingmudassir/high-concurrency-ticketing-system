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
        // 2. Database Query with Include - Now includes ticketTiers
        const events = await prisma.event.findMany({
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
                    orderBy: { price: 'asc' }, // Sort by price ascending
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
                startDate: 'asc' // Sort by upcoming events
            }
        });

        // 3. Data Transformation - Updated for new schema
        const formattedEvents = events.map(event => ({
            id: event.id,
            name: event.title,
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
            // NEW: Include ticket tiers instead of single price
            ticketTiers: event.ticketTiers,
            // For backward compatibility - calculate min price from tiers
            price: event.ticketTiers.length > 0 
                ? Math.min(...event.ticketTiers.map(t => t.price))
                : 0,
            tickets: event.tickets, // All individual ticket details
        }));

        return { success: true, data: formattedEvents };

    } catch (error) {
        console.error("FETCH_EVENTS_ERROR:", error);
        return { success: false, error: "FAILED TO FETCH EVENT DATA" };
    }
}