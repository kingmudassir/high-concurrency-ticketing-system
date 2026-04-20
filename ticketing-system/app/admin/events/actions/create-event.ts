"use server";

import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma"; 
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";

interface ActionResponse {
    success: boolean;
    eventId?: string;
    error?: string;
}

export async function createEventAction(formData: FormData): Promise<ActionResponse> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    // 1. Authentication & Role Verification
    if (!accessToken) {
        return { success: false, error: "UNAUTHORIZED: SESSION EXPIRED" };
    }

    try {
        const payload = decodeJwt(accessToken) as { role?: string };
        
        if (payload.role !== "ADMIN") {
            return { success: false, error: "FORBIDDEN: INSUFFICIENT PERMISSIONS" };
        }

        // 2. Data Extraction & Sanitization
        const title = formData.get("title")?.toString().trim();
        const description = formData.get("description")?.toString().trim();
        const location = formData.get("location")?.toString().trim();
        const priceRaw = formData.get("price")?.toString();
        const totalTicketsRaw = formData.get("totalTickets")?.toString();
        const startDateRaw = formData.get("startDate")?.toString();

        // 3. Strict Validation Gate
        // This prevents Prisma validation errors by catching empty/invalid data early
        if (!title || !location || !priceRaw || !totalTicketsRaw || !startDateRaw) {
            return { success: false, error: "VALIDATION_FAILED: ALL FIELDS EXCEPT DESCRIPTION ARE REQUIRED" };
        }

        const price = parseInt(priceRaw);
        const totalTickets = parseInt(totalTicketsRaw);
        const startDate = new Date(startDateRaw);

        // Check for NaN or invalid dates
        if (isNaN(price) || isNaN(totalTickets) || isNaN(startDate.getTime())) {
            return { success: false, error: "DATA_FORMAT_ERROR: INVALID NUMERIC OR DATE INPUT" };
        }

        // 4. Database Insertion
        const newEvent = await prisma.event.create({
            data: {
                title,
                description: description || null, // Allow null if empty
                location,
                price,
                totalTickets,
                startDate,
                ticketsSold: 0,
            },
        });

        // 5. Cache Invalidation
        // Forces Next.js to fetch fresh data for these segments
        revalidatePath("/admin/events");
        revalidatePath("/dashboard");

        return { success: true, eventId: newEvent.id };

    } catch (error: any) {
        // Detailed logging for debugging
        console.error("CRITICAL_EVENT_CREATION_FAILURE:", error);
        
        // Return a generic error to the client to avoid exposing DB internals
        return { 
            success: false, 
            error: error.code === 'P2002' 
                ? "DATABASE_CONFLICT: EVENT ALREADY EXISTS" 
                : "INTERNAL_SERVER_ERROR: PLEASE CHECK SYSTEM LOGS" 
        };
    }
}