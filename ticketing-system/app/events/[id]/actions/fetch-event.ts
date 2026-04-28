"use server";

import { getPrisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { getRedisClient } from "@/lib/redis/redis";

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
    ticketTiers: TicketTier[];
    lineupActs: LineupAct[];
    tickets: EventTicket[];
};

type FetchEventResult =
    | { success: true; data: EventDetail }
    | { success: false; error: string };

// Helper to generate cache key for event
function getEventCacheKey(eventId: string): string {
    return `event:${eventId}`;
}

// Helper to invalidate event cache (call when event is updated)
export async function invalidateEventCache(eventId: string) {
    try {
        const redis = await getRedisClient();
        if (redis) {
            const cacheKey = getEventCacheKey(eventId);
            await redis.del(cacheKey);
            console.log(`🗑️ Redis cache invalidated for: ${cacheKey}`);
        }
    } catch (error) {
        console.error("Failed to invalidate event cache:", error);
    }
}

// Public version - with Redis caching
// Public version - with Redis caching
export async function fetchPublicEventById(eventId: string): Promise<FetchEventResult> {
    const prisma = getPrisma();
    const cacheKey = getEventCacheKey(eventId);

    try {
        // 1. Try to get from Redis cache
        const redis = await getRedisClient();
        
        if (redis) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log(`📦 Redis cache HIT for: ${cacheKey}`);
                const parsedData = JSON.parse(cached);
                // Convert dates back from ISO strings
                parsedData.data.startDate = new Date(parsedData.data.startDate);
                if (parsedData.data.endDate) parsedData.data.endDate = new Date(parsedData.data.endDate);
                if (parsedData.data.doorsOpen) parsedData.data.doorsOpen = new Date(parsedData.data.doorsOpen);
                parsedData.data.createdAt = new Date(parsedData.data.createdAt);
                parsedData.data.updatedAt = new Date(parsedData.data.updatedAt);
                return parsedData as FetchEventResult;
            }
            console.log(`📦 Redis cache MISS for: ${cacheKey}`);
        }

        // 2. Cache miss - fetch from database
        const event = await prisma.event.findUnique({
            where: { 
                id: eventId,
                status: "PUBLISHED"
            },
            include: {
                ticketTiers: {
                    orderBy: { sortOrder: 'asc' },
                },
                lineupActs: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });

        if (!event) {
            return { success: false, error: "EVENT_NOT_FOUND" };
        }

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
            tickets: [],
        };

        const result: FetchEventResult = { success: true, data: formattedEvent };

        // 3. Store in Redis cache
        if (redis) {
            // Cache for 1 hour (3600 seconds)
            await redis.setEx(cacheKey, 3600, JSON.stringify(result));
            console.log(`💾 Redis cache STORED for: ${cacheKey} (TTL: 1 hour)`);
        }

        return result;
    } catch (error) {
        console.error("[fetchPublicEventById] Error:", error);
        return { success: false, error: "INTERNAL_SERVER_ERROR" };
    }
}

// Admin version - with Redis caching (shorter TTL for admin)
export async function fetchEventById(eventId: string): Promise<FetchEventResult> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const cacheKey = getEventCacheKey(eventId);

    if (!accessToken) {
        return { success: false, error: "UNAUTHORIZED: SESSION EXPIRED" };
    }

    try {
        const payload = decodeJwt(accessToken) as { role?: string };
        if (payload.role !== "ADMIN") {
            return { success: false, error: "FORBIDDEN: INSUFFICIENT PERMISSIONS" };
        }

        // Admin can skip cache or use shorter TTL
        const redis = await getRedisClient();
        
        if (redis) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log(`📦 [ADMIN] Redis cache HIT for: ${cacheKey}`);
                const parsedData = JSON.parse(cached);
                // Convert dates back from ISO strings
                parsedData.data.startDate = new Date(parsedData.data.startDate);
                if (parsedData.data.endDate) parsedData.data.endDate = new Date(parsedData.data.endDate);
                if (parsedData.data.doorsOpen) parsedData.data.doorsOpen = new Date(parsedData.data.doorsOpen);
                parsedData.data.createdAt = new Date(parsedData.data.createdAt);
                parsedData.data.updatedAt = new Date(parsedData.data.updatedAt);
                return parsedData as FetchEventResult;
            }
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

        const result: FetchEventResult = { success: true, data: formattedEvent };

        // Cache for admin with shorter TTL (10 minutes)
        if (redis) {
            await redis.setEx(cacheKey, 600, JSON.stringify(result));
            console.log(`💾 [ADMIN] Redis cache STORED for: ${cacheKey} (TTL: 10 min)`);
        }

        return result;
    } catch (error) {
        console.error("[fetchEventById] Error:", error);
        return { success: false, error: "INTERNAL_SERVER_ERROR" };
    }
}