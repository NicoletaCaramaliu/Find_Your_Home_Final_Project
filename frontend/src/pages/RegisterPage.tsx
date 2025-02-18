import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { Card, CardContent } from "../components/ui/Card";
import { register } from "../services/authService"; // functia care face request la backend

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (email: string, password: string, username: string, role: number) => {
    try {
      await register(email, username, password, role);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Eroare la înregistrare:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg rounded-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">Înregistrare</h2>
          <RegisterForm onRegister={handleRegister} />
        </CardContent>
      </Card>
    </div>
  );
}
