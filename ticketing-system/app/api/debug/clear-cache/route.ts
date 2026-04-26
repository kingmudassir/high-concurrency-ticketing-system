import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis/redis";

export async function GET() {
    const redis = await getRedisClient();
    
    if (!redis) {
        return NextResponse.json({ error: "Redis not connected" }, { status: 500 });
    }
    
    // Clear all event caches
    const keys = await redis.keys("event:*");
    for (const key of keys) {
        await redis.del(key);
    }
    
    // Clear recent events cache
    await redis.del("events:recent:page1");
    
    console.log(`🗑️ Cleared ${keys.length} event caches`);
    
    return NextResponse.json({ 
        success: true, 
        cleared: keys.length,
        keys: keys 
    });
}