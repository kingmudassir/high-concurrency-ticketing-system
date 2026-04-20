"use client";

import { useState } from "react";
import { Search, UserPlus, MoreHorizontal, ShieldCheck, ShieldAlert, UserX } from "lucide-react";

const users = [
    { id: "USR-0001", name: "Muhammad Bilal", email: "m.bilal@gmail.com", joined: "2026-04-18", role: "user", status: "active", tickets: 3 },
    { id: "USR-0002", name: "Sara Ahmed", email: "sara.a@hotmail.com", joined: "2026-04-17", role: "user", status: "active", tickets: 1 },
    { id: "USR-0003", name: "Ali Raza", email: "ali.raza@proton.me", joined: "2026-04-15", role: "moderator", status: "active", tickets: 7 },
    { id: "USR-0004", name: "Nadia Khan", email: "nk@rushticket.io", joined: "2026-04-10", role: "admin", status: "active", tickets: 0 },
    { id: "USR-0005", name: "Usman Tariq", email: "u.tariq@yahoo.com", joined: "2026-04-09", role: "user", status: "suspended", tickets: 2 },
    { id: "USR-0006", name: "Fatima Malik", email: "fmalik@gmail.com", joined: "2026-04-05", role: "user", status: "active", tickets: 4 },
    { id: "USR-0007", name: "Zara Hussain", email: "zh@outlook.com", joined: "2026-04-01", role: "user", status: "active", tickets: 1 },
];

const roleConfig: Record<string, { label: string; color: string }> = {
    admin:     { label: "Admin",     color: "text-zinc-950 border-zinc-400 bg-zinc-100" },
    moderator: { label: "Moderator", color: "text-emerald-700 border-emerald-200 bg-emerald-50" },
    user:      { label: "User",      color: "text-zinc-400 border-zinc-100 bg-white" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
    active:    { label: "Active",    color: "text-emerald-600" },
    suspended: { label: "Suspended", color: "text-red-500" },
};

export default function UsersPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const filtered = users.filter((u) => {
        const matchSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || u.role === filter || u.status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="p-6 sm:p-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em]">
                    {users.length} Total_Users
                </p>
                <button className="flex items-center gap-2 bg-zinc-950 text-white px-5 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors">
                    <UserPlus className="w-3 h-3" />
                    Invite User
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 border border-zinc-200 bg-white px-3 py-2.5 w-full sm:w-64">
                    <Search className="w-3 h-3 text-zinc-300 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="text-[10px] font-mono bg-transparent outline-none text-zinc-600 placeholder-zinc-300 w-full uppercase tracking-widest"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {["all", "admin", "moderator", "user", "suspended"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-2 text-[8px] font-mono font-bold uppercase tracking-widest border transition-colors ${
                                filter === f
                                    ? "bg-zinc-950 text-white border-zinc-950"
                                    : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-zinc-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50">
                                {["ID", "Name", "Email", "Joined", "Role", "Tickets", "Status", "Actions"].map((h) => (
                                    <th key={h} className="text-left px-6 py-3 text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => {
                                const roleCfg = roleConfig[u.role];
                                const statusCfg = statusConfig[u.status];
                                return (
                                    <tr key={u.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors group">
                                        <td className="px-6 py-4 text-[9px] font-mono text-zinc-400">{u.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                                                    <span className="text-[8px] font-bold text-zinc-500 uppercase">
                                                        {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold text-zinc-950 uppercase tracking-tight whitespace-nowrap">
                                                    {u.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[9px] font-mono text-zinc-400">{u.email}</td>
                                        <td className="px-6 py-4 text-[9px] font-mono text-zinc-400">{u.joined}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest border ${roleCfg.color}`}>
                                                {roleCfg.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-mono font-bold text-zinc-950 tabular-nums">
                                            {u.tickets}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${statusCfg.color}`}>
                                                {statusCfg.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {u.status === "active" ? (
                                                    <button className="flex items-center gap-1 text-[8px] font-mono font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors whitespace-nowrap">
                                                        <UserX className="w-3 h-3" />
                                                        Suspend
                                                    </button>
                                                ) : (
                                                    <button className="flex items-center gap-1 text-[8px] font-mono font-bold text-emerald-500 hover:text-emerald-700 uppercase tracking-widest transition-colors whitespace-nowrap">
                                                        <ShieldCheck className="w-3 h-3" />
                                                        Reinstate
                                                    </button>
                                                )}
                                                <button className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-zinc-950 transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                        Showing {filtered.length} of {users.length} users
                    </span>
                    <div className="flex gap-1">
                        {[1, 2].map((p) => (
                            <button key={p} className={`w-7 h-7 text-[10px] font-mono font-bold border transition-colors ${
                                p === 1 ? "bg-zinc-950 text-white border-zinc-950" : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400"
                            }`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}