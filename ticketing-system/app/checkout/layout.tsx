import RushNavbar from '../globalcomponents/Navbar/Navbar';
import Footer from '../(landing)/components/Footer';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
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