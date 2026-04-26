import { PrismaClient } from "@prisma/client";

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
            return;
        }

        console.log(`📊 Found ${expiredTickets.length} expired tickets`);

        const tierCounts = new Map();
        const eventCounts = new Map();

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
    } catch (error) {
        console.error("❌ Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

clearExpiredTickets();