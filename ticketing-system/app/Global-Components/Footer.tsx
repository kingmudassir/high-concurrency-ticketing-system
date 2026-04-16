import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
                    
                    {/* Brand Section */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <span className="text-xl">🎫</span>
                            <span className="font-black text-xl tracking-tight text-gray-900">
                                Ticket<span className="text-blue-600">Rush</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            The gold standard for high-concurrency event ticketing. 
                            Built for speed, scale, and zero-fail reliability.
                        </p>
                    </div>

                    {/* Links: Platform */}
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/events" className="hover:text-blue-600 transition-colors">Browse Events</Link></li>
                            <li><Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
                            <li><Link href="/api-docs" className="hover:text-blue-600 transition-colors">Developer API</Link></li>
                        </ul>
                    </div>

                    {/* Links: Support */}
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/help" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Tech Stack - Shows off your skills */}
                    <div className="hidden lg:block">
                        <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-4">Stack</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Next.js', 'Prisma', 'Redis', 'PostgreSQL'].map((tech) => (
                                <span key={tech} className="px-2 py-1 bg-gray-50 text-[10px] font-bold text-gray-400 rounded border border-gray-100">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400">
                        © {currentYear} TicketRush. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6">
                        {/* Simple icon placeholders */}
                        <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest">Twitter</a>
                        <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest">GitHub</a>
                        <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}