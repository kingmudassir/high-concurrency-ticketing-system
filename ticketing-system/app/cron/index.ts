import "dotenv/config";
import cron from "node-cron";
import { cleanupExpiredTickets } from "./cleanupTickets";

// Runs every minute
cron.schedule("* * * * *", async () => {
    await cleanupExpiredTickets();
});