import axios from "axios";

const api = axios.create({
  baseURL: "http://backend.test/api",
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
