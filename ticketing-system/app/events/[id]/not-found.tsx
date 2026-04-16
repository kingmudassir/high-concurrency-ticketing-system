import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <span className="text-6xl mb-4">🔦</span>
        <h2 className="text-3xl font-black text-gray-900">Event Not Found</h2>
        <p className="text-gray-500 mt-2 text-center max-w-sm">
            The event you're looking for doesn't exist or has been removed from our marketplace.
        </p>
        <Link
            href="/events"
            className="mt-8 bg-black text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-black/10"
        >
            Explore Other Events
        </Link>
        </div>
    );
}