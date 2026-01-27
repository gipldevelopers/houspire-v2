// src/services/auth.service.js
import api from '@/lib/axios';
import { setAuthCookie, clearAuthCookies, getAuthToken, getUserData, isAuthenticated, isAdmin } from '@/utils/cookies';

const authService = {
  // User Sign Up
  signUp: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        setAuthCookie(token, user, false);
      }
      
      return response.data; // Return the exact backend response
    } catch (error) {
      // Return the EXACT backend error structure
      return error.response?.data || {
        success: false,
        message: 'Signup failed'
      };
    }
  },

  // User Sign In - FIXED: This was the main issue
  signIn: async (credentials) => {
    try {
      const response = await api.post('/auth/signin', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        setAuthCookie(token, user, false);
      }
      
      return response.data; // Return exact backend response
    } catch (error) {
      // CRITICAL FIX: Return the exact backend error structure
      return error.response?.data || {
        success: false,
        message: 'Login failed'
      };
    }
  },

  // Admin Sign In - FIXED
  adminSignIn: async (credentials) => {
    try {
      const response = await api.post('/auth/admin/signin', credentials);
      
      if (response.data.success) {
        const { token, admin } = response.data.data;
        setAuthCookie(token, admin, true);
      }
      
      return response.data;
    } catch (error) {
      // Return exact backend error structure
      return error.response?.data || {
        success: false,
        message: 'Admin login failed'
      };
    }
  },

  // Get Current User
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');

      return response.data;
    } catch (error) {
      // For this one, return the error structure instead of throwing
      return error.response?.data || {
        success: false,
        message: 'Failed to get user data'
      };
    }
  },

  // Refresh Token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Token refresh failed'
      };
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to send reset email'
      };
    }
  },

  // Reset Password
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Password reset failed'
      };
    }
  },

  // Change Password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Password change failed'
      };
    }
  },

  // Google Auth
  googleAuth: async (token) => {
    try {
      const response = await api.post('/auth/google', { token });
      
      if (response.data.success) {
        const { token: authToken, user } = response.data.data;
        setAuthCookie(authToken, user, false);
      }
      
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Google authentication failed'
      };
    }
  },

  // Send Magic Link
  sendMagicLink: async (email) => {
    try {
      const response = await api.post('/auth/magic-link/send', { email });
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to send magic link'
      };
    }
  },

  // Verify Magic Link
  verifyMagicLink: async (token) => {
    try {
      const response = await api.post('/auth/magic-link/verify', { token });
      
      if (response.data.success) {
        const { token: authToken, user } = response.data.data;
        setAuthCookie(authToken, user, false);
      }
      
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Magic link verification failed'
      };
    }
  },

  // Logout - optionally handle redirect at call site
  logout: (redirectPath) => {
    clearAuthCookies();
    // Let caller control navigation; keep optional redirect for backward compatibility
    if (redirectPath) {
      window.location.href = redirectPath;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return isAuthenticated();
  },

  // Check if user is admin
  isAdmin: () => {
    return isAdmin();
  },

  // Get stored user data
  getStoredUser: () => {
    return getUserData();
  },

  // Get auth token
  getToken: () => {
    return getAuthToken();
  }
};

export default authService;