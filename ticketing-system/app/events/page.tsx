import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Ticket, ArrowRight } from "lucide-react";

async function getEvents() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "asc" },
  });
  return events.map(e => ({
    ...e,
    availableTickets: Math.max(0, e.totalTickets - e.ticketsSold),
  }));
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="min-h-screen bg-[slate-50/50]">
      {/* Hero Section - Makes it feel like a real app */}
      <div className="border-b bg-white">
        <div className="container mx-auto py-16 px-6">
          <Badge variant="outline" className="mb-4 border-blue-200 bg-blue-50 text-blue-700">
            Platform live
          </Badge>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 lg:text-6xl">
            Experience <span className="text-blue-600">Everything.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Don't just watch from the sidelines. Secure your spot at the most exclusive events.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card 
              key={event.id} 
              className="group relative flex flex-col overflow-hidden border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              {/* Subtle Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 font-medium text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(event.startDate).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric' 
                      })}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 flex-1">
                <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
                  {event.description}
                </p>
              </CardContent>

              <CardFooter className="relative z-10 flex items-center justify-between border-t bg-slate-50/50 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Price</p>
                  <p className="text-2xl font-black text-slate-900">
                    ${(event.price / 100).toFixed(2)}
                  </p>
                </div>
                
                <Button 
                  asChild 
                  size="lg"
                  variant={event.availableTickets === 0 ? "secondary" : "default"}
                  className="rounded-full shadow-sm transition-all group-hover:shadow-md"
                >
                  <Link href={`/events/${event.id}`}>
                    {event.availableTickets === 0 ? (
                      "Sold Out"
                    ) : (
                      <>
                        Book Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}