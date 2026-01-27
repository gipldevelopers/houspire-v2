// src/services/user.service.js
import api from '@/lib/axios';

export const userService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load user profile'
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to update profile'
      };
    }
  },

  // Logout user (server-side)
  logout: async () => {
    try {
      const response = await api.post('/users/profile/logout');
      return response.data;
    } catch (error) {
      // Even if API call fails, we'll still clear client-side storage
      return {
        success: false,
        message: 'Logout completed on client side'
      };
    }
  },
    updateTourStatus: async (hasSeenTour) => {
    try {
      const response = await api.patch('/users/tour/status', { hasSeenTour });
      return response.data;
    } catch (error) {
      console.error('❌ Error updating tour status:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to update tour status'
      };
    }
  },
  getTourStatus: async () => {
    try {
      const response = await api.get('/users/tour/status');
      return response.data;
    } catch (error) {
      console.error('❌ Error getting tour status:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to get tour status'
      };
    }
  },
  
  // Check if user has phone number
  checkPhoneNumber: async () => {
    try {
      const response = await api.get('/users/profile/phone/check');
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to check phone number'
      };
    }
  },
};