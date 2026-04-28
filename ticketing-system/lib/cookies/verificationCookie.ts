import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "pending_verification";
const SECRET = process.env.JWT_SECRET!;

export async function setVerificationCookie(email: string) {
    const token = jwt.sign({ email }, SECRET, { expiresIn: "5m" });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 5 * 60,
        path: "/",
    });
}