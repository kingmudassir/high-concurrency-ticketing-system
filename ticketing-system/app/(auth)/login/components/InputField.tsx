"use client";
import { LucideIcon, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState, forwardRef } from 'react';
import Link from 'next/link';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    error?: string;
    success?: boolean;
    hint?: string;
    forgotPasswordLink?: boolean;
    required?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({ 
    label, 
    icon: Icon, 
    type, 
    error, 
    success,
    hint,
    disabled, 
    className,
    forgotPasswordLink,
    required,
    ...props 
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    const getBorderColor = () => {
        if (error) return 'border-red-500';
        if (success) return 'border-emerald-500';
        if (isFocused) return 'border-zinc-950';
        return 'border-zinc-200';
    };

    const getIconColor = () => {
        if (error) return 'text-red-500';
        if (success) return 'text-emerald-500';
        if (isFocused) return 'text-zinc-950';
        return 'text-zinc-400';
    };

    const getLabelColor = () => {
        if (error) return 'text-red-500';
        if (success) return 'text-emerald-600';
        return 'text-zinc-500';
    };

    return (
        <div className={`space-y-2 w-full transition-all duration-200 ${disabled ? 'opacity-60' : 'opacity-100'}`}>
            {/* Label Row */}
            <div className="flex justify-between items-center px-1">
                <label className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-colors ${getLabelColor()}`}>
                    {label}
                    {required && <span className="ml-1 text-rose-500">*</span>}
                </label>
                
                {forgotPasswordLink && !error && !success && (
                    <Link 
                        href="/forgot-password" 
                        className="text-[9px] font-mono text-zinc-400 hover:text-zinc-950 transition-colors uppercase tracking-wider"
                    >
                        Forgot Password?
                    </Link>
                )}
            </div>

            {/* Input Container */}
            <div className="relative group">
                {/* Icon Prefix */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-200">
                    <Icon className={`h-4 w-4 transition-all ${getIconColor()}`} />
                </div>
                
                <input 
                    {...props}
                    ref={ref}
                    type={inputType}
                    disabled={disabled}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    className={`
                        w-full bg-white border-2 py-4 pl-11 pr-12 text-sm font-medium 
                        rounded-xl transition-all duration-200
                        focus:outline-none focus:ring-0
                        placeholder:text-zinc-300 placeholder:font-normal
                        disabled:cursor-not-allowed disabled:bg-zinc-50
                        ${getBorderColor()}
                        ${isFocused ? 'shadow-md shadow-zinc-100' : ''}
                        ${className}
                    `}
                />

                {/* Password Toggle */}
                {isPasswordField && (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setShowPassword(!showPassword)}
                        className={`
                            absolute inset-y-0 right-0 pr-4 flex items-center transition-all duration-200
                            ${disabled ? 'cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
                        `}
                    >
                        {showPassword ? (
                            <EyeOff className={`h-4 w-4 transition-colors ${getIconColor()}`} />
                        ) : (
                            <Eye className={`h-4 w-4 transition-colors ${getIconColor()}`} />
                        )}
                    </button>
                )}

                {/* Success Indicator */}
                {success && !error && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                )}
            </div>

            {/* Hint / Error Message */}
            {(error || hint) && (
                <div className="px-1">
                    {error ? (
                        <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertCircle className="w-3 h-3" />
                            {error}
                        </span>
                    ) : hint ? (
                        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                            {hint}
                        </span>
                    ) : null}
                </div>
            )}
        </div>
    );
});

InputField.displayName = "InputField";