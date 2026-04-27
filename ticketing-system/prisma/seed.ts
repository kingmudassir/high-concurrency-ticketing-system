import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const upcomingEvents = [
    {
        title: 'CLASSICAL MUSIC NIGHT',
        category: 'concert',
        location: 'National Auditorium, Karachi',
        city: 'Karachi',
        startDate: new Date('2026-06-10T20:00:00'),
        totalTickets: 800,
        price: 2000,
    },
    {
        title: 'BLOCKCHAIN SUMMIT 2026',
        category: 'networking',
        location: 'Convention Centre, Lahore',
        city: 'Lahore',
        startDate: new Date('2026-07-18T09:30:00'),
        totalTickets: 1000,
        price: 10000,
    },
    {
        title: 'TENNIS OPEN 2026',
        category: 'sports',
        location: 'Sports Complex, Islamabad',
        city: 'Islamabad',
        startDate: new Date('2026-08-22T10:00:00'),
        totalTickets: 2000,
        price: 800,
    },
    {
        title: 'MAGIC SHOW LIVE',
        category: 'theatre',
        location: 'Arts Council, Lahore',
        city: 'Lahore',
        startDate: new Date('2026-09-05T19:00:00'),
        totalTickets: 500,
        price: 1500,
    },
    {
        title: 'BBQ FESTIVAL',
        category: 'food',
        location: 'Beach Park, Karachi',
        city: 'Karachi',
        startDate: new Date('2026-10-09T12:00:00'),
        totalTickets: 1200,
        price: 1200,
    },
    {
        title: 'POP CONCERT',
        category: 'concert',
        location: 'Expo Centre, Rawalpindi',
        city: 'Rawalpindi',
        startDate: new Date('2026-11-14T19:30:00'),
        totalTickets: 2500,
        price: 3000,
    },
    {
        title: 'VR GAMING EXPO',
        category: 'gaming',
        location: 'Tech Hub, Karachi',
        city: 'Karachi',
        startDate: new Date('2026-12-05T11:00:00'),
        totalTickets: 600,
        price: 2500,
    },
    {
        title: 'MEDITATION RETREAT',
        category: 'wellness',
        location: 'Hill Resort, Murree',
        city: 'Murree',
        startDate: new Date('2027-01-25T06:00:00'),
        totalTickets: 100,
        price: 20000,
    },
    {
        title: 'AWARD SHOW 2027',
        category: 'film',
        location: 'Convention Hall, Karachi',
        city: 'Karachi',
        startDate: new Date('2027-02-18T19:00:00'),
        totalTickets: 1500,
        price: 5000,
    },
    {
        title: 'DESIGN WEEK 2027',
        category: 'exhibition',
        location: 'Design Centre, Lahore',
        city: 'Lahore',
        startDate: new Date('2027-03-10T10:00:00'),
        totalTickets: 700,
        price: 1800,
    },
];

async function main() {
    console.log('🌱 Adding 10 more upcoming events...');
    console.log('📊 Current event count:', await prisma.event.count());

    for (let i = 0; i < upcomingEvents.length; i++) {
        const e = upcomingEvents[i];
        
        console.log(`📝 Creating event ${i + 1}/${upcomingEvents.length}: ${e.title}`);
        
        await prisma.event.create({
            data: {
                title: e.title,
                subtitle: `Experience the best of ${e.category} in ${e.city}`,
                description: `Join us for an unforgettable ${e.category.toLowerCase()} experience at ${e.location}. Limited seats available!`,
                imageUrl: `https://picsum.photos/id/${400 + i}/800/600`,
                category: e.category,
                tags: ['upcoming', 'must-attend', 'premium'],
                location: e.location,
                address: `${i + 31} Main Boulevard, ${e.city}`,
                city: e.city,
                transport: 'Metro, bus, and ride-sharing available',
                parking: 'Ample parking with security',
                venueNotes: 'Wheelchair accessible • Air conditioned',
                startDate: e.startDate,
                endDate: null,
                doorsOpen: new Date(e.startDate.getTime() - 90 * 60 * 1000),
                gstPercent: 10,
                serviceFeePercent: 5,
                instructions: [
                    'Valid ID required for entry',
                    'No refunds or exchanges',
                    'Doors open 90 minutes before showtime',
                    'Outside food not allowed',
                    'Professional cameras prohibited'
                ],
                totalTickets: e.totalTickets,
                ticketsSold: 0,
                status: 'PUBLISHED',
                ticketTiers: {
                    create: [
                        {
                            name: 'General Admission',
                            description: 'Standard entry to the event',
                            price: e.price,
                            capacity: Math.floor(e.totalTickets * 0.65),
                            sold: 0,
                            sortOrder: 0,
                        },
                        {
                            name: 'Premium',
                            description: 'Reserved seating with prime views',
                            price: Math.floor(e.price * 1.6),
                            capacity: Math.floor(e.totalTickets * 0.2),
                            sold: 0,
                            sortOrder: 1,
                        },
                        {
                            name: 'VIP',
                            description: 'Exclusive access with meet & greet',
                            price: e.price * 2.5,
                            capacity: Math.floor(e.totalTickets * 0.1),
                            sold: 0,
                            sortOrder: 2,
                        },
                        {
                            name: 'VVIP',
                            description: 'Superior experience with backstage access',
                            price: e.price * 4,
                            capacity: Math.floor(e.totalTickets * 0.05),
                            sold: 0,
                            sortOrder: 3,
                        },
                    ],
                },
                lineupActs: {
                    create: [
                        {
                            name: 'International Artist',
                            role: 'HEADLINER',
                            startTime: '21:30',
                            sortOrder: 0,
                        },
                        {
                            name: 'National Star',
                            role: 'SPECIAL_GUEST',
                            startTime: '20:00',
                            sortOrder: 1,
                        },
                        {
                            name: 'Local Talent',
                            role: 'SUPPORT',
                            startTime: '18:30',
                            sortOrder: 2,
                        },
                        {
                            name: 'Opening Performance',
                            role: 'OPENER',
                            startTime: '17:00',
                            sortOrder: 3,
                        },
                    ],
                },
            },
        });
        
        console.log(`✅ Created: ${e.title}`);
    }

    console.log(`\n🎉 Successfully added ${upcomingEvents.length} upcoming events!`);
    console.log(`📊 Total events now:`, await prisma.event.count());
}

main()
    .catch((e) => {
        console.error('❌ Failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });