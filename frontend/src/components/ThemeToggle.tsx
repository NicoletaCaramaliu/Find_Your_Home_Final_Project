import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors duration-300 text-gray-800 dark:text-gray-200"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
