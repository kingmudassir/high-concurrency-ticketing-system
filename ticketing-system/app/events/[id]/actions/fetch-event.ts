"use server";

import { getPrisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

export type TicketTier = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    capacity: number;
    sold: number;
    sortOrder: number;
};

export type LineupAct = {
    id: string;
    name: string;
    role: "HEADLINER" | "SUPPORT" | "OPENER" | "SPECIAL_GUEST";
    startTime: string | null;
    sortOrder: number;
};

export type EventTicket = {
    id: string;
    status: string;
    pricePaid: number;
    gstPaid: number;
    serviceFeePaid: number;
    createdAt: Date;
    expiresAt: Date;
    tierId: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
    tier?: {
        id: string;
        name: string;
        price: number;
    };
};

export type EventDetail = {
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    imageUrl: string | null;
    category: string;
    tags: string[];
    location: string;
    address: string | null;
    city: string | null;
    transport: string | null;
    parking: string | null;
    venueNotes: string | null;
    startDate: Date;
    endDate: Date | null;
    doorsOpen: Date | null;
    gstPercent: number;
    serviceFeePercent: number;
    instructions: string[];
    totalTickets: number;
    ticketsSold: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    // Relations
    ticketTiers: TicketTier[];
    lineupActs: LineupAct[];
    tickets: EventTicket[];
};

type FetchEventResult =
    | { success: true; data: EventDetail }
    | { success: false; error: string };

// Public version - no auth required
export async function fetchPublicEventById(eventId: string): Promise<FetchEventResult> {
    const prisma = getPrisma();

    try {
        const event = await prisma.event.findUnique({
            where: { 
                id: eventId,
                status: "PUBLISHED" // Only show published events
            },
            include: {
                ticketTiers: {
                    orderBy: { sortOrder: 'asc' },
                },
                lineupActs: {
                    orderBy: { sortOrder: 'asc' },
                },
                // Don't include tickets for public view for security
            },
        });

        if (!event) {
            return { success: false, error: "EVENT_NOT_FOUND" };
        }

        // Transform to match the EventDetail type (without tickets)
        const formattedEvent: EventDetail = {
            id: event.id,
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
            totalTickets: event.totalTickets,
            ticketsSold: event.ticketsSold,
            status: event.status,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            ticketTiers: event.ticketTiers,
            lineupActs: event.lineupActs,
            tickets: [], // Public view doesn't get ticket details
        };

        return { success: true, data: formattedEvent };
    } catch (error) {
        console.error("[fetchPublicEventById] Error:", error);
        return { success: false, error: "INTERNAL_SERVER_ERROR" };
    }
}

// Admin version - requires auth
export async function fetchEventById(eventId: string): Promise<FetchEventResult> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return { success: false, error: "UNAUTHORIZED: SESSION EXPIRED" };
    }

    try {
        const payload = decodeJwt(accessToken) as { role?: string };
        if (payload.role !== "ADMIN") {
            return { success: false, error: "FORBIDDEN: INSUFFICIENT PERMISSIONS" };
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                ticketTiers: {
                    orderBy: { sortOrder: 'asc' },
                },
                lineupActs: {
                    orderBy: { sortOrder: 'asc' },
                },
                tickets: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                            },
                        },
                        tier: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!event) {
            return { success: false, error: "EVENT_NOT_FOUND" };
        }

        // Transform to match the EventDetail type
        const formattedEvent: EventDetail = {
            id: event.id,
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
            totalTickets: event.totalTickets,
            ticketsSold: event.ticketsSold,
            status: event.status,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            ticketTiers: event.ticketTiers,
            lineupActs: event.lineupActs,
            tickets: event.tickets,
        };

        return { success: true, data: formattedEvent };
    } catch (error) {
        console.error("[fetchEventById] Error:", error);
        return { success: false, error: "INTERNAL_SERVER_ERROR" };
    }
}