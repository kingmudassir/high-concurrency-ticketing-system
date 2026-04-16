import { prisma } from "@/lib/prisma";
import { getRedisClient } from "../../lib/redis";
import { EventDisplay } from "../types/event";

export const getEventById = async (id: string): Promise<EventDisplay | null> => {
    const redis = await getRedisClient();
    const cacheKey = `event:${id}`;
    
    // 1. Check cache for the specific event
    const cached = await redis?.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 2. Fetch from DB
    const event = await prisma.event.findUnique({
        where: { id },
        omit: {
            createdAt: true,
            updatedAt: true,
        }
    });

    if (!event) return null;

    // 3. Transform
    const payload: EventDisplay = {
        ...event,
        startDate: event.startDate.toISOString(),
        availableTickets: event.totalTickets - event.ticketsSold
    };

    await redis?.setEx(cacheKey, 10, JSON.stringify(payload));
    await redis?.set(`tickets:count:${id}`, payload.availableTickets, { nx: true });

    return payload;
};