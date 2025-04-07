import axios from "axios";


const refreshApi = axios.create({
  baseURL: "http://localhost:5266/api",
  withCredentials: true,
});

const AUTH_URL = "/Auth";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${AUTH_URL}/login`,
      { email, password },
      { baseURL: "http://localhost:5266/api", withCredentials: true }
    );

    const token = response.data.token;
    localStorage.setItem("token", token);
    
    setTimeout(() => {
      window.location.reload();
    }, 200);
    
    return response.data;
  } catch (error: any) {
    console.error("Eroare la login:", error);
    throw new Error(error.response?.data?.message || "Login eșuat");
  }
};

export const register = async (email: string, username: string, password: string, role: number) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, {
      email,
      username,
      password,
      role,
    }, {
      baseURL: "http://localhost:5266/api",
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.Message || "Înregistrare eșuată");
  }
};

export const logout = async () => {
  try {
    await axios.post(`${AUTH_URL}/logout`, {}, {
      baseURL: "http://localhost:5266/api",
      withCredentials: true
    });
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
