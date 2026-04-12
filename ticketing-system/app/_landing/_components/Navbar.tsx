import Link from 'next/link';

export default async function Navbar() {
    return (
        <nav className="border-b border-gray-200 flex justify-between items-center px-10 py-4">
        {/* Left side of navbar */}
        <Link 
            href="/"
            className="font-bold tracking-tighter text-2xl"
        >
            ticket
            <span className="text-blue-600">
            rush
            </span>
        </Link>

        {/* Right side of navbar */}
        <div className="flex justify-center items-center space-x-5 text-lg text-gray-500">
            <Link 
            href={'/events'}
            className="cursor-pointer hover:text-gray-700">
            Events
            </Link>

            <div className="cursor-pointer hover:text-gray-700">
            Login
            </div>

            <div className="px-4 py-2 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-400">
            Sign up
            </div>
        </div>
        </nav>
    );
}