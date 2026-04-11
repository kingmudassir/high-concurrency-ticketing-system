import { prisma } from "@/lib/prisma";
import { getRedisClient } from "../../lib/redis";
import { EventDisplay } from "../types/event";

// services/event-service.ts
export const getallEvents = async (): Promise<EventDisplay[]> => {
    const redis = await getRedisClient();
    const cached = await redis?.get("events:all");

    console.log("Cache values: ", cached)
    if (cached) return JSON.parse(cached);

    const events = await prisma.event.findMany({ 
        orderBy: { startDate: 'asc' },
        omit: {
            createdAt: true,
            updatedAt: true,
        }
    });

    console.log("Hardcoded DB values: ", events)

    // Transform the data so the DB version matches the Cache version
    const payload = events.map(event => ({
        ...event,
        // Force the Date object into a String so it's consistent
        startDate: event.startDate.toISOString(), 
        availableTickets: event.totalTickets - event.ticketsSold
    }));

    await redis?.setEx("events:all", 30, JSON.stringify(payload));
    return payload;
}