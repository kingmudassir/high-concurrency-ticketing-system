"use server";

import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma";
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";

interface UnsaveEventResponse {
    success: boolean;
    error?: string;
    code?: string;
}

export async function unsaveEventAction(eventId: string): Promise<UnsaveEventResponse> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    // ─── 1. Authentication Check ──────────────────────────────────────────────
    if (!accessToken) {
        return {
            success: false,
            error: "You must be logged in to unsave events.",
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

    if (!eventId) {
        return {
            success: false,
            error: "Event ID is required.",
            code: "MISSING_EVENT_ID"
        };
    }

    // ─── 2. Database Operation ─────────────────────────────────────────────────
    try {
        // Delete the saved event
        await prisma.savedEvent.delete({
            where: {
                userId_eventId: {
                    userId: userId,
                    eventId: eventId
                }
            }
        });

        // ─── 3. Invalidate caches ────────────────────────────────────────────────
        revalidatePath("/tickets");
        revalidatePath(`/events/${eventId}`);

        return { success: true };

    } catch (error: any) {
        console.error("[unsaveEventAction] Error:", error);

        if (error.code === "P2025") {
            return {
                success: false,
                error: "Saved event not found.",
                code: "NOT_FOUND"
            };
        }

        return {
            success: false,
            error: "Unable to unsave event. Please try again.",
            code: "INTERNAL_ERROR"
        };
    }
}