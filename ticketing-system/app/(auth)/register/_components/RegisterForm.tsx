"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { InputField } from './InputField';
import Link from 'next/link';
import { RegisterSchema } from '@/lib/validation/zod';
import { useRegisterMutation } from '@/app/hooks/register/useRegister';
import { z } from "zod";

type RegisterValues = z.infer<typeof RegisterSchema>;

export function RegisterForm() {
    const { mutate, isPending } = useRegisterMutation();
    
    const { 
        register, 
        handleSubmit, 
        setError, 
        watch,        
        clearErrors, 
        formState: { errors } 
    } = useForm<RegisterValues>({
        resolver: zodResolver(RegisterSchema),
        // Validate when user leaves the field for the first time
        mode: "onBlur",
        // CRITICAL: Stop the library from auto-showing errors while typing
        reValidateMode: "onBlur", 
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const password = watch("password", "");
    const confirmPassword = watch("confirmPassword", "");

    const strength = {
        length: password.length >= 8,
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        number: /[0-9]/.test(password),
        match: password === confirmPassword && confirmPassword !== ''
    };

    const onSubmit = (data: RegisterValues) => {
        const submitData = new FormData();
        Object.entries(data).forEach(([key, val]) => {
            submitData.append(key, val);
        });

        mutate(submitData, {
            onSuccess: (res) => {
                if (!res.success) {
                    if (res.errors) {
                        // existing field error handling
                        Object.entries(res.errors).forEach(([key, messages]) => {
                            setError(key as keyof RegisterValues, { 
                                type: "server",
                                message: Array.isArray(messages) ? messages[0] : messages 
                            });
                        });
                    } else if (res.message) {
                        // NEW: handle the general message from registerUser catch block
                        setError("email", {   // or use "root" if you prefer
                            type: "server",
                            message: res.message 
                        });
                    }
                }
            },
            // ADD THIS BLOCK:
            onError: (error) => {
                // This runs if the server crashes (500 error)
                console.error("Mutation failed:", error);
                
                // You can manually set a general error on a field 
                // or a global toast to let the user know the system failed.
                setError("email", { 
                    type: "server", 
                    message: "A critical system error occurred. Please try again." 
                });
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

            {/* Global Error Message */}
            {errors.root?.serverError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
                        {errors.root.serverError.message}
                    </p>
                </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <InputField 
                    label="Username" 
                    icon={User} 
                    type="text" 
                    placeholder="e.g. KingMoody" 
                    disabled={isPending}
                    error={errors.username?.message}
                    {...register("username", {
                        onChange: () => clearErrors("username") 
                    })}
                />
                
                <InputField 
                    label="Email Address" 
                    icon={Mail} 
                    type="email" 
                    placeholder="name@company.com" 
                    disabled={isPending}
                    error={errors.email?.message}
                    {...register("email", {
                        onChange: () => clearErrors("email")
                    })}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField 
                        label="Password" 
                        icon={Lock} 
                        type="password" 
                        placeholder="••••••••" 
                        disabled={isPending}
                        error={errors.password?.message}
                        {...register("password", {
                            onChange: () => clearErrors("password")
                        })}
                    />
                    <InputField 
                        label="Confirm" 
                        icon={Lock} 
                        type="password" 
                        placeholder="••••••••" 
                        disabled={isPending}
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword", {
                            onChange: () => clearErrors("confirmPassword")
                        })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-y-2 pt-2">
                    <StrengthCheck label="8+ Characters" active={strength.length} />
                    <StrengthCheck label="Special Char" active={strength.special} />
                    <StrengthCheck label="Number" active={strength.number} />
                    <StrengthCheck label="Passwords Match" active={strength.match} />
                </div>

                {/* Terms and Button logic remains same */}
                <div className="flex items-start gap-3 pt-2">
                    <input type="checkbox" id="terms" required className="w-4 h-4 shrink-0 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-500" />
                    <label htmlFor="terms" className="text-[11px] text-zinc-500 leading-normal cursor-pointer select-none">
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
                    {isPending ? "Processing..." : "Create an account"}
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