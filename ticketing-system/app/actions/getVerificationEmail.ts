import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "pending_verification";
const SECRET = process.env.JWT_SECRET!;

export async function getVerificationEmail(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, SECRET) as { email: string };
        return decoded.email;
    } catch (error) {
        return null;
    }
}