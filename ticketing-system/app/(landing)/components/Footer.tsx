"use client";

import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';

const GitHubIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-current">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const LINKS = {
    Discover: [
        { label: 'Browse Events', href: '/events' },
        { label: 'Concerts', href: '/events?category=concerts' },
        { label: 'Sports', href: '/events?category=sports' },
        { label: 'Theater', href: '/events?category=theater' },
    ],
    Account: [
        { label: 'My Tickets', href: '/tickets' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings', href: '/settings' },
    ],
    Company: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
    ],
    Support: [
        { label: 'Help Center', href: '/help' },
        { label: 'Buyer Guarantee', href: '/guarantee' },
        { label: 'Refunds', href: '/refunds' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-zinc-950 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">

            {/* Top: Brand + Links */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-10 pb-16 border-b border-white/10">

            {/* Brand */}
            <div className="col-span-2">
                <Link href="/" className="flex items-center gap-2.5 mb-6 group">
                <div className="w-8 h-8 bg-white flex items-center justify-center overflow-hidden">
                    <div className="w-2 h-2 bg-emerald-500 group-hover:scale-[4] transition-transform duration-500 ease-in-out rounded-full" />
                </div>
                <span className="text-[15px] font-black uppercase tracking-[-0.04em]">
                    Rush<span className="text-emerald-500">Ticket</span>
                </span>
                </Link>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mb-8">
                High-concurrency ticketing built for the world's most in-demand events.
                Zero waiting rooms. 100% accuracy.
                </p>

                {/* GitHub Star CTA */}
                <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 border border-white/15 text-zinc-300 hover:bg-white hover:text-zinc-950 transition-all text-[10px] font-bold uppercase tracking-[0.2em] group"
                >
                <GitHubIcon />
                <Star className="w-3 h-3 fill-current group-hover:text-yellow-500 transition-colors" />
                Star on GitHub
                </a>
            </div>

            {/* Link groups */}
            {Object.entries(LINKS).map(([group, links]) => (
                <div key={group} className="flex flex-col gap-4">
                <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500">{group}</h4>
                {links.map((link) => (
                    <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors font-medium"
                    >
                    {link.label}
                    </Link>
                ))}
                </div>
            ))}
            </div>

            {/* Newsletter strip */}
            <div className="py-10 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Stay ahead of the queue</p>
                <p className="text-lg font-black tracking-tight">Get early access alerts.</p>
            </div>
            <div className="flex w-full md:w-auto gap-0 border border-white/15">
                <input
                type="email"
                placeholder="your@email.com"
                className="bg-transparent px-5 py-3.5 text-sm font-medium text-white placeholder:text-zinc-600 outline-none w-full md:w-64"
                />
                <button className="px-6 py-3.5 bg-emerald-500 text-zinc-950 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-colors whitespace-nowrap flex items-center gap-2">
                Subscribe <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
            </div>
            </div>

            {/* Bottom */}
            <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                <span>© 2026 RushTicket Inc.</span>
                <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy</span>
                <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms</span>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-700 uppercase tracking-wider">
                <span>Powered by</span>
                {['REDIS_V7', 'NEXT.JS', 'BULLMQ'].map((tech) => (
                <span key={tech} className="hover:text-emerald-500 transition-colors cursor-default">{tech}</span>
                ))}
                <div className="flex items-center gap-1.5 ml-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-zinc-600">All systems operational</span>
                </div>
            </div>
            </div>

        </div>
        </footer>
    );
}