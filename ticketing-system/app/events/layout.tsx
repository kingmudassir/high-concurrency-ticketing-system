import Footer from "../Global-Components/Footer";
import Navbar from "./components/Navbar";

export default function EventsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            {/* The 'grow' now actually works to push the footer down */}
            <main className="grow bg-white">
                {children}
            </main>
            <Footer />
        </div>
    );
}