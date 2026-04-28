// app/api/tickets/verify-reservation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPrisma } from '@/lib/db/prisma';
import { decodeJwt } from 'jose';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { ticketIds, eventId } = body;
        
        if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
            return NextResponse.json({ 
                valid: false, 
                tickets: [], 
                error: 'No ticket IDs provided' 
            }, { status: 400 });
        }

        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access_token')?.value;

        if (!accessToken) {
            return NextResponse.json({ 
                valid: false, 
                tickets: [], 
                error: 'Unauthorized' 
            }, { status: 401 });
        }

        let userId: string;
        try {
            const payload = decodeJwt(accessToken) as { userId: string };
            userId = payload.userId;
        } catch (error) {
            return NextResponse.json({ 
                valid: false, 
                tickets: [], 
                error: 'Invalid token' 
            }, { status: 401 });
        }

        const prisma = getPrisma();
        const now = new Date();

        // Find tickets that belong to the user, are pending, and not expired
        const tickets = await prisma.ticket.findMany({
            where: {
                id: { in: ticketIds },
                userId: userId,
                status: 'PENDING',
                expiresAt: { gt: now }
            },
            select: {
                id: true,
                eventId: true,
                tierId: true,
                expiresAt: true,
                status: true,
                pricePaid: true,
            }
        });

        // Check if all requested tickets are valid and belong to the same event
        const allTicketsValid = tickets.length === ticketIds.length;
        const allFromSameEvent = tickets.every(ticket => ticket.eventId === eventId);

        if (allTicketsValid && allFromSameEvent) {
            return NextResponse.json({ 
                valid: true, 
                tickets: tickets,
                message: 'Reservation is valid'
            });
        } else {
            // Return only the valid tickets
            return NextResponse.json({ 
                valid: false, 
                tickets: tickets,
                message: 'Some tickets are invalid or expired',
                requestedCount: ticketIds.length,
                validCount: tickets.length
            });
        }

    } catch (error) {
        console.error('[verify-reservation] Error:', error);
        return NextResponse.json({ 
            valid: false, 
            tickets: [], 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}