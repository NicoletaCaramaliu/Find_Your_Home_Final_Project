import { useState, useEffect } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  errorMessage?: string; // Eroare din partea serverului
}

export default function LoginForm({ onLogin, errorMessage }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      <Input
        type="password"
        placeholder="Parolă"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" className="w-full">
        Autentificare
      </Button>
    </form>
  );
}
