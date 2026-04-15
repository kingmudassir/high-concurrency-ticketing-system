"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { 
    generateRefreshTokens, 
    signAccessToken, 
    setAuthCookies 
} from "@/lib/cookies/auth-cookies";
import jwt from "jsonwebtoken";

const VERIFY_COOKIE = "pending_verification";
const SECRET = process.env.JWT_SECRET!;

export async function verifyOTP(userEnteredOtp: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(VERIFY_COOKIE)?.value;

        if (!token) {
            return { success: false, message: "Session expired. Please register again." };
        }

        // 1. Decode Email from Verification Cookie
        let email: string;
        try {
            const decoded = jwt.verify(token, SECRET) as { email: string };
            email = decoded.email;
        } catch (err) {
            return { success: false, message: "Invalid or expired session." };
        }

        // 2. Fetch User
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                otp: true,
                otpExpiresAt: true,
                role: true,
            }
        });

        if (!user) {
            return { success: false, message: "User account not found." };
        }

        // 3. Validation
        if (!user.otp || user.otp !== userEnteredOtp) {
            return { success: false, message: "The code you entered is incorrect." };
        }

        if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
            return { success: false, message: "This code has expired. Please request a new one." };
        }

        // 4. ATOMIC TRANSACTION: Verify User + Session Creation
        const { finalAccessToken, refreshToken } = await prisma.$transaction(async (tx) => {
            // A. Mark User as Verified
            await tx.user.update({
                where: { email },
                data: {
                    emailVerified: new Date(),
                    otp: null,
                    otpExpiresAt: null,
                    lastLogin: new Date()
                }
            });

            // B. Generate Refresh Token and Hash
            const { refreshToken, refreshTokenHash } = await generateRefreshTokens();

            // C. Create Session in DB to get the REAL ID
            const session = await tx.session.create({
                data: {
                    userId: user.id,
                    refreshTokenHash,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 Days
                }
            });

            // D. Sign the final Access Token with the session ID
            const finalAccessToken = signAccessToken({
                userId: user.id,
                role: user.role,
                sessionId: session.id
            });

            return { finalAccessToken, refreshToken };
        });

        // 5. Set Auth Cookies using updated utility
        await setAuthCookies(finalAccessToken, refreshToken);

        // 6. Cleanup Verification Cookie
        cookieStore.delete(VERIFY_COOKIE);

        return { 
            success: true, 
            message: "Email verified successfully! Logging you in..." 
        };

    } catch (error) {
        console.error("Verification/Login Error:", error);
        return { success: false, message: "A server error occurred during verification." };
    }
}