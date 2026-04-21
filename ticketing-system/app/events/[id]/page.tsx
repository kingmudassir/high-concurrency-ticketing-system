import { notFound } from 'next/navigation';
import { MOCK_EVENTS } from '../Mockdata';
import EventDetailClient from './components/Eventdetailclient';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return MOCK_EVENTS.map((e) => ({ id: e.id }));
}

// Update: Make sure to await params here too
export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const event = MOCK_EVENTS.find((e) => e.id === id);
    
    if (!event) return { title: 'Event Not Found — RushTicket' };
    return {
        title: `${event.title} · ${event.artist} — RushTicket`,
        description: `Get tickets for ${event.title} at ${event.venue}, ${event.city}. ${event.dateLabel}.`,
    };
}

// Update: Add async to the component and await params
export default async function EventDetailPage({ params }: Props) {
    const { id } = await params;
    const event = MOCK_EVENTS.find((e) => e.id === id);

    if (!event) notFound();

    // Related events: same category, exclude current
    const related = MOCK_EVENTS.filter(
        (e) => e.category === event.category && e.id !== event.id
    ).slice(0, 3);

    return <EventDetailClient event={event} related={related} />;
}