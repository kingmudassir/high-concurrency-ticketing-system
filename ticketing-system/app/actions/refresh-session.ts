"use server"

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { generateRefreshTokens, signAccessToken } from "@/lib/cookies/auth-cookies";

export async function refreshSession() {
    try {
        const cookieStore = await cookies();
        const oldRefreshToken = cookieStore.get("refresh_token")?.value;

        if (!oldRefreshToken) {
            return { success: false as const, accessToken: null };
        }

        const activeSessions = await prisma.session.findMany({
            where: { expiresAt: { gt: new Date() } },
            include: { user: { select: { id: true, role: true } } },
            orderBy: { createdAt: 'desc' }
        });

        let currentSession = null;
        for (const s of activeSessions) {
            const isMatch = await compare(oldRefreshToken, s.refreshTokenHash);
            if (isMatch) { currentSession = s; break; }
        }

        if (!currentSession) {
            return { success: false as const, accessToken: null };
        }

        const { refreshToken, refreshTokenHash } = await generateRefreshTokens();

        const newSession = await prisma.$transaction(async (tx) => {
            await tx.session.delete({ where: { id: currentSession.id } });
            return tx.session.create({
                data: {
                    userId: currentSession.user.id,
                    refreshTokenHash,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                }
            });
        });

        const accessToken = signAccessToken({
            userId: currentSession.user.id,
            role: currentSession.user.role,
            sessionId: newSession.id
        });

        // Return tokens — let the caller set cookies
        return { success: true as const, accessToken, refreshToken };

    } catch (error) {
        console.error("Token Refresh Failed:", error);
        return { success: false as const, accessToken: null };
    }
}