import React from "react";

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
    number: string;
    label: string;
    icon: React.ReactNode;
}

export function SectionHeader({ number, label, icon }: SectionHeaderProps) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono font-bold text-zinc-400 tabular-nums">{number}</span>
                <div className="w-px h-4 bg-zinc-300" />
                <div className="flex items-center gap-2 text-zinc-950">
                    {icon}
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-950">
                        {label}
                    </span>
                </div>
            </div>
            <div className="flex-1 h-px bg-zinc-200" />
        </div>
    );
}

// ─── Field Label ──────────────────────────────────────────────────────────────

interface FieldLabelProps {
    children: React.ReactNode;
    optional?: boolean;
}

export function FieldLabel({ children, optional }: FieldLabelProps) {
    return (
        <label className="flex items-center gap-2 text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">
            {children}
            {optional && (
                <span className="text-zinc-300 normal-case tracking-normal font-normal">
                    optional
                </span>
            )}
        </label>
    );
}

// ─── Input ────────────────────────────────────────────────────────────────────

export function Input({
    className = "",
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`w-full bg-zinc-50 border border-zinc-200 py-3 px-4 text-[11px] font-mono text-zinc-800 placeholder-zinc-300 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all ${className}`}
        />
    );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

export function Textarea({
    className = "",
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={`w-full bg-zinc-50 border border-zinc-200 py-3 px-4 text-[11px] font-mono text-zinc-800 placeholder-zinc-300 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all resize-none ${className}`}
        />
    );
}