import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/my-tickets", "/settings", "/profile"];
const AUTH_ROUTES = ["/login", "/register", "/otp"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    const isProtectedRoute = PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    // 1. No refresh token at all — kick unauthenticated users off protected routes
    if (!refreshToken && isProtectedRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // 2. Fully authenticated — block access to auth pages
    if (accessToken && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // 3. Silent refresh: refresh token exists but access token is missing or expired.
    //    We cannot use Prisma/bcrypt in Edge middleware, so we delegate to an internal
    //    Node.js API route. On success, we redirect to the same URL — the browser then
    //    makes a fresh request with the new cookies already in its jar, so getCurrentUser()
    //    sees them naturally. No request-header mutation required.
    if (!accessToken && refreshToken) {
        try {
            const refreshRes = await fetch(
                `${request.nextUrl.origin}/api/auth/refresh`,
                {
                    method: "POST",
                    headers: { Cookie: `refresh_token=${refreshToken}` },
                }
            );

            if (refreshRes.ok) {
                const setCookieHeader = refreshRes.headers.get("set-cookie");

                if (setCookieHeader) {
                    // Redirect to the same URL the user was trying to reach.
                    // The browser re-issues the request, this time carrying the new
                    // cookies set by the refresh endpoint — clean and correct.
                    const redirectResponse = NextResponse.redirect(request.url);
                    redirectResponse.headers.set("set-cookie", setCookieHeader);
                    return redirectResponse;
                }
            }

            // Refresh failed — if this is a protected route, send them home.
            if (isProtectedRoute) {
                return NextResponse.redirect(new URL("/", request.url));
            }

        } catch (error) {
            console.error("[Middleware] Token refresh request failed:", error);

            if (isProtectedRoute) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};