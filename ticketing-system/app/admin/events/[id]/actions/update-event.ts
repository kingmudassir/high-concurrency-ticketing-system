"use server";

import { getPrisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";

interface UpdateEventResult {
    success: boolean;
    error?: string;
}

export async function updateEventAction(
    eventId: string,
    formData: FormData
): Promise<UpdateEventResult> {
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

        const title = formData.get("title")?.toString().trim();
        const description = formData.get("description")?.toString().trim();
        const location = formData.get("location")?.toString().trim();
        const priceRaw = formData.get("price")?.toString();
        const totalTicketsRaw = formData.get("totalTickets")?.toString();
        const startDateRaw = formData.get("startDate")?.toString();

        if (!title || !location || !priceRaw || !totalTicketsRaw || !startDateRaw) {
            return { success: false, error: "VALIDATION_FAILED: ALL REQUIRED FIELDS MUST BE PROVIDED" };
        }

        const price = parseInt(priceRaw);
        const totalTickets = parseInt(totalTicketsRaw);
        const startDate = new Date(startDateRaw);

        if (isNaN(price) || isNaN(totalTickets) || isNaN(startDate.getTime())) {
            return { success: false, error: "DATA_FORMAT_ERROR: INVALID NUMERIC OR DATE INPUT" };
        }

        // Prevent reducing totalTickets below already sold count
        const existing = await prisma.event.findUnique({
            where: { id: eventId },
            select: { ticketsSold: true },
        });

        if (!existing) {
            return { success: false, error: "EVENT_NOT_FOUND" };
        }

        if (totalTickets < existing.ticketsSold) {
            return {
                success: false,
                error: `CAPACITY_CONFLICT: CANNOT SET CAPACITY BELOW ${existing.ticketsSold} TICKETS ALREADY SOLD`,
            };
        }

        await prisma.event.update({
            where: { id: eventId },
            data: {
                title,
                description: description || null,
                location,
                price,
                totalTickets,
                startDate,
            },
        });

        revalidatePath(`/event/${eventId}`);
        revalidatePath("/admin/events");

        return { success: true };
    } catch (error: any) {
        console.error("[updateEventAction] Error:", error);
        return { success: false, error: "INTERNAL_SERVER_ERROR: PLEASE CHECK SYSTEM LOGS" };
    }
}