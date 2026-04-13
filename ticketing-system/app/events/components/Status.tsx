export default function Status() {
    return (
        <div className="flex items-center w-fit px-3 py-1.5 gap-2.5 bg-blue-50 border border-blue-100 rounded-full">
        {/* Indicator Wrapper */}
        <div className="relative flex h-2 w-2">
            {/* The Animated Ripple */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            {/* The Solid Center Dot */}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
        </div>

        <span className="text-[10px] text-blue-700 tracking-[0.2em] font-black uppercase">
            Live Database Feed
        </span>
        </div>
    );
}