// src/lib/axios.js
import axios from 'axios';
import { getAuthToken, clearAuthCookies } from '@/utils/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    // Skip auth for public routes
    const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/admin/signin'];
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
    
    if (token && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - UPDATED: No automatic redirects or token clearing
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Don't automatically handle 401 errors - let components handle them
    // This prevents page reloads on login failures
    if (response?.status === 401) {
      // Only clear tokens if it's NOT an auth route (meaning token expired)
      const isAuthRoute = response.config?.url?.includes('/auth/');
      if (!isAuthRoute) {
        // Token expired during normal usage, clear auth
        clearAuthCookies();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/signin';
        }
      }
      // For auth routes (login failures), just reject the error
      return Promise.reject(error);
    }
    
    // Handle other errors normally
    if (response?.data) {
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default api;