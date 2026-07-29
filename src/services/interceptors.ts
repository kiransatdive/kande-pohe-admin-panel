import apiClient from './apiClient';

apiClient.interceptors.request.use((config) => {
  // Add auth token if exists
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401, 403 globally
    return Promise.reject(error);
  }
);
