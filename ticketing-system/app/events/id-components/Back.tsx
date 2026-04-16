import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Back() {
    return (
        <div className="max-w-7xl mx-auto px-6 md:px-10 mt-12 mb-8">
            <Link 
                href="/events"
                className="group inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all"
            >
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-100 bg-white group-hover:border-gray-300 group-hover:bg-gray-50 transition-all shadow-sm">
                    <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <span>Back to Events</span>
            </Link>
        </div>
    );
}