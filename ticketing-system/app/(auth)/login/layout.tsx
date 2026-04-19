import Footer from "@/app/(landing)/components/Footer";
import RushNavbar from "@/app/globalcomponents/Navbar/Navbar";

export default function RootLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 selection:bg-emerald-500/30 selection:text-emerald-900">

        <main className="grow flex flex-col">
            {children}
        </main>

        </div>
    );
}