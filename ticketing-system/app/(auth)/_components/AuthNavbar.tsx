import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthNavbar() {
    return (
        <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center bg-transparent">
            {/* Back to Home Link */}
            <Link 
                href="/" 
                className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-all"
            >
                <div className="p-2 rounded-full bg-white border border-gray-100 group-hover:border-gray-200 shadow-sm transition-all">
                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <span>Back to Home</span>
            </Link>

            {/* Subtle Brand Mark */}
            <Link href="/" className="flex items-center space-x-1.5 opacity-60 hover:opacity-100 transition-opacity">
                <span className="text-xl">🎫</span>
                <span className="font-black text-lg tracking-tight text-gray-900">
                    Ticket<span className="text-blue-600">Rush</span>
                </span>
            </Link>
        </nav>
    );
}