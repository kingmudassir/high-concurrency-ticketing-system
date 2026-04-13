// app/(landing)/layout.tsx
import Footer from "../Global-Components/Footer";
import Navbar from "./_components/Navbar";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="grow">{children}</main>
            <Footer />
        </>
    );
}