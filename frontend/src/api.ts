import axios, { AxiosRequestConfig } from "axios";
import { refreshToken } from "./services/authService";

const API_URL = process.env.REACT_APP_API_URL;


interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Adauga token la fiecare request
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

// Intercepteaza 401 si incearcă refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Interceptor intrat");
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        localStorage.setItem("token", newToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token invalid sau expirat");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);



export default api;
