import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            ticket<span className="text-blue-600">rush</span>
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/events"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Events
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href="#"
              className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Real-time availability
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-6">
            Book Tickets
            <br />
            <span className="text-blue-600">Before They&apos;re Gone.</span>
          </h1>

          <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Real-time availability. No overselling. No surprises at checkout.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/events"
              className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-blue-700 active:scale-95 transition-all"
            >
              Browse Events
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 font-medium px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all"
            >
              How it works →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats bar ─── */}
      <section className="border-y border-gray-100 bg-gray-50 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "< 200ms", label: "API response time" },
            { value: "Zero", label: "Oversold tickets" },
            { value: "99.9%", label: "Uptime" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-gray-900 mb-1">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Value props ─── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
            Built for high demand
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
            When thousands of users hit the same event at once, most systems break.
            This one doesn&apos;t.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Cached reads",
                description:
                  "Event listings are served from Redis. Your database doesn't break a sweat under traffic spikes.",
              },
              {
                icon: "🔒",
                title: "No overselling",
                description:
                  "Atomic ticket reservation with database-level locking. Two users can never book the last seat.",
              },
              {
                icon: "📡",
                title: "Live availability",
                description:
                  "Ticket counts update in near real-time. What you see is what's actually available.",
              },
            ].map(({ icon, title, description }) => (
              <div
                key={title}
                className="border border-gray-100 rounded-2xl p-8 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA section ─── */}
      <section className="py-24 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to grab your tickets?
          </h2>
          <p className="text-blue-200 mb-10 text-lg">
            Events sell out fast. Don&apos;t wait.
          </p>
          <Link
            href="/events"
            className="inline-block bg-white text-blue-600 font-semibold px-10 py-4 rounded-xl text-lg hover:bg-blue-50 active:scale-95 transition-all"
          >
            See all events
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <p>
          ticketrush — a high-concurrency ticketing system. Built with Next.js, Prisma & PostgreSQL.
        </p>
      </footer>
    </main>
  );
}