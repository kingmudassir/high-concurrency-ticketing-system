import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Cta() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="relative overflow-hidden bg-black rounded-[2.5rem] px-8 py-16 md:py-24 text-center shadow-2xl">
                    
                    {/* Background Decorative Elements - Subtle gradients to prevent it from looking "flat" */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 blur-[100px]" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
                            The rush is on. <br />
                            <span className="text-blue-500">Secure your spot.</span>
                        </h2>
                        
                        <p className="text-gray-400 text-lg md:text-xl mb-12 font-medium">
                            Don't let high traffic stand between you and the front row. Experience the fastest checkout in the industry.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/register"
                                className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-10 py-4 rounded-2xl text-lg hover:bg-blue-500 hover:-translate-y-1 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
                            >
                                Create Account
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            
                            <Link
                                href="/events"
                                className="w-full sm:w-auto bg-white/5 border border-white/10 text-white font-bold px-10 py-4 rounded-2xl text-lg hover:bg-white/10 transition-all"
                            >
                                Browse Events
                            </Link>
                        </div>

                        {/* Scarcity Trigger */}
                        <p className="mt-8 text-sm text-gray-500 font-bold uppercase tracking-widest">
                            Limited seats available for upcoming Tech-Fest '26
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}