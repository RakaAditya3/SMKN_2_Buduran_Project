import axios from "axios";

const api = axios.create({
  baseURL: "https://env-laravel.jh-beon.cloud/api",
   headers: {
    "Accept": "application/json",
    "Content-Type": "application/json", // ✅ tambahkan ini
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const student_token = localStorage.getItem("student_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (student_token) {
      config.headers.Authorization = `Bearer ${student_token}`;
    }
  }
  return config;
});

export default api;
