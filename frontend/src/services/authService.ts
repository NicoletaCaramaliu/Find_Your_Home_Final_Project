import axios from "axios";

const API_URL = "http://localhost:5266/api/Auth"; 

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", response.data.Token);
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.Message || "Autentificare eșuată");
  }
};

export const register = async (email: string, username: string, password: string, role: number) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, username, password, role });
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.Message || "Înregistrare eșuată");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
