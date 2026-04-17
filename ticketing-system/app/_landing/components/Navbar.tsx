"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../Landing.module.css";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { name: "Architecture", href: "#architecture" },
    { name: "Stack", href: "#stack" },
    { name: "Load Tests", href: "#load-tests" },
    { name: "Docs", href: "#docs" },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-zinc-950/90 backdrop-blur-xl border-b border-white/10 py-4 shadow-xl shadow-black/50"
          : "bg-transparent py-6"
      } ${styles.navContainer}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-500/30 group-hover:scale-110 transition-transform duration-300">
            <div className="w-5 h-5 bg-white rounded rotate-45" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="font-bold text-2xl tracking-tighter text-white">
              Rush<span className="text-violet-400">Ticket</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[3px]">
              HIGH-CONCURRENCY
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-zinc-400 hover:text-white font-medium transition-colors relative py-1 group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span className="hidden lg:inline">GitHub</span>
          </a>

          {/* Get Started Button - Hidden on mobile */}
          <Link
            href="/register"
            className="group relative inline-flex items-center justify-center"
          >
            <span className="bg-white text-zinc-950 hover:bg-zinc-100 text-sm font-semibold py-2.5 px-7 rounded-full flex items-center gap-2 transition-all active:scale-95">
              Get Started
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Burger Menu Button - Only on mobile */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-50"
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6">
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ${
                mobileMenuOpen ? "top-2.5 rotate-45" : "top-1"
              }`}
            />
            <span
              className={`absolute left-0 top-2.5 block h-0.5 w-6 bg-current transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ${
                mobileMenuOpen ? "top-2.5 -rotate-45" : "top-4"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-zinc-950/95 backdrop-blur-2xl z-40 transition-all duration-500 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center min-h-screen gap-10 text-2xl font-medium">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {link.name}
            </a>
          ))}

          {/* Get Started inside mobile menu */}
          <div className="pt-8">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-white text-zinc-950 px-12 py-4 rounded-full text-lg font-semibold hover:bg-zinc-100 active:scale-95 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;