import LoginFooter from "./_components/LoginFooter";
import LoginForm from "./_components/LoginForm";
import LoginHeader from "./_components/LoginHeader";

export default function LoginPage() {
    return (
        <div className="bg-gray-50 flex items-center justify-center px-4 h-full">
            <div className="w-full max-w-md">
                <LoginHeader />
                <LoginForm />
                <LoginFooter />
            </div>
        </div>
    );
}