"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Home } from "lucide-react";
import { useState } from "react";

interface NavHeaderProps {
    showHomeButton?: boolean;
    className?: string;
    onBack?: () => void;
}

export function NavHeader({ showHomeButton = false, className = "", onBack }: NavHeaderProps) {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    };

    const handleHome = () => {
        router.push("/");
    };

    return (
        <nav className={`fixed sm:absolute top-0 left-0 w-full px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 md:py-6 z-50 bg-white/80 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none ${className}`}>
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="group flex items-center gap-2 sm:gap-3 transition-all duration-300 select-none"
                >
                    {/* Icon Container */}
                    <div className={`
                        relative flex items-center justify-center 
                        w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9
                        rounded-lg sm:rounded-xl 
                        border transition-all duration-300
                        ${isHovered 
                            ? 'border-zinc-950 bg-zinc-950 shadow-md' 
                            : 'border-zinc-200 bg-white'
                        }
                    `}>
                        <ChevronLeft className={`
                            w-3.5 h-3.5 sm:w-4 sm:h-4 
                            transition-all duration-300
                            ${isHovered ? 'text-white -translate-x-0.5' : 'text-zinc-600'}
                        `} />
                    </div>
                    
                    {/* Text */}
                    <span className={`
                        text-[8px] sm:text-[9px] md:text-[10px] 
                        font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] 
                        transition-all duration-300
                        ${isHovered ? 'text-zinc-950 -translate-x-0.5' : 'text-zinc-400'}
                    `}>
                        Back
                    </span>
                </button>

                {/* Home Button (Optional) */}
                {showHomeButton && (
                    <button
                        onClick={handleHome}
                        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white border border-zinc-200 hover:border-zinc-950 hover:shadow-md transition-all duration-300 group"
                    >
                        <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
                        <span className="text-[7px] sm:text-[8px] md:text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-950">
                            Home
                        </span>
                    </button>
                )}
            </div>
        </nav>
    );
}