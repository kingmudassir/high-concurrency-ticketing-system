"use client"

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import SocialLogin from "../../_components/SocialLogin";
import { LoginSchema } from "@/lib/zod";
import { useLoginMutation } from "@/app/hooks/login-hooks/use-login";

export default function LoginForm() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    // Hooks
    const { mutate, isPending, data } = useLoginMutation();

    // Handle Backend Errors
    useEffect(() => {
        if (data && !data.success) {
            if (data.errors) {
                const backendErrors: Record<string, string> = {};
                Object.entries(data.errors).forEach(([key, value]) => {
                    if (Array.isArray(value) && value.length > 0) {
                        backendErrors[key] = value[0];
                    }
                });
                setErrors(backendErrors);
            } else if (data.message) {
                // For generic "Invalid email or password" or "Banned" messages
                setErrors({ form: data.message });
            }
        }
    }, [data]);

    const clearError = (fieldName: string) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            delete newErrors["form"]; // Clear general form error when user types
            return newErrors;
        });
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const rawData = Object.fromEntries(formData.entries());
        const result = LoginSchema.safeParse(rawData);

        // Client-side Validation
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            const newErrors: Record<string, string> = {};

            Object.keys(fieldErrors).forEach((key) => {
                const errorArray = fieldErrors[key as keyof typeof fieldErrors];
                if (errorArray && errorArray.length > 0) {
                    newErrors[key] = errorArray[0];
                }
            });

            setErrors(newErrors);
            return;
        }

        mutate(formData);
    }

    return (
        <div className="bg-white rounded-4xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 select-none">
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* General Form Error (e.g., Invalid Credentials) */}
                {errors.form && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 animate-in fade-in zoom-in-95">
                        <p className="text-xs text-red-600 font-bold text-center">
                            {errors.form}
                        </p>
                    </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                        Email Address
                    </label>
                    <input
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        onChange={() => clearError("email")}
                        className={`w-full px-4 py-3.5 rounded-2xl border bg-gray-50/30 text-sm focus:ring-2 outline-none transition-all placeholder:text-gray-300 ${
                            errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-100 focus:ring-blue-500"
                        }`}
                    />
                    {errors.email && (
                        <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Password
                        </label>
                        <button 
                            type="button" 
                            className="text-[10px] text-blue-600 font-bold hover:underline cursor-not-allowed"
                            onClick={(e) => e.preventDefault()}
                        >
                            Forgot?
                        </button>
                    </div>
                    <div className="relative group">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            onChange={() => clearError("password")}
                            className={`w-full px-4 py-3.5 rounded-2xl border bg-gray-50/30 text-sm pr-12 focus:ring-2 outline-none transition-all placeholder:text-gray-300 ${
                                errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-100 focus:ring-blue-500"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button 
                    type="submit"
                    disabled={isPending}
                    className="w-full py-4 rounded-2xl font-black text-sm bg-black text-white hover:bg-gray-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 mt-2"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            VERIFYING...
                        </>
                    ) : (
                        "Sign In to TicketRush"
                    )}
                </button>

                <SocialLogin />
            </form>
        </div>
    );
}