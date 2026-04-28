// lib/cron/schedule.ts
import { runCleanup } from "./cleanup-expired-tickets";

// For Next.js App Router, we need to set up cron jobs differently
// This file can be used with a separate worker process or Vercel Cron Jobs

let isRunning = false;

export async function scheduledCleanup() {
    // Prevent multiple simultaneous runs
    if (isRunning) {
        console.log("⏳ Cleanup already running, skipping...");
        return;
    }

    isRunning = true;
    
    try {
        console.log(`🚀 Starting scheduled cleanup at ${new Date().toISOString()}`);
        await runCleanup();
        console.log(`✅ Scheduled cleanup completed at ${new Date().toISOString()}`);
    } catch (error) {
        console.error("❌ Scheduled cleanup failed:", error);
    } finally {
        isRunning = false;
    }
}

// For local development - run every hour
// This will be called from a separate process
if (process.env.NODE_ENV === "development" && process.env.RUN_CRON === "true") {
    console.log("🕐 Setting up cron job to run every hour");
    
    // Run every hour
    setInterval(async () => {
        await scheduledCleanup();
    }, 60 * 60 * 1000);
    
    // Run first cleanup after 1 minute
    setTimeout(async () => {
        await scheduledCleanup();
    }, 60 * 1000);
}