import { useState, useEffect } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  errorMessage?: string;
  isLoading?: boolean;
}

export default function LoginForm({ onLogin, errorMessage, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setError("");
    }
  }, [errorMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Toate câmpurile sunt obligatorii");
      return;
    }

    setError("");
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pr-10" 
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:text-gray-300"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Se autentifică..." : "Autentificare"}
      </Button>
    </form>
  );
}
