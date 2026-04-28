"use server";

import { getPrisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";

interface DeleteEventResult {
    success: boolean;
    error?: string;
}

export async function deleteEventAction(eventId: string): Promise<DeleteEventResult> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return { success: false, error: "UNAUTHORIZED: SESSION EXPIRED" };
    }

    try {
        const payload = decodeJwt(accessToken) as { role?: string };
        if (payload.role !== "ADMIN") {
            return { success: false, error: "FORBIDDEN: INSUFFICIENT PERMISSIONS" };
        }

        // Delete tickets first (no cascade defined on Event->Ticket in schema)
        await prisma.ticket.deleteMany({ where: { eventId } });
        await prisma.event.delete({ where: { id: eventId } });

        revalidatePath("/admin/events");

        return { success: true };
    } catch (error: any) {
        console.error("[deleteEventAction] Error:", error);
        if (error.code === "P2025") {
            return { success: false, error: "EVENT_NOT_FOUND: ALREADY DELETED" };
        }
        return { success: false, error: "INTERNAL_SERVER_ERROR: PLEASE CHECK SYSTEM LOGS" };
    }
}