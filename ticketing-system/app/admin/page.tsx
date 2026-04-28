import {
    Ticket,
    Users,
    DollarSign,
    AlertTriangle,
    ArrowRight,
    Zap,
} from "lucide-react";
import Link from "next/link";
import StatCard from "./components/StatCard";
import { getAllUsers } from "../actions/admin-actions/get-all-users";

const recentEvents = [
    { name: "Taylor Swift — Eras Tour", date: "2026-05-12", tickets: 50000, sold: 49200, status: "active" },
    { name: "F1 Grand Prix Karachi", date: "2026-06-01", tickets: 30000, sold: 18750, status: "active" },
    { name: "Coke Studio Live", date: "2026-04-30", tickets: 8000, sold: 8000, status: "sold_out" },
    { name: "DevCon Islamabad 2026", date: "2026-07-14", tickets: 2000, sold: 340, status: "upcoming" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    sold_out: { label: "Sold Out", color: "text-zinc-600 bg-zinc-100 border-zinc-200" },
    upcoming: { label: "Upcoming", color: "text-zinc-400 bg-zinc-50 border-zinc-100" },
};

const activityLog = [
    { action: "Ticket purchased", detail: "Event: Coke Studio Live · Seat A-42", time: "2m ago", type: "purchase" },
    { action: "New user registered", detail: "IP: 203.128.x.x · PK", time: "6m ago", type: "user" },
    { action: "Event created", detail: "DevCon Islamabad 2026", time: "1h ago", type: "event" },
    { action: "Report flagged", detail: "User ID #2841 — suspicious activity", time: "2h ago", type: "report" },
    { action: "Ticket refunded", detail: "Order #TK-004812 processed", time: "3h ago", type: "refund" },
];

const activityColors: Record<string, string> = {
    purchase: "bg-emerald-500",
    user: "bg-zinc-400",
    event: "bg-zinc-950",
    report: "bg-red-500",
    refund: "bg-zinc-300",
};

export default async function AdminOverviewPage() {
    const { success, users, stats, message } = await getAllUsers();

    if (!success || !stats) {
        return (
            <div className="p-10 text-red-500 font-mono text-xs">
                {message || "Failed to load dashboard statistics."}
            </div>
        );
    }

    return (
        

        <div className="p-6 sm:p-10 space-y-10">
            {/* System Banner */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em]">
                        All Systems Operational // Redis Lock Active // 0 Queue Failures
                    </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest hidden sm:block">
                    Last sync: 4s ago
                </span>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total_Revenue"
                    value="₨ 4.2M"
                    sub="This month"
                    icon={DollarSign}
                    trend="up"
                    trendValue="+12.4%"
                    accent="emerald"
                />
                <StatCard
                    label="Tickets_Sold"
                    value="76,290"
                    sub="Across all events"
                    icon={Ticket}
                    trend="up"
                    trendValue="+8.1%"
                    accent="emerald"
                />
                <StatCard
                    label="Active Users"
                    value={stats.totalCount}
                    sub="Registered accounts"
                    icon={Users}
                    trend={stats.trend}
                    trendValue={stats.trendValue}
                    accent="zinc"
                />
                <StatCard
                    label="Open_Reports"
                    value="7"
                    sub="Pending review"
                    icon={AlertTriangle}
                    trend="down"
                    trendValue="-2"
                    accent="red"
                />
            </div>

            {/* Main Grid: Events + Activity */}
            <div className="grid lg:grid-cols-[1fr_340px] gap-6">
                {/* Recent Events Table */}
                <div className="bg-white border border-zinc-200">
                    <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
                                Recent Events
                            </p>
                            <p className="text-[9px] font-mono text-zinc-400 mt-0.5 uppercase tracking-widest">
                                Event_Registry
                            </p>
                        </div>
                        <Link
                            href="/admin/events"
                            className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-zinc-400 hover:text-zinc-950 uppercase tracking-widest transition-colors"
                        >
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-100">
                                    {["Event", "Date", "Capacity", "Sold", "Status"].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left px-6 py-3 text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em]"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentEvents.map((e, i) => {
                                    const pct = Math.round((e.sold / e.tickets) * 100);
                                    const cfg = statusConfig[e.status];
                                    return (
                                        <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors group">
                                            <td className="px-6 py-4 text-xs font-bold text-zinc-950 uppercase tracking-tight max-w-[180px] truncate">
                                                {e.name}
                                            </td>
                                            <td className="px-6 py-4 text-[10px] font-mono text-zinc-400">{e.date}</td>
                                            <td className="px-6 py-4 text-[10px] font-mono text-zinc-600 tabular-nums">
                                                {e.tickets.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-mono font-bold text-zinc-950 tabular-nums w-12">
                                                        {pct}%
                                                    </span>
                                                    <div className="w-20 h-1 bg-zinc-100">
                                                        <div
                                                            className={`h-full ${pct === 100 ? "bg-zinc-950" : "bg-emerald-500"}`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest border ${cfg.color}`}>
                                                    {cfg.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity Log */}
                <div className="bg-white border border-zinc-200">
                    <div className="px-6 py-4 border-b border-zinc-100">
                        <p className="text-xs font-bold text-zinc-950 uppercase tracking-tight">Activity_Log</p>
                        <p className="text-[9px] font-mono text-zinc-400 mt-0.5 uppercase tracking-widest">
                            Real_Time_Feed
                        </p>
                    </div>
                    <div className="divide-y divide-zinc-50">
                        {activityLog.map((item, i) => (
                            <div key={i} className="px-6 py-4 flex items-start gap-3 hover:bg-zinc-50 transition-colors">
                                <div className="mt-1.5 shrink-0">
                                    <div className={`w-1.5 h-1.5 ${activityColors[item.type]}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-zinc-950 uppercase tracking-tight">
                                        {item.action}
                                    </p>
                                    <p className="text-[9px] font-mono text-zinc-400 mt-0.5 truncate">
                                        {item.detail}
                                    </p>
                                </div>
                                <span className="text-[8px] font-mono text-zinc-300 shrink-0 mt-0.5">
                                    {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="px-6 py-3 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-[8px] font-mono text-zinc-300 uppercase tracking-widest">
                            Pipeline_Integrity: 100%
                        </span>
                        <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                    </div>
                </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white border border-zinc-200">
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-zinc-950 uppercase tracking-tight">Recent Users</p>
                        <p className="text-[9px] font-mono text-zinc-400 mt-0.5 uppercase tracking-widest">
                            User_Registry
                        </p>
                    </div>
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-zinc-400 hover:text-zinc-950 uppercase tracking-widest transition-colors"
                    >
                        View All <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>










                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-100">
                                {["Name", "Email", "Joined", "Role", "Status"].map((h) => (
                                    <th key={h} className="text-left px-6 py-3 text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em]">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-bold text-zinc-950 uppercase tracking-tight">
                                        {u.username}
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-mono text-zinc-400">
                                        {u.email}
                                    </td>
                                    {/* CHANGE: u.joined -> u.joinedAt */}
                                    <td className="px-6 py-4 text-[10px] font-mono text-zinc-400">
                                        {u.joinedAt} 
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[8px] font-mono font-bold uppercase tracking-widest ${
                                            u.status === "BANNED" ? "text-red-600" : "text-emerald-600"
                                        }`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {/* Optional: Add an action button here later */}
                                        <button className="text-zinc-400 hover:text-zinc-950">
                                        <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>










            </div>
        </div>
    );
}