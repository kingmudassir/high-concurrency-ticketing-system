"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function NavHeader() {
    const router = useRouter();

    const handleBack = () => {
        // Check if there is a history to go back to
        if (window.history.length > 1) {
        router.back();
        } else {
        router.push("/");
        }
    };

    return (
        <nav className="absolute top-0 left-0 w-full p-6 sm:p-10 z-50">
        <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors select-none"
        >
            <div className="flex items-center justify-center w-8 h-8 border border-zinc-200 group-hover:border-zinc-950 transition-all">
            <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
            Go back
            </span>
        </button>
        </nav>
    );
}