// 🎯 File: src/constants/api.ts
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore"; // 🔑 Import your global auth store

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("🚀 API CLIENT INITIALIZED WITH BASE URL:", baseURL);

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject the bearer token dynamically right before the request leaves!
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ` + accessToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
