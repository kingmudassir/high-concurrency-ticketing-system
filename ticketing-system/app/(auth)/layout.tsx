import Footer from "../Global-Components/Footer";
import Navbar from "./_components/AuthNavbar";

// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="grow flex items-center justify-center bg-gray-50">{children}</main>
        </>
    );
}