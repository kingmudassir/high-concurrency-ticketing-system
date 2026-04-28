// lib/queue/cleanup-worker.ts
import { Worker } from "bullmq";
import { redisConnection, QUEUES, cleanupQueue } from "./queue-config";
import { getPrisma } from "@/lib/db/prisma";
import { getRedisClient } from "@/lib/redis/redis";

export async function scheduleCleanup() {
    try {
        const repeatableJobs = await cleanupQueue.getRepeatableJobs();
        for (const job of repeatableJobs) {
            await cleanupQueue.removeRepeatableByKey(job.key);
        }
        
        await cleanupQueue.add(
            'scheduled-cleanup',
            {},
            {
                repeat: { pattern: '*/30 * * * * *' }, // Every 30 seconds
                removeOnComplete: true,
                removeOnFail: false,
            }
        );
        console.log('⏰ Scheduled cleanup to run every 30 seconds');
    } catch (error) {
        console.error('Failed to schedule cleanup:', error);
    }
}

export const cleanupWorker = new Worker(
    QUEUES.RESERVATION_CLEANUP,
    async () => {
        const prisma = getPrisma();
        const redis = await getRedisClient();
        console.log("🧹 Running reservation cleanup...");

        try {
            // 1. Find ALL expired tickets (both PENDING and EXPIRED status)
            const expiredTickets = await prisma.ticket.findMany({
                where: {
                    OR: [
                        { status: "PENDING", expiresAt: { lt: new Date() } },
                        { status: "EXPIRED" } // Also get already expired tickets
                    ]
                },
                select: { eventId: true, status: true },
            });

            // Get unique event IDs
            const eventIds = [...new Set(expiredTickets.map(t => t.eventId))];
            
            console.log(`📊 Found ${expiredTickets.length} expired tickets across ${eventIds.length} events`);

            // Update newly expired PENDING tickets
            const newlyExpired = await prisma.ticket.findMany({
                where: {
                    status: "PENDING",
                    expiresAt: { lt: new Date() },
                },
                select: { id: true, tierId: true, eventId: true },
            });

            if (newlyExpired.length > 0) {
                console.log(`📊 Processing ${newlyExpired.length} newly expired tickets`);
                
                const tierCounts = new Map<string, number>();
                const eventCounts = new Map<string, number>();

                for (const ticket of newlyExpired) {
                    tierCounts.set(ticket.tierId, (tierCounts.get(ticket.tierId) || 0) + 1);
                    eventCounts.set(ticket.eventId, (eventCounts.get(ticket.eventId) || 0) + 1);
                }

                await prisma.$transaction(async (tx) => {
                    await tx.ticket.updateMany({
                        where: { id: { in: newlyExpired.map(t => t.id) } },
                        data: { status: "EXPIRED" },
                    });

                    for (const [tierId, count] of tierCounts) {
                        await tx.ticketTier.update({
                            where: { id: tierId },
                            data: { sold: { decrement: count } },
                        });
                    }

                    for (const [eventId, count] of eventCounts) {
                        await tx.event.update({
                            where: { id: eventId },
                            data: { ticketsSold: { decrement: count } },
                        });
                    }
                });
            }

            // ALWAYS clear Redis cache for ALL events with expired tickets
            if (eventIds.length > 0 && redis) {
                console.log(`🗑️ Clearing Redis cache for ${eventIds.length} events...`);
                for (const eventId of eventIds) {
                    await redis.del(`event:${eventId}`);
                    console.log(`   Cleared: event:${eventId}`);
                }
                await redis.del("events:recent:page1");
                console.log(`   Cleared: events:recent:page1`);
            } else if (eventIds.length > 0) {
                console.log("⚠️ Redis not available, cache not cleared");
            } else {
                console.log("🧹 No expired tickets found in database");
            }

            return { 
                expiredCount: expiredTickets.length,
                newlyExpiredCount: newlyExpired.length,
                eventsCleared: eventIds.length 
            };
        } catch (error) {
            console.error("❌ Cleanup worker error:", error);
            throw error;
        }
    },
    {
        connection: redisConnection,
        concurrency: 1,
        lockDuration: 60000,
    }
);

scheduleCleanup().catch(console.error);

cleanupWorker.on("completed", (job) => {
    console.log(`✅ Cleanup job ${job?.id} completed`);
});

cleanupWorker.on("failed", (job, err) => {
    console.error(`❌ Cleanup job ${job?.id} failed:`, err);
});

cleanupWorker.on("error", (err) => {
    console.error("Cleanup worker error:", err);
});

cleanupWorker.on("ready", () => {
    console.log("✅ Cleanup worker is ready");
});