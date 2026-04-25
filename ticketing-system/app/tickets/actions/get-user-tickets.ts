"use server";

import { getPrisma } from "@/lib/db/prisma";

export async function getUserTickets(userId: string) {
    const prisma = getPrisma();
    const now = new Date();
    
    try {
        // First, update any expired pending tickets to EXPIRED status
        await prisma.ticket.updateMany({
            where: {
                userId,
                status: "PENDING",
                expiresAt: { lt: now }
            },
            data: { status: "EXPIRED" }
        });

        // Then fetch all tickets
        const tickets = await prisma.ticket.findMany({
            where: { userId },
            include: {
                event: {
                    select: {
                        title: true,
                        imageUrl: true,
                        location: true,
                        city: true,
                        startDate: true,
                    }
                },
                tier: {
                    select: {
                        name: true,
                        price: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        return { success: true, tickets };
    } catch (error) {
        console.error("Error fetching user tickets:", error);
        return { success: false, error: "Failed to fetch tickets" };
    }
}