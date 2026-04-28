// app/api/tickets/reserve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ticketReservationQueue, reservationQueueEvents } from "@/lib/queue/queue-config";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = decodeJwt(accessToken) as { userId: string; role?: string };
        const { eventId, tierId, quantity, gstPercent, serviceFeePercent } = await req.json();

        if (quantity < 1 || quantity > 10) {
            return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
        }

        const reservationId = randomUUID();
        const expiresInMinutes = 10;

        // 🔑 FIX: Use underscores instead of colons
        const jobId = `${eventId}_${tierId}_${Date.now()}_${reservationId}`;

        const job = await ticketReservationQueue.add(
            `reservation-${reservationId}`,
            {
                userId: payload.userId,
                eventId,
                tierId,
                quantity,
                gstPercent,
                serviceFeePercent,
                expiresInMinutes,
                reservationId,
            },
            {
                jobId, // Now using underscores
                removeOnFail: false,
            }
        );

        // Wait for the worker to finish (up to 30 s)
        const result = await job.waitUntilFinished(reservationQueueEvents, 30000);
        const ticketResult = result as { ticketIds: string[]; expiresAt: Date };

        return NextResponse.json({
            success: true,
            reservationId,
            ticketIds: ticketResult.ticketIds,
            expiresAt: ticketResult.expiresAt,
        });
    } catch (error: any) {
        console.error("Reservation error:", error);

        if (error.message?.includes("Insufficient tickets")) {
            return NextResponse.json({ error: error.message }, { status: 409 });
        }
        if (error.name === "JobTimeoutError") {
            return NextResponse.json(
                { error: "Reservation is taking too long. Please try again." },
                { status: 504 }
            );
        }
        return NextResponse.json({ error: "Failed to reserve tickets" }, { status: 500 });
    }
}