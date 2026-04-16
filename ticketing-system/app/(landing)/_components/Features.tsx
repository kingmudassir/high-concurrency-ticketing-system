import { Zap, Lock, Radio } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
    {
        icon: <Zap size={24} strokeWidth={2.5} />,
        title: "Cached Reads",
        description: "Event listings are served directly from Redis. Your database doesn't break a sweat, even during massive traffic spikes."
    },
    {
        icon: <Lock size={24} strokeWidth={2.5} />,
        title: "Atomic Safety",
        description: "Built with database-level locking. Two users can never book the last seat, ensuring zero overselling, ever."
    },
    {
        icon: <Radio size={24} strokeWidth={2.5} />,
        title: "Live Updates",
        description: "Ticket counts and availability update in near real-time. What you see is exactly what's currently in the vault."
    },
    ];

    export default function Features() {
    return (
        <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                Engineered for <br />
                <span className="text-blue-600">Extreme Demand.</span>
            </h2>
            <p className="text-xl text-gray-500 leading-relaxed">
                When thousands of users hit the same ticket at once, most systems fail. 
                We built TicketRush to be the exception.
            </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                />
            ))}
            </div>
            
        </div>
        </section>
    );
}