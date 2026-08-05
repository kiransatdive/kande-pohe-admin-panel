import axios from 'axios';
import { env } from '../config/env';

const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 60000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
