"use server";

import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma";
import { decodeJwt } from "jose";

interface CheckIfSavedResponse {
    success: boolean;
    isSaved: boolean;
    error?: string;
}

export async function checkIfSavedAction(eventId: string): Promise<CheckIfSavedResponse> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return { success: true, isSaved: false };
    }

    let userId: string;
    try {
        const payload = decodeJwt(accessToken) as { userId: string; role?: string };
        userId = payload.userId;
    } catch {
        return { success: true, isSaved: false };
    }

    if (!eventId) {
        return { success: false, isSaved: false, error: "Event ID required" };
    }

    try {
        // Check if SavedEvent model exists
        let isSaved = false;
        try {
            const savedEvent = await prisma.savedEvent.findUnique({
                where: {
                    userId_eventId: {
                        userId: userId,
                        eventId: eventId
                    }
                }
            });
            isSaved = !!savedEvent;
        } catch (err) {
            // SavedEvent model doesn't exist yet
            console.error("SavedEvent model not found:", err);
        }

        return { success: true, isSaved };
    } catch (error) {
        console.error("[checkIfSavedAction] Error:", error);
        return { success: false, isSaved: false, error: "Failed to check saved status" };
    }
}