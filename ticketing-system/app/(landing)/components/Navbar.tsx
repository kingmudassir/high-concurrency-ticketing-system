"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Layers, 
  Activity, 
  FileText, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const GitHubIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const RushNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <nav className={`fixed top-0 w-full z-100 transition-all duration-300 ${
        scrolled 
          ? 'bg-zinc-50/90 backdrop-blur-md border-b border-zinc-200 py-4 shadow-sm' 
          : 'bg-transparent py-8'
    }`}>
      <div className="max-w-425 mx-auto px-6 sm:px-10 flex items-center justify-between relative">
        
        {/* LEFT: BRANDING (Using Footer Logo) */}
        <Link 
        href={'/'}
        className="flex items-center gap-4 z-10 group cursor-pointer">
          <div className="w-9 h-9 bg-zinc-950 flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-2.5 h-2.5 bg-emerald-500" />
          </div>
          <div className="flex flex-col">
            <h1 className={`text-xl font-bold tracking-tighter leading-none transition-colors ${scrolled ? 'text-zinc-950' : 'text-zinc-950'}`}>
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
        <div className="hidden min-[1250px]:flex items-center gap-8 z-10">
          <a 
            href="#" 
            className="flex items-center gap-2.5 text-zinc-400 hover:text-zinc-950 font-bold text-[10px] tracking-widest transition-all font-mono"
          >
            <GitHubIcon />
            <span>STAR_REPO</span>
          </a>
          
          <Link 
          href={'/register'}
          className="inline-flex items-center gap-3 bg-zinc-950 text-white px-8 py-3.5 font-bold text-xs uppercase tracking-widest transition-all hover:bg-zinc-900 active:scale-[0.98]"
          > 
          Get Started
          <ArrowRight className="w-4 h-4 text-emerald-500" />
          </Link>
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

      {/* FULL SCREEN MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
            className="fixed inset-0 z-200 bg-zinc-950/20 backdrop-blur-sm flex justify-end"
          >
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="w-full sm:w-112.5 bg-zinc-50 h-screen shadow-[-40px_0_80px_rgba(0,0,0,0.1)] border-l border-zinc-200 flex flex-col"
            >
              {/* Header Section */}
              <div className="p-8 flex justify-between items-center border-b border-zinc-200 bg-white">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-emerald-600 font-bold tracking-[0.2em] uppercase">
                    System_Menu
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

              {/* Navigation Section */}
              <div className="flex-1 px-8 py-12 flex flex-col gap-2 overflow-y-auto">
                {navLinks.map((link, idx) => (
                  <motion.a
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * idx }}
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between p-6 border border-transparent hover:border-zinc-200 hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] font-mono text-zinc-300 font-bold">0{idx + 1}</span>
                      <span className="text-2xl font-bold text-zinc-400 group-hover:text-zinc-950 transition-colors uppercase tracking-tighter">
                        {link.name}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                  </motion.a>
                ))}
              </div>

              {/* Action Section */}
              <div className="p-8 bg-white border-t border-zinc-200 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest px-1 font-bold">External_Connect</span>
                  <a 
                    href="#" 
                    className="flex items-center justify-center gap-3 border border-zinc-200 text-zinc-600 py-4 font-bold text-[10px] tracking-[0.2em] hover:bg-zinc-950 hover:text-white transition-all uppercase"
                  >
                    <GitHubIcon />
                    Star on GitHub
                  </a>
                </div>
                
                <Link 
                href={'/register'}
                className=" text-center w-full py-6 bg-zinc-950 text-white font-bold text-lg uppercase tracking-widest hover:bg-zinc-900 transition-all">
                  Get Started
                </Link>
                
                <div className="flex justify-between items-center pt-4">
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