import React, { useState } from "react";
import api from "../api";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/Auth/request-password-reset", email, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage("Verifică emailul pentru linkul de resetare.");
    } catch (err: any) {
      setMessage(err.response?.data || "Eroare");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Recuperare parolă</h2>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Emailul tău"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Trimite link de resetare
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;