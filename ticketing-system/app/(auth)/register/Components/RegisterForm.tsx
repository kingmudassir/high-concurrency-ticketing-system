"use client";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import SocialLogin from "../../_components/SocialLogin";
import { useState } from "react";
import { useRegisterMutation } from "@/app/hooks/use-register";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setConfirmShowPassword] = useState(false)

    const {mutate, isPending, isSuccess, data, reset} = useRegisterMutation()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        mutate(formData);
    }

    return (
        <div className="bg-white rounded-4xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 select-none">
            <div className="space-y-5">

                <form onSubmit={handleSubmit}>
                    {data?.message && !data.success && (
                        <p className="text-xs text-center text-red-600 bg-red-50 py-2 rounded-lg font-bold">
                            {data.message}
                        </p>
                    )}

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
                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                            />
                            {
                                data?.errors?.firstName && (
                                    <p className="text-[10px] text-red-500 font-bold ml-1">{data.errors.firstName[0]}</p>
                                )
                            }
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                Last Name
                            </label>
                            <input
                                name="lastName"
                                type="text"
                                placeholder="Khan"
                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                            />
                            {
                                data?.errors?.lastName && (
                                    <p className="text-[10px] text-red-500 font-bold ml-1">{data.errors.lastName[0]}</p>
                                )
                            }
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            onKeyDown={(e) => {
                                if (e.key === " ") {
                                e.preventDefault()
                                }
                            }}
                            className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                        />
                        {
                                data?.errors?.email && (
                                    <p className="text-[10px] text-red-500 font-bold ml-1">{data.errors.email[0]}</p>
                                )
                            }
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                            Create Password
                        </label>
                        <div className="relative group">
                            <input
                                name="password"
                                type={ showPassword ? "text" : "password" }
                                placeholder="••••••••"
                                onKeyDown={(e) => {
                                    if (e.key === " ") {
                                    e.preventDefault()
                                    }
                                }}
                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm pr-12 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                            />
                            <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                {
                                    showPassword ? <Eye size={18} /> : <EyeOff size={18} />
                                }
                            </button>
                            {data?.errors?.password && (
                                <p className="text-[10px] text-red-500 font-bold ml-1">{data.errors.password[0]}</p>
                            )}

                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <input
                                name="confirmPassword"
                                type={ showConfirmPassword ? "text" : "password" }
                                placeholder="••••••••"
                                onKeyDown={(e) => {
                                    if (e.key === " ") {
                                    e.preventDefault()
                                    }
                                }}
                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm pr-12 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                            />
                            <button 
                            type="button"
                            onClick={() => setConfirmShowPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                {
                                    showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />
                                }
                            </button>
                            {data?.errors?.confirmPassword && (
                                <p className="text-[10px] text-red-500 font-bold ml-1">{data.errors.confirmPassword[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3 px-1 py-2">
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
                    disabled={isPending}
                    className="w-full py-4 rounded-2xl font-black text-sm bg-black text-white hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl shadow-black/10 mt-2">
                        {isPending ? "PROCESSING..." : "CREATE MY ACCOUNT"}
                    </button>
                </form>
                <SocialLogin />
            </div>
        </div>
    );
}