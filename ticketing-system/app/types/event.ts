export interface EventDisplay {
    id: string;
    title: string;
    description: string | null;
    location: string;
    price: number;
    totalTickets: number;
    ticketsSold: number;
    startDate: string;
    availableTickets: number;
}