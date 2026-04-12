export default async function Status() {
    return (
        <div className="flex items-center w-fit px-3 py-1 space-x-2 bg-blue-100 rounded-4xl">
            <div className="rounded-full w-1.5 h-1.5 bg-blue-600 animate-ping"></div>

            <span className="text-[10px] text-blue-600 tracking-widest uppercase font-extrabold">
                LIVE DATABASE FEED
            </span>
        </div>
    )
}