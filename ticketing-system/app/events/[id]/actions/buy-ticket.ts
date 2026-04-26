"use server";

import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma";
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";
import { ticketReservationQueue } from "@/lib/queue";
import { getRedisClient } from "@/lib/redis/redis";

const MAX_TICKETS_PER_USER_PER_EVENT = 8;

interface BuyTicketResponse {
    success: boolean;
    ticketIds?: string[];
    expiresAt?: string;
    error?: string;
    code?: string;
    queuePosition?: number;
    jobId?: string;
}

export async function buyTicketAction(formData: FormData): Promise<BuyTicketResponse> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    // ─── 1. Authentication ────────────────────────────────────────────────────
    if (!accessToken) {
        return {
            success: false,
            error: "You must be logged in to purchase tickets.",
            code: "UNAUTHORIZED",
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
            code: "INVALID_TOKEN",
        };
    }

    // ─── 2. Parse & validate input ────────────────────────────────────────────
    const eventId = formData.get("eventId")?.toString();
    const tierId = formData.get("tierId")?.toString();
    const quantityStr = formData.get("quantity")?.toString();
    const gstPercentStr = formData.get("gstPercent")?.toString();
    const serviceFeePercentStr = formData.get("serviceFeePercent")?.toString();

    if (!eventId || !tierId || !quantityStr) {
        return { success: false, error: "Missing required fields.", code: "MISSING_FIELDS" };
    }

    const quantity = parseInt(quantityStr);
    const gstPercent = parseInt(gstPercentStr || "0");
    const serviceFeePercent = parseInt(serviceFeePercentStr || "0");

    if (isNaN(quantity) || quantity < 1 || quantity > MAX_TICKETS_PER_USER_PER_EVENT) {
        return {
            success: false,
            error: `Quantity must be between 1 and ${MAX_TICKETS_PER_USER_PER_EVENT} tickets.`,
            code: "INVALID_QUANTITY",
        };
    }

    // ─── 3. Quick validation BEFORE queue ────────────────────────────────────
    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true, status: true, startDate: true },
        });

        if (!event) throw new Error("EVENT_NOT_FOUND");
        if (event.status !== "PUBLISHED") throw new Error("EVENT_NOT_AVAILABLE");
        if (new Date(event.startDate) < new Date()) throw new Error("EVENT_ALREADY_STARTED");

        const existingTickets = await prisma.ticket.count({
            where: { userId, eventId, status: { in: ["PENDING", "CONFIRMED"] } },
        });

        if (existingTickets + quantity > MAX_TICKETS_PER_USER_PER_EVENT) {
            const canBuy = MAX_TICKETS_PER_USER_PER_EVENT - existingTickets;
            if (canBuy <= 0) {
                return {
                    success: false,
                    error: `You already have the maximum of ${MAX_TICKETS_PER_USER_PER_EVENT} tickets for this event.`,
                    code: "TICKET_LIMIT_REACHED",
                };
            }
            return {
                success: false,
                error: `You can only reserve ${canBuy} more ticket${canBuy !== 1 ? "s" : ""} for this event.`,
                code: "PARTIAL_LIMIT",
                ticketIds: [canBuy.toString()],
            };
        }

        const tier = await prisma.ticketTier.findUnique({
            where: { id: tierId },
            select: { capacity: true, sold: true, name: true, eventId: true },
        });

        if (!tier || tier.eventId !== eventId) throw new Error("TIER_NOT_FOUND");

        const available = tier.capacity - tier.sold;
        if (available < quantity) {
            return {
                success: false,
                error: available === 0
                    ? `Sorry, ${tier.name} tickets are sold out.`
                    : `Only ${available} ${tier.name} ticket${available !== 1 ? "s" : ""} left.`,
                code: "INSUFFICIENT_CAPACITY",
            };
        }
    } catch (error: any) {
        console.error("[buyTicketAction] Validation error:", error);
        return mapErrorToResponse(error);
    }

    // ─── 4. Add to BullMQ queue ───────────────────────────────────────────────
    const reservationId = `${userId}_${eventId}_${tierId}_${Date.now()}`;
    const jobId = `${eventId}_${tierId}_${reservationId}`;

    try {
        const job = await ticketReservationQueue.add(
            `reservation-${reservationId}`,
            {
                userId,
                eventId,
                tierId,
                quantity,
                gstPercent,
                serviceFeePercent,
                expiresInMinutes: 30/60,
                reservationId,
            },
            {
                jobId,
                removeOnFail: false,
            }
        );

        const waitingCount = await ticketReservationQueue.getWaitingCount();
        const activeCount = await ticketReservationQueue.getActiveCount();

        return {
            success: true,
            jobId: job.id,
            queuePosition: waitingCount + activeCount + 1,
        };
    } catch (error) {
        console.error("[buyTicketAction] Queue error:", error);
        return {
            success: false,
            error: "Unable to process reservation. Please try again.",
            code: "QUEUE_ERROR",
        };
    }
}

// ─── checkReservationStatus ───────────────────────────────────────────────────
export async function checkReservationStatus(jobId: string): Promise<{
    state: string;
    ticketIds?: string[];
    expiresAt?: string;
    error?: string;
    position?: number;
}> {
    try {
        const job = await ticketReservationQueue.getJob(jobId);

        if (job) {
            const state = await job.getState();
            const returnValue = job.returnvalue;

            if (returnValue) {
                let parsed = returnValue;
                if (typeof returnValue === "string") {
                    try { parsed = JSON.parse(returnValue); } catch { }
                }
                if (parsed?.ticketIds?.length > 0) {
                    // Clear cache when reservation is successful
                    const eventId = parsed.eventId || job.data?.eventId;
                    if (eventId) {
                        await clearEventCache(eventId);
                    }
                    return {
                        state: "completed",
                        ticketIds: parsed.ticketIds,
                        expiresAt: parsed.expiresAt,
                    };
                }
            }

            if (state === "failed") {
                return { state: "failed", error: job.failedReason || "Unknown error" };
            }

            let position: number | undefined;
            if (state === "waiting") {
                const waiting = await ticketReservationQueue.getWaiting();
                const idx = waiting.findIndex((j) => j.id === jobId);
                position = idx >= 0 ? idx + 1 : undefined;
            }

            return { state, position };
        }

        // Fallback to database check
        console.log(`[checkReservationStatus] Job ${jobId} not found - checking DB`);

        const prisma = getPrisma();
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if (!accessToken) {
            return { state: "failed", error: "Session expired" };
        }

        const payload = decodeJwt(accessToken) as { userId: string };
        const eventId = jobId.split("_")[0];

        const tickets = await prisma.ticket.findMany({
            where: {
                userId: payload.userId,
                eventId,
                status: "PENDING",
                expiresAt: { gt: new Date() },
            },
            select: { id: true, expiresAt: true },
            orderBy: { createdAt: "desc" },
            take: 8,
        });

        if (tickets.length > 0) {
            return {
                state: "completed",
                ticketIds: tickets.map((t) => t.id),
                expiresAt: tickets[0].expiresAt.toISOString(),
            };
        }

        return { state: "failed", error: "Reservation could not be completed. Please try again." };
    } catch (error) {
        console.error("[checkReservationStatus] Error:", error);
        return { state: "error", error: "Failed to check status" };
    }
}

// ─── Clear Redis Cache ────────────────────────────────────────────────────────
export async function clearEventCache(eventId: string) {
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

// ─── cancelReservationAction ──────────────────────────────────────────────────
export async function cancelReservationAction(ticketIds: string[]): Promise<{ success: boolean; error?: string; cancelledCount?: number }> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return { success: false, error: "Unauthorized" };
    }

    let userId: string;
    let eventId: string | null = null;
    let cancelledCount = 0;
    
    try {
        const payload = decodeJwt(accessToken) as { userId: string };
        userId = payload.userId;
        
        await prisma.$transaction(async (tx) => {
            const tickets = await tx.ticket.findMany({
                where: {
                    id: { in: ticketIds },
                    userId,
                    status: "PENDING",
                    expiresAt: { gt: new Date() },
                },
                select: { id: true, tierId: true, eventId: true },
            });

            if (tickets.length === 0) {
                throw new Error("No valid pending tickets found");
            }

            eventId = tickets[0].eventId;
            cancelledCount = tickets.length;

            await tx.ticket.updateMany({
                where: { id: { in: tickets.map(t => t.id) } },
                data: { status: "CANCELLED" },
            });

            const byTier = tickets.reduce<Record<string, number>>((acc, t) => {
                acc[t.tierId] = (acc[t.tierId] || 0) + 1;
                return acc;
            }, {});

            for (const [tierId, count] of Object.entries(byTier)) {
                const currentTier = await tx.ticketTier.findUnique({
                    where: { id: tierId },
                    select: { sold: true },
                });
                
                if (currentTier && currentTier.sold >= count) {
                    await tx.ticketTier.update({
                        where: { id: tierId },
                        data: { sold: { decrement: count } },
                    });
                }
            }

            const currentEvent = await tx.event.findUnique({
                where: { id: eventId! },
                select: { ticketsSold: true },
            });
            
            if (currentEvent && currentEvent.ticketsSold >= tickets.length) {
                await tx.event.update({
                    where: { id: eventId! },
                    data: { ticketsSold: { decrement: tickets.length } },
                });
            }
        });

        // Clear cache and revalidate
        if (eventId) {
            await clearEventCache(eventId);
            revalidatePath(`/events/${eventId}`);
        }
        revalidatePath("/account/tickets");
        
        return { success: true, cancelledCount };
    } catch (error: any) {
        console.error("[cancelReservationAction] Error:", error);
        return { success: false, error: error.message || "Failed to cancel reservation" };
    }
}

// ─── mapErrorToResponse ───────────────────────────────────────────────────────
function mapErrorToResponse(error: any): BuyTicketResponse {
    if (error.message === "EVENT_NOT_FOUND")
        return { success: false, error: "Event not found.", code: "EVENT_NOT_FOUND" };
    if (error.message === "EVENT_NOT_AVAILABLE")
        return { success: false, error: "This event is not available for purchase.", code: "EVENT_NOT_AVAILABLE" };
    if (error.message === "EVENT_ALREADY_STARTED")
        return { success: false, error: "This event has already started.", code: "EVENT_ALREADY_STARTED" };
    if (error.message === "TIER_NOT_FOUND")
        return { success: false, error: "Ticket tier not found.", code: "TIER_NOT_FOUND" };
    if (error.message === "TICKET_LIMIT_REACHED")
        return {
            success: false,
            error: `You already have the maximum of ${MAX_TICKETS_PER_USER_PER_EVENT} tickets for this event.`,
            code: "TICKET_LIMIT_REACHED",
        };
    if (error.message?.startsWith("PARTIAL_LIMIT:")) {
        const canBuy = parseInt(error.message.split(":")[1]);
        return {
            success: false,
            error: `You can only reserve ${canBuy} more ticket${canBuy !== 1 ? "s" : ""} for this event.`,
            code: "PARTIAL_LIMIT",
            ticketIds: [canBuy.toString()],
        };
    }
    if (error.message?.startsWith("CAPACITY:")) {
        const [, available, tierName] = error.message.split(":");
        return {
            success: false,
            error: available === "0"
                ? `Sorry, ${tierName} tickets are sold out.`
                : `Only ${available} ${tierName} ticket${Number(available) !== 1 ? "s" : ""} left.`,
            code: "INSUFFICIENT_CAPACITY",
        };
    }
    return {
        success: false,
        error: "Unable to process your request. Please try again.",
        code: "INTERNAL_ERROR",
    };
}