import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()+={}[\]:;"'<>,.?/~`|\\_-])[A-Za-z\d@$!%*?&#^()+={}[\]:;"'<>,.?/~`|\\_-]{8,}$/;

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordRegex.test(newPassword)) {
      setError(
        "Parola trebuie să conțină cel puțin 8 caractere, o literă mică, una mare, un număr și un caracter special. Caractere speciale permise: @$!%*?&#^()+={}[]:;\"'<>,.?/~`|\\_-"
      );
      return;
    }

    try {
      await api.post("/Auth/reset-password", { token, newPassword });
      setMessage("Parola a fost schimbată cu succes!");
      setError("");
    } catch (err: any) {
      setMessage(err.response?.data || "Eroare la resetare");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Resetează parola</h2>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {!message && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Parolă nouă"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Resetează parola
          </button>
        </form>
      )}

      {message && (
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Mergi către autentificare
        </button>
      )}
    </div>
  );
};

export default ResetPasswordPage;
