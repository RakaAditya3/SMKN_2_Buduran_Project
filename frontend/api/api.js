import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: "https://env-laravel.jh-beon.cloud/api",
=======
  baseURL: "http://localhost:8000/api",
   headers: {
    "Accept": "application/json",
    "Content-Type": "application/json", // ✅ tambahkan ini
  },
>>>>>>> 5efe1eaa31e1aa6a090a2b5b1ba35ae0b65a78e2
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
