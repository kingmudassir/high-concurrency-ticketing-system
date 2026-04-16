import Link from "next/link";

export default function RegisterFooter() {
    return (
        <div className="mt-8 flex flex-col items-center space-y-4">
            <p className="text-sm text-gray-500 font-medium">
                Already a member?{" "}
                <Link 
                    href="/login" 
                    className="text-gray-900 font-black hover:text-blue-600 transition-colors underline underline-offset-4 decoration-gray-200 hover:decoration-blue-600"
                >
                    Sign in to your account
                </Link>
            </p>
            
            {/* Minimalist Legal/Support Links - Keeping it identical to Login for consistency */}
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <Link href="/help" className="hover:text-gray-600 transition-colors">Support</Link>
            </div>
        </div>
    );
}