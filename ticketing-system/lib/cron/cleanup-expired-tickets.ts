import { getPrisma } from "@/lib/db/prisma";
import { getRedisClient } from "@/lib/redis/redis";

export async function runCleanup() {
    const prisma = getPrisma();
    const redis = await getRedisClient();
    const now = new Date();
    
    console.log("🧹 Running cleanup...");
    
    // ─── 1. Find expired PENDING tickets ─────────────────────────────────
    const expiredTickets = await prisma.ticket.findMany({
        where: {
            status: "PENDING",
            expiresAt: { lt: now }
        },
        select: { 
            id: true, 
            tierId: true, 
            eventId: true 
        }
    });
    
    console.log(`📊 Found ${expiredTickets.length} expired pending tickets`);
    
    if (expiredTickets.length > 0) {
        // Group by tier and event for counter updates
        const tierCounts = new Map<string, number>();
        const eventCounts = new Map<string, number>();
        
        for (const ticket of expiredTickets) {
            tierCounts.set(ticket.tierId, (tierCounts.get(ticket.tierId) || 0) + 1);
            eventCounts.set(ticket.eventId, (eventCounts.get(ticket.eventId) || 0) + 1);
        }
        
        await prisma.$transaction(async (tx) => {
            // Update tickets to EXPIRED
            await tx.ticket.updateMany({
                where: { id: { in: expiredTickets.map(t => t.id) } },
                data: { status: "EXPIRED" }
            });
            
            // Restore tier sold counts
            for (const [tierId, count] of tierCounts) {
                await tx.ticketTier.update({
                    where: { id: tierId },
                    data: { sold: { decrement: count } }
                });
            }
            
            // Restore event ticketsSold counts
            for (const [eventId, count] of eventCounts) {
                await tx.event.update({
                    where: { id: eventId },
                    data: { ticketsSold: { decrement: count } }
                });
            }
        });
        
        console.log(`✅ Expired ${expiredTickets.length} pending tickets`);
    }
    
    // ─── 2. Delete CANCELLED tickets (no updatedAt field, use createdAt) ───
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const cancelledTickets = await prisma.ticket.findMany({
        where: {
            status: "CANCELLED",
            createdAt: { lt: sevenDaysAgo }  // Use createdAt instead of updatedAt
        },
        select: { id: true, eventId: true }
    });
    
    console.log(`📊 Found ${cancelledTickets.length} old cancelled tickets to delete`);
    
    if (cancelledTickets.length > 0) {
        await prisma.ticket.deleteMany({
            where: {
                id: { in: cancelledTickets.map(t => t.id) },
                status: "CANCELLED"
            }
        });
        console.log(`🗑️ Deleted ${cancelledTickets.length} old cancelled tickets`);
    }
    
    // ─── 3. Clear Redis cache for affected events ─────────────────────────
    const affectedEventIds = new Set<string>();
    for (const ticket of expiredTickets) {
        affectedEventIds.add(ticket.eventId);
    }
    for (const ticket of cancelledTickets) {
        affectedEventIds.add(ticket.eventId);
    }
    
    if (affectedEventIds.size > 0) {
        for (const eventId of affectedEventIds) {
            await redis?.del(`event:${eventId}`);
            console.log(`🗑️ Cleared Redis cache for event ${eventId}`);
        }
        await redis?.del("events:recent:page1");
    }

    
    return { 
        success: true, 
        expiredCount: expiredTickets.length,
        deletedCount: cancelledTickets.length,
        eventsAffected: Array.from(affectedEventIds)
    };
}