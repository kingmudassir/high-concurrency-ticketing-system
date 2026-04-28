// scripts/run-cleanup.ts
import { config } from "dotenv";
import { runCleanup } from "./cleanup-expired-tickets";

// Load environment variables
config({ path: ".env.local" });

async function main() {
    console.log("🧹 Running ticket cleanup script...");
    
    try {
        const result = await runCleanup();
        console.log("✨ Cleanup completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("💥 Cleanup failed:", error);
        process.exit(1);
    }
}

main();