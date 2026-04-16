// app/admin/page.tsx
import { ArrowUpRight, Cpu, Zap, Lock } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
        {/* Header section */}
        <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Executive Overview</h1>
            <p className="text-gray-500 font-medium">Monitoring real-time ticket concurrency and system health.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
            { label: "Total Revenue", value: "$124,500", trend: "+12.5%", icon: <Zap /> },
            { label: "Tickets Sold", value: "8,432", trend: "+3.2%", icon: <ArrowUpRight /> },
            { label: "Active Locks", value: "142", trend: "Normal", icon: <Lock /> },
            { label: "Queue Latency", value: "12ms", trend: "-2ms", icon: <Cpu /> },
            ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">{stat.icon}</div>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                    {stat.trend}
                </span>
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
            </div>
            ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Events Table */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-bold">Active Events</h3>
                <button className="text-sm font-bold text-blue-600">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50/50 text-xs font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-4">Event Name</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Sold</th>
                    <th className="px-8 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {[
                    { name: "Tech-Fest '26", status: "High Demand", sold: "98%" },
                    { name: "Global Beats Tour", status: "Live", sold: "45%" },
                    { name: "Startup Summit", status: "Queueing", sold: "12%" },
                    ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6 font-bold text-gray-900">{row.name}</td>
                        <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">
                            {row.status}
                        </span>
                        </td>
                        <td className="px-8 py-6">
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full" style={{ width: row.sold }} />
                        </div>
                        </td>
                        <td className="px-8 py-6">
                        <button className="text-gray-400 hover:text-black font-bold">Manage</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>

            {/* Live System Feed */}
            <div className="bg-black rounded-[2.5rem] p-8 text-white shadow-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                Live System Log
            </h3>
            <div className="space-y-6">
                {[
                { time: "12:44:01", msg: "Redis lock acquired for ticket #992", type: "sys" },
                { time: "12:43:58", msg: "BullMQ processed confirmation email", type: "queue" },
                { time: "12:43:45", msg: "Atomic decrement successful - Event ID: 04", type: "db" },
                { time: "12:42:10", msg: "1,200 concurrent requests handled (200ms avg)", type: "load" },
                ].map((log, i) => (
                <div key={i} className="font-mono text-xs border-l-2 border-blue-600/30 pl-4 py-1">
                    <span className="text-blue-500 font-bold">[{log.time}]</span>
                    <span className="text-gray-400 ml-2 uppercase font-black">{log.type}:</span>
                    <p className="text-gray-300 mt-1">{log.msg}</p>
                </div>
                ))}
            </div>
            <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all">
                Open Terminal
            </button>
            </div>
        </div>
        </div>
    );
}