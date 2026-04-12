import Link from "next/link";

export default async function Back() {
    return (
        <div className="container mx-auto mt-20 px-6">
            <Link 
                href="/events"
                className="text-gray-600 hover:text-black transition-colors font-medium"
            >
                ← Back to Events
            </Link>
        </div>
    )
}