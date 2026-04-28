export interface TicketTier {
    id: string;
    name: string;
    description: string | null;
    price: number;
    capacity: number;
    sold: number;
}

export interface RealEvent {
    id: string;
    title: string;
    isSoldOut: boolean;
    isHot: boolean;
    ticketTiers?: TicketTier[];
    gstPercent?: number;
    serviceFeePercent?: number;
    price?: number;
}

// Normalised tier shape used internally by the panel
export interface NormalisedTier {
    id: string;
    name: string;
    price: number;
    description: string;
    available: boolean;
    remaining: number;
}

export const getRemainingTickets = (tier: TicketTier): number =>
    tier.capacity - tier.sold;

export const isTierAvailable = (tier: TicketTier): boolean =>
    getRemainingTickets(tier) > 0;

export const formatPrice = (price: number): string =>
    `₨ ${price.toLocaleString()}`;
