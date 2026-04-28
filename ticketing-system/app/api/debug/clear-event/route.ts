import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis/redis";

export async function GET() {
    const redis = await getRedisClient();
    
    if (!redis) {
        return NextResponse.json({ error: "Redis not connected" }, { status: 500 });
    }
    
    // Get all keys
    const keys = await redis.keys("*");
    const cleared = [];
    
    for (const key of keys) {
        await redis.del(key);
        cleared.push(key);
    }
    
    console.log(`🗑️ Cleared ${cleared.length} Redis keys:`, cleared);
    
    return NextResponse.json({ 
        success: true, 
        cleared: cleared.length,
        keys: cleared 
    });
}