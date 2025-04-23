import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginForm from "../../components/login/LoginForm";
import { Link } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import { login } from "../../services/authService";
import Navbar from "../../components/NavBar";
import { motion } from "framer-motion";

export default function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setErrorMessage(""); 

    try {
      await login(email, password);
      navigate("/properties?pageNumber=1&pageSize=10");
    } catch (error: any) {
      if (import.meta.env.MODE === "development") {
        console.error("Eroare la login:", error);
      }
      setErrorMessage(error.message || "Login eșuat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-600 dark:to-black transition-colors duration-500">
      
      {/* Imaginea din stânga */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="hidden lg:block w-3/4 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/home-background.jpg')" }}
      >
        <div className="h-full bg-black/40 dark:bg-black/60"></div>
      </motion.div>

      {/* Autentificarea */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/4 p-8 relative">
        
        {/* Navbar doar pe partea dreaptă */}
        <div className="absolute top-0 left-0 w-full bg-blue-500 dark:bg-gray-800/90">
          <Navbar />
        </div>

        <div className="w-full max-w-md mt-20">
          {/* Toggle dark mode */}
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>

          {/* Cardul de autentificare */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl shadow-2xl p-10 bg-blue-200 dark:bg-gray-800/90"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
              Autentificare
            </h2>

            <LoginForm
              onLogin={handleLogin}
              errorMessage={errorMessage}
              isLoading={isLoading}
            />

            <Link
              to="/forgot-password"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm block text-center mt-3">
              Ai uitat parola?
            </Link>

            <p className="mt-6 text-gray-600 dark:text-gray-400 text-center">
              Nu ai cont?{" "}
              <Link
                to="/register"
                className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
              >
                Înregistrează-te
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
