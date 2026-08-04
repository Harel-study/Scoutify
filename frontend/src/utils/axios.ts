/**
 * @module AxiosClient
 *
 * Configures and provides a pre-configured Axios instance for API communication.
 * Handles automatic attachment of authorization headers and silent refresh token rotation
 * on 401 Unauthorized responses.
 */
import axios from 'axios';

// Get API base URL from Vite environment, fallback to localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Pre-configured Axios instance for making authenticated requests to the API.
 * Automatically handles attaching the Bearer token and rotating expired tokens.
 *
 * @example
 * import api from '@/utils/axios';
 * const response = await api.get('/users/profile');
 */
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

/** @type {boolean} True if a token refresh request is currently in flight. */
let isRefreshing = false;

/** @type {Array<{resolve: Function, reject: Function}>} Requests queued while waiting for a new token. */
let failedQueue: any[] = [];

/**
 * Resolves or rejects all pending queued requests when a token refresh completes.
 *
 * @param  {any}            error    The error if the token refresh failed, or null if successful.
 * @param  {string | null}  [token]  The new access token, provided if the refresh was successful.
 */
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
