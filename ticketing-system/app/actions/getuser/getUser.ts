"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getPrisma } from "@/lib/db/prisma";
import { PrismaClient } from "@prisma/client";

const ACCESS_TOKEN_COOKIE = "access_token";
const JWT_SECRET = process.env.JWT_SECRET!;

export async function getCurrentUser() {
    try {
        const prisma = getPrisma();
        const cookieStore = await cookies();
        const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

        console.log("getCurrentUser - token exists:", !!token);

        if (!token) {
            return { success: false, user: null };
        }

        let decoded: { userId: string; sessionId: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: string; sessionId: string };
            console.log("Decoded token:", decoded); // Add this
        } catch (err) {
            console.error("Token verification failed:", err);
            return { success: false, user: null };
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                status: true,
            },
        });

        console.log("Found user:", user); // Add this

        if (!user || user.status !== "ACTIVE") {
            return { success: false, user: null };
        }

        return { success: true, user: user };

    } catch (error) {
        console.error("[getCurrentUser] Auth check failed:", error);
        return { success: false, user: null };
    }
}