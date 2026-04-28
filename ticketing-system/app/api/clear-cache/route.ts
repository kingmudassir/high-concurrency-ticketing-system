// Create a temporary file: app/api/clear-cache/route.ts
import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis/redis";

export async function GET() {
    try {
        const redis = await getRedisClient();
        
        // Clear recent events cache
        await redis.del("events:recent:page1");
        
        // Clear all event caches
        const keys = await redis.keys("event:*");
        for (const key of keys) {
            await redis.del(key);
        }
        
        // Clear any other event-related caches
        const eventKeys = await redis.keys("*cmobk6iaj000160vj1kk9w546*");
        for (const key of eventKeys) {
            await redis.del(key);
        }
        
        return NextResponse.json({ 
            success: true, 
            cleared: [...keys, ...eventKeys, "events:recent:page1"] 
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}