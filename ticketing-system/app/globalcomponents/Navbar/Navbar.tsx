"use client";

import { useState, useEffect, useRef } from 'react';
import { Menu, X, Layers, Activity, FileText, ArrowRight, LogOut, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AuthButton } from '@/app/globalcomponents/AuthButton';
import { useLogout } from '@/app/hooks/logout/use-logout';
import { useAuth } from '@/app/hooks/auth/useAuth';

const GitHubIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-current">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export default function RushNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout, isLoggingOut } = useLogout();
  const { user, isLoading } = useAuth();

  // Remove the manual fetchUser useEffect - useAuth already handles this!

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsOpen(false);
    await logout();
  };

  const userInitial = user
    ? (user.username ? user.username[0].toUpperCase() : user.email[0].toUpperCase())
    : null;

  const navLinks = [
    { name: 'Browse Events', href: '/events' },
    { name: 'My Tickets', href: '/tickets' },
  ];

  const userMenuLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <Layers className="w-3.5 h-3.5" /> },
    { name: 'My Tickets', href: '/tickets', icon: <Activity className="w-3.5 h-3.5" /> },
    { name: 'Settings', href: '/settings', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl border-b border-zinc-100 shadow-sm shadow-zinc-100'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LEFT: Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 bg-zinc-950 flex items-center justify-center overflow-hidden">
            <div className="w-2 h-2 bg-emerald-400 group-hover:scale-[4] transition-transform duration-500 ease-in-out rounded-full" />
          </div>
          <div>
            <span className="text-[15px] font-black tracking-[-0.04em] text-zinc-950 uppercase">
              Rush<span className="text-emerald-500">Ticket</span>
            </span>
            <p className="text-[7px] font-mono text-zinc-400 tracking-[0.25em] uppercase leading-none mt-0.5">
              v1.0 — live
            </p>
          </div>
        </Link>

        {/* MIDDLE: Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-950 transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-emerald-500 group-hover:w-full transition-all duration-200" />
            </Link>
          ))}
        </div>

        {/* RIGHT: GitHub + Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {/* GitHub Star — always visible */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-2 px-3.5 py-2 border text-[11px] font-bold uppercase tracking-widest transition-all group ${
              scrolled
                ? 'border-zinc-200 text-zinc-500 hover:border-zinc-950 hover:text-zinc-950 bg-white'
                : 'border-white/20 text-white/70 hover:border-white hover:text-white bg-white/5'
            }`}
          >
            <GitHubIcon />
            <Star className="w-3 h-3 fill-current opacity-60 group-hover:opacity-100 transition-opacity" />
            <span>Star</span>
          </a>

          {/* Auth Section */}
          {isLoading ? (
            <div className="w-28 h-9 bg-zinc-100 animate-pulse rounded" />
          ) : !user ? (
            <AuthButton
              showIcon={false}
              className={`px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
                scrolled
                  ? 'bg-zinc-950 text-white hover:bg-emerald-600'
                  : 'bg-white text-zinc-950 hover:bg-emerald-400'
              }`}
            />
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2.5 px-3 py-1.5 border transition-all ${
                  scrolled
                    ? 'border-zinc-200 bg-white hover:border-zinc-400'
                    : 'border-white/20 bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="w-6 h-6 bg-emerald-500 flex items-center justify-center text-white font-bold text-[10px]">
                  {userInitial}
                </div>
                <span className={`text-[11px] font-bold tracking-wide ${scrolled ? 'text-zinc-700' : 'text-white'}`}>
                  {user.username || 'Account'}
                </span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white border border-zinc-200 shadow-xl shadow-zinc-200/50 z-50"
                  >
                    <div className="p-3 border-b border-zinc-100">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-bold text-zinc-900 truncate mt-0.5">{user.email}</p>
                    </div>
                    {userMenuLinks.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[12px] font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                      >
                        <span className="text-zinc-400">{item.icon}</span>
                        {item.name}
                      </Link>
                    ))}
                    <div className="p-2 border-t border-zinc-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* MOBILE: Hamburger */}
        <button
          onClick={() => setIsOpen(true)}
          className={`lg:hidden flex items-center gap-2 px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all ${
            scrolled
              ? 'border-zinc-200 text-zinc-600 bg-white'
              : 'border-white/30 text-white bg-white/10'
          }`}
        >
          Menu
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* MOBILE SLIDE PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
            className="fixed inset-0 z-200 bg-zinc-950/40 backdrop-blur-sm"
          >
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="absolute right-0 top-0 h-full w-full sm:w-105 bg-white flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
                <div>
                  <p className="text-[9px] font-mono text-emerald-500 font-bold tracking-[0.3em] uppercase">System / Nav</p>
                  <p className="text-xl font-black tracking-[-0.04em] uppercase text-zinc-950">RushTicket</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 border border-zinc-200 text-zinc-400 hover:text-zinc-950 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User block */}
              {user && (
                <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center text-white font-black text-sm">
                    {userInitial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-950">{user.username || 'Account'}</p>
                    <p className="text-xs text-zinc-400">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex-1 px-6 py-6 flex flex-col gap-1 overflow-y-auto">
                <p className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.3em] mb-3">Navigation</p>
                {navLinks.map((link, i) => (
                  <motion.div key={link.name} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.04 * i }}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between py-4 border-b border-zinc-100 hover:border-zinc-300 transition-colors"
                    >
                      <span className="text-lg font-black uppercase tracking-tighter text-zinc-400 group-hover:text-zinc-950 transition-colors">
                        {link.name}
                      </span>
                      <ArrowRight className="w-4 h-4 text-emerald-500 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </motion.div>
                ))}

                {user && (
                  <>
                    <p className="text-[9px] font-mono text-zinc-300 uppercase tracking-[0.3em] mt-6 mb-3">Account</p>
                    {userMenuLinks.map((item, i) => (
                      <motion.div key={item.name} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.04 * (navLinks.length + i) }}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center justify-between py-4 border-b border-zinc-100 hover:border-zinc-300 transition-colors"
                        >
                          <div className="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-950 transition-colors">
                            {item.icon}
                            <span className="text-lg font-black uppercase tracking-tighter">{item.name}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-emerald-500 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-zinc-100 flex flex-col gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2.5 py-4 border border-zinc-200 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all"
                >
                  <GitHubIcon />
                  <Star className="w-3 h-3 fill-current" />
                  Star on GitHub
                </a>

                {!user ? (
                  <AuthButton
                    showIcon={false}
                    className="w-full py-4 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors text-center"
                  />
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2.5 py-4 border border-red-100 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                )}

                <div className="flex justify-between pt-1">
                  <span className="text-[8px] font-mono text-zinc-300 uppercase tracking-widest">Build_2026.04</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-mono text-zinc-300 uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}