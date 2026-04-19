"use server";

import { compare } from "bcryptjs";
import { getPrisma } from "@/lib/db/prisma";
import { setAuthCookies, generateRefreshTokens, signAccessToken } from "@/lib/cookies/auth-cookies";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, message: "Please provide both email and password." };
    }

    try {
        const prisma = getPrisma();

        // 1. Fetch User - Mapping to 'password' field from your register logic
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                password: true, // Matches 'password' in register.ts and schema.prisma
                role: true,
                emailVerified: true,
                status: true,
            },
        });

        // 2. Initial validation
        if (!user || !user.password) {
            return { success: false, message: "Invalid email or password." };
        }

        if (user.status !== "ACTIVE") {
            return { success: false, message: "This account is currently restricted." };
        }

        // 3. Compare the entered password with the hash stored in 'password'
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return { success: false, message: "Invalid email or password." };
        }

        // 4. Verification Check
        if (!user.emailVerified) {
            return { 
                success: false, 
                message: "Please verify your email before logging in.",
                unverified: true // Helpful hint for UI to redirect to OTP if needed
            };
        }

        // 5. ATOMIC SESSION CREATION
        const { accessToken, refreshToken } = await prisma.$transaction(async (tx) => {
            // A. Create Session entry
            const session = await tx.session.create({
                data: {
                    userId: user.id,
                    refreshTokenHash: "TEMP_HASH",
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });

            // B. Generate tokens
            const { refreshToken, refreshTokenHash } = await generateRefreshTokens(user.id, session.id);

            // C. Update Session with hashed refresh token
            await tx.session.update({
                where: { id: session.id },
                data: { refreshTokenHash },
            });

            // D. Generate Access Token
            const accessToken = signAccessToken({
                userId: user.id,
                role: user.role,
                sessionId: session.id,
            });

            return { accessToken, refreshToken };
        });

        // 6. Set Browser Cookies
        await setAuthCookies(accessToken, refreshToken);

        // 7. Update Metadata (Non-blocking)
        prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        }).catch(err => console.error("Last login update failed:", err));

        return { success: true, message: "Login successful!" };

    } catch (error) {
        console.error("Login Error:", error);
        return { success: false, message: "A server error occurred during login." };
    }
}