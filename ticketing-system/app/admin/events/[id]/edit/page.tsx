import { notFound } from 'next/navigation';
import EditEventForm from './components/EditEventForm';
import { fetchEventById } from '@/app/events/[id]/actions/fetch-event';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
    const { id } = await params;
    const result = await fetchEventById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const event = result.data;

    return <EditEventForm event={event} />;
}