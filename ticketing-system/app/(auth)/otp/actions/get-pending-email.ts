'use server'

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const VERIFY_COOKIE = "pending_verification";
const SECRET = process.env.JWT_SECRET!;

export async function getPendingEmail() {
    const cookieStore = await cookies();
    const token = cookieStore.get(VERIFY_COOKIE)?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, SECRET) as { email: string };
        return decoded.email;
    } catch (err) {
        return null;
    }
}