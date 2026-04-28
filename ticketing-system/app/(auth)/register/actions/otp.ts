"use server";

import { getPrisma } from "@/lib/db/prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";

export async function generateAndSaveOTP(
    email: string, 
    db?: Prisma.TransactionClient | PrismaClient
) {
    try {
        const client = db ?? getPrisma();

        const otp = randomInt(100000, 999999).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);

        const updatedUser = await client.user.update({
            where: { email },
            data: {
                otp,
                otpExpiresAt: expiry
            }
        });

        if (!updatedUser) {
            throw new Error("User not found.");
        }

        return { success: true, otp };

    } catch (error) {
        console.error("OTP Generation Error:", error);
        throw error; 
    }
}