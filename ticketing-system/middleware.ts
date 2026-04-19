import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
    "/dashboard",
    "/my-tickets",
    "/settings",
    "/profile"
]

const AUTH_ROUTES = ["/login", "/register", "/otp"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const accessToken = request.cookies.get("access_token")?.value
    const refreshToken = request.cookies.get("refresh_token")?.value

    console.log("Current Url: ", pathname)
    console.log("Access Token: ", accessToken)
    console.log("Refresh Token: ", refreshToken)

    const isProtectedRoute = PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    )

    const isAuthRoute = AUTH_ROUTES.some(
        (route) => pathname.startsWith(route)
    )

    if (!refreshToken && isProtectedRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (accessToken && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!accessToken && refreshToken) {
        try {
            const refreshRes = await fetch(
                `${request.nextUrl.origin}/api/auth/refresh`,
                {
                    method: "POST",
                    headers: {
                        Cookie: `refresh_token=${refreshToken}`,
                    },
                }
            )

            if (refreshRes.ok) {
                const setCookieHeader = refreshRes.headers.get("set-cookie");

                if (setCookieHeader) {
                    if (isAuthRoute) {
                        const response = NextResponse.redirect(new URL("/", request.url));
                        response.headers.set("set-cookie", setCookieHeader);
                        return response;
                    }

                    const response = NextResponse.next();
                    response.headers.set("set-cookie", setCookieHeader);
                    response.headers.set("x-middleware-set-cookie", setCookieHeader);
                    return response;
                }
            }

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
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};