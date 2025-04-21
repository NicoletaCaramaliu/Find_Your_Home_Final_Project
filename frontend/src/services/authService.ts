import api from "../api";
import axios from "axios";
import { parseError } from "../utils/parseError";


  const REFRESH_API_URL =
  import.meta.env.MODE === "production"
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:5266/api";


const refreshApi = axios.create({
  baseURL: REFRESH_API_URL,
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
    if (import.meta.env.MODE === "development") {
      console.error("Login error:", error);
    }
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
    if (import.meta.env.MODE === "development") {
      console.error("Register error:", error);
    }
    throw new Error(parseError(error));
  }
};

export const logout = async () => {
  try {
    await api.post(`${AUTH_URL}/logout`);
    localStorage.removeItem("token");
  } catch (error: any) {
    if (import.meta.env.MODE === "development") {
      console.error("Logout error:", error);
    }
    throw new Error(parseError(error));
  }
};

export const refreshToken = async (): Promise<string> => {
  try {
    const response = await refreshApi.post("/Auth/refresh-token");
    return response.data.token;
  } catch (error: any) {
    if (import.meta.env.MODE === "development") {
      console.error("Refresh token error:", error);
    }
    throw new Error(parseError(error));
  }
};
