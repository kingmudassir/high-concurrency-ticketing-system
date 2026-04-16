import Link from "next/link";

export default async function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      {/* This container exactly matches the max-width and padding 
         of your Events page layout for perfect vertical alignment.
      */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex justify-between items-center h-20">
          
          {/* Left Side: Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-600/20">
              <span className="text-white text-xl leading-none">🎫</span>
            </div>
            <span className="font-black tracking-tighter text-2xl text-gray-900">
              ticket<span className="text-blue-600">rush</span>
            </span>
          </Link>

          {/* Right Side: Navigation & Actions */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/events" 
                className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 transition-colors"
              >
                Events
              </Link>
              <Link 
                href="/login" 
                className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
            </div>

            {/* Premium CTA Button */}
            <Link
              href="/register"
              className="px-6 py-3 rounded-2xl bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/20 active:scale-95 transition-all"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}