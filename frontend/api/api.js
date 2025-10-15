import axios from "axios";

// Ganti baseURL sesuai Laragon Nginx
const api = axios.create({
  baseURL: "http://backend.test/api", // <-- sesuaikan domain / port Nginx
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
