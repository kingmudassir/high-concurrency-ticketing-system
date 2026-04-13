export default function Stats() {
    const stats = [
        { label: "Latency", value: "< 200ms", sub: "Global API response" },
        { label: "Reliability", value: "Zero", sub: "Oversold tickets" },
        { label: "Uptime", value: "99.9%", sub: "SLA Guaranteed" },
    ];

    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100 border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                {stats.map((stat, index) => (
                    <div 
                    key={index} 
                    className="bg-white p-10 flex flex-col items-center text-center hover:bg-gray-50 transition-colors group"
                    >
                    <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-3">
                        {stat.label}
                    </span>
                    <div className="text-5xl font-black text-gray-900 tracking-tighter mb-2 group-hover:scale-105 transition-transform duration-300">
                        {stat.value}
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                        {stat.sub}
                    </span>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}