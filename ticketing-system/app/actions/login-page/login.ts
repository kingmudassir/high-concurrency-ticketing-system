"use server"

import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { LoginSchema } from "@/lib/zod"
import { generateAllTokens, setAuthCookies } from "@/lib/cookies/auth-cookies";
import { setVerificationCookie } from "@/lib/cookies/verification-cookie";
import { sendVerificationEmail } from "@/lib/mail";
import { generateAndSaveOTP } from "../registeration-page/generate-otp";

// Define a strict return type so TypeScript knows 'errors' and 'requiresVerification' exist in all paths
type LoginResponse = {
    success: boolean;
    message: string;
    requiresVerification?: boolean;
    errors?: Record<string, string[]>;
};

export async function loginUser(formData: FormData): Promise<LoginResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = LoginSchema.safeParse(rawData);

    // Path 1: Validation Errors
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid input data.",
            requiresVerification: false,
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, password } = validatedFields.data;

    try {
        const user = await prisma.user.findUnique({ 
            where: { email },
            select: { id: true, password: true, role: true, status: true, emailVerified: true }
        });

        // Path 2: User not found or incorrect password
        if (!user || !user.password) {
            return { 
                success: false, 
                message: "Invalid email or password.",
                requiresVerification: false 
            };
        }

        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
            return { 
                success: false, 
                message: "Invalid email or password.",
                requiresVerification: false 
            };
        }

        // Path 3: Banned status
        if (user.status === "BANNED") {
            return { 
                success: false, 
                message: "This account has been suspended.",
                requiresVerification: false 
            };
        }

        // Path 4: Verification Gate (Existing user, but not verified)
        if (!user.emailVerified) {
            await prisma.$transaction(async (tx) => {
                const otpResponse = await generateAndSaveOTP(email, tx);
                if (!otpResponse.success || !otpResponse.otp) throw new Error("OTP_FAILED");

                const emailResult = await sendVerificationEmail(email, otpResponse.otp);
                if (!emailResult.success) throw new Error("EMAIL_FAILED");

                await setVerificationCookie(email);
            });

            return { 
                success: true, 
                requiresVerification: true, 
                message: "Email not verified. A new code has been sent." 
            };
        }

        // Path 5: Success (Fully verified user)
        const result = await prisma.$transaction(async (tx) => {
            const session = await tx.session.create({
                data: {
                    userId: user.id,
                    refreshTokenHash: "", 
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                }
            });

            const { accessToken, refreshToken, refreshTokenHash } = await generateAllTokens(
                user.id, 
                user.role, 
                session.id
            );

            await tx.session.update({
                where: { id: session.id },
                data: { refreshTokenHash }
            });

            return { accessToken, refreshToken };
        });

        await setAuthCookies(result.accessToken, result.refreshToken);

        return { 
            success: true, 
            requiresVerification: false,
            message: "Login successful" 
        };

    } catch (error: any) {
        console.error("Login Error:", error);
        return { 
            success: false, 
            message: "An error occurred during login.",
            requiresVerification: false 
        };
    }
}