"use server";

import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma";
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";

interface SaveEventResponse {
    success: boolean;
    savedEventId?: string;
    error?: string;
    code?: string;
}

export async function saveEventAction(eventId: string): Promise<SaveEventResponse> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    // ─── 1. Authentication Check ──────────────────────────────────────────────
    if (!accessToken) {
        return {
            success: false,
            error: "You must be logged in to save events.",
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
        // Check if event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true, title: true }
        });

        if (!event) {
            return {
                success: false,
                error: "Event not found.",
                code: "EVENT_NOT_FOUND"
            };
        }

        // Check if already saved
        const existingSaved = await prisma.savedEvent.findUnique({
            where: {
                userId_eventId: {
                    userId: userId,
                    eventId: eventId
                }
            }
        });

        if (existingSaved) {
            return {
                success: false,
                error: "Event already saved.",
                code: "ALREADY_SAVED"
            };
        }

        // Create saved event
        const savedEvent = await prisma.savedEvent.create({
            data: {
                userId: userId,
                eventId: eventId
            },
            select: { id: true }
        });

        // ─── 3. Invalidate caches ────────────────────────────────────────────────
        revalidatePath("/tickets");
        revalidatePath(`/events/${eventId}`);

        return {
            success: true,
            savedEventId: savedEvent.id
        };

    } catch (error: any) {
        console.error("[saveEventAction] Error:", error);

        // Handle unique constraint violation
        if (error.code === "P2002") {
            return {
                success: false,
                error: "Event already saved.",
                code: "ALREADY_SAVED"
            };
        }

        return {
            success: false,
            error: "Unable to save event. Please try again.",
            code: "INTERNAL_ERROR"
        };
    }
}