export default function RegisterHeader() {
    return (
        <div className="flex flex-col items-center text-center mb-10">
            {/* Logo Icon with a different "playful" rotation than Login */}
            <div className="mb-4 bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20 rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-2xl leading-none">🎫</span>
            </div>

            {/* Benefit-Driven Title */}
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Join the <span className="text-blue-600">Rush.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 font-medium mt-2 max-w-70">
                Create an account to start booking tickets for the world's most exclusive events.
            </p>
        </div>
    );
}