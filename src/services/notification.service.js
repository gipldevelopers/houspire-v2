// src/services/notification.service.js
import api from "@/lib/axios";

export const notificationService = {
  // Get user notifications
  getUserNotifications: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/notifications?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return {
        success: false,
        message: "Failed to load notifications",
        data: { notifications: [] }
      };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return {
        success: false,
        message: "Failed to mark notification as read"
      };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.patch('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return {
        success: false,
        message: "Failed to mark all notifications as read"
      };
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return {
        success: false,
        message: "Failed to load unread count",
        data: { count: 0 }
      };
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      return {
        success: false,
        message: "Failed to delete notification"
      };
    }
  }
};
