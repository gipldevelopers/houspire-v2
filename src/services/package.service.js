// src\services\package.service.js
import api from '@/lib/axios';

export const packageService = {
// Get all packages - UPDATED to handle includeSingleRoom parameter
getPackages: async (activeOnly = true, includeSingleRoom = false) => {
  try {
    const response = await api.get(`/packages?activeOnly=${activeOnly}&includeSingleRoom=${includeSingleRoom}`);
    return response.data;
  } catch (error) {
    return error.response?.data || {
      success: false,
      message: 'Failed to load packages'
    };
  }
},

    // Get all addons
  getAddons: async (activeOnly = true) => {
    try {
      const response = await api.get(`/packages/addons?activeOnly=${activeOnly}`);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load addons'
      };
    }
  },

// Get single package for admin (FIXED)
getPackageForAdmin: async (packageId) => {
  try {
    const response = await api.get(`/packages/admin/${packageId}`);
    return response.data;
  } catch (error) {
    console.error('Error loading package:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to load package',
      data: { package: null }
    };
  }
},

  // Get single package - FIXED: Use the correct endpoint
  getPackage: async (packageId) => {
    try {
      const response = await api.get(`/packages/${packageId}`);
      return response.data;
    } catch (error) {
      console.error('Error loading package:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to load package',
        data: { package: null }
      };
    }
  },

 //  Get single addon
getAddon: async (addonId) => {
  try {
    const response = await api.get(`/packages/addons/${addonId}`);
    return response.data;
  } catch (error) {
    console.error('Error loading addon:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to load addon',
      data: { addon: null }
    };
  }
},

  // Create package (admin only)
  createPackage: async (packageData) => {
    try {
      const response = await api.post('/packages', packageData);
      return response.data;
    } catch (error) {
      console.error('Error creating package:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to create package'
      };
    }
  },

 // Update package (admin only) - FIXED
  updatePackage: async (packageId, updateData) => {
    try {
      const response = await api.put(`/packages/${packageId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating package:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to update package'
      };
    }
  },


  // Update package status (admin only)
  updatePackageStatus: async (packageId, isActive) => {
    try {
      const response = await api.patch(`/packages/${packageId}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error updating package status:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to update package status'
      };
    }
  },

  // Delete package (admin only)
  deletePackage: async (packageId) => {
    try {
      const response = await api.delete(`/packages/${packageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting package:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to delete package'
      };
    }
  },

  // Create addon (admin only)
  createAddon: async (addonData) => {
    try {
      const response = await api.post('/packages/addons', addonData);
      return response.data;
    } catch (error) {
      console.error('Error creating addon:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to create addon'
      };
    }
  },

 // Update addon (admin only) - FIXED
  updateAddon: async (addonId, updateData) => {
    try {
      const response = await api.put(`/packages/addons/${addonId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating addon:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to update addon'
      };
    }
  },

  // Update addon status (admin only)
  updateAddonStatus: async (addonId, isActive) => {
    try {
      const response = await api.patch(`/packages/addons/${addonId}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error updating addon status:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to update addon status'
      };
    }
  },

  // Delete addon (admin only)
  deleteAddon: async (addonId) => {
    try {
      const response = await api.delete(`/packages/addons/${addonId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting addon:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to delete addon'
      };
    }
  },

  // Get all packages for admin (includes inactive)
  getAllPackages: async () => {
    try {
      const response = await api.get('/packages/admin/all');
      return response.data;
    } catch (error) {
      console.error('Error loading all packages:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to load packages',
        data: { packages: [] }
      };
    }
  },

  // Get all addons for admin (includes inactive)
  getAllAddons: async () => {
    try {
      const response = await api.get('/packages/admin/addons');
      return response.data;
    } catch (error) {
      console.error('Error loading all addons:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to load addons',
        data: { addons: [] }
      };
    }
  },

  // Get package statistics for admin
  getPackageStats: async () => {
    try {
      const response = await api.get('/packages/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error loading package stats:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to load package statistics',
        data: { stats: {} }
      };
    }
  },

 // Get single addon for admin (FIXED)
getAddonForAdmin: async (addonId) => {
  try {
    const response = await api.get(`/packages/addons/admin/${addonId}`);
    return response.data;
  } catch (error) {
    console.error('Error loading addon:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to load addon',
      data: { addon: null }
    };
  }
},
  // Process payment and update project
  processPayment: async (projectId, paymentData) => {
    try {
      const response = await api.post('/projects/payment', {
        projectId,
        ...paymentData
      });
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to process payment'
      };
    }
  },

    // Get GST settings
  getGSTSettings: async () => {
    try {
      const response = await api.get('/payments/gst-settings');
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load GST settings',
        data: { rate: 18.0 } // Default fallback
      };
    }
  },

  // Calculate pricing with GST and discount
  calculatePricing: (subtotal, gstRate, couponDiscount = 0, discountType = 'PERCENTAGE') => {
    let discountAmount = 0;
    
    if (discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * couponDiscount) / 100;
    } else {
      discountAmount = Math.min(couponDiscount, subtotal);
    }

    const amountAfterDiscount = subtotal - discountAmount;
    const gstAmount = (amountAfterDiscount * gstRate) / 100;
    const totalAmount = amountAfterDiscount + gstAmount;

    return {
      subtotal,
      discountAmount,
      amountAfterDiscount,
      gstAmount,
      totalAmount
    };
  }
};