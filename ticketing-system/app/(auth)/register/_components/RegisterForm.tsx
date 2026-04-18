"use client";
import { useState, useMemo } from 'react';
import { UserPlus, ArrowRight, User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { InputField } from './InputField';
import Link from 'next/link';
import { RegisterSchema } from '@/lib/validation/zod';
import { useRegisterMutation } from '@/app/hooks/register/register';

export function RegisterForm() {
    const { mutate, isPending } = useRegisterMutation();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const strength = useMemo(() => ({
        length: formData.password.length >= 8,
        special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        match: formData.password === formData.confirmPassword && formData.confirmPassword !== ''
    }), [formData.password, formData.confirmPassword]);

    const clearError = (field: keyof typeof formData) => {
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = RegisterSchema.safeParse(formData);

    if (!result.success) {
        const formattedErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
            formattedErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(formattedErrors);
        return;
    }

    // Prepare FormData for the Server Action
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
    });

    mutate(submitData, {
        onSuccess: (data) => {
            if (!data.success) {
                // Handle Server-side validation or logic errors (e.g., Email in use)
                if (data.errors) {
                    // Flatten server errors back into our local error state
                    const serverErrors: Record<string, string> = {};
                    Object.entries(data.errors).forEach(([key, messages]) => {
                        serverErrors[key] = Array.isArray(messages) ? messages[0] : messages;
                    });
                    setErrors(serverErrors);
                } else if (data.message) {
                    // If no specific field error, set a general error (optional)
                    alert(data.message);
                }
            }
            // If data.success is true, the hook handles the redirect to "/"
        }
    });
    };

    return (
        <div className="bg-white border border-zinc-200 p-6 sm:p-10 lg:p-12 shadow-sm relative w-full lg:w-auto max-w-125 lg:max-w-none mx-auto select-none">
            <div className="mb-8 flex justify-between items-start gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 uppercase tracking-tighter">
                        Create Account
                    </h2>
                </div>
                <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-zinc-950 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-emerald-500" />
                </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <InputField 
                    label="Username" 
                    icon={User} 
                    type="text" 
                    placeholder="e.g. KingMoody" 
                    disabled={isPending}
                    error={errors.username}
                    onChange={(e) => {
                        setFormData({ ...formData, username: e.target.value });
                        clearError('username');
                    }}
                />
                <InputField 
                    label="Email Address" 
                    icon={Mail} 
                    type="email" 
                    placeholder="name@company.com" 
                    disabled={isPending}
                    error={errors.email}
                    onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        clearError('email');
                    }}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField 
                        label="Password" 
                        icon={Lock} 
                        type="password" 
                        placeholder="••••••••" 
                        disabled={isPending}
                        error={errors.password}
                        onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            clearError('password');
                        }}
                    />
                    <InputField 
                        label="Confirm" 
                        icon={Lock} 
                        type="password" 
                        placeholder="••••••••" 
                        disabled={isPending}
                        error={errors.confirmPassword}
                        onChange={(e) => {
                            setFormData({ ...formData, confirmPassword: e.target.value });
                            clearError('confirmPassword');
                        }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-y-2 pt-2">
                    <StrengthCheck label="8+ Characters" active={strength.length} />
                    <StrengthCheck label="Special Char" active={strength.special} />
                    <StrengthCheck label="Number" active={strength.number} />
                    <StrengthCheck label="Passwords Match" active={strength.match} />
                </div>

                <div className="flex items-start gap-3 pt-2">
                    <input
                        type="checkbox"
                        id="terms"
                        className=" w-4 h-4 shrink-0 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                    />
                    <label
                        htmlFor="terms"
                        className="text-[11px] text-zinc-500 leading-normal cursor-pointer select-none"
                    >
                        I acknowledge the <span className="text-zinc-950 font-bold underline underline-offset-2">Service Protocol</span> and data encryption policies.
                    </label>
                </div>
                <button 
                    type="submit"
                    disabled={isPending}
                    className={`w-full bg-zinc-950 text-white py-4 font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] mt-4 ${
                        isPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-zinc-900'
                    }`}
                >
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        <>
                            <UserPlus className="w-4 h-4 text-emerald-500" />
                            Create an account
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col items-center gap-4 text-center">
                <p className="text-[11px] text-zinc-400 font-medium">
                    Already have an account? &nbsp;
                    <Link 
                        href={'/login'} 
                        className="text-zinc-950 font-bold underline decoration-emerald-500 underline-offset-4 uppercase tracking-tighter hover:text-emerald-600 transition-colors">
                        Sign In
                    </Link>
                </p>
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-mono text-zinc-300 uppercase tracking-widest">
                        System Online & Encrypted
                    </span>
                </div>
            </div>
        </div>
    );
}

function StrengthCheck({ label, active }: { label: string; active: boolean }) {
    return (
        <div className={`flex items-center gap-2 transition-colors ${active ? 'text-emerald-600' : 'text-zinc-300'}`}>
            <CheckCircle2 className={`w-3.5 h-3.5 ${active ? 'fill-emerald-50' : ''}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
        </div>
    );
}