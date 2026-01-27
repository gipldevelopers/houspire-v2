// lib/api/search.js
import api from '@/lib/axios';

export const searchApi = {
  // Global search
  globalSearch: (params) => 
    api.get('/admin/search/global', { 
      params: {
        query: params.query,
        limit: params.limit || 5
      } 
    }),

  // Search by type
  searchByType: (type, params) =>
    api.get(`/admin/search/${type}`, { 
      params: {
        query: params.query,
        page: params.page || 1,
        limit: params.limit || 10
      }
    }),

  // Get search suggestions - CORRECTED ENDPOINT
  getSuggestions: (params) =>
    api.get('/admin/search/suggestions/all', { 
      params: {
        query: params.query
      }
    }),
};

export default searchApi;