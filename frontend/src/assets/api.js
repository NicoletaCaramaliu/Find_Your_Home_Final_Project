const API_URL = "http://localhost:44322/api"; 

export const getData = async () => {
    const response = await fetch(`${API_URL}/data`);
    return response.json();
};