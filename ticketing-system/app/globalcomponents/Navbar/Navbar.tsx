"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Layers, 
  Activity, 
  FileText, 
  ArrowRight,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AuthButton } from '@/app/globalcomponents/AuthButton';
import { getCurrentUser } from '@/app/actions/getuser/getUser';
import { useLogout } from '@/app/hooks/logout/use-logout';

const GitHubIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const RushNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch User on Mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.success) {
          setUser(response.user);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setIsLoading(false); // Authentication check is complete
      }
    };
    fetchUser();
  }, []);

  // 2. Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Initialize the hook at the top of your component
  const { logout, isLoggingOut } = useLogout();

  // 2. Update the handler function
  // Inside RushNavbar.tsx
  const handleLogout = async () => {
    // Instant UI feedback:
    setIsUserMenuOpen(false); 
    setIsOpen(false); // Close mobile menu if open
    
    await logout();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const navLinks = [
    { name: 'Architecture', icon: <Layers />, href: "#stack" },
    { name: 'Load Reports', icon: <Activity />, href: "#test" },
    { name: 'Documentation', icon: <FileText />, href: "#docs" },
  ];

  const userMenuLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <Layers className="w-4 h-4" /> },
    { name: 'My Tickets', href: '/tickets', icon: <Activity className="w-4 h-4" /> },
    { name: 'Settings', href: '/settings', icon: <FileText className="w-4 h-4" /> },
  ];

  const userInitial = user
    ? (user.username ? user.username[0].toUpperCase() : user.email[0].toUpperCase())
    : null;

  return (
    <nav className={`fixed top-0 w-full z-100 transition-all duration-300 ${
        scrolled 
          ? 'bg-zinc-50/90 backdrop-blur-md border-b border-zinc-200 py-4 shadow-sm' 
          : 'bg-transparent py-8'
    }`}>

      
      <div className="max-w-425 mx-auto px-6 sm:px-10 flex items-center justify-between relative">
        
        {/* LEFT: BRANDING */}
        <Link 
          href={'/'}
          className="flex items-center gap-4 z-10 group cursor-pointer"
        >
          <div className="w-9 h-9 bg-zinc-950 flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-2.5 h-2.5 bg-emerald-500" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tighter leading-none text-zinc-950">
              RUSH<span className="text-emerald-600">TICKET</span>
            </h1>
            <p className="font-mono text-[9px] text-zinc-400 tracking-[0.3em] uppercase mt-1">
              CONCURRENCY V1.0
            </p>
          </div>
        </Link>

        {/* MIDDLE: LINKS (Desktop) */}
        <div className="hidden min-[1250px]:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-[10px] font-bold text-zinc-400 hover:text-emerald-600 transition-colors uppercase tracking-[0.4em] font-mono"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* RIGHT: ACTIONS (Desktop) */}
        <div className="hidden min-[1250px]:flex items-center gap-6 z-10">
          <a href="#" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-950 transition-colors">
            <GitHubIcon />
            <span className="text-xs font-medium">Star on GitHub</span>
          </a>

          {/* 1. Check if we are still fetching auth status. 
            Showing a subtle pulse prevents the "Logged Out" button from flashing.
          */}
          {isLoading ? (
            <div className="h-10 w-28 bg-zinc-100 animate-pulse rounded-full border border-zinc-200" />
          ) : !user ? (
            /* 2. Show only when we are CERTAIN there is no user */
            <AuthButton 
              showIcon={false}
              className="bg-zinc-950 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:bg-zinc-800 active:scale-[0.98]" 
            />
          ) : (
            /* 3. Show when user is authenticated */
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all bg-white"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                  {userInitial}
                </div>
                <span className="text-sm font-semibold text-zinc-700">
                  {user.username || "Account"}
                </span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-64 bg-white border border-zinc-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-zinc-50/50 border-b border-zinc-100">
                      <p className="text-xs font-medium text-zinc-500">Signed in as</p>
                      <p className="text-sm font-bold text-zinc-900 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-2">
                      {userMenuLinks.map((item) => (
                        <Link 
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-all"
                        >
                          <span className="text-zinc-400">{item.icon}</span>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="p-2 border-t border-zinc-100">
                      <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                        {isLoggingOut ? "Signing out..." : "Logout"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <div className="min-[1250px]:hidden z-10">
          <button 
            onClick={() => setIsOpen(true)}
            className={`flex items-center gap-3 border px-4 py-2 transition-colors ${scrolled ? 'border-zinc-200 bg-white hover:bg-zinc-50' : 'border-zinc-200 bg-white/50 hover:bg-white'}`}
          >
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Menu</span>
            <Menu className="text-zinc-950 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MOBILE FULL SCREEN PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
            className="fixed inset-0 z-[200] bg-zinc-950/20 backdrop-blur-sm flex justify-end"
          >
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="w-full sm:w-[450px] bg-zinc-50 h-screen shadow-[-40px_0_80px_rgba(0,0,0,0.1)] border-l border-zinc-200 flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-6 flex justify-between items-center border-b border-zinc-200 bg-white shrink-0">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-emerald-600 font-bold tracking-[0.2em] uppercase">
                    System Menu
                  </span>
                  <span className="text-xl font-bold text-zinc-950 tracking-tighter">
                    RUSHTICKET
                  </span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-3 border border-zinc-200 text-zinc-400 hover:text-zinc-950 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity Block — only when logged in */}
              {user && (
                <div className="px-6 py-5 bg-white border-b border-zinc-100 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-base shrink-0">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-zinc-900 truncate">
                        {user.username || "Account"}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              <div className="flex-1 px-6 py-8 flex flex-col gap-1 overflow-y-auto">
                {/* Page nav */}
                <p className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.2em] font-bold px-2 mb-3">
                  Navigation
                </p>
                {navLinks.map((link, idx) => (
                  <motion.a
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * idx }}
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between p-5 border border-transparent hover:border-zinc-200 hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <span className="text-[10px] font-mono text-zinc-300 font-bold">0{idx + 1}</span>
                      <span className="text-xl font-bold text-zinc-400 group-hover:text-zinc-950 transition-colors uppercase tracking-tighter">
                        {link.name}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-3 group-hover:translate-x-0" />
                  </motion.a>
                ))}

                {/* Account links — only when logged in */}
                {user && (
                  <>
                    <p className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.2em] font-bold px-2 mt-6 mb-3">
                      Account
                    </p>
                    {userMenuLinks.map((item, idx) => (
                      <motion.div
                        key={item.name}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.05 * (navLinks.length + idx) }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center justify-between p-5 border border-transparent hover:border-zinc-200 hover:bg-white transition-all"
                        >
                          <div className="flex items-center gap-5">
                            <span className="text-zinc-300 group-hover:text-zinc-500 transition-colors">
                              {item.icon}
                            </span>
                            <span className="text-xl font-bold text-zinc-400 group-hover:text-zinc-950 transition-colors uppercase tracking-tighter">
                              {item.name}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-3 group-hover:translate-x-0" />
                        </Link>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              {/* Panel Footer */}
              <div className="p-6 bg-white border-t border-zinc-200 flex flex-col gap-4 shrink-0">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest px-1 font-bold">External_Connect</span>
                  <a 
                    href="#" 
                    className="flex items-center justify-center gap-3 border border-zinc-200 text-zinc-600 py-3.5 font-bold text-[10px] tracking-[0.2em] hover:bg-zinc-950 hover:text-white transition-all uppercase"
                  >
                    <GitHubIcon />
                    Star on GitHub
                  </a>
                </div>

                {/* Auth CTA: show login button OR logout button */}
                {!user ? (
                  <AuthButton 
                    showIcon={false}
                    className="text-center w-full py-5 bg-zinc-950 text-white font-bold text-sm uppercase tracking-widest hover:bg-zinc-900 transition-all"
                  />
                ) : (
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 py-5 border border-red-100 bg-red-50 text-red-500 font-bold text-sm uppercase tracking-widest hover:bg-red-100 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.2em]">Build_2026.04</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500" />
                    <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.2em]">Status: Online</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default RushNavbar;