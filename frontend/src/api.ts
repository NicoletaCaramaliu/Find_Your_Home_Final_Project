// src/api.ts
import axios, { AxiosRequestConfig } from "axios";
import { refreshToken } from "./services/authService";

const API_URL = "http://localhost:5266/api";

// 🔧 Extindem configul axios ca să acceptăm _retry
interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshToken();
          localStorage.setItem("token", newToken);
      
          (originalRequest.headers ??= {}).Authorization = `Bearer ${newToken}`;
      
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("token");
          console.error("Refresh token invalid sau expirat");
          window.location.href = "/login";
        }
      }

    return Promise.reject(error);
  }
);

export default api;
