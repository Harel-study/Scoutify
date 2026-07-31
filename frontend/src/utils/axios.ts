import axios from 'axios';

// Get API base URL from Vite environment, fallback to localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enables sending/receiving HttpOnly cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});
// Request Interceptor: Attach access token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response Interceptor: Handle expired tokens
let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop if refresh request itself fails
    if (originalRequest.url === '/auth/refresh') {
      isRefreshing = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      return Promise.reject(error);
    }

    // Check if error is 401 unauthorized (Token Expired)
    const isAuthRoute = 
      originalRequest.url === '/auth/login' || 
      originalRequest.url === '/auth/register' || 
      originalRequest.url === '/auth/google' ||
      originalRequest.url === '/auth/logout';

    const isTokenExpiredError = 
      error.response && 
      error.response.status === 401 && 
      !isAuthRoute &&
      !originalRequest._retry;

    if (isTokenExpiredError) {
      if (isRefreshing) {
        // Queue this request while token is refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request token refresh (cookie is automatically sent)
        const response = await api.post('/auth/refresh');
        const { accessToken } = response.data;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          processQueue(null, accessToken);
          isRefreshing = false;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;   
        // Clear local storage and dispatch event to alert AuthProvider
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-expired'));
        
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default api;
