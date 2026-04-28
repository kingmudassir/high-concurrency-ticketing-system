// Reports page stub
"use client";

import { Flag, AlertTriangle, CheckCircle2, XCircle, MoreHorizontal } from "lucide-react";

const reports = [
    { id: "RPT-001", type: "Fraud", user: "Unknown #2841", target: "TK-008201", detail: "Suspected bot purchase pattern", time: "2h ago", status: "open" },
    { id: "RPT-002", type: "Abuse", user: "m.bilal@gmail.com", target: "USR-0005", detail: "Repeated failed auth attempts", time: "5h ago", status: "open" },
    { id: "RPT-003", type: "Duplicate", user: "System", target: "TK-008100", detail: "Duplicate idempotency key detected", time: "1d ago", status: "resolved" },
    { id: "RPT-004", type: "Refund Dispute", user: "fmalik@gmail.com", target: "TK-008409", detail: "Refund not reflected in balance", time: "2d ago", status: "resolved" },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    open:     { label: "Open",     color: "text-red-600 bg-red-50 border-red-100",         icon: AlertTriangle },
    resolved: { label: "Resolved", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CheckCircle2 },
};

export default function ReportsPage() {
    return (
        <div className="p-6 sm:p-10 space-y-8">
            <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 animate-pulse" />
                <p className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em]">
                    2 Open_Reports // Immediate Review Required
                </p>
            </div>

            <div className="bg-white border border-zinc-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50">
                                {["ID", "Type", "Reported By", "Target", "Detail", "Time", "Status", ""].map((h) => (
                                    <th key={h} className="text-left px-6 py-3 text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((r) => {
                                const cfg = statusConfig[r.status];
                                const StatusIcon = cfg.icon;
                                return (
                                    <tr key={r.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                        <td className="px-6 py-4 text-[9px] font-mono text-zinc-400">{r.id}</td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-zinc-950 uppercase tracking-tight">{r.type}</td>
                                        <td className="px-6 py-4 text-[9px] font-mono text-zinc-400">{r.user}</td>
                                        <td className="px-6 py-4 text-[9px] font-mono font-bold text-zinc-950">{r.target}</td>
                                        <td className="px-6 py-4 text-[9px] font-mono text-zinc-400 max-w-[200px] truncate">{r.detail}</td>
                                        <td className="px-6 py-4 text-[9px] font-mono text-zinc-400">{r.time}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest border ${cfg.color}`}>
                                                <StatusIcon className="w-2.5 h-2.5" />
                                                {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {r.status === "open" && (
                                                <button className="text-[8px] font-mono font-bold text-emerald-500 hover:text-emerald-700 uppercase tracking-widest transition-colors">
                                                    Resolve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}