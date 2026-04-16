import RegisterFooter from "./Components/RegisterFooter";
import RegisterForm from "./Components/RegisterForm";
import RegisterHeader from "./Components/RegisterHeader";

export default function RegisterPage() {
    return (
        <div className="bg-gray-50 flex items-center justify-center px-4 py-12 h-full">
            <div className="w-full max-w-md">
                <RegisterHeader />
                <RegisterForm />
                <RegisterFooter />
            </div>
        </div>
    );
}