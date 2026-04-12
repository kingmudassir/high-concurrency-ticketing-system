import { prisma } from "@/lib/prisma";
import { getRedisClient } from "@/lib/redis";

export async function cleanupExpiredTickets() {
    const redis = await getRedisClient();

    console.log("Running expired ticket cleanup...");

    // 1. Find expired tickets
    const expiredTickets = await prisma.ticket.findMany({
        where: {
            status: "PENDING",
            expiresAt: {
                lt: new Date(), // expired
            },
        },
    });

    if (expiredTickets.length === 0) {
        console.log("No expired tickets found.");
        return;
    }

    console.log(`Found ${expiredTickets.length} expired tickets`);

    // 2. Group by eventId (important for Redis)
    const eventMap: Record<string, number> = {};

    for (const ticket of expiredTickets) {
        eventMap[ticket.eventId] = (eventMap[ticket.eventId] || 0) + 1;
    }

    // 3. Cancel tickets in DB
    await prisma.ticket.updateMany({
        where: {
            id: { in: expiredTickets.map(t => t.id) },
        },
        data: {
            status: "CANCELLED",
        },
    });

    // 4. Decrease ticketsSold in Event
    for (const [eventId, count] of Object.entries(eventMap)) {
        await prisma.event.update({
            where: { id: eventId },
            data: {
                ticketsSold: { decrement: count },
            },
        });

        // 5. Return tickets back to Redis
        const ticketKey = `tickets:count:${eventId}`;
        await redis?.incrBy(ticketKey, count);
    }

    console.log("Expired tickets cleaned up successfully.");
}