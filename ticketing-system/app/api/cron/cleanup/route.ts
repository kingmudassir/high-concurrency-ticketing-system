import { NextResponse } from "next/server";
import { runCleanup } from "@/lib/cron/cleanup-expired-tickets";

export async function GET() {
    try {
        const result = await runCleanup();
        return NextResponse.json({
            ...result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Cleanup failed:", error);
        return NextResponse.json(
            { error: "Cleanup failed", details: String(error) },
            { status: 500 }
        );
    }
}