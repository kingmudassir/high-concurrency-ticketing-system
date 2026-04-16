import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/my-tickets", "/settings", "/profile"];
const AUTH_ROUTES = ["/login", "/register", "/otp"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) => 
        pathname === route || pathname.startsWith(`${route}/`)
    );

    // 1. Redirect to home if accessing protected route without even a refresh token
    if (!refreshToken && isProtectedRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // 2. Prevent logged-in users from hitting Auth pages
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
    if (refreshToken && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // 3. SILENT REFRESH: If we have a refresh token but NO access token, 
    // we need to call our refresh logic.
    if (!accessToken && refreshToken) {
        try {
            // We call an internal API route because we can't run Prisma/Bcrypt in Edge Middleware directly
            const refreshRes = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
                method: "POST",
                headers: { Cookie: `refresh_token=${refreshToken}` },
            });

            if (refreshRes.ok) {
                const response = NextResponse.next();
                const setCookieHeader = refreshRes.headers.get("set-cookie");
                
                // If the API returned new cookies, pass them along to the browser
                if (setCookieHeader) {
                    response.headers.set("set-cookie", setCookieHeader);
                }
                return response;
            }
        } catch (error) {
            console.error("Middleware Refresh Error:", error);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};