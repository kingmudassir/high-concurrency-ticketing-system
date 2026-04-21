"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Ticket,
    Settings,
    LogOut,
    ShieldCheck,
    Bell,
    BarChart3,
    ChevronRight,
    Flag,
    PlusCircle,
} from "lucide-react";
import { useState } from "react";
import { useLogout } from "@/app/hooks/logout/use-logout";

interface SidebarProps {
    user: {
        username: string | null;
        email: string;
        role: string;
    } | null;
}

const getInitials = (name?: string | null, email?: string) => {
    if (name) {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return parts[0].substring(0, 1).toUpperCase();
    }
    return email?.substring(0, 1).toUpperCase() || "??";
};

const navItems = [
    {
        group: "Core",
        items: [
            { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
            { label: "Events", href: "/admin/events", icon: CalendarDays, exact: true },
            { label: "Create Event", href: "/admin/events/new", icon: PlusCircle },
            { label: "Tickets", href: "/admin/tickets", icon: Ticket },
        ],
    },
    {
        group: "Management",
        items: [
            { label: "Users", href: "/admin/users", icon: Users },
            { label: "Reports", href: "/admin/reports", icon: Flag },
            { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        ],
    },
    {
        group: "System",
        items: [
            { label: "Notifications", href: "/admin/notifications", icon: Bell },
            { label: "Settings", href: "/admin/settings", icon: Settings },
        ],
    },
];

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const { logout, isLoggingOut } = useLogout();

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href) && href !== "/admin";
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <aside
            className={`relative flex flex-col h-screen bg-zinc-950 border-r border-zinc-800 transition-all duration-300 shrink-0 ${
                collapsed ? "w-18" : "w-60"
            }`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-6 border-b border-zinc-800">
                <div className="w-8 h-8 bg-zinc-950 border border-zinc-700 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-emerald-500" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-[11px] font-bold text-white uppercase tracking-tighter leading-none">
                            RushTicket
                        </span>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
                            {user?.role} Panel
                        </span>
                    </div>
                )}
            </div>

            {/* Admin Badge */}
            {!collapsed && (
                <div className="mx-4 mt-4 mb-2 flex items-center gap-2 bg-emerald-950/40 border border-emerald-900/50 px-3 py-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest truncate">
                        {user?.role} Access
                    </span>
                </div>
            )}

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                {navItems.map((group) => (
                    <div key={group.group}>
                        {!collapsed && (
                            <p className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-[0.3em] px-2 mb-2">
                                {group.group}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const active = isActive(item.href, item.exact);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group flex items-center gap-3 px-3 py-2.5 transition-all duration-150 relative ${
                                            active
                                                ? "bg-zinc-900 text-white"
                                                : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
                                        }`}
                                    >
                                        {active && (
                                            <span className="absolute left-0 top-0 h-full w-0.5 bg-emerald-500" />
                                        )}
                                        <item.icon
                                            className={`w-4 h-4 shrink-0 transition-colors ${
                                                active ? "text-emerald-500" : "text-zinc-600 group-hover:text-zinc-300"
                                            }`}
                                        />
                                        {!collapsed && (
                                            <>
                                                <span className="text-[11px] font-bold uppercase tracking-widest flex-1">
                                                    {item.label}
                                                </span>
                                                {active && (
                                                    <ChevronRight className="w-3 h-3 text-emerald-500" />
                                                )}
                                            </>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom: User + Logout */}
            <div className="border-t border-zinc-800">
                {/* User Info */}
                {!collapsed && (
                    <div className="px-4 py-3 flex items-center gap-3 border-b border-zinc-800">
                        <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-bold text-zinc-300 uppercase">
                                {getInitials(user?.username, user?.email)}
                            </span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] font-bold text-zinc-200 uppercase tracking-tight truncate">
                                {user?.username}
                            </span>
                            <span className="text-[8px] font-mono text-zinc-600 truncate">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-5 py-4 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 transition-all duration-150 group disabled:opacity-70"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {!collapsed && (
                        <span className="text-[11px] font-bold uppercase tracking-widest">
                            {isLoggingOut ? "Logging out..." : "Logout"}
                        </span>
                    )}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-18 w-6 h-6 bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-colors z-10"
            >
                <ChevronRight
                    className={`w-3 h-3 text-zinc-400 transition-transform duration-300 ${
                        collapsed ? "" : "rotate-180"
                    }`}
                />
            </button>
        </aside>
    );
}