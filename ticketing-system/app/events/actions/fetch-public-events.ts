"use server";

import { getPrisma } from "@/lib/db/prisma";
import { getRedisClient } from "@/lib/redis/redis";

interface FetchPublicEventsParams {
    page?: number;
    limit?: number;
    query?: string;
    location?: string;
    category?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    dateFilter?: string;
}

function generateCacheKey(params: FetchPublicEventsParams): string | null {
    const { page = 1, limit = 20, query, location, category, sort, minPrice, maxPrice, dateFilter } = params;
    
    const isDefaultQuery = !query && !location && (!category || category === 'all') && (!sort || sort === 'recent') && !minPrice && !maxPrice && (!dateFilter || dateFilter === 'any');
    
    if (isDefaultQuery && page === 1 && limit === 20) {
        return "events:recent:page1";
    }
    
    return null;
}

export async function fetchPublicEvents({
    page = 1,
    limit = 20,
    query,
    location,
    category,
    sort = "recent",
    minPrice,
    maxPrice,
    dateFilter
}: FetchPublicEventsParams = {}) {
    const prisma = getPrisma();
    const skip = (page - 1) * limit;
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Check Redis cache first
    const cacheKey = generateCacheKey({ page, limit, query, location, category, sort, minPrice, maxPrice, dateFilter });
    let cachedData = null;
    
    if (cacheKey) {
        try {
            const redis = await getRedisClient();
            if (redis) {
                const cached = await redis.get(cacheKey);
                if (cached) {
                    console.log("📦 Redis cache HIT for:", cacheKey);
                    cachedData = JSON.parse(cached);
                    return cachedData;
                }
                console.log("📦 Redis cache MISS for:", cacheKey);
            }
        } catch (error) {
            console.error("Redis cache error:", error);
        }
    }

    // ─── Build the WHERE clause - Start with active events ─────────────────
    const andConditions: any[] = [
        {
            OR: [
                { startDate: { gt: now } },
                { 
                    AND: [
                        { startDate: { lte: now } },
                        { endDate: { gt: now } }
                    ]
                },
                {
                    endDate: null,
                    startDate: { gte: todayStart }
                }
            ]
        }
    ];

    // ─── Search filter (title, location, city) ─────────────────────────────
    if (query) {
        andConditions.push({
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { location: { contains: query, mode: 'insensitive' } },
                { city: { contains: query, mode: 'insensitive' } }
            ]
        });
    }

    // ─── Location filter ───────────────────────────────────────────────────
    if (location) {
        andConditions.push({
            OR: [
                { city: { contains: location, mode: 'insensitive' } },
                { location: { contains: location, mode: 'insensitive' } }
            ]
        });
    }

    // ─── Date filter ───────────────────────────────────────────────────────
    if (dateFilter && dateFilter !== 'any') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (dateFilter === 'today') {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            andConditions.push({
                startDate: {
                    gte: today,
                    lt: tomorrow
                }
            });
        } else if (dateFilter === 'weekend') {
            const weekendStart = new Date(today);
            const dayOfWeek = today.getDay();
            const daysUntilSaturday = (6 - dayOfWeek) % 7;
            weekendStart.setDate(today.getDate() + daysUntilSaturday);
            const weekendEnd = new Date(weekendStart);
            weekendEnd.setDate(weekendStart.getDate() + 2);
            andConditions.push({
                startDate: {
                    gte: weekendStart,
                    lt: weekendEnd
                }
            });
        } else if (dateFilter === 'month') {
            const monthEnd = new Date(today);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            andConditions.push({
                startDate: {
                    lte: monthEnd
                }
            });
        }
    }

    // ─── Build the final where clause ──────────────────────────────────────
    const where: any = {
        status: "PUBLISHED",
        AND: andConditions
    };

    // ─── Category filter ───────────────────────────────────────────────────
    if (category && category !== 'all') {
        where.category = category;
    }

    // ─── Price filter ─────────────────────────────────────────────────────
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.ticketTiers = {
            some: {
                ...(minPrice !== undefined && { price: { gte: minPrice } }),
                ...(maxPrice !== undefined && { price: { lte: maxPrice } })
            }
        };
    }

    // ─── Build orderBy ─────────────────────────────────────────────────────
    let orderBy: any = { createdAt: 'desc' };
    
    if (sort === 'trending' || sort === 'popular') {
        orderBy = { ticketsSold: 'desc' };
    } else if (sort === 'date') {
        orderBy = { startDate: 'asc' };
    } else if (sort === 'recent') {
        orderBy = { createdAt: 'desc' };
    } else if (sort === 'price-low') {
        orderBy = { startDate: 'asc' };
    } else if (sort === 'price-high') {
        orderBy = { startDate: 'asc' };
    }

    try {
        const totalCount = await prisma.event.count({ where });
        
        const events = await prisma.event.findMany({
            where,
            include: {
                ticketTiers: {
                    orderBy: { price: 'asc' },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        capacity: true,
                        sold: true,
                    }
                }
            },
            orderBy,
            skip,
            take: limit
        });

        const formattedEvents = events.map(event => ({
            id: event.id,
            title: event.title,
            subtitle: event.subtitle,
            description: event.description,
            imageUrl: event.imageUrl,
            category: event.category,
            tags: event.tags,
            location: event.location,
            city: event.city,
            startDate: event.startDate,
            endDate: event.endDate,
            totalCapacity: event.totalTickets,
            ticketsSold: event.ticketsSold,
            ticketTiers: event.ticketTiers.map(tier => ({
                id: tier.id,
                name: tier.name,
                price: tier.price,
                capacity: tier.capacity,
                sold: tier.sold,
            })),
        }));

        const result = {
            success: true,
            data: formattedEvents,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit,
                hasNextPage: page * limit < totalCount,
                hasPrevPage: page > 1
            }
        };

        // Store in Redis cache
        if (cacheKey && formattedEvents.length > 0) {
            try {
                const redis = await getRedisClient();
                if (redis) {
                    await redis.setEx(cacheKey, 300, JSON.stringify(result));
                    console.log("💾 Redis cache STORED for:", cacheKey);
                }
            } catch (error) {
                console.error("Redis cache store error:", error);
            }
        }

        return result;

    } catch (error) {
        console.error("FETCH_PUBLIC_EVENTS_ERROR:", error);
        return { success: false, error: "FAILED TO FETCH EVENT DATA" };
    }
}