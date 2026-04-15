import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const JWT_SECRET = process.env.JWT_SECRET!;

// Durations
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 mins
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

/**
 * 1. Generates the raw Refresh Token and its hash for DB storage.
 */
export async function generateRefreshTokens() {
    const refreshToken = randomBytes(40).toString("hex");
    const refreshTokenHash = await hash(refreshToken, 10);
    return { refreshToken, refreshTokenHash };
}

/**
 * 2. Signs a new Access Token (JWT).
 * Call this once you have a valid userId and sessionId from the DB.
 */
export function signAccessToken(payload: { userId: string; role: string; sessionId: string }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

/**
 * 3. Sets the cookies in the browser response headers.
 * Note: Must be called within a Server Action or Route Handler.
 */
export async function setAuthCookies(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        maxAge: ACCESS_TOKEN_MAX_AGE,
        path: "/",
    });

    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        maxAge: REFRESH_TOKEN_MAX_AGE,
        path: "/",
    });
}

/**
 * 4. Clears tokens (Logout).
 */
export async function clearAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

/**
 * Legacy/Helper: Combined generator if you already have the sessionId.
 */
export async function generateAllTokens(userId: string, role: string, sessionId: string) {
    const { refreshToken, refreshTokenHash } = await generateRefreshTokens();
    const accessToken = signAccessToken({ userId, role, sessionId });
    
    return { accessToken, refreshToken, refreshTokenHash };
}