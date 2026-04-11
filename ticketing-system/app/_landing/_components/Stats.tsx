export default async function Stats() {
    return (
        <div className="bg-gray-50 mt-20 py-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                        &lt; 200ms
                    </span>
                    <span className="text-gray-500">
                        API response time
                    </span>
                </div>

                <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                        Zero
                    </span>
                    <span className="text-gray-500">
                        Oversold tickets
                    </span>
                </div>

                <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                        99.9%
                    </span>
                    <span className="text-gray-500">
                        Uptime
                    </span>
                </div>
            </div>
        </div>
        
    )
}