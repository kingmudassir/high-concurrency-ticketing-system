import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-20 lg:pt-32">
      {/* Background Decor - Subtle gradient blur for that modern look */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-linear-to-b from-blue-50/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="text-sm font-bold text-blue-700 tracking-wide uppercase">
            Live: 4,200+ Tickets Available
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight leading-[0.9] mb-6">
          Book Tickets <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
            Before They're Gone.
          </span>
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 leading-relaxed mb-10">
          The only high-concurrency platform that handles the rush. 
          <span className="text-gray-900 font-medium"> No overselling. No wait times.</span> Just the fastest path to your next event.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            href="/events"
            className="w-full sm:w-auto px-10 py-4 bg-black text-white text-lg font-bold rounded-2xl shadow-2xl shadow-black/10 hover:bg-gray-800 hover:-translate-y-1 active:scale-95 transition-all"
          >
            Browse Events
          </Link>

          <button className="w-full sm:w-auto px-10 py-4 bg-white text-gray-600 text-lg font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all">
            How it works →
          </button>
        </div>

        {/* Social Proof Placeholder (Optional but looks pro) */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Trusted by organizers at</p>
          <div className="flex justify-center items-center gap-8 grayscale opacity-50 font-black text-xl text-gray-400 italic">
            <span>TECHCONF</span>
            <span>SONIC</span>
            <span>VIBE.FEST</span>
          </div>
        </div>
      </div>
    </section>
  );
}