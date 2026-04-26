import { Worker, Job } from "bullmq";
import { redisConnection, QUEUES, TicketReservationJob } from "./queue-config";
import { getPrisma } from "@/lib/db/prisma";

export const reservationWorker = new Worker<TicketReservationJob>(
    QUEUES.TICKET_RESERVATION,
    async (job: Job<TicketReservationJob>) => {
        const { userId, eventId, tierId, quantity, expiresInMinutes, reservationId, gstPercent, serviceFeePercent } = job.data;
        const prisma = getPrisma();

        console.log(`🎫 Processing reservation ${reservationId} for user ${userId} (${quantity} tickets)`);

        try {
            const result = await prisma.$transaction(async (tx) => {
                // 1. Fetch the tier
                const tier = await tx.ticketTier.findUnique({
                    where: { id: tierId },
                });

                if (!tier) {
                    throw new Error(`Tier ${tierId} not found`);
                }

                // 2. Calculate available tickets using only the DB as source of truth.
                //    `tier.sold` already includes all PENDING + CONFIRMED tickets because
                //    we increment it here when creating a PENDING reservation (see step 4).
                //    We do NOT add a separate pending count — that would double-count.
                const available = tier.capacity - tier.sold;

                if (available < quantity) {
                    throw new Error(`Insufficient tickets. Only ${available} available, requested ${quantity}`);
                }

                const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

                // 3. Create PENDING ticket rows
                await tx.ticket.createMany({
                    data: Array.from({ length: quantity }, () => ({
                        eventId,
                        tierId,
                        userId,
                        status: "PENDING",
                        pricePaid: tier.price,
                        gstPaid: Math.floor(tier.price * (gstPercent / 100)),
                        serviceFeePaid: Math.floor(tier.price * (serviceFeePercent / 100)),
                        expiresAt,
                    })),
                });

                // 4. Increment `sold` so subsequent capacity checks see these seats as taken.
                //    This is decremented by cleanup/expiry routes if the reservation lapses,
                //    and stays incremented (already at the right value) when tickets are CONFIRMED.
                await tx.ticketTier.update({
                    where: { id: tierId },
                    data: { sold: { increment: quantity } },
                });

                // 5. Also track on the event for display purposes
                await tx.event.update({
                    where: { id: eventId },
                    data: { ticketsSold: { increment: quantity } },
                });

                // 6. Retrieve the IDs of the tickets we just created
                const createdTickets = await tx.ticket.findMany({
                    where: {
                        userId,
                        eventId,
                        tierId,
                        status: "PENDING",
                        expiresAt: { gte: expiresAt }, // match the exact batch
                    },
                    select: { id: true },
                    orderBy: { createdAt: "desc" },
                    take: quantity,
                });

                if (createdTickets.length !== quantity) {
                    throw new Error(`Failed to retrieve created tickets. Got ${createdTickets.length} of ${quantity}`);
                }

                return {
                    success: true,
                    ticketIds: createdTickets.map(t => t.id),
                    expiresAt,
                };
            });

            console.log(`✅ Reservation ${reservationId} successful: ${result.ticketIds.length} tickets reserved`);
            return result;
        } catch (error) {
            console.error(`❌ Reservation ${reservationId} failed:`, error);
            throw error;
        }
    },
    {
        connection: redisConnection,
        concurrency: 5,
        lockDuration: 30000,
        removeOnComplete: {
            age: 3600,
            count: 1000,
        },
        removeOnFail: {
            age: 24 * 3600,
        },
    }
);

reservationWorker.on("completed", (job: Job<TicketReservationJob>) => {
    if (job) {
        console.log(`✅ Reservation ${job.data.reservationId} completed`);
    }
});

reservationWorker.on("failed", (job: Job<TicketReservationJob> | undefined, err: Error) => {
    if (job) {
        console.error(`❌ Reservation ${job.data.reservationId} failed:`, err.message);
    }
});

reservationWorker.on("error", (err) => {
    console.error("❌ Reservation worker error:", err);
});

reservationWorker.on("ready", () => {
    console.log("✅ Reservation worker is ready and processing jobs");
});

reservationWorker.on("stalled", (jobId) => {
    console.warn(`⚠️ Job ${jobId} has stalled`);
});