"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateRefreshTokens, signAccessToken } from "@/lib/cookies/auth-cookies";

const REFRESH_SECRET = process.env.REFRESH_SECRET!;

const FAILURE = { success: false as const, accessToken: null, refreshToken: null };

export async function refreshSession() {
    try {
        const cookieStore = await cookies();
        const oldRefreshToken = cookieStore.get("refresh_token")?.value;

        if (!oldRefreshToken) {
            return FAILURE;
        }

        // Gate 1: JWT signature + expiry
        let decoded: { userId: string; sessionId: string };
        try {
            decoded = jwt.verify(oldRefreshToken, REFRESH_SECRET) as { userId: string; sessionId: string };
        } catch {
            return FAILURE;
        }

        // Gate 2: Session must exist in DB
        const currentSession = await prisma.session.findUnique({
            where: { id: decoded.sessionId },
            include: { user: { select: { id: true, role: true } } },
        });

        if (!currentSession) {
            return FAILURE;
        }

        // Gate 3: Session row must not be expired
        if (currentSession.expiresAt < new Date()) {
            return FAILURE;
        }

        // Gate 4: Token must match the stored hash (guards against token theft + rotation)
        const isMatch = await compare(oldRefreshToken, currentSession.refreshTokenHash);
        if (!isMatch) {
            // A hash mismatch after a valid JWT signature means a stolen token was used
            // after rotation. Invalidate the entire session immediately.
            await prisma.session.delete({ where: { id: currentSession.id } });
            return FAILURE;
        }

        // Rotation: issue new refresh token, update hash + expiry in-place
        const { refreshToken, refreshTokenHash } = await generateRefreshTokens(
            currentSession.user.id,
            currentSession.id
        );

        const updatedSession = await prisma.session.update({
            where: { id: currentSession.id },
            data: {
                refreshTokenHash,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        const accessToken = signAccessToken({
            userId: currentSession.user.id,
            role: currentSession.user.role,
            sessionId: updatedSession.id,
        });

        return { success: true as const, accessToken, refreshToken };

    } catch (error) {
        console.error("[refreshSession] Token refresh failed:", error);
        return FAILURE;
    }
}