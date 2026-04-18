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

        const hashPassword = await hash(password, 12);

        await prisma.$transaction(async (tx) => {
            if (!existingUser) {
                // Create user only if they don't exist
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

            // Generate/Save OTP, Send Email, and Set Cookie
            const otpResponse = await generateAndSaveOTP(email, tx);
            
            if (!otpResponse.success || !otpResponse.otp) {
                throw new Error("(OTP) - Registeration failed due to technical error. Please try again.");
            }

            const emailResult = await sendVerificationEmail(email, otpResponse.otp);

            if (!emailResult.success) {
                throw new Error("(Email) - Registeration failed due to technical error. Please try again."); 
            }

            await setVerificationCookie(email);
        }, { timeout: 15000 });

        return { 
            success: true, 
        };
    } catch (error: any) {
        console.error("Registration/Verification Error:", error.message);
        
        if (error.message === "EMAIL_SENDING_FAILED") {
            return { success: false, message: "Could not send verification email." };
        }
        
        return { success: false, message: "An error occurred. Please try again." };
    }
}