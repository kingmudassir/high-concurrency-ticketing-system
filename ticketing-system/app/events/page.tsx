import EventsClient from './components/Eventsclient';

interface EventsPageProps {
    searchParams: {
        q?: string;
        location?: string;
        category?: string;
        sort?: string;
        page?: string;
    };
}

export default function EventsPage({ searchParams }: EventsPageProps) {
    return (
        <EventsClient
        initialQuery={searchParams.q || ''}
        initialLocation={searchParams.location || ''}
        initialCategory={searchParams.category || 'all'}
        initialSort={searchParams.sort || 'trending'}
        />
    );
}