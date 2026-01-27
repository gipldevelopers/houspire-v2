// src/services/boq.service.js
import api from '@/lib/axios';

export const boqService = {
  // Get user's BOQs - only SENT status
  getUserBOQs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/boq?${params.toString()}`);
      
      // Filter only BOQs with SENT status for users
      if (response.data.success && response.data.data?.boqs) {
        const sentBOQs = response.data.data.boqs.filter(boq => 
          boq.status === 'SENT'
        );
        
        return {
          ...response.data,
          data: {
            ...response.data.data,
            boqs: sentBOQs
          }
        };
      }
      
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load BOQs'
      };
    }
  },

  // Get single BOQ (only if SENT status)
  getBOQ: async (publicId) => {
    try {
      const response = await api.get(`/boq/${publicId}`);
      
      // Check if BOQ has SENT status before returning
      if (response.data.success && response.data.data) {
        const boq = response.data.data;
        if (boq.status !== 'SENT') {
          return {
            success: false,
            message: 'BOQ not available or has not been sent yet'
          };
        }
      }
      
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load BOQ'
      };
    }
  },

  // Get BOQs by project (only SENT status)
  getBOQsByProject: async (projectPublicId) => {
    try {
      const response = await api.get(`/boq/project/${projectPublicId}`);
      
      // Filter only BOQs with SENT status
      if (response.data.success && response.data.data) {
        const sentBOQs = response.data.data.filter(boq => 
          boq.status === 'SENT'
        );
        
        return {
          ...response.data,
          data: sentBOQs
        };
      }
      
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load project BOQs'
      };
    }
  },

  // Download BOQ as PDF
  downloadBOQ: async (publicId) => {
    try {
      const response = await api.get(`/boq/${publicId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to download BOQ');
    }
  }
};