'use client';

export default function Error({
    error,
    reset,
    }: {
    error: Error & { digest?: string };
    reset: () => void;
    }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 max-w-md">
            <h2 className="text-2xl font-black text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6 text-sm">
                We couldn't retrieve the event details. This might be a temporary connection issue.
            </p>
            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => reset()}
                    className="bg-black text-white px-6 py-2 rounded-xl font-bold text-sm"
                >
                    Try Again
                </button>
                <button
                    onClick={() => window.location.href = '/events'}
                    className="bg-white border border-gray-200 px-6 py-2 rounded-xl font-bold text-sm"
                >
                    Go Back
                </button>
            </div>
        </div>
        </div>
    );
}