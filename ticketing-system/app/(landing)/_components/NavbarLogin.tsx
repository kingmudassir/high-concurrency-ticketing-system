'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/app/actions/logout';

interface NavbarLoginProps {
    user: {
        id: string;
        name: string;
        email: string;
        tokens: number;
        role: string;
    };
}

export default function NavbarLogin({ user }: NavbarLoginProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Get initials for the avatar (e.g., "John Doe" -> "JD")
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const handleLogout = async () => {
        await logoutUser();
        router.push('/');
        router.refresh(); // Forces the layout to re-run getCurrentUser
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Brand Logo */}
                    <Link href="/" className="group flex items-center space-x-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                            <span className="text-white text-xl">🎫</span>
                        </div>
                        <span className="font-black text-xl tracking-tight text-gray-900">
                            Ticket<span className="text-blue-600">Rush</span>
                        </span>
                    </Link>

                    {/* Navigation Links (Desktop) */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                            <span className="text-xs font-bold text-gray-500 mr-2 uppercase">Tokens:</span>
                            <span className="text-sm font-black text-blue-600">{user.tokens}</span>
                        </div>
                        <Link href="/events" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                            Browse Events
                        </Link>
                        <Link href="/my-tickets" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                            My Tickets
                        </Link>
                    </div>

                    {/* Profile Menu Section */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center space-x-3 p-1 rounded-full border border-gray-200 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-inner">
                                <span className="text-xs">{initials}</span> 
                            </div>
                            <span className="hidden sm:block text-sm font-bold text-gray-800 pr-2">{user.name}</span>
                            <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setIsOpen(false)}
                                />
                                
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-20 overflow-hidden ring-1 ring-black/5">
                                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Account</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                                    </div>

                                    <Link 
                                        href="/dashboard" 
                                        className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link 
                                        href="/settings" 
                                        className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Settings
                                    </Link>
                                    <hr className="my-1 border-gray-100" />
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left block px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}