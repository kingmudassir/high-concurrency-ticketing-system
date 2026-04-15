import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose'; // Use 'jose' for middleware, 'jsonwebtoken' is too heavy for the Edge

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    // 1. Define paths that need protection
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
    const isSettingsPage = request.nextUrl.pathname.startsWith('/settings');
    const isLoginPage = request.nextUrl.pathname.startsWith('/login');

    // 2. LOGIC: If user is on a protected page without an access token
    if ((isDashboardPage || isSettingsPage) && !accessToken) {
        // If they have a refresh token, let them proceed to the page 
        // and let the Server Action handle the refresh (to avoid complex middleware logic)
        if (refreshToken) {
            return NextResponse.next();
        }
        
        // No tokens at all? Send them to login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. LOGIC: If user is logged in, don't let them go to the Login page
    if (isLoginPage && accessToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// 4. CONFIG: Only run middleware on specific paths
// middleware.ts
export const config = {
    matcher: [
        '/dashboard/:path*', 
        '/settings/:path*', 
        '/login',
        '/' // Keep root if needed
    ],
};