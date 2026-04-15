// app/(landing)/layout.tsx
import { getCurrentUser } from "../actions/get-current-user";
import Footer from "../Global-Components/Footer";
import Navbar from "./_components/Navbar";
import NavbarLogin from "./_components/NavbarLogin"; // Assuming this exists

export default async function LandingLayout({ children }: { children: React.ReactNode }) {
    // 1. Fetch user directly on the server
    const { success, user } = await getCurrentUser();

    return (
        <>
            {/* 2. Toggle based on server-side logic */}
            {success && user ? <NavbarLogin user={user} /> : <Navbar />}
            <main className="grow">{children}</main>
            <Footer />
        </>
    );
}