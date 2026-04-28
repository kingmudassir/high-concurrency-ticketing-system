"use client";

import { useState } from "react";
import { Save, ToggleLeft, ToggleRight, ShieldAlert } from "lucide-react";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
        <button onClick={onToggle} className="flex items-center">
            {enabled ? (
                <ToggleRight className="w-8 h-8 text-emerald-500" />
            ) : (
                <ToggleLeft className="w-8 h-8 text-zinc-300" />
            )}
        </button>
    );
}

function SectionLabel({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-emerald-600" />
            <span className="text-[9px] font-mono font-bold tracking-[0.4em] uppercase text-zinc-400">
                {label}
            </span>
        </div>
    );
}

export default function SettingsPage() {
    const [siteName, setSiteName] = useState("RushTicket");
    const [adminEmail, setAdminEmail] = useState("admin@rushticket.io");
    const [maxVUs, setMaxVUs] = useState("10000");
    const [lockTTL, setLockTTL] = useState("5000");

    const [toggles, setToggles] = useState({
        maintenance: false,
        registrations: true,
        emailNotifs: true,
        redisLock: true,
        dlq: true,
        idempotency: true,
    });

    const toggle = (key: keyof typeof toggles) =>
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="p-6 sm:p-10 max-w-3xl space-y-12">
            {/* General */}
            <div>
                <SectionLabel label="General_Config" />
                <div className="bg-white border border-zinc-200 divide-y divide-zinc-100">
                    {[
                        { label: "Site_Name", value: siteName, setter: setSiteName, type: "text" },
                        { label: "Admin_Email", value: adminEmail, setter: setAdminEmail, type: "email" },
                    ].map((field) => (
                        <div key={field.label} className="flex items-center justify-between px-6 py-5 gap-6">
                            <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest shrink-0">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                value={field.value}
                                onChange={(e) => field.setter(e.target.value)}
                                className="flex-1 max-w-xs text-[11px] font-mono text-zinc-950 bg-zinc-50 border border-zinc-200 px-3 py-2 focus:outline-none focus:border-zinc-950 transition-colors uppercase"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* System Toggles */}
            <div>
                <SectionLabel label="System_Toggles" />
                <div className="bg-white border border-zinc-200 divide-y divide-zinc-100">
                    {[
                        { key: "maintenance" as const, label: "Maintenance_Mode", sub: "Takes the site offline. Only admins can access." },
                        { key: "registrations" as const, label: "User_Registrations", sub: "Allow new accounts to be created." },
                        { key: "emailNotifs" as const, label: "Email_Notifications", sub: "BullMQ worker dispatches confirmation emails." },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between px-6 py-5">
                            <div>
                                <p className="text-[10px] font-mono font-bold text-zinc-950 uppercase tracking-widest">
                                    {item.label}
                                </p>
                                <p className="text-[9px] font-mono text-zinc-400 mt-1">{item.sub}</p>
                            </div>
                            <Toggle enabled={toggles[item.key]} onToggle={() => toggle(item.key)} />
                        </div>
                    ))}
                </div>
                {toggles.maintenance && (
                    <div className="mt-3 flex items-start gap-3 bg-red-50 border border-red-100 px-4 py-3">
                        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider leading-relaxed">
                            Warning: Maintenance mode is active. The site is currently inaccessible to regular users.
                        </p>
                    </div>
                )}
            </div>

            {/* Concurrency Config */}
            <div>
                <SectionLabel label="Concurrency_Config" />
                <div className="bg-white border border-zinc-200 divide-y divide-zinc-100">
                    {[
                        { label: "Max_VUs", value: maxVUs, setter: setMaxVUs, sub: "Max virtual users in K6 load test" },
                        { label: "Redis_Lock_TTL", value: lockTTL, setter: setLockTTL, sub: "Lock expiry in milliseconds (prevents deadlock)" },
                    ].map((field) => (
                        <div key={field.label} className="flex items-center justify-between px-6 py-5 gap-6">
                            <div>
                                <label className="text-[10px] font-mono font-bold text-zinc-950 uppercase tracking-widest">
                                    {field.label}
                                </label>
                                <p className="text-[9px] font-mono text-zinc-400 mt-1">{field.sub}</p>
                            </div>
                            <input
                                type="number"
                                value={field.value}
                                onChange={(e) => field.setter(e.target.value)}
                                className="w-28 text-[11px] font-mono text-zinc-950 bg-zinc-50 border border-zinc-200 px-3 py-2 focus:outline-none focus:border-zinc-950 transition-colors text-right tabular-nums"
                            />
                        </div>
                    ))}

                    {/* Protocol Toggles */}
                    {[
                        { key: "redisLock" as const, label: "Redis_Distributed_Lock", sub: "SET NX atomic locking on ticket purchase." },
                        { key: "dlq" as const, label: "Dead_Letter_Queue", sub: "Route failed jobs to DLQ with exponential backoff." },
                        { key: "idempotency" as const, label: "Idempotency_Keys", sub: "Short-circuit duplicate purchase retries." },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between px-6 py-5">
                            <div>
                                <p className="text-[10px] font-mono font-bold text-zinc-950 uppercase tracking-widest">
                                    {item.label}
                                </p>
                                <p className="text-[9px] font-mono text-zinc-400 mt-1">{item.sub}</p>
                            </div>
                            <Toggle enabled={toggles[item.key]} onToggle={() => toggle(item.key)} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div>
                <SectionLabel label="Danger_Zone" />
                <div className="bg-white border border-red-100">
                    {[
                        { label: "Flush_Redis_Cache", sub: "Clears all distributed locks and cached data. Irreversible.", btn: "Flush Cache" },
                        { label: "Purge_Queue", sub: "Deletes all pending BullMQ jobs, including confirmations.", btn: "Purge Queue" },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between px-6 py-5 border-b border-red-50 last:border-0">
                            <div>
                                <p className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">
                                    {item.label}
                                </p>
                                <p className="text-[9px] font-mono text-zinc-400 mt-1">{item.sub}</p>
                            </div>
                            <button className="text-[9px] font-mono font-bold text-red-500 border border-red-200 px-3 py-2 uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors">
                                {item.btn}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save */}
            <div className="flex items-center justify-between border-t border-zinc-200 pt-8">
                <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest">
                    Changes are applied immediately after save.
                </span>
                <button className="flex items-center gap-2 bg-zinc-950 text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors">
                    <Save className="w-3 h-3" />
                    Save Changes
                </button>
            </div>
        </div>
    );
}