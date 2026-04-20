import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string;
    sub: string;
    icon: LucideIcon;
    trend?: "up" | "down" | "flat";
    trendValue?: string;
    accent?: "emerald" | "red" | "zinc";
}

export default function StatCard({
    label,
    value,
    sub,
    icon: Icon,
    trend = "flat",
    trendValue,
    accent = "zinc",
}: StatCardProps) {
    const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
    const trendColor =
        trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-zinc-400";
    const accentColor =
        accent === "emerald"
            ? "bg-emerald-500"
            : accent === "red"
            ? "bg-red-500"
            : "bg-zinc-300";

    return (
        <div className="bg-white border border-zinc-200 p-6 relative group hover:border-zinc-400 transition-colors">
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 w-full h-0.5 ${accentColor}`} />

            <div className="flex items-start justify-between mb-6">
                <div className="w-9 h-9 bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-zinc-400" />
                </div>
                {trendValue && (
                    <div className={`flex items-center gap-1 ${trendColor}`}>
                        <TrendIcon className="w-3 h-3" />
                        <span className="text-[10px] font-mono font-bold">{trendValue}</span>
                    </div>
                )}
            </div>

            <div>
                <p className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em] mb-2">
                    {label}
                </p>
                <p className="text-3xl font-bold text-zinc-950 tracking-tighter tabular-nums leading-none">
                    {value}
                </p>
                <p className="text-[10px] font-mono text-zinc-400 mt-2">{sub}</p>
            </div>
        </div>
    );
}