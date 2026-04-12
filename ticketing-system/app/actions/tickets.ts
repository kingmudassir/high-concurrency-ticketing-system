"use server";

import { prisma } from "@/lib/prisma";
import { getRedisClient } from "@/lib/redis";
import { revalidatePath } from "next/cache";

export async function purchaseTicket(eventId: string, userId: string) {
    const redis = await getRedisClient();
    const ticketKey = `tickets:count:${eventId}`;

    // Step 1: Decrease ticket count (atomic)
    const remaining = await redis?.decr(ticketKey);

    // Step 2: Sold out check
    if (remaining === undefined || remaining < 0) {
        await redis?.set(ticketKey, 0);
        return { success: false, message: "Sold out!" };
    }

    try {
        // Step 3: Create ticket
        const ticket = await prisma.ticket.create({
            data: {
                eventId,
                userId,
                status: "PENDING",
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });

        // Step 4: Update event
        await prisma.event.update({
            where: { id: eventId },
            data: {
                ticketsSold: { increment: 1 }, // ✅ ONLY this
            },
        });

        // Step 5: Refresh UI
        revalidatePath(`/events/${eventId}`);

        return { success: true, ticketId: ticket.id };

    } catch (error) {
        // Step 6: Rollback Redis if DB fails
        await redis?.incr(ticketKey);

        return { success: false, message: "Database error." };
    }
}