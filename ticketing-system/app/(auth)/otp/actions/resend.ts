// app/(auth)/register/actions/resend-otp.ts
'use server'

import { getPrisma } from "@/lib/db/prisma";
import { sendVerificationEmail } from "@/lib/mail/mail";
import { generateAndSaveOTP } from "../../register/actions/otp";

export async function resend(email: string) {
    if (!email) return { success: false, message: "Email is required." };

    try {
        const prisma = getPrisma();
        
        // Check if user exists and isn't verified
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("User not found.");
        if (user.emailVerified) throw new Error("Email already verified.");

        // Generate new OTP (standalone call, no 'tx' needed here)
        const otpResponse = await generateAndSaveOTP(email);
        
        if (!otpResponse.success || !otpResponse.otp) {
            throw new Error("Failed to generate code.");
        }

        await sendVerificationEmail(email, otpResponse.otp);

        return { success: true, message: "New code sent!" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to resend." };
    }
}