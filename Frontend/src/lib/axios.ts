import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // We can implement refresh token logic here if we get 401
    // For Phase 1 simplified, we just clear auth and redirect to login if 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { clearAuth } = useAuthStore.getState();
      clearAuth();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
