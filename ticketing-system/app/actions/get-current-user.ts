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

        // 1. Verify Access Token
        let decoded: { userId: string; sessionId: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: string; sessionId: string };
        } catch (err: any) {
            // If the token is invalid or expired at this stage, the middleware failed 
            // to catch it. We return null to stay safe.
            return { success: false, user: null };
        }

        // 2. Fetch User & Validate Session
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
            status: true,
            tokens: true, 
            sessions: {
                where: { id: sessionId, expiresAt: { gt: new Date() } },
                select: { id: true }
            }
        }
    });

    // Check if user exists, is active, and the session is still valid in the DB
    if (!user || user.status !== "ACTIVE" || user.sessions.length === 0) {
        return { success: false, user: null };
    }

    // Clean up the response
    const { sessions, ...userData } = user;
    return { success: true, user: userData };
}