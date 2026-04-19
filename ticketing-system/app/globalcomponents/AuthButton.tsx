'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface AuthButtonProps {
    className?: string;
    children?: React.ReactNode;
    showIcon?: boolean;
}

export const AuthButton = ({ 
    className, 
    children = "Get Started", 
    showIcon = true 
    }: AuthButtonProps) => {
    const pathname = usePathname();
    
    // We encode the current path so special characters don't break the URL
    const registerUrl = `/register?returnTo=${encodeURIComponent(pathname)}`;

    return (
        <Link 
        href={registerUrl}
        className={className}
        > 
        {children}
        {showIcon && <ArrowRight className="w-4 h-4 text-emerald-500" />}
        </Link>
    );
};