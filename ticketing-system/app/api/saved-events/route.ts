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
        return NextResponse.json({ isSaved: false });
    }

    try {
        const payload = decodeJwt(accessToken) as { userId: string };
        const prisma = getPrisma();

        // Check if SavedEvent model exists
        let isSaved = false;
        try {
            const savedEvent = await prisma.savedEvent.findUnique({
                where: {
                    userId_eventId: {
                        userId: payload.userId,
                        eventId: eventId
                    }
                }
            });
            isSaved = !!savedEvent;
        } catch (err) {
            // SavedEvent model doesn't exist yet
            console.error("SavedEvent model not found:", err);
        }

        return NextResponse.json({ isSaved });
    } catch (error) {
        console.error('Error checking saved event:', error);
        return NextResponse.json({ isSaved: false });
    }
}