"use server";

import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma";
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";

const MAX_TICKETS_PER_USER_PER_EVENT = 8;

interface BuyTicketResponse {
    success: boolean;
    ticketIds?: string[];
    expiresAt?: string;
    error?: string;
    code?: string;
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
    const eventId            = formData.get("eventId")?.toString();
    const tierId             = formData.get("tierId")?.toString();
    const quantityStr        = formData.get("quantity")?.toString();
    const gstPercentStr      = formData.get("gstPercent")?.toString();
    const serviceFeePercentStr = formData.get("serviceFeePercent")?.toString();

    if (!eventId || !tierId || !quantityStr) {
        return { success: false, error: "Missing required fields.", code: "MISSING_FIELDS" };
    }

    const quantity          = parseInt(quantityStr);
    const gstPercent        = parseInt(gstPercentStr || "0");
    const serviceFeePercent = parseInt(serviceFeePercentStr || "0");

    if (isNaN(quantity) || quantity < 1 || quantity > MAX_TICKETS_PER_USER_PER_EVENT) {
        return {
            success: false,
            error: `Quantity must be between 1 and ${MAX_TICKETS_PER_USER_PER_EVENT} tickets.`,
            code: "INVALID_QUANTITY",
        };
    }

    // ─── 3. Database transaction ──────────────────────────────────────────────
    try {
        const result = await prisma.$transaction(
            async (tx) => {
                const now = new Date();

                // 3.1 Validate event
                const event = await tx.event.findUnique({
                    where: { id: eventId },
                    select: { id: true, status: true, startDate: true },
                });

                if (!event)                         throw new Error("EVENT_NOT_FOUND");
                if (event.status !== "PUBLISHED")   throw new Error("EVENT_NOT_AVAILABLE");
                if (new Date(event.startDate) < now) throw new Error("EVENT_ALREADY_STARTED");

                // 3.2 Validate tier
                const tier = await tx.ticketTier.findUnique({
                    where: { id: tierId },
                    select: { id: true, name: true, price: true, capacity: true, sold: true, eventId: true },
                });

                if (!tier || tier.eventId !== eventId) throw new Error("TIER_NOT_FOUND");

                // 3.3 Expire any of THIS user's stale PENDING tickets for this event
                //     so we count correctly and release capacity before checking the cap.
                const staleTickets = await tx.ticket.findMany({
                    where: {
                        userId,
                        eventId,
                        status: "PENDING",
                        expiresAt: { lt: now },
                    },
                    select: { id: true, tierId: true },
                });

                if (staleTickets.length > 0) {
                    const byTier = staleTickets.reduce<Record<string, number>>((acc, t) => {
                        acc[t.tierId] = (acc[t.tierId] ?? 0) + 1;
                        return acc;
                    }, {});

                    await tx.ticket.updateMany({
                        where: { id: { in: staleTickets.map((t) => t.id) } },
                        data: { status: "EXPIRED" },
                    });

                    for (const [tid, count] of Object.entries(byTier)) {
                        await tx.ticketTier.update({
                            where: { id: tid },
                            data: { sold: { decrement: count } },
                        });
                    }

                    await tx.event.update({
                        where: { id: eventId },
                        data: { ticketsSold: { decrement: staleTickets.length } },
                    });
                }

                // 3.4 Count how many PENDING + CONFIRMED tickets this user already has
                const existingTickets = await tx.ticket.findMany({
                    where: {
                        userId,
                        eventId,
                        status: { in: ["PENDING", "CONFIRMED"] },
                    },
                    select: { id: true, status: true },
                });

                const alreadyOwned   = existingTickets.length;
                const afterPurchase  = alreadyOwned + quantity;

                if (afterPurchase > MAX_TICKETS_PER_USER_PER_EVENT) {
                    const canBuy = MAX_TICKETS_PER_USER_PER_EVENT - alreadyOwned;
                    if (canBuy <= 0) {
                        throw new Error("TICKET_LIMIT_REACHED");
                    }
                    throw new Error(`PARTIAL_LIMIT:${canBuy}`);
                }

                // 3.5 Check tier capacity
                // Re-read sold after we potentially expired tickets above
                const freshTier = await tx.ticketTier.findUnique({
                    where: { id: tierId },
                    select: { capacity: true, sold: true, name: true },
                });

                const available = (freshTier?.capacity ?? 0) - (freshTier?.sold ?? 0);
                if (available < quantity) {
                    throw new Error(`CAPACITY:${available}:${tier.name}`);
                }

                // 3.6 Calculate prices
                const pricePerTicket    = tier.price;
                const subtotal          = pricePerTicket * quantity;
                const gstAmount         = Math.round(subtotal * (gstPercent / 100));
                const serviceFeeAmount  = Math.round(subtotal * (serviceFeePercent / 100));
                const expiresAt         = new Date(now.getTime() + 10 * 60 * 1000); // 10 min

                // 3.7 Create PENDING tickets
                const ticketIds: string[] = [];
                for (let i = 0; i < quantity; i++) {
                    const ticket = await tx.ticket.create({
                        data: {
                            eventId,
                            tierId,
                            userId,
                            pricePaid:      pricePerTicket,
                            gstPaid:        gstAmount,
                            serviceFeePaid: serviceFeeAmount,
                            status:         "PENDING",
                            expiresAt,
                        },
                        select: { id: true },
                    });
                    ticketIds.push(ticket.id);
                }

                // 3.8 Update counters
                await tx.ticketTier.update({
                    where: { id: tierId },
                    data: { sold: { increment: quantity } },
                });

                await tx.event.update({
                    where: { id: eventId },
                    data: { ticketsSold: { increment: quantity } },
                });

                return { ticketIds, expiresAt };
            },
            { timeout: 10_000, isolationLevel: "Serializable" }
        );

        // ─── 4. Invalidate caches ─────────────────────────────────────────────
        revalidatePath(`/events/${eventId}`);
        revalidatePath("/events");
        revalidatePath("/account/tickets");

        return {
            success: true,
            ticketIds: result.ticketIds,
            expiresAt: result.expiresAt.toISOString(),
        };
    } catch (error: any) {
        console.error("[buyTicketAction] Error:", error);

        // Structured error mapping
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
                error: `You can only reserve ${canBuy} more ticket${canBuy !== 1 ? "s" : ""} for this event (max ${MAX_TICKETS_PER_USER_PER_EVENT} per person).`,
                code: "PARTIAL_LIMIT",
                ticketIds: [canBuy.toString()], // pass the allowed count back to the UI
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
}