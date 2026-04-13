import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
            
            {/* Brand Logo */}
            <Link 
                href="/" 
                className="group flex items-center space-x-2"
            >
                <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white text-xl">🎫</span>
                </div>
                <span className="font-black text-xl tracking-tight text-gray-900">
                Ticket<span className="text-blue-600">Rush</span>
                </span>
            </Link>

            {/* Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
                <Link href="/events" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                Browse Events
                </Link>
                <Link href="/about" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                How it Works
                </Link>
                <Link href="/pricing" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
                </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
                <Link 
                href="/login" 
                className="hidden sm:block text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                Sign In
                </Link>
                
                <Link 
                href="/register" 
                className="relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-bold text-white transition-all duration-300 bg-black rounded-xl cursor-pointer group active:scale-95 shadow-xl shadow-black/10"
                >
                <span className="relative">Get Started</span>
                </Link>
            </div>

            </div>
        </div>
        </nav>
    );
}