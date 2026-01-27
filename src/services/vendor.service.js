// // src/services/vendor.service.js
// import api from '@/lib/axios';

// export const vendorService = {
//   // Get all vendors
//   getAllVendors: async (filters = {}) => {
//     try {
//       const params = new URLSearchParams();
//       Object.keys(filters).forEach(key => {
//         if (filters[key] !== undefined && filters[key] !== null) {
//           params.append(key, filters[key]);
//         }
//       });
      
//       const response = await api.get(`/vendors/admin/list?${params.toString()}`);
//       return response.data;
//     } catch (error) {
//       return error.response?.data || {
//         success: false,
//         message: 'Failed to load vendors'
//       };
//     }
//   },

//   // Get single vendor
//   getVendor: async (vendorId) => {
//     try {
//       const response = await api.get(`/vendors/${vendorId}`);
//       return response.data;
//     } catch (error) {
//       return error.response?.data || {
//         success: false,
//         message: 'Failed to load vendor'
//       };
//     }
//   },

//   // Create vendor
//   createVendor: async (vendorData) => {
//     try {
//       const response = await api.post('/vendors', vendorData);
//       return response.data;
//     } catch (error) {
//       return error.response?.data || {
//         success: false,
//         message: 'Failed to create vendor'
//       };
//     }
//   },

//   // Update vendor
//   updateVendor: async (vendorId, vendorData) => {
//     try {
//       const response = await api.put(`/vendors/${vendorId}`, vendorData);
//       return response.data;
//     } catch (error) {
//       return error.response?.data || {
//         success: false,
//         message: 'Failed to update vendor'
//       };
//     }
//   },

//   // Toggle vendor status
//   toggleVendorStatus: async (vendorId, isActive) => {
//     try {
//       const response = await api.patch(`/vendors/${vendorId}/status`, { isActive });
//       return response.data;
//     } catch (error) {
//       return error.response?.data || {
//         success: false,
//         message: 'Failed to update vendor status'
//       };
//     }
//   },

//   // Verify vendor
//   verifyVendor: async (vendorId) => {
//     try {
//       const response = await api.patch(`/vendors/${vendorId}/verify`);
//       return response.data;
//     } catch (error) {
//       return error.response?.data || {
//         success: false,
//         message: 'Failed to verify vendor'
//       };
//     }
//   },

//   // Export vendors to Excel
//   exportVendors: async (filters = {}) => {
//     try {
//       const params = new URLSearchParams();
//       Object.keys(filters).forEach(key => {
//         if (filters[key] !== undefined && filters[key] !== null) {
//           params.append(key, filters[key]);
//         }
//       });

//       const response = await api.get(`/vendors/export/excel?${params.toString()}`, {
//         responseType: 'blob'
//       });
      
//       // Create download link
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `vendors_export_${Date.now()}.xlsx`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       return { success: true, message: 'Export completed successfully' };
//     } catch (error) {
//       console.error('Export error:', error);
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Failed to export vendors'
//       };
//     }
//   },

//   // Import vendors from Excel
//   // importVendors: async (file) => {
//   //   try {
//   //     const formData = new FormData();
//   //     formData.append('file', file);

//   //     const response = await api.post('/vendors/import', formData, {
//   //       headers: {
//   //         'Content-Type': 'multipart/form-data'
//   //       }
//   //     });
//   //     return response.data;
//   //   } catch (error) {
//   //     return error.response?.data || {
//   //       success: false,
//   //       message: 'Failed to import vendors'
//   //     };
//   //   }
//   // },
//   // In the importVendors method, update the error handling:
// importVendors: async (file) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', file);

//     const response = await api.post('/vendors/import', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       },
//       timeout: 60000 // Increase timeout for large files
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Import error:', error);
//     return {
//       success: false,
//       message: error.response?.data?.message || 'Failed to import vendors. Please check the file format.'
//     };
//   }
// },

//   // Download import template
//   downloadTemplate: async () => {
//     try {
//       const response = await api.get('/vendors/import/template', {
//         responseType: 'blob'
//       });
      
//       // Create download link
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'vendor_import_template.xlsx');
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       return { success: true, message: 'Template downloaded successfully' };
//     } catch (error) {
//       console.error('Template download error:', error);
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Failed to download template'
//       };
//     }
//   }
// };

// src/services/vendor.service.js
import api from '@/lib/axios';

export const vendorService = {
  // Get all vendors with pagination and filters
  getAllVendors: async (filters = {}, page = 1, limit = 12) => {
    try {
      const params = new URLSearchParams();
      
      // Add pagination
      params.append('page', page);
      params.append('limit', limit);
      
      // Add filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/vendors/admin/list?${params.toString()}`);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load vendors'
      };
    }
  },

  // Get vendor stats for filters
  getVendorStats: async () => {
    try {
      const response = await api.get('/vendors/admin/stats');
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load vendor stats'
      };
    }
  },

  // Rest of the methods remain the same...
  getVendor: async (vendorId) => {
    try {
      const response = await api.get(`/vendors/${vendorId}`);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load vendor'
      };
    }
  },

  createVendor: async (vendorData) => {
    try {
      const response = await api.post('/vendors', vendorData);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to create vendor'
      };
    }
  },

  updateVendor: async (vendorId, vendorData) => {
    try {
      const response = await api.put(`/vendors/${vendorId}`, vendorData);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to update vendor'
      };
    }
  },

  toggleVendorStatus: async (vendorId, isActive) => {
    try {
      const response = await api.patch(`/vendors/${vendorId}/status`, { isActive });
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to update vendor status'
      };
    }
  },

  verifyVendor: async (vendorId) => {
    try {
      const response = await api.patch(`/vendors/${vendorId}/verify`);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to verify vendor'
      };
    }
  },

  exportVendors: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/vendors/export/excel?${params.toString()}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vendors_export_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Export completed successfully' };
    } catch (error) {
      console.error('Export error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to export vendors'
      };
    }
  },

  importVendors: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/vendors/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to import vendors'
      };
    }
  },

  downloadTemplate: async () => {
    try {
      const response = await api.get('/vendors/import/template', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vendor_import_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Template downloaded successfully' };
    } catch (error) {
      console.error('Template download error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to download template'
      };
    }
  }
};