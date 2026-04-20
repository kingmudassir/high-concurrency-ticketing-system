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

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                password: true,
                role: true,
                emailVerified: true,
                status: true,
            },
        });

        if (!user || !user.password) {
            return { success: false, message: "Invalid email or password." };
        }

        if (user.status !== "ACTIVE") {
            return { success: false, message: "This account is currently restricted." };
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return { success: false, message: "Invalid email or password." };
        }

        if (!user.emailVerified) {
            return { 
                success: false, 
                message: "Please verify your email before logging in.",
                unverified: true 
            };
        }

        const { accessToken, refreshToken } = await prisma.$transaction(async (tx) => {
            const session = await tx.session.create({
                data: {
                    userId: user.id,
                    refreshTokenHash: "TEMP_HASH",
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });

            const { refreshToken, refreshTokenHash } = await generateRefreshTokens(user.id, session.id);

            await tx.session.update({
                where: { id: session.id },
                data: { refreshTokenHash },
            });

            const accessToken = signAccessToken({
                userId: user.id,
                role: user.role,
                sessionId: session.id,
            });

            return { accessToken, refreshToken };
        });

        await setAuthCookies(accessToken, refreshToken);

        // Non-blocking update
        prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        }).catch(err => console.error("Last login update failed:", err));

        // ROLE-BASED REDIRECT LOGIC
        const redirectTo = user.role === "ADMIN" ? "/admin" : "/";

        return { 
            success: true, 
            message: "Login successful!",
            redirectTo // Pass the route back to the client
        };

    } catch (error) {
        console.error("Login Error:", error);
        return { success: false, message: "A server error occurred during login." };
    }
}