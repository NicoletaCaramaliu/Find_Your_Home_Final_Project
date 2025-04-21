import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/login/RegisterForm";
import { Card, CardContent } from "../components/ui/Card";
import { register } from "../services/authService"; // functia care face request la backend
import ThemeToggle from "../components/ThemeToggle";
import Navbar from "../components/NavBar";
import { motion } from "framer-motion";
import { useState } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string>("");

  const handleRegister = async (email: string, password: string, username: string, role: number) => {
    try {
      await register(email, username, password, role);
      setRegisterError("");
      navigate("/login");
    } catch (error: any) {
      if (import.meta.env.MODE === "development") {
        console.error("Eroare la înregistrare:", error.message);
      }
      setRegisterError(error.message); 
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-blue-100 dark:bg-gray-900 transition-colors duration-500 relative">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        >
          <div className="block dark:hidden w-full h-full" style={{ backgroundImage: "url('/images/register_background.jpg')", opacity: 0.3 }}></div>
          <div className="hidden dark:block w-full h-full" style={{ backgroundImage: "url('/images/register_background.jpg')", opacity: 0.4 }}></div>
        </motion.div>

        <motion.div
          drag
          dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
          whileDrag={{ scale: 1.1 }}
          dragElastic={0.2}
        >
          <Card className="w-96 p-8 shadow-lg rounded-lg bg-white dark:bg-gray-800 relative z-10">
            <ThemeToggle />
            <CardContent>
              <h2 className="text-2xl font-bold text-center mb-4">Înregistrare</h2>
              <RegisterForm onRegister={handleRegister} errorMessage={registerError} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}