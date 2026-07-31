import apiClient from './apiClient';

apiClient.interceptors.request.use((config) => {
  // Add auth token if exists
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401, 403 globally
    return Promise.reject(error);
  }
);
