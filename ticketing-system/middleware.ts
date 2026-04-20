import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, decodeJwt } from "jose";

const PROTECTED_ROUTES = ["/dashboard", "/my-tickets", "/settings", "/profile"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/register", "/otp"];

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    const isProtectedRoute = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
    const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
    const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

    // 1. UNAUTHORIZED: No session at all
    if (!refreshToken && (isProtectedRoute || isAdminRoute)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. ADMIN CHECK: If token exists, verify role immediately
    if (isAdminRoute && accessToken) {
        try {
            const { payload } = await jwtVerify(accessToken, JWT_SECRET);
            if (payload.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        } catch (error) {
            // Token expired; silence error and let refresh logic below handle it
        }
    }

    // 3. AUTH ROUTE CHECK: Redirect logged-in users away from Login/Register
    if (accessToken && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 4. TOKEN REFRESH LOGIC
    if (!accessToken && refreshToken) {
        try {
            const refreshRes = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
                method: "POST",
                headers: { Cookie: `refresh_token=${refreshToken}` },
            });

            if (refreshRes.ok) {
                const setCookieHeader = refreshRes.headers.get("set-cookie");
                
                if (setCookieHeader) {
                    // Extract new token to prevent redundant loops
                    const match = setCookieHeader.match(/access_token=([^;]+)/);
                    const newAccessToken = match ? match[1] : null;

                    // ADMIN ROLE CHECK (If on admin route)
                    if (isAdminRoute && newAccessToken) {
                        const payload = decodeJwt(newAccessToken);
                        if (payload.role !== "ADMIN") {
                            return NextResponse.redirect(new URL("/dashboard", request.url));
                        }
                    }

                    // BREAK THE LOOP: Create response
                    const response = isAuthRoute 
                        ? NextResponse.redirect(new URL("/dashboard", request.url))
                        : NextResponse.next();

                    // 1. Set the cookie for the Browser
                    response.headers.set("set-cookie", setCookieHeader);
                    response.headers.set("x-middleware-set-cookie", setCookieHeader);

                    // 2. CRITICAL: Set the cookie for the CURRENT request 
                    // This prevents the "missing token" loop on the immediate next step
                    if (newAccessToken) {
                        request.cookies.set("access_token", newAccessToken);
                    }

                    return response;
                }
            }

            // If refresh fails, clear everything to stop the loop
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.set("access_token", "", { maxAge: 0 });
            response.cookies.set("refresh_token", "", { maxAge: 0 });
            return response;

        } catch (error) {
            console.error("[Middleware Error]:", error);
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};