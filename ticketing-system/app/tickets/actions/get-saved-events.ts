"use server";

import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma";
import { decodeJwt } from "jose";

interface GetSavedEventsResponse {
    success: boolean;
    savedEvents?: any[];
    error?: string;
}

export async function getUserSavedEvents(): Promise<GetSavedEventsResponse> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return { success: false, error: "UNAUTHORIZED" };
    }

    let userId: string;
    try {
        const payload = decodeJwt(accessToken) as { userId: string; role?: string };
        userId = payload.userId;
    } catch {
        return { success: false, error: "INVALID_TOKEN" };
    }

    try {
        const savedEvents = await prisma.savedEvent.findMany({
            where: { userId },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        imageUrl: true,
                        location: true,
                        city: true,
                        startDate: true,
                        category: true,
                        totalTickets: true,
                        ticketsSold: true,
                        ticketTiers: {
                            orderBy: { price: 'asc' },
                            select: {
                                id: true,
                                name: true,
                                price: true,
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, savedEvents };

    } catch (error) {
        console.error("[getUserSavedEvents] Error:", error);
        return { success: false, error: "FAILED_TO_FETCH_SAVED_EVENTS" };
    }
}