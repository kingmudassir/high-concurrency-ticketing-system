"use client"

import { useState } from "react";
import EventCard from "./EventCard";

const filtersData = [
    { name: "All", slug: "all" },
    { name: "Technology", slug: "tech" },
    { name: "Music", slug: "music" },
    { name: "Sports", slug: "sports" }
];

export default function Events({ initialEvents }: { initialEvents: any[] }) {
    const [selectedFilter, setSelectedFilter] = useState("All")

    const selectFilter = (name: string) => {
        setSelectedFilter(name)
    }

    return (
        <div className="mt-8">
            <div className="flex justify-between">
                {/* Header Text */}
                <div className="flex flex-col space-y-3">
                    <div className="text-6xl font-bold">
                        Explore <span className="text-blue-600">Events.</span>
                    </div>

                    <div className="text-gray-600">
                        High-concurrency ticketing for the world's most anticipated moments. 
                    </div>
                </div>

                {/* Menu Buttons */}
                <div className="flex justify-center items-center space-x-2 text-gray-500 font-bold mt-auto">
                    {
                        filtersData?.map((item, index) => (
                            <div 
                            key={index} 
                            onClick={() => selectFilter(item.name)}
                            className={`border border-gray-200 px-5 py-3 rounded-2xl cursor-pointer ${item.name === selectedFilter ? "bg-black text-white" : ""}`}>
                                {item.name}
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="mt-10">
                <EventCard events={initialEvents} />
            </div>
        </div>
    )
}