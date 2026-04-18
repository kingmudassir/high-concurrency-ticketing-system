import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Routes that require authentication.
 * Users must have valid session tokens to access these.
 */
const PROTECTED_ROUTES = [
    "/dashboard",
    "/my-tickets",
    "/settings",
    "/profile"
]

/**
 * Routes related to authentication (login/register/otp).
 * Logged-in users should not access these pages.
 */
const AUTH_ROUTES = [""]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Extract authentication tokens from cookies
    const accessToken = request.cookies.get("access_token")?.value
    const refreshToken = request.cookies.get("refresh_token")?.value

    // Debug logs (remove in production)
    console.log("Current Url: ", pathname)
    console.log("Access Token: ", accessToken)
    console.log("Refresh Token: ", refreshToken)

    /**
     * Check if current route requires authentication.
     * Matches exact route or nested paths like /dashboard/settings
     */
    const isProtectedRoute = PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    )

    /**
     * Check if current route is part of authentication flow.
     * Example: /login, /register, /otp
     */
    const isAuthRoute = AUTH_ROUTES.some(
        (route) => pathname.startsWith(route)
    )

    /**
     * Case 1:
     * No refresh token → user is not logged in at all.
     * Block access to protected routes.
     */
    if (!refreshToken && isProtectedRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    /**
     * Case 2:
     * User already logged in → block login/register pages.
     */
    if (accessToken && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    /**
     * Case 3:
     * Access token missing but refresh token exists.
     * Attempt silent session refresh via backend API.
     */
    if (!accessToken && refreshToken) {
        try {
            const refreshRes = await fetch(
                `${request.nextUrl.origin}/api/auth/refresh`,
                {
                    method: "POST",
                    headers: {
                        // Pass refresh token manually since middleware fetch
                        // does not automatically include cookies
                        Cookie: `refresh_token=${refreshToken}`,
                    },
                }
            )

            /**
             * If refresh succeeds:
             * - backend returns new auth cookies
             * - attach them to redirect response
             */
            if (refreshRes.ok) {
                const setCookieHeader = refreshRes.headers.get("set-cookie");

                if (setCookieHeader) {
                    // Redirect to same page so browser re-applies new cookies
                    const redirectResponse = NextResponse.redirect(request.url);
                    redirectResponse.headers.set("set-cookie", setCookieHeader);
                    return redirectResponse;
                }
            }

            /**
             * If refresh fails:
             * block access to protected routes
             */
            if (isProtectedRoute) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch (error) {
            // Network / server failure during refresh attempt
            console.error("[Middleware] Token refresh request failed:", error);

            if (isProtectedRoute) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }
    }

    /**
     * Default behavior:
     * allow request to continue normally
     */
    return NextResponse.next();
}

/**
 * Middleware runs on all routes except:
 * - API routes
 * - Next.js static assets
 * - favicon
 */
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};