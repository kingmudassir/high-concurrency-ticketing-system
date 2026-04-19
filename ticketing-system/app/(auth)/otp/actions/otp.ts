"use server";

import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma";
import { generateRefreshTokens, setAuthCookies, signAccessToken } from "@/lib/cookies/auth-cookies";
import { getPendingEmail } from "./get-pending-email";

const VERIFY_COOKIE = "pending_verification";

export async function verifyOTP(userEnteredOtp: string) {
    try {
        const prisma = getPrisma()

        const cookieStore = await cookies();
        const token = cookieStore.get(VERIFY_COOKIE)?.value;

        if (!token) {
            return { success: false, message: "Session expired. Please register again." };
        }

        const email = await getPendingEmail();

        if (!email) {
            return { success: false, message: "Session expired or invalid. Please register again." };
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