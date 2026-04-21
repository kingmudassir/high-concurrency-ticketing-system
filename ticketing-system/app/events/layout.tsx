import type { Metadata } from 'next';
import RushNavbar from '../globalcomponents/Navbar/Navbar';
import Footer from '../(landing)/components/Footer';

export const metadata: Metadata = {
    title: 'Browse Events — RushTicket',
    description: 'Find concerts, sports, theater and more. High-concurrency ticketing for the world&apos;s most in-demand events.',
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <RushNavbar />
        <main className="min-h-screen bg-zinc-50 pt-16">
            {children}
        </main>
        <Footer />
        </>
    );
}