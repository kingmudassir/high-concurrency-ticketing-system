import { cookies } from "next/headers";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server"; // Import this

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

// Durations in seconds
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 mins
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

/**
 * 1. Generates the raw Refresh Token (JWT) and its hash for DB storage.
 * Updated to include both userId and sessionId in the payload for O(1) lookups.
 */
export async function generateRefreshTokens(userId: string, sessionId: string) {
    const refreshToken = jwt.sign(
        { userId, sessionId }, 
        REFRESH_SECRET, 
        { expiresIn: '7d' }
    );
    
    // Hash the token before storing it in the database for extra security
    const refreshTokenHash = await hash(refreshToken, 10);
    
    return { refreshToken, refreshTokenHash };
}

/**
 * 2. Signs a new Access Token (JWT).
 */
export function signAccessToken(payload: { userId: string; role: string; sessionId: string }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

/**
 * 3. Sets the cookies in the browser response headers.
 * Added 'secure' flag based on environment.
 */
export async function setAuthCookies(
    accessToken: string, 
    refreshToken: string, 
    res?: NextResponse // Optional response object
) {
    const isProduction = process.env.NODE_ENV === "production";
    
    const options = {
        httpOnly: true,
        sameSite: "strict" as const,
        secure: isProduction,
        path: "/",
    };

    // IF we have a response object (API Route / Middleware context)
    if (res) {
        res.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
            ...options,
            maxAge: ACCESS_TOKEN_MAX_AGE,
        });
        res.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
            ...options,
            maxAge: REFRESH_TOKEN_MAX_AGE,
        });
        return;
    }

    // FALLBACK: Standard Server Action context
    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
        ...options,
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
        ...options,
        maxAge: REFRESH_TOKEN_MAX_AGE,
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
 * 5. Combined generator used during initial login or full session resets.
 * Fixed: Corrected variable naming and passed both required arguments.
 */
export async function generateAllTokens(userId: string, role: string, sessionId: string) {
    // Corrected 'userid' to 'userId' and added the missing 'sessionId' argument
    const { refreshToken, refreshTokenHash } = await generateRefreshTokens(userId, sessionId);
    
    const accessToken = signAccessToken({ userId, role, sessionId });
    
    return { accessToken, refreshToken, refreshTokenHash };
}