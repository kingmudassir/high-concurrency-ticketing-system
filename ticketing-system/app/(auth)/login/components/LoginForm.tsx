"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, LogIn, ArrowRight, ShieldAlert } from 'lucide-react';
import { InputField } from './InputField';
import Link from 'next/link';
import { LoginSchema } from '@/lib/validation/zod';
import { z } from "zod";
import { useLoginMutation } from "@/app/hooks/login/useLogin";

type LoginValues = z.infer<typeof LoginSchema>;

export function LoginForm() {
    const { mutate, isPending } = useLoginMutation();
    
    const { 
        register, 
        handleSubmit, 
        setError, 
        clearErrors, 
        formState: { errors } 
    } = useForm<LoginValues>({
        resolver: zodResolver(LoginSchema),
        mode: "onBlur",
        reValidateMode: "onBlur", 
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = (data: LoginValues) => {
        const submitData = new FormData();
        Object.entries(data).forEach(([key, val]) => {
            submitData.append(key, val);
        });

        mutate(submitData, {
            onSuccess: (res) => {
                if (!res.success) {
                    if ("errors" in res && res.errors) {
                        Object.entries(res.errors).forEach(([key, messages]) => {
                            setError(key as keyof LoginValues, { 
                                type: "server",
                                message: Array.isArray(messages) ? messages[0] : (messages as string) 
                            });
                        });
                    } else if (res.message) {
                        setError("email", { 
                            type: "server",
                            message: res.message 
                        });
                    }
                }
            },
            onError: (error) => {
                console.error("Login attempt failed:", error);
                setError("email", { 
                    type: "server", 
                    message: "Authentication server unreachable. Protocol breach suspected." 
                });
            }
        });
    };

    return (
        <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                {/* Top accent bar */}
                <div className="h-0.5 sm:h-1 bg-emerald-500" />
                
                <div className="p-5 sm:p-6 md:p-8 lg:p-10">
                    {/* Header */}
                    <div className="mb-5 sm:mb-6 md:mb-8">
                        <h2 className="text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-tighter">
                            Welcome Back
                        </h2>
                        <p className="text-[9px] sm:text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">
                            Sign in to your account
                        </p>
                    </div>

                    <form className="space-y-4 sm:space-y-5 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <InputField 
                            label="Email" 
                            icon={Mail} 
                            type="email" 
                            placeholder="name@company.com" 
                            disabled={isPending}
                            error={errors.email?.message}
                            required
                            {...register("email", {
                                onChange: () => clearErrors("email")
                            })}
                        />
                        
                        <InputField 
                            label="Password" 
                            icon={Lock} 
                            type="password" 
                            placeholder="••••••••" 
                            disabled={isPending}
                            forgotPasswordLink={true}
                            error={errors.password?.message}
                            required
                            {...register("password", {
                                onChange: () => clearErrors("password")
                            })}
                        />

                        <div className="pt-3 sm:pt-4">
                            <button 
                                type="submit"
                                disabled={isPending}
                                className={`
                                    w-full bg-zinc-950 text-white rounded-lg sm:rounded-xl 
                                    py-3 sm:py-4 
                                    font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] 
                                    flex items-center justify-center gap-2 sm:gap-3
                                    transition-all duration-300
                                    hover:bg-zinc-900 hover:shadow-md
                                    active:scale-[0.98]
                                    disabled:opacity-70 disabled:cursor-not-allowed
                                `}
                            >
                                <LogIn className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isPending ? 'animate-pulse' : 'text-emerald-400'}`} />
                                {isPending ? "Logging In..." : "Sign In"}
                                {!isPending && (
                                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-stone-100 text-center">
                        <p className="text-[9px] sm:text-[10px] font-mono text-zinc-500">
                            Don't have an account? &nbsp;
                            <Link 
                                href="/register" 
                                className="font-bold text-zinc-950 hover:text-emerald-600 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {/* Security Note */}
                    <div className="mt-4 sm:mt-6 flex items-center justify-center gap-1.5 sm:gap-2">
                        <ShieldAlert className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-400" />
                        <p className="text-[6px] sm:text-[7px] font-mono text-stone-400 uppercase tracking-wider">
                            Secure • Encrypted • Protected
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}