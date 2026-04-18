// prisma/seed.ts
import { prisma } from "../lib/db/prisma";

async function main() {
  // 1. Clean out existing data
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();

  console.log('Seed: Data cleared.');

  // 2. Create sample events
  await prisma.event.createMany({
    data: [
      {
        title: "Grand Concert 2026",
        description: "An orchestral masterpiece under the stars.",
        location: "Alhamra Arts Council, Lahore",
        price: 5000,
        totalTickets: 100,
        ticketsSold: 0,
        startDate: new Date("2026-04-20T19:00:00Z"),
      },
      {
        title: "Tech Rush Summit",
        description: "The premier conference for high-concurrency systems.",
        location: "Marriott Hotel, Islamabad",
        price: 12000,
        totalTickets: 500,
        ticketsSold: 0, 
        startDate: new Date("2026-05-15T09:00:00Z"),
      },
      {
        title: "Music Fest: Sufi Night",
        description: "A soulful evening with legendary Sufi performers.",
        location: "PNCA, Islamabad",
        price: 3500,
        totalTickets: 200,
        ticketsSold: 0,
        startDate: new Date("2026-06-10T20:00:00Z"),
      },
      {
        title: "Startup Expo 2026",
        description: "Connect with the brightest founders and investors.",
        location: "Expo Center, Karachi",
        price: 2000,
        totalTickets: 1000,
        ticketsSold: 0,
        startDate: new Date("2026-07-05T10:00:00Z"),
      },
      {
        title: "Championship Boxing",
        description: "Heavyweight title bout in the heart of the city.",
        location: "Sports Complex, Rawalpindi",
        price: 7500,
        totalTickets: 300,
        ticketsSold: 0,
        startDate: new Date("2026-08-12T18:00:00Z"),
      }
    ]
  });

  console.log('Seed: Success! 5 events created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });