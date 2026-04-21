import React from "react";

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
    number: string;
    label: string;
    icon: React.ReactNode;
    description?: string;
}

export function SectionHeader({ number, label, icon, description }: SectionHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-0 mb-1">
                {/* Number tab */}
                <div className="flex items-center justify-center w-8 h-8 bg-zinc-950 text-white text-[9px] font-black font-mono shrink-0">
                    {number}
                </div>
                {/* Label bar */}
                <div className="flex items-center gap-2.5 flex-1 bg-zinc-100 px-4 h-8">
                    <span className="text-zinc-400">{icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-950">
                        {label}
                    </span>
                </div>
                {/* Decorative accent */}
                <div className="w-2 h-8 bg-emerald-500 shrink-0" />
            </div>
            {description && (
                <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mt-3 pl-8">
                    {description}
                </p>
            )}
        </div>
    );
}

// ─── Field Label ──────────────────────────────────────────────────────────────

interface FieldLabelProps {
    children: React.ReactNode;
    optional?: boolean;
    required?: boolean;
}

export function FieldLabel({ children, optional, required }: FieldLabelProps) {
    return (
        <label className="flex items-center gap-2 text-[9px] font-black font-mono text-zinc-500 uppercase tracking-[0.2em] mb-2">
            {children}
            {optional && (
                <span className="text-[8px] text-zinc-300 normal-case tracking-normal font-normal border border-zinc-200 px-1.5 py-0.5">
                    optional
                </span>
            )}
            {required && (
                <span className="text-[8px] text-emerald-600 normal-case tracking-normal font-black border border-emerald-200 bg-emerald-50 px-1.5 py-0.5">
                    required
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
            className={`w-full bg-white border border-zinc-200 py-3 px-4 text-[11px] font-mono text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-950 focus:ring-0 transition-colors hover:border-zinc-300 ${className}`}
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
            className={`w-full bg-white border border-zinc-200 py-3 px-4 text-[11px] font-mono text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-950 transition-colors resize-none hover:border-zinc-300 ${className}`}
        />
    );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function SectionDivider() {
    return (
        <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-zinc-100" />
            <div className="w-1.5 h-1.5 bg-zinc-200 rotate-45" />
            <div className="h-px flex-1 bg-zinc-100" />
        </div>
    );
}