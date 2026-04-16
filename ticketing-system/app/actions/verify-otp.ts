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

        // 1. Decode Email
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
            select: { id: true, otp: true, otpExpiresAt: true, role: true }
        });

        if (!user) return { success: false, message: "User account not found." };

        // 3. Validation
        if (!user.otp || user.otp !== userEnteredOtp) {
            return { success: false, message: "The code you entered is incorrect." };
        }

        if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
            return { success: false, message: "This code has expired." };
        }

        // 4. ATOMIC TRANSACTION
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

            // B. Create an empty session first to get the ID
            // We use a temporary string for the hash because we need the session.id 
            // to generate the actual Refresh Token JWT.
            const session = await tx.session.create({
                data: {
                    userId: user.id,
                    refreshTokenHash: "TEMP_HASH", 
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                }
            });

            // C. Now we have the session.id, generate the REAL tokens
            const { refreshToken, refreshTokenHash } = await generateRefreshTokens(user.id, session.id);

            // D. Update the session with the real hash
            await tx.session.update({
                where: { id: session.id },
                data: { refreshTokenHash }
            });

            // E. Sign the final Access Token
            const finalAccessToken = signAccessToken({
                userId: user.id,
                role: user.role,
                sessionId: session.id
            });

            return { finalAccessToken, refreshToken };
        });

        // 5. Finalize
        await setAuthCookies(finalAccessToken, refreshToken);
        (await cookies()).delete(VERIFY_COOKIE);

        return { 
            success: true, 
            message: "Email verified successfully! Logging you in..." 
        };

    } catch (error) {
        console.error("Verification Error:", error);
        return { success: false, message: "A server error occurred." };
    }
}