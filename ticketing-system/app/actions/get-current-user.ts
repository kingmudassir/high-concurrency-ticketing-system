"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { refreshSession } from "./refresh-session";
import { setAuthCookies } from "@/lib/cookies/auth-cookies";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const JWT_SECRET = process.env.JWT_SECRET!;

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        let token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
        const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

        // 1. No access token but refresh token exists — silent refresh
        if (!token && refreshToken) {
            const refresh = await refreshSession();
            if (refresh.success && refresh.accessToken) {
                // getCurrent user IS a server action, so it CAN write cookies
                await setAuthCookies(refresh.accessToken, refresh.refreshToken!);
                token = refresh.accessToken;
            }
        }

        if (!token) return { success: false, user: null };

        // 2. Verify access token
        let decoded: { userId: string; sessionId: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: string; sessionId: string };
        } catch (err) {
            // 3. Token expired — one refresh attempt
            if (refreshToken) {
                const refresh = await refreshSession();
                if (refresh.success && refresh.accessToken) {
                    await setAuthCookies(refresh.accessToken, refresh.refreshToken!);
                    const newDecoded = jwt.verify(refresh.accessToken, JWT_SECRET) as { userId: string; sessionId: string };
                    return await fetchUserAndSession(newDecoded.userId, newDecoded.sessionId);
                }
            }
            return { success: false, user: null };
        }

        return await fetchUserAndSession(decoded.userId, decoded.sessionId);

    } catch (error) {
        console.error("Auth Check Error:", error);
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
            tokens: true,
            status: true,
            sessions: {
                where: { id: sessionId },
                select: { id: true }
            }
        }
    });

    if (!user || user.sessions.length === 0 || user.status !== "ACTIVE") {
        return { success: false, user: null };
    }

    const { sessions, ...userData } = user;
    return { success: true, user: userData };
}