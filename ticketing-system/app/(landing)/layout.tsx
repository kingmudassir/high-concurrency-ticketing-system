import Footer from "./components/Footer";
import RushNavbar from "./components/Navbar";

export default function LandingLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    return (
        <div className="flex flex-col min-h-screen">
        <RushNavbar />
        <main className="grow">
            {children}
        </main>
        <Footer />
        </div>
    );
}