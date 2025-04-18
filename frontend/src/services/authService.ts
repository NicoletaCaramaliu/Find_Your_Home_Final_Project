import api from "../api";
import axios from "axios";

const refreshApi = axios.create({
  baseURL: "https://findyourhomeapp-g2h4decmh2argjet.westeurope-01.azurewebsites.net/api",
  withCredentials: true,
});

const AUTH_URL = "/Auth";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post(`${AUTH_URL}/login`, { email, password });

    const token = response.data.token;
    localStorage.setItem("token", token);

    return response.data;
  } catch (error: any) {
    console.error("Eroare la login:", error);
    throw new Error(error.response?.data?.message || "Login eșuat");
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
    throw new Error(error.response?.data?.Message || "Înregistrare eșuată");
  }
};

export const logout = async () => {
  try {
    await api.post(`${AUTH_URL}/logout`);
    localStorage.removeItem("token");
  } catch (error: any) {
    console.error("Eroare la delogare:", error);
    throw new Error("Delogare eșuată");
  }
};

export const refreshToken = async (): Promise<string> => {
  try {
    const response = await refreshApi.post("/Auth/refresh-token");
    return response.data.token;
  } catch (error) {
    console.error("Eroare la refresh token:", error);
    throw new Error("Tokenul a expirat. Trebuie să vă reconectați.");
  }
};
