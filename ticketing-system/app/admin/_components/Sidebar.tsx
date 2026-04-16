// components/admin/Sidebar.tsx
import { 
    LayoutDashboard, 
    Ticket, 
    CalendarDays, 
    Users, 
    Settings, 
    Activity, 
    ShieldCheck 
} from "lucide-react";
import Link from "next/link";

const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin" },
    { icon: <Ticket size={20} />, label: "Tickets", href: "/admin/tickets" },
    { icon: <CalendarDays size={20} />, label: "Events", href: "/admin/events" },
    { icon: <Users size={20} />, label: "Manage Accounts", href: "/admin/accounts" },
    { icon: <Activity size={20} />, label: "System Health", href: "/admin/health" },
    { icon: <ShieldCheck size={20} />, label: "Security", href: "/admin/security" },
];

export default function Sidebar() {
    return (
        <aside className="w-64 border-r border-gray-100 bg-white h-screen sticky top-0 flex flex-col">
        <div className="p-8">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            </div>
            TICKET<span className="text-blue-600">RUSH</span>
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
            <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-500 font-bold rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all group"
            >
                <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                {item.label}
            </Link>
            ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 font-bold hover:text-red-500 transition-colors">
            <Settings size={20} />
            Settings
            </button>
        </div>
        </aside>
    );
}