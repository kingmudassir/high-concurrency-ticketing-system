import { Eye, Loader2 } from "lucide-react";
import SocialLogin from "../../_components/SocialLogin";

export default function LoginForm() {
    return (
        <div className="bg-white rounded-4xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
        <div className="space-y-5">
            
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
            <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Password
                </label>
                <button className="text-[10px] text-blue-600 font-bold hover:underline">
                Forgot?
                </button>
            </div>
            <div className="relative group">
                <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm pr-12 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                />
                <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                <Eye size={18} />
                </button>
            </div>
            </div>

            {/* Submit Button */}
            <button className="w-full py-4 rounded-2xl font-black text-sm bg-black text-white hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 mt-2">
            Sign In to TicketRush
            </button>

            <SocialLogin />
        </div>
        </div>
    );
}