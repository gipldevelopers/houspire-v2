// lib/api/dashboard.js
import api from '@/lib/axios';

export const dashboardApi = {
  // Get overall dashboard statistics
  getStats: async (params = {}) => {
    const response = await api.get('/admin/dashboard/stats', { params });
    return response.data;
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    const response = await api.get('/admin/dashboard/revenue-analytics', { params });
    return response.data;
  },

  // Get project analytics
  getProjectAnalytics: async (params = {}) => {
    const response = await api.get('/admin/dashboard/project-analytics', { params });
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (params = {}) => {
    const response = await api.get('/admin/dashboard/recent-activities', { params });
    return response.data;
  },

  // Get quick stats
  getQuickStats: async () => {
    const response = await api.get('/admin/dashboard/quick-stats');
    return response.data;
  },

  // Export dashboard data
  exportData: async (params = {}) => {
    const response = await api.get('/admin/dashboard/export', { 
      params,
      responseType: 'blob' // For file download
    });
    return response.data;
  },
};

export default dashboardApi;