import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import Navbar from "../components/NavBar";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error: any) {
      console.error("Eroare la delogare:", error);
      alert("Delogarea a eșuat. Încearcă din nou!");
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="flex flex-col items-center justify-center w-full p-8 relative">
        <div className="absolute top-0 left-0 w-full">
          <Navbar />
        </div>

        <div className="w-full max-w-md mt-20 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
            Bine ai venit pe Dashboard!
          </h2>

          <button
            onClick={handleLogout}
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Deloghează-te
          </button>
        </div>
      </div>
    </div>
  );
}
