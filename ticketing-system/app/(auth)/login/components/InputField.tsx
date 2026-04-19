"use client";
import { LucideIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useState, forwardRef } from 'react';
import Link from 'next/link';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    error?: string;
    forgotPasswordLink?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({ 
    label, 
    icon: Icon, 
    type, 
    error, 
    disabled, 
    className,
    forgotPasswordLink,
    ...props 
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    return (
        <div className={`space-y-2 w-full transition-opacity ${disabled ? 'opacity-60' : 'opacity-100'}`}>
            <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em]">
                    {label}
                </label>
                
                {forgotPasswordLink && !error && (
                    <Link href="#" className="text-[9px] font-mono text-zinc-400 hover:text-zinc-950 transition-colors uppercase">
                        Forgot Password?
                    </Link>
                )}

                {error && (
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {error}
                    </span>
                )}
            </div>

            <div className="relative group">
                {/* Icon Prefix */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className={`h-4 w-4 transition-colors ${
                        error ? 'text-red-400' : 'text-zinc-300 group-focus-within:text-zinc-950'
                    }`} />
                </div>
                
                <input 
                    {...props}
                    ref={ref}
                    type={inputType}
                    disabled={disabled}
                    className={`w-full bg-zinc-50 border py-4 pl-11 pr-12 text-sm font-medium focus:outline-none transition-all ${
                        disabled ? 'cursor-not-allowed' : ''
                    } ${
                        error 
                        ? 'border-red-500 focus:border-red-600 focus:bg-red-50/10' 
                        : 'border-zinc-200 focus:border-zinc-950 focus:bg-white'
                    } ${className}`}
                />

                {/* Password Toggle */}
                {isPasswordField && (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${
                            disabled ? 'text-zinc-200 cursor-not-allowed' : 'text-zinc-300 hover:text-zinc-950'
                        }`}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>
        </div>
    );
});

InputField.displayName = "InputField";