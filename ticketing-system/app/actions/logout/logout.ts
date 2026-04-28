"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { clearAuthCookies } from "@/lib/cookies/auth-cookies";
import { getPrisma } from "@/lib/db/prisma";

const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export async function logoutAction() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    const prisma = getPrisma();

    if (refreshToken) {
        try {
        // 1. Decode and verify the token to extract the sessionId
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { 
            userId: string; 
            sessionId: string; 
        };

        // 2. Delete the session from the Database
        // Using deleteMany prevents crashes if the session was already deleted
        await prisma.session.deleteMany({
            where: {
            id: decoded.sessionId,
            userId: decoded.userId,
            },
        });

        // 3. Optional: Log the logout event for your Audit Trail
        await prisma.authAuditLog.create({
            data: {
            userId: decoded.userId,
            action: "LOGOUT_SUCCESS",
            // Note: You'd need to pass IP/UA headers if you want to capture them here
            },
        });

        } catch (error) {
        // If token is malformed or secret changed, we still want to log out locally
        console.error("Logout DB Cleanup Error:", error);
        }
    }

    // 4. Wipe cookies from the browser
    await clearAuthCookies();

    // 5. Redirect to home
    // In Next.js Server Actions, redirect() throws an error that Next.js catches
    // to perform the redirect. Always call it at the very end.
    redirect("/");
}