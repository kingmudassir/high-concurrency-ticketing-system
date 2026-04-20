// prisma/seed.ts
import { getPrisma } from "../lib/db/prisma";

async function main() {
    console.log("🌱 Starting seed...");

    const prisma = getPrisma();

    // 1. Delete all existing data
    await prisma.ticket.deleteMany();
    await prisma.event.deleteMany();

    console.log("🗑️  All existing events and tickets deleted.");

    // 2. Create 5 fresh events
    const freshEvents = [
        {
            title: "Taylor Swift - The Eras Tour",
            description: "The biggest pop concert of the decade is coming to Pakistan. Join us for an unforgettable night of hits from all eras.",
            location: "National Stadium, Karachi",
            price: 12500,
            totalTickets: 45000,
            ticketsSold: 32450,
            startDate: new Date("2026-05-15T20:00:00Z"),
        },
        {
            title: "F1 Grand Prix Karachi 2026",
            description: "Formula 1 makes its historic debut in Pakistan. Watch the world's fastest drivers battle it out on the streets of Karachi.",
            location: "Karachi City Circuit",
            price: 18500,
            totalTickets: 28000,
            ticketsSold: 18750,
            startDate: new Date("2026-06-07T16:00:00Z"),
        },
        {
            title: "Coke Studio Live Season 15",
            description: "Live performances by Atif Aslam, Rahat Fateh Ali Khan, and many more. A magical musical night you don't want to miss.",
            location: "Alhamra Arts Council, Lahore",
            price: 5500,
            totalTickets: 7500,
            ticketsSold: 7200,
            startDate: new Date("2026-04-25T19:30:00Z"),
        },
        {
            title: "DevCon Pakistan 2026",
            description: "Pakistan's largest technology and developer conference. Featuring talks, workshops, and networking with industry leaders.",
            location: "PNCA, Islamabad",
            price: 2999,
            totalTickets: 3000,
            ticketsSold: 1840,
            startDate: new Date("2026-07-18T09:00:00Z"),
        },
        {
            title: "PSL 2026 Grand Final",
            description: "The ultimate cricket showdown. Watch the champion team get crowned in front of a roaring crowd at Gaddafi Stadium.",
            location: "Gaddafi Stadium, Lahore",
            price: 9500,
            totalTickets: 26500,
            ticketsSold: 26500,
            startDate: new Date("2026-03-22T19:00:00Z"),
        },
    ];

    await prisma.event.createMany({
        data: freshEvents,
    });

    console.log(`✅ Successfully created 5 fresh events!`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        const prisma = getPrisma();
        await prisma.$disconnect();
    });