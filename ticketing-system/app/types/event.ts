export interface EventDisplay {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  price: number;
  totalTickets: number;
  ticketsSold: number;
  availableTickets: number;
}