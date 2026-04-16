"use client"

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import SocialLogin from "../../_components/SocialLogin";
import { RegisterSchema } from "@/lib/zod";
import { useEffect, useState } from "react";
import { useRegisterMutation } from "@/app/hooks/registeration-hooks/use-register";

export default function RegisterFormUI() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    //Hooks
    const { mutate, isPending, data } = useRegisterMutation();

    useEffect(() => {
        if (data && !data.success && data.errors) {
            const backendErrors: Record<string, string> = {};
            
            // Transform the Zod error arrays into single strings
            Object.entries(data.errors).forEach(([key, value]) => {
                if (Array.isArray(value) && value.length > 0) {
                    backendErrors[key] = value[0];
                }
            });
            
            setErrors(backendErrors);
        }
    }, [data]);


    const passwordsMatch = password === confirmPassword;
    const showMatchError = confirmPassword.length > 0 && !passwordsMatch;


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrors({})   // Clear old errors

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())
        const result = RegisterSchema.safeParse(data)

        // 1. Client-side Validation
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            const newErrors: Record<string, string> = {};

            (Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>).forEach((key) => {
                const errorArray = fieldErrors[key];
                if (errorArray && errorArray.length > 0) {
                    newErrors[key] = errorArray[0];
                }
            });

            setErrors(newErrors);
            return; // Stop here if Zod finds errors
        }

        // 2. If we reach this point, the data is valid on the client.
        // Now, send it to the server!
        mutate(formData);
    }

    const clearError = (fieldName: string) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };

    return (
        <div className="bg-white rounded-4xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 select-none">
            <div className="space-y-5">
                <form onSubmit={handleSubmit}>
                    {/* Name Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                First Name
                            </label>
                            <input
                                name="firstName"
                                type="text"
                                placeholder="Ahmed"
                                onChange={() => clearError("firstName")}
                                className={`w-full px-4 py-3.5 rounded-2xl border bg-gray-50/30 text-sm focus:ring-2 outline-none transition-all placeholder:text-gray-300 ${errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-100 focus:ring-blue-500"}`}
                            />

                            {/* The Error Message */}
                            {errors.firstName && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                Last Name
                            </label>
                            <input
                                name="lastName"
                                type="text"
                                placeholder="Khan"
                                onChange={() => clearError("lastName")}
                                className={`w-full px-4 py-3.5 rounded-2xl border bg-gray-50/30 text-sm focus:ring-2 outline-none transition-all placeholder:text-gray-300 ${errors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-100 focus:ring-blue-500"}`}
                            />

                            {/* The Error Message */}
                            {errors.lastName && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                                    {errors.lastName}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2 mt-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            onKeyDown={(e) => {
                                if (e.key === " ") {
                                e.preventDefault()
                                }
                            }}
                            onChange={() => clearError("email")}
                            placeholder="name@company.com"
                            className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                        />

                        {/* The Error Message */}
                            {errors.email && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                                    {errors.email}
                                </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2 mt-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                            Create Password
                        </label>
                        <div className="relative group">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onKeyDown={(e) => {
                                    if (e.key === " ") {
                                    e.preventDefault()
                                    }
                                }}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearError("password");
                                }}
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm pr-12 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>

                            {/* The Error Message */}
                            {errors.password && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2 mt-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onKeyDown={(e) => {
                                    if (e.key === " ") {
                                    e.preventDefault()
                                    }
                                }}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    clearError("confirmPassword");
                                }}
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm pr-12 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>

                            {showMatchError && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                                    Passwords do not match
                                </p>
                            )}

                            {confirmPassword.length > 0 && passwordsMatch && (
                                <p className="text-[10px] text-green-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                                    Passwords match!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3 px-1 py-4">
                        <input
                            id="terms"
                            type="checkbox"
                            className="w-4 h-4 mt-0.5 rounded border-gray-200 accent-black cursor-pointer transition-all"
                        />
                        <label htmlFor="terms" className="text-xs text-gray-500 leading-normal cursor-pointer font-medium">
                            I agree to the{" "}
                            <Link href="/terms" className="text-gray-900 font-bold hover:underline underline-offset-2">Terms</Link>
                            {" "}and{" "}
                            <Link href="/privacy" className="text-gray-900 font-bold hover:underline underline-offset-2">Privacy Policy</Link>
                        </label>
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
                                <span>REGISTERING...</span>
                            </>
                        ) : (
                            "CREATE MY ACCOUNT"
                        )}
                    </button>
                </form>
                <SocialLogin />
            </div>
        </div>
    );
}