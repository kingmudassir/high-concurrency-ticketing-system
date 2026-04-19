"use client";

import { logoutAction } from "@/app/actions/logout/logout";
import { useState } from "react";

export const useLogout = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = async () => {
        setIsLoggingOut(true);
        try {
            // 1. Execute the server-side logic (Cookie removal + DB cleanup)
            await logoutAction();
            
            // 2. FORCE a hard refresh. 
            // This is the only way to kill the 'user' state in the Navbar 
            // if you are already on the "/" page.
            window.location.href = "/"; 
            
        } catch (error: any) {
            // Next.js redirect() throws a specific error. 
            // If the error message includes "NEXT_REDIRECT", ignore it and let it happen.
            if (error.message?.includes("NEXT_REDIRECT")) {
                window.location.href = "/"; 
                return;
            }
            
            console.error("Logout failed:", error);
            setIsLoggingOut(false);
        }
    };

    return { logout, isLoggingOut };
};