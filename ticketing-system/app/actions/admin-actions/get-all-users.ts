"use server";

import { getPrisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/app/actions/getuser/getUser";
import { startOfMonth, subMonths } from "date-fns";

export async function getAllUsers() {
    try {
        const { success, user } = await getCurrentUser();
        
        if (!success || user?.role !== "ADMIN") {
            return { success: false, message: "Unauthorized." };
        }

        const prisma = getPrisma();
        const now = new Date();
        const currentMonthStart = startOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));

        // 1. Fetch all verified users
        const usersData = await prisma.user.findMany({
            where: {
                role: "USER",
                emailVerified: { not: null }
            },
            select: {
                id: true,
                username: true,
                email: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        // 2. Calculate Stats for the StatCard
        const totalCount = usersData.length;
        
        const currentMonthUsers = usersData.filter(u => u.createdAt >= currentMonthStart).length;
        const lastMonthUsers = usersData.filter(u => u.createdAt >= lastMonthStart && u.createdAt < currentMonthStart).length;

        // Calculate Trend Percentage
        let trendValue = "0%";
        let trend: "up" | "down" = "up";

        if (lastMonthUsers === 0) {
            trendValue = currentMonthUsers > 0 ? "+100%" : "0%";
            trend = "up";
        } else {
            const percentageChange = ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
            trend = percentageChange >= 0 ? "up" : "down";
            trendValue = `${percentageChange > 0 ? "+" : ""}${percentageChange.toFixed(1)}%`;
        }

        // 3. Format date for the table
        const users = usersData.map((u) => {
            const date = u.createdAt;
            const day = date.getDate();
            const month = date.toLocaleString('en-US', { month: 'long' });
            const year = date.getFullYear();

            const suffix = (d: number) => {
                if (d > 3 && d < 21) return 'th';
                switch (d % 10) {
                    case 1: return "st";
                    case 2: return "nd";
                    case 3: return "rd";
                    default: return "th";
                }
            };

            return {
                ...u,
                joinedAt: `${day}${suffix(day)} ${month}, ${year}`
            };
        });

        return {
            success: true,
            users,
            stats: {
                totalCount: totalCount.toLocaleString(),
                trend,
                trendValue
            }
        };

    } catch (error) {
        console.error("[getAllUsers] Failed:", error);
        return { success: false, message: "Server error." };
    }
}