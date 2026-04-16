export default function LoginHeader() {
    return (
        <div className="flex flex-col items-center text-center mb-10">
            {/* Logo Icon with subtle rotation */}
            <div className="mb-4 bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20 -rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-2xl leading-none">🎫</span>
            </div>

            {/* Brand Title */}
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Welcome <span className="text-blue-600">Back.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 font-medium mt-2 max-w-60">
                Sign in to manage your tickets and browse new events.
            </p>
        </div>
    );
}