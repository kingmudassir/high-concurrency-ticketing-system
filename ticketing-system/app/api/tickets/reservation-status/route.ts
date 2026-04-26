// app/api/tickets/reservation-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ticketReservationQueue } from "@/lib/queue";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = decodeJwt(accessToken) as { userId: string };
    const jobId = req.nextUrl.searchParams.get("jobId");
    
    if (!jobId) {
        return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const job = await ticketReservationQueue.getJob(jobId);
    
    if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const state = await job.getState();
    const result = job.returnvalue;
    const failedReason = job.failedReason;

    // Parse result if it's a string, otherwise use as is
    let parsedResult = null;
    if (result) {
        try {
            parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
        } catch (e) {
            console.error("Failed to parse result:", e);
            parsedResult = result;
        }
    }

    // Also get queue position if waiting
    let position: number | undefined;
    if (state === "waiting") {
        const waitingJobs = await ticketReservationQueue.getWaiting();
        const index = waitingJobs.findIndex(j => j.id === jobId);
        position = index >= 0 ? index + 1 : undefined;
    }

    return NextResponse.json({
        jobId,
        state,
        result: parsedResult,
        failedReason,
        position,
    });
}