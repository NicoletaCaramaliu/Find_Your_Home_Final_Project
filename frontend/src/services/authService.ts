import api from "../api";
import axios from "axios";

const REFRESH_API_URL = import.meta.env.MODE === "production"
  ? "https://findyourhomeapp-g2h4decmh2argjet.westeurope-01.azurewebsites.net/api"
  : "http://localhost:5266/api";

const refreshApi = axios.create({
  baseURL: REFRESH_API_URL,
  withCredentials: true,
});

const AUTH_URL = "/Auth" ;

const parseError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data?.Message;

    switch (status) {
      case 400:
        return message || "Date invalide.";
      case 401:
        return message || "Email sau parolă incorecte.";
      case 403:
        return "Acces interzis.";
      case 404:
        return "Resursa nu a fost găsită.";
      case 500:
        return "Eroare de server. Încearcă din nou.";
      default:
        return message || "A apărut o eroare necunoscută.";
    }
  }

  return "Eroare de rețea sau server indisponibil.";
};

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post(`${AUTH_URL}/login`, { email, password });
    const token = response.data.token;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error: any) {
    throw new Error(parseError(error));
  }
};

export const register = async (
  email: string,
  username: string,
  password: string,
  role: number
) => {
  try {
    const response = await api.post(`${AUTH_URL}/register`, {
      email,
      username,
      password,
      role,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(parseError(error));
  }
};

export const logout = async () => {
  try {
    await api.post(`${AUTH_URL}/logout`);
    localStorage.removeItem("token");
  } catch (error: any) {
    throw new Error(parseError(error));
  }
};

export const refreshToken = async (): Promise<string> => {
  try {
    const response = await refreshApi.post("/Auth/refresh-token");
    return response.data.token;
  } catch (error: any) {
    throw new Error("Tokenul a expirat sau este invalid.");
  }
};
