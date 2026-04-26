// lib/queue/queue-config.ts
import { Queue, QueueEvents } from "bullmq";
import Redis from "ioredis";

export const redisConnection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
});

export const QUEUES = {
    TICKET_RESERVATION: "ticket-reservation",
    TICKET_PURCHASE: "ticket-purchase",
    RESERVATION_CLEANUP: "reservation-cleanup",
} as const;

// ─── Job type interfaces ──────────────────────────────────────────────────────

export interface TicketReservationJob {
    userId: string;
    eventId: string;
    tierId: string;
    quantity: number;
    gstPercent: number;
    serviceFeePercent: number;
    expiresInMinutes: number;
    reservationId: string;
}

export interface TicketPurchaseJob {
    reservationId: string;
    ticketIds: string[];
}

// ─── Queues ───────────────────────────────────────────────────────────────────

export const ticketReservationQueue = new Queue<TicketReservationJob>(
    QUEUES.TICKET_RESERVATION,
    {
        connection: redisConnection,
        defaultJobOptions: {
            // IMPORTANT: do NOT use removeOnComplete: true here.
            // Jobs must survive long enough for checkReservationStatus to read
            // the returnvalue. Use a short age-based TTL instead.
            removeOnComplete: { age: 120, count: 5000 }, // keep for 2 minutes
            removeOnFail: { age: 24 * 3600 },
        },
    }
);

export const ticketPurchaseQueue = new Queue<TicketPurchaseJob>(
    QUEUES.TICKET_PURCHASE,
    {
        connection: redisConnection,
        defaultJobOptions: {
            removeOnComplete: { age: 3600, count: 1000 },
            removeOnFail: { age: 24 * 3600 },
        },
    }
);

export const cleanupQueue = new Queue(
    QUEUES.RESERVATION_CLEANUP,
    {
        connection: redisConnection,
        defaultJobOptions: {
            removeOnComplete: { age: 3600, count: 100 },
            removeOnFail: false,
        },
    }
);

// ─── Queue Events (needed for waitUntilFinished / event listeners) ────────────

export const reservationQueueEvents = new QueueEvents(QUEUES.TICKET_RESERVATION, {
    connection: redisConnection,
});

export const purchaseQueueEvents = new QueueEvents(QUEUES.TICKET_PURCHASE, {
    connection: redisConnection,
});

export const cleanupQueueEvents = new QueueEvents(QUEUES.RESERVATION_CLEANUP, {
    connection: redisConnection,
});