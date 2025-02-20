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

      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: any) {
      console.error("Eroare la login:", error);
  
      if (!error.response) {
        throw new Error("Parolă greșită.");
      }

      throw new Error(error.response?.data?.Message || "Nu sunteți înregistrat. Creați-vă un cont pentru a vă putea bucura de beneficiile apliacției.");
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



export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  } catch (error: any) {
    console.error("Eroare la delogare:", error);
    throw new Error("Delogare eșuată");
  }
};
