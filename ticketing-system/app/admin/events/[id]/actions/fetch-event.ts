"use server";

import { getPrisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

export type EventTicket = {
    id: string;
    status: string;
    createdAt: Date;
    expiresAt: Date;
    user: {
        id: string;
        username: string;
        email: string;
    };
};

export type EventDetail = {
    id: string;
    title: string;
    description: string | null;
    location: string;
    price: number;
    totalTickets: number;
    ticketsSold: number;
    startDate: Date;
    createdAt: Date;
    updatedAt: Date;
    tickets: EventTicket[];
};

type FetchEventResult =
    | { success: true; data: EventDetail }
    | { success: false; error: string };

export async function fetchEventById(eventId: string): Promise<FetchEventResult> {
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

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                tickets: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!event) {
            return { success: false, error: "EVENT_NOT_FOUND" };
        }

        return { success: true, data: event as EventDetail };
    } catch (error) {
        console.error("[fetchEventById] Error:", error);
        return { success: false, error: "INTERNAL_SERVER_ERROR" };
    }
}