import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { login } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate("/dashboard"); 
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <div
        className="hidden lg:block w-3/4 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/home-background.jpg')",
        }}
      >
        <div className="h-full bg-black/40"></div>
      </div>

      <div className="flex items-center justify-center w-full lg:w-1/4 p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>

          <div className="rounded-2xl shadow-xl p-8 bg-gray-100 dark:bg-gray-800/80">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
              Autentificare
            </h2>

            {/* trimite mesajul de eroare catre LoginForm */}
            <LoginForm onLogin={handleLogin} errorMessage={errorMessage} />

            <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
              Nu ai cont?{" "}
              <Link
                to="/register"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Înregistrează-te
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
