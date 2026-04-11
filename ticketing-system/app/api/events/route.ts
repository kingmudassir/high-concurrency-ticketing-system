import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;
let redisUnavailable = false;

export async function getRedisClient(): Promise<RedisClient | null> {
  if (redisUnavailable) return null;
  if (redisClient?.isReady) return redisClient;

  const client = createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
    socket: {
      connectTimeout: 2000,
      reconnectStrategy: false,
      tls: true,
    },
  });

  client.on("error", () => {});

  try {
    await client.connect();
    redisClient = client;
    return client;
  } catch {
    redisUnavailable = true;
    client.destroy();
    return null;
  }
}