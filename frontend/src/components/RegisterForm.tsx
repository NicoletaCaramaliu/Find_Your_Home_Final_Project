import { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const roles = [
  { label: "Admin", value: 0 },
  { label: "User", value: 1 },
  { label: "Agent", value: 2 },
];



interface RegisterFormProps {
  onRegister: (email: string, password: string, username: string, role: number) => void;
}

export default function RegisterForm({ onRegister }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setName] = useState("");
  const [role, setRole] = useState(1); // Default: User
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) {
      setError("Toate câmpurile sunt obligatorii");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Email-ul nu are forma corectă. Exemplu: user@example.com");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("Parola trebuie să conțină cel puțin 8 caractere, o literă mică, o literă mare, un număr și un caracter special");
      return;
    }
    setError("");
    onRegister(email, password, username, role);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Nume"
        value={username}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Parolă"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <select
        className="w-full p-2 border rounded-lg"
        value={role}
        onChange={(e) => setRole(Number(e.target.value))} // Convertim in numar
      >
        {roles.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>

      <Button type="submit" className="w-full">Înregistrare</Button>
    </form>
  );
}
