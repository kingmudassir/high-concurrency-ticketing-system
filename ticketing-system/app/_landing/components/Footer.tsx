"use client";

export default function Footer() {
    return (
        <>
        {/* CTA Section */}
        <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto text-center relative">
            <div className="absolute inset-x-20 inset-y-0 bg-amber-400/5 rounded-3xl blur-3xl pointer-events-none" />
            <div className="relative max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 border border-ink/12 px-4 py-1.5 rounded-full mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono tracking-[0.15em] uppercase text-ink/40">Open source on GitHub</span>
            </div>

            <h2 className="section-heading text-ink mb-6">
                Clone it.<br />
                <span className="text-ink/30">Break it. Learn it.</span>
            </h2>

            <p className="text-ink/45 text-base leading-relaxed mb-10">
                This is a portfolio project built to demonstrate distributed systems thinking. The full source — Redis lock implementation, BullMQ workers, Prisma schema, and K6 scripts — is on GitHub.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <button className="btn-primary group flex items-center gap-3 text-base py-3 px-8">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span>View Source</span>
                </button>
                <button className="btn-ghost text-base py-3 px-8">
                Read the Docs →
                </button>
            </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-ink/8 py-8 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-ink flex items-center justify-center">
                <div className="w-2 h-2 rounded-sm bg-amber-400" />
                </div>
                <span className="text-xs font-mono text-ink/40 tracking-wide">FluxTicket — A Portfolio Project</span>
            </div>
            <div className="flex items-center gap-6 text-xs font-mono text-ink/30">
                <span>Next.js</span>
                <span className="text-ink/15">·</span>
                <span>Redis</span>
                <span className="text-ink/15">·</span>
                <span>BullMQ</span>
                <span className="text-ink/15">·</span>
                <span>PostgreSQL</span>
                <span className="text-ink/15">·</span>
                <span>K6</span>
            </div>
            </div>
        </footer>
        </>
    );
}