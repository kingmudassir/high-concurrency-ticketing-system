"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
// Create a pool for the database connection
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Create the adapter
const adapter = new adapter_pg_1.PrismaPg(pool);
// Create PrismaClient with the adapter
const prisma = new client_1.PrismaClient({ adapter });
const eventsData = [
    {
        title: 'SUMMER MUSIC FESTIVAL 2025',
        category: 'concert',
        location: 'Expo Centre, Karachi',
        city: 'Karachi',
        startDate: new Date('2025-06-15T18:00:00'),
        totalTickets: 1000,
        price: 2500,
    },
    {
        title: 'TECH CONFERENCE 2025',
        category: 'networking',
        location: 'Pearl Continental Hotel, Lahore',
        city: 'Lahore',
        startDate: new Date('2025-07-20T09:00:00'),
        totalTickets: 500,
        price: 5000,
    },
    {
        title: 'CRICKET CHAMPIONSHIP FINAL',
        category: 'sports',
        location: 'Gaddafi Stadium, Lahore',
        city: 'Lahore',
        startDate: new Date('2025-08-10T14:00:00'),
        totalTickets: 5000,
        price: 1500,
    },
    {
        title: 'COMEDY NIGHT WITH STARS',
        category: 'theatre',
        location: 'Avari Hotel, Islamabad',
        city: 'Islamabad',
        startDate: new Date('2025-09-05T20:00:00'),
        totalTickets: 300,
        price: 3000,
    },
    {
        title: 'FOOD FESTIVAL 2025',
        category: 'food',
        location: 'Beach Luxury Hotel, Karachi',
        city: 'Karachi',
        startDate: new Date('2025-10-10T12:00:00'),
        totalTickets: 800,
        price: 1000,
    },
    {
        title: 'JAZZ CONCERT',
        category: 'concert',
        location: 'Serena Hotel, Islamabad',
        city: 'Islamabad',
        startDate: new Date('2025-11-20T19:00:00'),
        totalTickets: 400,
        price: 3500,
    },
    {
        title: 'GAMING TOURNAMENT',
        category: 'gaming',
        location: 'Convention Hall, Karachi',
        city: 'Karachi',
        startDate: new Date('2025-12-05T10:00:00'),
        totalTickets: 600,
        price: 2000,
    },
    {
        title: 'WELLNESS RETREAT',
        category: 'wellness',
        location: 'Pearl Continental Hotel, Rawalpindi',
        city: 'Rawalpindi',
        startDate: new Date('2026-01-15T08:00:00'),
        totalTickets: 200,
        price: 8000,
    },
    {
        title: 'FILM PREMIERE NIGHT',
        category: 'film',
        location: 'Cinepax, Lahore',
        city: 'Lahore',
        startDate: new Date('2026-02-10T19:30:00'),
        totalTickets: 300,
        price: 4000,
    },
    {
        title: 'FASHION WEEK 2026',
        category: 'exhibition',
        location: 'Expo Centre, Lahore',
        city: 'Lahore',
        startDate: new Date('2026-03-05T11:00:00'),
        totalTickets: 700,
        price: 6000,
    },
];
async function main() {
    console.log('🌱 Starting seed...');
    try {
        // Clear existing data
        await prisma.ticket.deleteMany({});
        await prisma.ticketTier.deleteMany({});
        await prisma.lineupAct.deleteMany({});
        await prisma.event.deleteMany({});
        console.log('✅ Cleared existing data');
        for (let i = 0; i < eventsData.length; i++) {
            const e = eventsData[i];
            console.log(`📝 Creating event ${i + 1}/${eventsData.length}: ${e.title}`);
            await prisma.event.create({
                data: {
                    title: e.title,
                    subtitle: `Experience the best of ${e.category} in ${e.city}`,
                    description: `Join us for an amazing ${e.category.toLowerCase()} event at ${e.location}.`,
                    imageUrl: `https://picsum.photos/id/${100 + i}/800/600`,
                    category: e.category,
                    tags: ['exciting', 'must-attend'],
                    location: e.location,
                    address: `${i + 1} Main Street, ${e.city}`,
                    city: e.city,
                    transport: 'Bus and taxi services available',
                    parking: 'Ample parking available',
                    venueNotes: 'Wheelchair accessible',
                    startDate: e.startDate,
                    endDate: null,
                    doorsOpen: new Date(e.startDate.getTime() - 90 * 60 * 1000),
                    gstPercent: 10,
                    serviceFeePercent: 5,
                    instructions: ['Valid ID required', 'No refunds', 'Doors open 90 mins before'],
                    totalTickets: e.totalTickets,
                    ticketsSold: 0,
                    status: 'PUBLISHED',
                    ticketTiers: {
                        create: [
                            {
                                name: 'General Admission',
                                description: 'Standard entry',
                                price: e.price,
                                capacity: Math.floor(e.totalTickets * 0.8),
                                sold: 0,
                                sortOrder: 0,
                            },
                            {
                                name: 'VIP',
                                description: 'Premium access',
                                price: e.price * 2,
                                capacity: Math.floor(e.totalTickets * 0.2),
                                sold: 0,
                                sortOrder: 1,
                            },
                        ],
                    },
                    lineupActs: {
                        create: [
                            {
                                name: 'Headline Performer',
                                role: 'HEADLINER',
                                startTime: '21:00',
                                sortOrder: 0,
                            },
                            {
                                name: 'Opening Act',
                                role: 'OPENER',
                                startTime: '19:00',
                                sortOrder: 1,
                            },
                        ],
                    },
                },
            });
            console.log(`✅ Created: ${e.title}`);
        }
        console.log(`\n🎉 Successfully created ${eventsData.length} events!`);
    }
    catch (error) {
        console.error('Error during seed:', error);
        throw error;
    }
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
