import Cards_for_features from "./Cards_for_features"

const features = [
    {
        icon: "⚡",
        title: "Cached reads",
        description: "Event listings are served from Redis. Your database doesn't break a sweat under traffic spikes."
    },

    {
        icon: "🔒",
        title: "No overselling",
        description: "Atomic ticket reservation with database-level locking. Two users can never book the last seat.",
    },

    {
        icon: "📡",
        title: "Live availability",
        description: "Ticket counts update in near real-time. What you see is what's actually available.",
    },
]

export default async function Features() {
    return (
        <div className="mt-30">
            <div className="flex flex-col space-y-5 max-w-170 mx-auto text-center">
                <span className="text-4xl font-bold">
                    Built for high demand
                </span>
                <span className="text-lg text-gray-500">
                    When thousands of users hit the same event at once, most systems break. This one doesn't.
                </span>
            </div>

            {/* Cards */}
            <div className="container mx-auto space-x-10 flex mt-15">
                {features.map((item, index) => {
                    return (
                        <Cards_for_features 
                        key= {index}
                        icon= {item.icon}
                        title= {item.title}
                        description= {item.description}
                        />
                    )
                })}
            </div>
        </div>
    )
}