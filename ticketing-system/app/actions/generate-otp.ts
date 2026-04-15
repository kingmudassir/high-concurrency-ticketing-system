"use server";

import { Prisma, PrismaClient } from "@prisma/client"; // Import Prisma types
import { prisma } from "@/lib/prisma";
import { randomInt } from "crypto";

export async function generateAndSaveOTP(email: string, db: Prisma.TransactionClient | PrismaClient = prisma) {
    try {
        // 1. Generate a 6-digit string (e.g., "054321")
        // randomInt(min, max) handles the padding logic for us
        const otp = randomInt(100000, 999999).toString();

        // 2. Set expiry (e.g., 10 minutes from now)
        const expiry = new Date(Date.now() + 10 * 60 * 1000);

        // 3. Update the user record
        const updatedUser = await db.user.update({ // Uses the passed 'tx' or the default 'prisma'
            where: { email },
            data: {
                otp,
                otpExpiresAt: expiry
            }
        });

        if (!updatedUser) {
            throw new Error("User not found.");
        }

        // 4. Return the OTP so your Email Service can send it
        // NEVER return this to the client/frontend.
        return { success: true, otp };

    } catch (error) {
        console.error("OTP Generation Error:", error);
        return { success: false };
    }
}