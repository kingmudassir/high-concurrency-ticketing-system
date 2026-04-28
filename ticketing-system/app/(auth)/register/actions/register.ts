'use server'

import { getPrisma } from "@/lib/db/prisma";
import { RegisterSchema } from "@/lib/validation/zod";
import { hash } from "bcryptjs"
import { generateAndSaveOTP } from "./otp";
import { sendVerificationEmail } from "@/lib/mail/mail";
import { setVerificationCookie } from "@/lib/cookies/verificationCookie";

export async function registerUser(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = RegisterSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten((issue) => issue.message).fieldErrors,
            message: "Validation failed."
        }
    }

    const { email, password, username } = validatedFields.data;

    try {
        const prisma = getPrisma()
        const existingUser = await prisma.user.findUnique({ where: { email } });

        // CASE 1: User exists AND is already verified
        if (existingUser && existingUser.emailVerified) {
            return {
                success: false,
                message: "An account with this email already exists.",
                errors: { email: ["Email already in use"] }
            }
        }

        // Fix 2: Moved hash below the early return to save CPU cycles on duplicates
        const hashPassword = await hash(password, 12);

        // This variable captures the OTP generated inside the transaction
        let generatedOtp: string | undefined;

        // --- TRANSACTION START (Strictly DB writes) ---
        await prisma.$transaction(async (tx) => {
            if (!existingUser) {
                await tx.user.create({
                    data: {
                        username,
                        email,
                        password: hashPassword,
                        emailVerified: null
                    }
                });
            } else {
                await tx.user.update({
                    where: { email },
                    data: { username, password: hashPassword }
                });
            }

            const otpResponse = await generateAndSaveOTP(email, tx);
            
            if (!otpResponse.success || !otpResponse.otp) {
                throw new Error("OTP_GENERATION_FAILED");
            }

            generatedOtp = otpResponse.otp;
        }, { timeout: 10000 }); // Reduced timeout; DB writes shouldn't take 15s
        // --- TRANSACTION END ---

        // Fix 1: External network calls run AFTER the DB connection is released
        const emailResult = await sendVerificationEmail(email, generatedOtp!);

        if (!emailResult.success) {
            // Note: The user record exists at this point. 
            // The UI should handle this by allowing them to click "Resend Email".
            return { 
                success: false, 
                message: "User registered, but verification email failed to send. Try to register again please." 
            };
        }

        await setVerificationCookie(email);

        return { 
            success: true, 
        };

    } catch (error: any) {
        console.error("Registration Error:", error.message);
        
        // Handle specific custom error from inside transaction
        if (error.message === "OTP GENERATION FAILED") {
            return { success: false, message: "Technical error generating security code." };
        }
        
        return { success: false, message: "An error occurred. Please try again." };
    }
}