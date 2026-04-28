import { NextRequest, NextResponse } from "next/server";
import { ticketPurchaseQueue } from "@/lib/queue/queue-config";

export async function POST(req: NextRequest) {
    try {
        const { reservationId, ticketIds } = await req.json();

        const job = await ticketPurchaseQueue.add(
            `purchase-${reservationId}`,
            {
                reservationId,
                ticketIds,
            },
            {
                removeOnComplete: true,
                removeOnFail: false,
            }
        );

        return NextResponse.json({
            success: true,
            jobId: job.id,
        });
    } catch (error) {
        console.error("Purchase confirmation error:", error);
        return NextResponse.json(
            { error: "Failed to confirm purchase" },
            { status: 500 }
        );
    }
}