import EventsClient from './components/Eventsclient';

interface EventsPageProps {
    searchParams: Promise<{
        q?: string;
        location?: string;
        category?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
    const params = await searchParams;
    
    return (
        <EventsClient
            initialQuery={params.q || ''}
            initialLocation={params.location || ''}
            initialCategory={params.category || 'all'}
            initialSort={params.sort || 'trending'}
        />
    );
}