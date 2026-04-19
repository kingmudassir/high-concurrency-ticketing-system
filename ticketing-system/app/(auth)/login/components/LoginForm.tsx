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
                    // FIX: Use the 'in' operator to prove to TS that 'errors' exists
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
        <div className="bg-white border border-zinc-200 p-8 sm:p-12 shadow-sm relative w-full lg:w-auto max-w-125 lg:max-w-none mx-auto select-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-950" />
            
            <div className="mb-10 flex justify-between items-start gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-950 uppercase tracking-tighter">
                        Login
                    </h2>

                </div>
                <div className="shrink-0 w-10 h-10 bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                    <div className="w-2 h-2 bg-zinc-950 rotate-45" />
                </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <InputField 
                    label="email" 
                    icon={Mail} 
                    type="email" 
                    placeholder="name@company.com" 
                    disabled={isPending}
                    error={errors.email?.message}
                    {...register("email", {
                        onChange: () => clearErrors("email")
                    })}
                />
                
                <InputField 
                    label="password" 
                    icon={Lock} 
                    type="password" 
                    placeholder="••••••••••••" 
                    disabled={isPending}
                    forgotPasswordLink={true}
                    error={errors.password?.message}
                    {...register("password", {
                        onChange: () => clearErrors("password")
                    })}
                />

                <div className="pt-4 space-y-4">
                    <button 
                        type="submit"
                        disabled={isPending}
                        className={`group w-full bg-zinc-950 text-white py-5 font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-[0.99] ${
                            isPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-zinc-900'
                        }`}
                    >
                        <LogIn className={`w-4 h-4 ${isPending ? 'animate-pulse' : 'text-emerald-500'}`} />
                        {isPending ? "Logging In..." : "Login"}
                        {!isPending && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 p-4">
                        <ShieldAlert className="w-4 h-4 text-zinc-400" />
                        <p className="text-[9px] font-mono text-zinc-400 leading-tight uppercase tracking-wider">
                            Unauthorized access attempts are logged and mapped to origin IP.
                        </p>
                    </div>
                </div>
            </form>

            <div className="mt-10 pt-8 border-t border-zinc-100 flex flex-col items-center gap-6">
                <p className="text-xs text-zinc-400 font-medium">
                    New User? &nbsp;
                    <Link 
                        href="/register" 
                        className="text-zinc-950 font-bold underline decoration-emerald-500 underline-offset-4 uppercase tracking-tighter hover:text-emerald-600 transition-colors">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}