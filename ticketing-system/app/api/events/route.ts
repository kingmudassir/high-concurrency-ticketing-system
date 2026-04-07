import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "redis";

const CACHE_KEY = "events:all";
const CACHE_TTL_SECONDS = 30;

type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;
let redisUnavailable = false; // once failed, never try again this process lifetime

async function getRedisClient(): Promise<RedisClient | null> {
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

  // Suppress the error event so it doesn't crash/spam
  client.on("error", () => {});

  try {
    await client.connect();
    redisClient = client;
    return client;
  } catch {
    redisUnavailable = true;
    client.destroy(); // fully tear down, no lingering listeners
    return null;
  }
}

export async function GET() {
  const redis = await getRedisClient();

  if (redis) {
    try {
      const cached = await redis.get(CACHE_KEY);
      if (cached) {
        return NextResponse.json(JSON.parse(cached), {
          headers: { "X-Cache": "HIT" },
        });
      }
    } catch {
      // cache read failed, fall through to DB
    }
  }

  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        totalTickets: true,
        ticketsSold: true,
        startDate: true,
      },
    });

    const payload = events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      price: e.price,
      startDate: e.startDate.toISOString(),
      totalTickets: e.totalTickets,
      availableTickets: Math.max(0, e.totalTickets - e.ticketsSold),
    }));

    if (redis) {
      redis.setEx(CACHE_KEY, CACHE_TTL_SECONDS, JSON.stringify(payload)).catch(() => {});
    }

    return NextResponse.json(payload, { headers: { "X-Cache": "MISS" } });
  } catch (err) {
    console.error("[Events API] Database error:", err);
    return NextResponse.json({ error: "Failed to load events." }, { status: 500 });
  }
}