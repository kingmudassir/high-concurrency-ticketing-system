import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPrisma } from '@/lib/db/prisma';
import { decodeJwt } from 'jose';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    
    if (!eventId) {
        return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return NextResponse.json({ success: false, tickets: [] });
    }

    try {
        const payload = decodeJwt(accessToken) as { userId: string };
        const prisma = getPrisma();

        const tickets = await prisma.ticket.findMany({
            where: {
                userId: payload.userId,
                eventId: eventId,
                status: 'PENDING',
                expiresAt: { gt: new Date() }
            },
            select: {
                id: true,
                expiresAt: true,
                status: true,
            }
        });

        return NextResponse.json({ success: true, tickets });
    } catch (error) {
        console.error('Error fetching pending tickets:', error);
        return NextResponse.json({ success: false, tickets: [] });
    }
}