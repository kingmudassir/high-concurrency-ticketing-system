"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateRefreshTokens, signAccessToken } from "@/lib/cookies/auth-cookies";

const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export async function refreshSession() {
    try {
        const cookieStore = await cookies();
        const oldRefreshToken = cookieStore.get("refresh_token")?.value;

        if (!oldRefreshToken) {
            return { success: false as const, accessToken: null };
        }

        // 1. Decode the token to get the direct database pointers
        let decoded: { userId: string; sessionId: string };
        // Add these logs inside refreshSession try block:

        // Gate 1: Decode
        try {
            decoded = jwt.verify(oldRefreshToken, REFRESH_SECRET) as any;
        } catch (err) {
            console.log("❌ Gate 1: JWT Verify Failed (Secret mismatch or Token Expired)");
            return { success: false, accessToken: null };
        }

        // Gate 2: Database Lookup
        const currentSession = await prisma.session.findUnique({
            where: { id: decoded.sessionId },
            include: { user: { select: { id: true, role: true } } }
        });
        if (!currentSession) {
            console.log("❌ Gate 2: Session not found in DB for ID:", decoded.sessionId);
            return { success: false, accessToken: null };
        }

        // Gate 3: Expiry
        if (currentSession.expiresAt < new Date()) {
            console.log("❌ Gate 3: Session row expired in DB");
            return { success: false, accessToken: null };
        }

        // Gate 4: Bcrypt Compare
        const isMatch = await compare(oldRefreshToken, currentSession.refreshTokenHash);
        if (!isMatch) {
            console.log("❌ Gate 4: Bcrypt Hash Mismatch. DB Hash doesn't match this token.");
            return { success: false, accessToken: null };
        }

        // 5. Rotation: Generate new tokens using the identifiers
        const { refreshToken, refreshTokenHash } = await generateRefreshTokens(
            currentSession.user.id, 
            currentSession.id
        );

        // Update the existing session record with the new hash and fresh expiry
        const newSession = await prisma.session.update({
            where: { id: currentSession.id },
            data: {
                refreshTokenHash,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
        });

        const accessToken = signAccessToken({
            userId: currentSession.user.id,
            role: currentSession.user.role,
            sessionId: newSession.id
        });

        return { success: true as const, accessToken, refreshToken };

    } catch (error) {
        console.error("Token Refresh Failed:", error);
        return { success: false as const, accessToken: null };
    }
}