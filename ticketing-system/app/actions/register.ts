"use server"

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { RegisterSchema } from "@/lib/zod" // Import your strict schema
import { setVerificationCookie } from "@/lib/cookies/verification-cookie";
import { sendVerificationEmail } from "@/lib/mail";
import { generateAndSaveOTP } from "./generate-otp";

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

    const { email, password, firstName, lastName } = validatedFields.data;
    const name = `${firstName} ${lastName}`;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        // CASE 1: User exists AND is already verified
        if (existingUser && existingUser.emailVerified) {
            return {
                success: false,
                message: "An account with this email already exists and is verified."
            }
        }

        const hashPassword = await hash(password, 12);

        // CASE 2: User doesn't exist OR exists but isn't verified
        await prisma.$transaction(async (tx) => {
            
            if (!existingUser) {
                // Create user only if they don't exist
                await tx.user.create({
                    data: {
                        name,
                        email,
                        password: hashPassword,
                        emailVerified: null
                    }
                });
            } else {
                // If they exist but aren't verified, update their password (optional)
                // and name in case they changed them on the second attempt
                await tx.user.update({
                    where: { email },
                    data: { name, password: hashPassword }
                });
            }

            // Generate/Save OTP, Send Email, and Set Cookie
            const otpResponse = await generateAndSaveOTP(email, tx);
            
            if (!otpResponse.success || !otpResponse.otp) {
                throw new Error("OTP_GENERATION_FAILED");
            }

            const emailResult = await sendVerificationEmail(email, otpResponse.otp);

            if (!emailResult.success) {
                throw new Error("EMAIL_SENDING_FAILED"); 
            }

            await setVerificationCookie(email);
        }, { timeout: 15000 });

        return { 
            success: true, 
            message: "Verification email sent!",
            email // Return email for redirect logic
        };

    } catch (error: any) {
        console.error("Registration/Verification Error:", error.message);
        
        if (error.message === "EMAIL_SENDING_FAILED") {
            return { success: false, message: "Could not send verification email." };
        }
        
        return { success: false, message: "An error occurred. Please try again." };
    }
}