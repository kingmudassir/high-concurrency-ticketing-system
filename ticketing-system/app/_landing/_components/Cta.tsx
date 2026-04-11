import Link from 'next/link';

export default function Cta() {
    return (
        <section className="py-24 px-6 bg-blue-600 mt-30">
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to grab your tickets?
            </h2>
            <p className="text-blue-200 mb-10 text-lg">
            Events sell out fast. Don&apos;t wait.
            </p>
            <Link
            href="/events"
            className="inline-block bg-white text-blue-600 font-semibold px-10 py-4 rounded-xl text-lg hover:bg-blue-50 active:scale-95 transition-all"
            >
            See all events
            </Link>
        </div>
        </section>
    );
}