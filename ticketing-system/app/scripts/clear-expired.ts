// scripts/clear-expired.ts
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from root
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const prisma = new PrismaClient();

async function clearExpiredTickets() {
    const now = new Date();
    
    console.log(`🧹 [${now.toISOString()}] Clearing expired tickets...`);

    try {
        const expiredTickets = await prisma.ticket.findMany({
            where: {
                status: "PENDING",
                expiresAt: { lt: now }
            },
            select: { id: true, tierId: true, eventId: true }
        });

        if (expiredTickets.length === 0) {
            console.log("✅ No expired tickets found");
            return { success: true, expiredCount: 0 };
        }

        console.log(`📊 Found ${expiredTickets.length} expired tickets`);

        const tierCounts = new Map<string, number>();
        const eventCounts = new Map<string, number>();

        for (const ticket of expiredTickets) {
            tierCounts.set(ticket.tierId, (tierCounts.get(ticket.tierId) || 0) + 1);
            eventCounts.set(ticket.eventId, (eventCounts.get(ticket.eventId) || 0) + 1);
        }

        await prisma.$transaction(async (tx) => {
            await tx.ticket.updateMany({
                where: { id: { in: expiredTickets.map(t => t.id) } },
                data: { status: "EXPIRED" }
            });

            for (const [tierId, count] of tierCounts) {
                await tx.ticketTier.update({
                    where: { id: tierId },
                    data: { sold: { decrement: count } }
                });
            }

            for (const [eventId, count] of eventCounts) {
                await tx.event.update({
                    where: { id: eventId },
                    data: { ticketsSold: { decrement: count } }
                });
            }
        });

        console.log(`✅ Cleared ${expiredTickets.length} expired tickets`);
        
        return { 
            success: true, 
            expiredCount: expiredTickets.length,
            eventsAffected: Array.from(eventCounts.keys())
        };

    } catch (error) {
        console.error("❌ Failed:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

clearExpiredTickets()
    .then((result) => {
        console.log("Result:", result);
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });