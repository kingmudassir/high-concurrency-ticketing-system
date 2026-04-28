// lib/queue/purchase-worker.ts
import { Worker, Job } from "bullmq";
import { redisConnection, QUEUES, TicketPurchaseJob } from "./queue-config";
import { getPrisma } from "@/lib/db/prisma";

export const purchaseWorker = new Worker<TicketPurchaseJob>(
    QUEUES.TICKET_PURCHASE,
    async (job: Job<TicketPurchaseJob>) => {
        const { reservationId, ticketIds } = job.data;
        const prisma = getPrisma();

        console.log(`💳 Processing purchase for reservation ${reservationId} (${ticketIds.length} tickets)`);

        try {
            const result = await prisma.$transaction(async (tx) => {
                // Get tickets to verify they're still pending
                const tickets = await tx.ticket.findMany({
                    where: {
                        id: { in: ticketIds },
                        status: "PENDING",
                        expiresAt: { gt: new Date() },
                    },
                    include: {
                        tier: true,
                    },
                });

                if (tickets.length !== ticketIds.length) {
                    throw new Error(`Some tickets have expired or been purchased. Expected ${ticketIds.length}, got ${tickets.length}`);
                }

                // Update tickets to CONFIRMED
                await tx.ticket.updateMany({
                    where: { id: { in: ticketIds } },
                    data: { status: "CONFIRMED" },
                });

                // Update sold count on ticket tier
                const tierId = tickets[0].tierId;
                await tx.ticketTier.update({
                    where: { id: tierId },
                    data: { sold: { increment: tickets.length } },
                });

                // Update event tickets sold
                await tx.event.update({
                    where: { id: tickets[0].eventId },
                    data: { ticketsSold: { increment: tickets.length } },
                });

                return { 
                    success: true, 
                    confirmedTickets: ticketIds.length 
                };
            });

            console.log(`✅ Purchase ${reservationId} completed: ${result.confirmedTickets} tickets confirmed`);
            return result;
        } catch (error) {
            console.error(`❌ Purchase ${reservationId} failed:`, error);
            throw error;
        }
    },
    {
        connection: redisConnection,
        concurrency: 10,
        lockDuration: 30000,
        removeOnComplete: {
            age: 3600,
            count: 1000,
        },
    }
);

purchaseWorker.on("completed", (job: Job<TicketPurchaseJob>) => {
    console.log(`✅ Purchase job ${job?.id} completed for reservation ${job?.data.reservationId}`);
});

purchaseWorker.on("failed", (job: Job<TicketPurchaseJob> | undefined, err: Error) => {
    if (job) {
        console.error(`❌ Purchase job failed for reservation ${job.data.reservationId}:`, err.message);
    }
});

purchaseWorker.on("error", (err) => {
    console.error("Purchase worker error:", err);
});

purchaseWorker.on("ready", () => {
    console.log("✅ Purchase worker is ready");
});