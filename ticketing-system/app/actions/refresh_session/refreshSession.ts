"use server";

import { cookies } from "next/headers";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { 
    generateRefreshTokens, 
    signAccessToken, 
    setAuthCookies 
} from "@/lib/cookies/auth-cookies";
import { getPrisma } from "@/lib/db/prisma";

const REFRESH_SECRET = process.env.REFRESH_SECRET!;

// Standardized failure response to maintain type safety
const FAILURE = { success: false as const, accessToken: null, refreshToken: null };

export async function refreshSession() {
    try {
        const prisma = getPrisma();
        const cookieStore = await cookies();
        const oldRefreshToken = cookieStore.get("refresh_token")?.value;

        if (!oldRefreshToken) {
            return FAILURE;
        }

        // 1. Verify JWT Integrity (Signature & Expiry)
        let decoded: { userId: string; sessionId: string };
        try {
            decoded = jwt.verify(oldRefreshToken, REFRESH_SECRET) as { userId: string; sessionId: string };
        } catch {
            return FAILURE;
        }

        // 2. Fetch Session and User data in one query
        const currentSession = await prisma.session.findUnique({
            where: { id: decoded.sessionId },
            include: { user: { select: { id: true, role: true } } },
        });

        // 3. Security Checks: Existence and Expiry
        if (!currentSession || currentSession.expiresAt < new Date()) {
            return FAILURE;
        }

        // 4. Token Rotation & Theft Detection
        // Verify the raw token from the cookie matches the hash in our DB
        const isMatch = await compare(oldRefreshToken, currentSession.refreshTokenHash);
        
        if (!isMatch) {
            // CRITICAL: This indicates a "Replay Attack" (someone using an old token).
            // We delete the session to kick everyone out (including the real user) for safety.
            await prisma.session.delete({ where: { id: currentSession.id } });
            return FAILURE;
        }

        // 5. Generate New Token Pair
        // We reuse your auth-cookies logic to ensure the payload and hashing are consistent
        const { refreshToken, refreshTokenHash } = await generateRefreshTokens(
            currentSession.user.id,
            currentSession.id
        );

        // 6. Update Database (In-place rotation)
        const updatedSession = await prisma.session.update({
            where: { id: currentSession.id },
            data: {
                refreshTokenHash,
                // We reset the 7-day clock in the DB
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        // 7. Sign New Access Token
        const accessToken = signAccessToken({
            userId: currentSession.user.id,
            role: currentSession.user.role,
            sessionId: updatedSession.id,
        });

        // 8. Sync with Browser
        // This is the missing piece that ensures consistency with your login flow
        await setAuthCookies(accessToken, refreshToken);

        return { 
            success: true as const, 
            accessToken, 
            refreshToken 
        };

    } catch (error) {
        console.error("[refreshSession] Token refresh failed:", error);
        return FAILURE;
    }
}