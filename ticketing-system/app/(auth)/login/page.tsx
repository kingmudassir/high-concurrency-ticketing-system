"use client";

import { AuthHero } from "./components/AuthHero";
import { LoginForm } from "./components/LoginForm";
import { NavHeader } from "./components/NavHeader";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6 sm:px-10 flex items-center justify-center relative overflow-hidden">
            
            {/* The Back Navigation - Consistent with Register */}
            <NavHeader />

            {/* Background Structural Accent - Mirroring Register's border */}
            <div className="absolute top-0 right-0 w-1/3 h-full border-l border-zinc-200 pointer-events-none hidden lg:block" />
            
            <div className="max-w-350 w-full mx-auto grid lg:grid-cols-[1fr_minmax(400px,500px)] gap-12 xl:gap-20 items-center relative z-10">
                
                {/* Left Side: System Context & Status Metrics */}
                <AuthHero />

                {/* Right Side: Secure Terminal Login Module */}
                <LoginForm />
                
            </div>
        </main>
    );
}