// src\services\style.service.js
import axios from '@/lib/axios';

export const styleService = {
  // Get all styles with filtering
  getStyles: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.featured !== undefined) params.append('featured', filters.featured);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await axios.get(`/styles?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch styles');
    }
  },

  // Get featured styles
  getFeaturedStyles: async (limit = 6) => {
    try {
      const response = await axios.get(`/styles/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch featured styles');
    }
  },

  // Get single style
  getStyle: async (styleId) => {
    try {
      const response = await axios.get(`/styles/${styleId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch style');
    }
  }
};