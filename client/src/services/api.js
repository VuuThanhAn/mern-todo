import axios from "axios";

// baseURL: lấy từ biến môi trường (VITE_API_BASE) hoặc fallback localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
});

export default api;