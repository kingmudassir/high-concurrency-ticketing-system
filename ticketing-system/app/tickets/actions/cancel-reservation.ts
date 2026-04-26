"use server";

import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma";
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";
import { getRedisClient } from "@/lib/redis/redis";

interface CancelReservationResponse {
    success: boolean;
    cancelledCount?: number;
    error?: string;
    code?: string;
}

// Helper to clear Redis cache for an event
async function clearEventCache(eventId: string) {
    try {
        const redis = await getRedisClient();
        if (redis) {
            await redis.del("events:recent:page1");
            await redis.del(`event:${eventId}`);
            console.log(`🗑️ Cleared Redis cache for event ${eventId}`);
        }
    } catch (error) {
        console.error("Failed to clear Redis cache:", error);
    }
}

export async function cancelReservationAction(ticketIds: string[]): Promise<CancelReservationResponse> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    // ─── 1. Authentication Check ──────────────────────────────────────────────
    if (!accessToken) {
        return {
            success: false,
            error: "You must be logged in to cancel reservations.",
            code: "UNAUTHORIZED"
        };
    }

    let userId: string;
    try {
        const payload = decodeJwt(accessToken) as { userId: string; role?: string };
        userId = payload.userId;
    } catch {
        return {
            success: false,
            error: "Invalid session. Please log in again.",
            code: "INVALID_TOKEN"
        };
    }

    if (!ticketIds || ticketIds.length === 0) {
        return {
            success: false,
            error: "No ticket IDs provided.",
            code: "MISSING_TICKET_IDS"
        };
    }

    // ─── Store event IDs to clear cache later ───────────────────────────────
    let affectedEventIds = new Set<string>();

    // ─── 2. Database Transaction ─────────────────────────────────────────────
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 2.1 Verify tickets belong to user and are in PENDING status
            const tickets = await tx.ticket.findMany({
                where: {
                    id: { in: ticketIds },
                    userId: userId,
                    status: "PENDING",
                    expiresAt: { gt: new Date() }
                },
                select: {
                    id: true,
                    tierId: true,
                    eventId: true,
                }
            });

            if (tickets.length === 0) {
                throw new Error("NO_VALID_TICKETS");
            }

            const foundIds = new Set(tickets.map(t => t.id));
            const invalidIds = ticketIds.filter(id => !foundIds.has(id));

            if (invalidIds.length > 0) {
                throw new Error(`INVALID_TICKETS:${invalidIds.join(",")}`);
            }

            // Store affected event IDs for cache clearing
            for (const ticket of tickets) {
                affectedEventIds.add(ticket.eventId);
            }

            // 2.2 Group by tier and event for counter updates
            const tierCounts = new Map<string, number>();
            const eventCounts = new Map<string, number>();

            for (const ticket of tickets) {
                tierCounts.set(ticket.tierId, (tierCounts.get(ticket.tierId) || 0) + 1);
                eventCounts.set(ticket.eventId, (eventCounts.get(ticket.eventId) || 0) + 1);
            }

            // 2.3 Update ticket status to CANCELLED
            await tx.ticket.updateMany({
                where: { id: { in: ticketIds } },
                data: { status: "CANCELLED" }
            });

            // 2.4 Restore tier sold counts
            for (const [tierId, count] of tierCounts) {
                const currentTier = await tx.ticketTier.findUnique({
                    where: { id: tierId },
                    select: { sold: true },
                });
                
                if (currentTier && currentTier.sold >= count) {
                    await tx.ticketTier.update({
                        where: { id: tierId },
                        data: { sold: { decrement: count } }
                    });
                }
            }

            // 2.5 Restore event ticketsSold counts
            for (const [eventId, count] of eventCounts) {
                const currentEvent = await tx.event.findUnique({
                    where: { id: eventId },
                    select: { ticketsSold: true },
                });
                
                if (currentEvent && currentEvent.ticketsSold >= count) {
                    await tx.event.update({
                        where: { id: eventId },
                        data: { ticketsSold: { decrement: count } }
                    });
                }
            }

            return { cancelledCount: tickets.length, ticketIds: tickets.map(t => t.id) };
        }, {
            timeout: 10000,
            isolationLevel: "Serializable"
        });

        // ─── 3. Clear Redis cache for affected events ────────────────────────
        for (const eventId of affectedEventIds) {
            await clearEventCache(eventId);
        }

        // ─── 4. Invalidate Next.js caches ────────────────────────────────────
        revalidatePath("/tickets");
        revalidatePath("/account/tickets");
        for (const eventId of affectedEventIds) {
            revalidatePath(`/events/${eventId}`);
        }
        revalidatePath("/events");

        return {
            success: true,
            cancelledCount: result.cancelledCount
        };

    } catch (error: any) {
        console.error("[cancelReservationAction] Error:", error);

        if (error.message === "NO_VALID_TICKETS") {
            return {
                success: false,
                error: "No valid pending reservations found for these tickets.",
                code: "NO_VALID_TICKETS"
            };
        }

        if (error.message?.startsWith("INVALID_TICKETS:")) {
            const invalidIds = error.message.split(":")[1];
            return {
                success: false,
                error: `Some tickets are not valid for cancellation: ${invalidIds}`,
                code: "INVALID_TICKETS"
            };
        }

        return {
            success: false,
            error: "Unable to cancel your reservation. Please try again.",
            code: "INTERNAL_ERROR"
        };
    }
}