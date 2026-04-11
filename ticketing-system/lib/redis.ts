import { createClient } from "redis";

const globalForRedis = global as unknown as { 
  redisClient: any 
};

export async function getRedisClient() {
  // LOG 1: Prove the function was even called
  console.log("--- getRedisClient called ---");

  // 1. If it exists and is ready, use it.
  if (globalForRedis.redisClient?.isReady) {
    console.log("♻️  Using existing Redis connection");
    return globalForRedis.redisClient;
  }

  const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
  const isTls = redisUrl.startsWith("rediss://");

  const client = createClient({
    url: redisUrl,
    socket: {
      connectTimeout: 5000,
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
      ...(isTls ? { tls: true } : {})
    },
  });

  client.on("error", (err) => console.error("Redis Client Error:", err));

  try {
    console.log("🔌 Attempting new Redis connection...");
    await client.connect();
    
    // 2. CRITICAL: Store it in global so it persists across refreshes
    globalForRedis.redisClient = client;
    
    console.log("✅ New Redis Connection Established");
    return client;
  } catch (error) {
    console.error("❌ Redis Connection Failed:", error);
    return null;
  }
}