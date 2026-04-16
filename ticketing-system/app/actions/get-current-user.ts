"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const ACCESS_TOKEN_COOKIE = "access_token";
const JWT_SECRET = process.env.JWT_SECRET!;

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

        if (!token) {
            return { success: false, user: null };
        }

        let decoded: { userId: string; sessionId: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: string; sessionId: string };
        } catch {
            return { success: false, user: null };
        }

        return await fetchUserAndSession(decoded.userId, decoded.sessionId);

    } catch (error) {
        console.error("[getCurrentUser] Auth check failed:", error);
        return { success: false, user: null };
    }
}

async function fetchUserAndSession(userId: string, sessionId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            sessions: {
                where: { id: sessionId, expiresAt: { gt: new Date() } },
                select: { id: true },
            },
        },
    });

    if (!user || user.status !== "ACTIVE" || user.sessions.length === 0) {
        return { success: false, user: null };
    }

    const { sessions, ...userData } = user;
    return { success: true, user: userData };
}