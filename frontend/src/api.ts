import axios, { AxiosRequestConfig } from "axios";
import { refreshToken } from "./services/authService";

const API_URL = import.meta.env.MODE === "production"
  ? "https://findyourhomeapp-g2h4decmh2argjet.westeurope-01.azurewebsites.net/api"
  : "http://localhost:5266/api";

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
    if (token && config.headers) {
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
    const status = error.response?.status;

    
    const shouldSkipRetry = error.config.url?.includes("/Auth/login");

    if (status === 401 && !originalRequest._retry && !shouldSkipRetry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        localStorage.setItem("token", newToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api(originalRequest);
      } catch {
        localStorage.removeItem("token");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
