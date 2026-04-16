import { getCurrentUser } from "../actions/get-current-user";
import Footer from "../Global-Components/Footer";
import NavbarLogin from "../Global-Components/NavbarLogin";
import Navbar from "./components/Navbar";

export default async function EventsLayout({ children }: { children: React.ReactNode }) {
    const { success, user } = await getCurrentUser();

    return (
        <div className="flex flex-col min-h-screen">

            {success && user ? <NavbarLogin user={user} /> : <Navbar />}
            {/* The 'grow' now actually works to push the footer down */}
            <main className="grow bg-white">
                {children}
            </main>
            <Footer />
        </div>
    );
}