// src/services/coupon.service.js
import api from "@/lib/axios";

export const couponService = {
  // Validate coupon
  validateCoupon: async (code, amount, planId = null, addonIds = []) => {
    try {
      const response = await api.post("/coupons/validate", {
        code,
        amount,
        planId,
        addonIds,
      });
      return response.data;
    } catch (error) {
      return (
        error.response?.data || {
          success: false,
          message: "Failed to validate coupon",
        }
      );
    }
  },

  // Get all coupons (admin)
  getCoupons: async () => {
    try {
      const response = await api.get("/coupons");
      return response.data;
    } catch (error) {
      return (
        error.response?.data || {
          success: false,
          message: "Failed to load coupons",
        }
      );
    }
  },

  // Create coupon (admin)
  createCoupon: async (couponData) => {
    try {
      const response = await api.post("/coupons", couponData);
      return response.data;
    } catch (error) {
      return (
        error.response?.data || {
          success: false,
          message: "Failed to create coupon",
        }
      );
    }
  },

  // Update coupon (admin)
  updateCoupon: async (couponId, updateData) => {
    try {
      const response = await api.put(`/coupons/${couponId}`, updateData);
      return response.data;
    } catch (error) {
      return (
        error.response?.data || {
          success: false,
          message: "Failed to update coupon",
        }
      );
    }
  },

  // Delete coupon (admin)
  deleteCoupon: async (couponId) => {
    try {
      const response = await api.delete(`/coupons/${couponId}`);
      return response.data;
    } catch (error) {
      return (
        error.response?.data || {
          success: false,
          message: "Failed to delete coupon",
        }
      );
    }
  },

  // Update coupon status (admin)
  updateCouponStatus: async (couponId, isActive) => {
    try {
      const response = await api.patch(`/coupons/${couponId}/status`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      return (
        error.response?.data || {
          success: false,
          message: "Failed to update coupon status",
        }
      );
    }
  },
  // Get coupon by ID (admin)
  getCouponById: async (couponId) => {
    try {
      const response = await api.get(`/coupons/${couponId}`);
      return response.data;
    } catch (error) {
      return (
        error.response?.data || {
          success: false,
          message: "Failed to load coupon details",
        }
      );
    }
  },

  // Get coupon statistics (admin)
  getCouponStats: async () => {
    try {
      const response = await api.get("/coupons/stats/all");
      return response.data;
    } catch (error) {
      return (
        error.response?.data || {
          success: false,
          message: "Failed to load coupon statistics",
        }
      );
    }
  },
};
