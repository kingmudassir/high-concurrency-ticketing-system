export type LineupRole = "HEADLINER" | "SUPPORT" | "OPENER" | "SPECIAL_GUEST";

export interface TicketTier {
    id: string;
    name: string;
    description: string;
    price: string;
    capacity: string;
}

export interface LineupAct {
    id: string;
    name: string;
    role: LineupRole;
    startTime: string;
}

export const LINEUP_ROLE_CONFIG: Record<LineupRole, { label: string; color: string }> = {
    HEADLINER:     { label: "Headliner",     color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    SUPPORT:       { label: "Support",       color: "text-zinc-600 bg-zinc-100 border-zinc-200" },
    OPENER:        { label: "Opener",        color: "text-zinc-400 bg-zinc-50 border-zinc-100" },
    SPECIAL_GUEST: { label: "Special Guest", color: "text-amber-600 bg-amber-50 border-amber-200" },
};