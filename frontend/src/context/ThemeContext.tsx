import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// tipuri pentru TypeScript
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// provider pentru gestionarea temei
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark"; 
  });
  
  useEffect(() => {
    console.log("Tema setată în ThemeProvider:", theme);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  const toggleTheme = () => {
    console.log("Schimbare temă de la:", theme);
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// hook personalizat pentru a folosi tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme trebuie folosit în interiorul ThemeProvider");
  }
  return context;
};
