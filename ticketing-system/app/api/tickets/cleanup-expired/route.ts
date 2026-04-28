import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPrisma } from '@/lib/db/prisma';
import { decodeJwt } from 'jose';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access_token')?.value;

        if (!accessToken) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        let userId: string;
        try {
            const payload = decodeJwt(accessToken) as { userId: string };
            userId = payload.userId;
        } catch {
            return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
        }

        const prisma = getPrisma();
        const now = new Date();

        // Find expired pending tickets for this user
        const expiredTickets = await prisma.ticket.findMany({
            where: {
                userId,
                status: "PENDING",
                expiresAt: { lt: now }
            },
            select: {
                id: true,
                tierId: true,
                eventId: true,
            }
        });

        if (expiredTickets.length === 0) {
            return NextResponse.json({ success: true, expiredCount: 0 });
        }

        // Group by tier and event for counter updates
        const tierCounts = new Map<string, number>();
        const eventCounts = new Map<string, number>();

        for (const ticket of expiredTickets) {
            tierCounts.set(ticket.tierId, (tierCounts.get(ticket.tierId) || 0) + 1);
            eventCounts.set(ticket.eventId, (eventCounts.get(ticket.eventId) || 0) + 1);
        }

        // Update in transaction
        await prisma.$transaction(async (tx) => {
            // Update ticket status to EXPIRED
            await tx.ticket.updateMany({
                where: { id: { in: expiredTickets.map(t => t.id) } },
                data: { status: "EXPIRED" }
            });

            // Restore tier sold counts
            for (const [tierId, count] of tierCounts) {
                await tx.ticketTier.update({
                    where: { id: tierId },
                    data: { sold: { decrement: count } }
                });
            }

            // Restore event ticketsSold counts
            for (const [eventId, count] of eventCounts) {
                await tx.event.update({
                    where: { id: eventId },
                    data: { ticketsSold: { decrement: count } }
                });
            }
        });

        return NextResponse.json({ success: true, expiredCount: expiredTickets.length });
    } catch (error) {
        console.error('Error cleaning up expired tickets:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}