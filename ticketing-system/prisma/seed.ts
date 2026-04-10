// prisma/seed.ts
import { prisma } from "../lib/prisma";

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
        price: 5000,
        totalTickets: 100,
        ticketsSold: 0,
        startDate: new Date("2026-04-05T19:00:00Z"),
      },
      {
        title: "Tech Rush Summit",
        description: "The premier conference for high-concurrency systems.",
        price: 12000,
        totalTickets: 500,
        ticketsSold: 0, 
        startDate: new Date("2026-05-15T09:00:00Z"),
      }
    ]
  });

  console.log('Seed: Success!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });