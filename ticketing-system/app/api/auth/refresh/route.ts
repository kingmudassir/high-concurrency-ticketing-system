import { refreshSession } from "@/app/actions/refresh_session/refreshSession";
import { setAuthCookies } from "@/lib/cookies/auth-cookies";
import { NextResponse } from "next/server";

export async function POST() {
    const result = await refreshSession();

    if (result.success && result.accessToken && result.refreshToken) {
        const response = NextResponse.json({ success: true });
        
        await setAuthCookies(result.accessToken, result.refreshToken, response);
        
        return response;
    }

    return NextResponse.json({ success: false }, { status: 401 });
}