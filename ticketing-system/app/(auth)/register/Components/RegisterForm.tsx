"use client";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import SocialLogin from "../../_components/SocialLogin";

export default function RegisterForm() {
    return (
        <div className="bg-white rounded-4xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
        <div className="space-y-5">
            
            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                First Name
                </label>
                <input
                type="text"
                placeholder="Ahmed"
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Last Name
                </label>
                <input
                type="text"
                placeholder="Khan"
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                />
            </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Email Address
            </label>
            <input
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
            />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Create Password
            </label>
            <div className="relative group">
                <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm pr-12 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <Eye size={18} />
                </button>
            </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Confirm Password
            </label>
            <div className="relative group">
                <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm pr-12 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <EyeOff size={18} />
                </button>
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
            <button className="w-full py-4 rounded-2xl font-black text-sm bg-black text-white hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl shadow-black/10 mt-2">
            Create My Account
            </button>

            <SocialLogin />
        </div>
        </div>
    );
}