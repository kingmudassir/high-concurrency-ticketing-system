"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Activity } from "lucide-react";

const pageTitles: Record<string, { title: string; sub: string }> = {
    "/admin": { title: "Overview", sub: "System_Dashboard" },
    "/admin/events": { title: "Events", sub: "Event_Registry" },
    "/admin/tickets": { title: "Tickets", sub: "Ticket_Ledger" },
    "/admin/users": { title: "Users", sub: "User_Registry" },
    "/admin/reports": { title: "Reports", sub: "Flag_Queue" },
    "/admin/analytics": { title: "Analytics", sub: "Performance_Data" },
    "/admin/notifications": { title: "Notifications", sub: "Dispatch_Log" },
    "/admin/settings": { title: "Settings", sub: "System_Config" },
};

export default function Topbar() {
    const pathname = usePathname();
    const meta = pageTitles[pathname] ?? { title: "Admin", sub: "Panel" };

    return (
        <header className="h-16 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between px-6 sm:px-10 shrink-0">
            {/* Page Identity */}
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-sm font-bold text-zinc-950 uppercase tracking-tighter leading-none">
                        {meta.title}
                    </h1>
                    <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
                        {meta.sub}
                    </p>
                </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="hidden sm:flex items-center gap-2 border border-zinc-200 bg-white px-3 py-2 w-48 group focus-within:border-zinc-950 transition-colors">
                    <Search className="w-3 h-3 text-zinc-300 group-focus-within:text-zinc-950 transition-colors shrink-0" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="text-[10px] font-mono bg-transparent outline-none text-zinc-600 placeholder-zinc-300 w-full uppercase tracking-widest"
                    />
                </div>

                {/* System pulse */}
                <div className="hidden md:flex items-center gap-2 text-zinc-400">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em]">Live</span>
                </div>

                {/* Notifications */}
                <button className="relative w-9 h-9 border border-zinc-200 bg-white flex items-center justify-center hover:border-zinc-950 transition-colors">
                    <Bell className="w-4 h-4 text-zinc-400" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500" />
                </button>
            </div>
        </header>
    );
}