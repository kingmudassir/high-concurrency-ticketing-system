import { refreshSession } from "@/app/actions/refresh_session/refreshSession";
import { setAuthCookies } from "@/lib/cookies/auth-cookies";
import { NextResponse } from "next/server";

export async function POST() {
    const result = await refreshSession();

    if (result.success && result.accessToken && result.refreshToken) {
        await setAuthCookies(result.accessToken, result.refreshToken);
        return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}