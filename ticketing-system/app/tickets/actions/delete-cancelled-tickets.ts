"use server";

import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma";
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";

interface DeleteCancelledTicketsResponse {
    success: boolean;
    deletedCount?: number;
    error?: string;
    code?: string;
}

export async function deleteCancelledTicketsAction(ticketIds: string[]): Promise<DeleteCancelledTicketsResponse> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    // ─── 1. Authentication Check ──────────────────────────────────────────────
    if (!accessToken) {
        return {
            success: false,
            error: "You must be logged in to delete tickets.",
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

    // ─── 2. Database Transaction ─────────────────────────────────────────────
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 2.1 Verify tickets belong to user and are in CANCELLED or EXPIRED status
            const tickets = await tx.ticket.findMany({
                where: {
                    id: { in: ticketIds },
                    userId: userId,
                    status: { in: ["CANCELLED", "EXPIRED"] }
                },
                select: {
                    id: true,
                    status: true,
                }
            });

            if (tickets.length === 0) {
                throw new Error("NO_CANCELLED_TICKETS_FOUND");
            }

            const foundIds = new Set(tickets.map(t => t.id));
            const invalidIds = ticketIds.filter(id => !foundIds.has(id));

            if (invalidIds.length > 0) {
                throw new Error(`INVALID_TICKETS:${invalidIds.join(",")}`);
            }

            // 2.2 Delete the tickets (permanently remove from database)
            const deleted = await tx.ticket.deleteMany({
                where: { id: { in: ticketIds } }
            });

            return { deletedCount: deleted.count };
        }, {
            timeout: 10000,
            isolationLevel: "Serializable"
        });

        // ─── 3. Invalidate caches ────────────────────────────────────────────
        revalidatePath("/tickets");

        return {
            success: true,
            deletedCount: result.deletedCount
        };

    } catch (error: any) {
        console.error("[deleteCancelledTicketsAction] Error:", error);

        if (error.message === "NO_CANCELLED_TICKETS_FOUND") {
            return {
                success: false,
                error: "No cancelled or expired tickets found for these IDs.",
                code: "NO_CANCELLED_TICKETS_FOUND"
            };
        }

        if (error.message?.startsWith("INVALID_TICKETS:")) {
            const invalidIds = error.message.split(":")[1];
            return {
                success: false,
                error: `Some tickets are not valid for deletion: ${invalidIds}`,
                code: "INVALID_TICKETS"
            };
        }

        return {
            success: false,
            error: "Unable to delete tickets. Please try again.",
            code: "INTERNAL_ERROR"
        };
    }
}

// ─── OPTIONAL: Delete ALL cancelled tickets for a user ────────────────────────
export async function deleteAllCancelledTicketsAction(): Promise<DeleteCancelledTicketsResponse> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return {
            success: false,
            error: "You must be logged in to delete tickets.",
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

    try {
        const result = await prisma.$transaction(async (tx) => {
            const deleted = await tx.ticket.deleteMany({
                where: {
                    userId: userId,
                    status: { in: ["CANCELLED", "EXPIRED"] }
                }
            });

            return { deletedCount: deleted.count };
        });

        revalidatePath("/tickets");

        return {
            success: true,
            deletedCount: result.deletedCount
        };

    } catch (error) {
        console.error("[deleteAllCancelledTicketsAction] Error:", error);
        return {
            success: false,
            error: "Unable to delete tickets. Please try again.",
            code: "INTERNAL_ERROR"
        };
    }
}