// src/services/gst.service.js
import api from '@/lib/axios';

export const gstService = {
  // Get current GST settings
  getGSTSettings: async () => {
    try {
      const response = await api.get('/admin/gst-settings');
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load GST settings'
      };
    }
  },

  // Update GST settings (admin only)
  updateGSTSettings: async (settings) => {
    try {
      const response = await api.put('/admin/gst-settings', settings);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to update GST settings'
      };
    }
  },

  // Calculate GST amount
  calculateGST: (amount, gstRate) => {
    return (amount * gstRate) / 100;
  },

  // Calculate total with GST
  calculateTotalWithGST: (amount, gstRate) => {
    const gstAmount = (amount * gstRate) / 100;
    return amount + gstAmount;
  },

    validateGSTNumber: async (gstNumber) => {
    try {
      const response = await api.post('/gst/validate', { gstNumber });
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to validate GST number'
      };
    }
  },

  // Save GST details for user
  saveGSTDetails: async (gstData) => {
    try {
      const response = await api.post('/gst/save-details', gstData);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to save GST details'
      };
    }
  },

  // Get user GST details
  getUserGSTDetails: async () => {
    try {
      const response = await api.get('/gst/user-details');
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load GST details'
      };
    }
  },

  // Remove GST details
  removeGSTDetails: async () => {
    try {
      const response = await api.delete('/gst/remove-details');
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to remove GST details'
      };
    }
  },

  // GST number validation regex
  validateGSTFormat: (gstNumber) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  }
};