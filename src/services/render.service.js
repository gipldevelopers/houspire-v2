// src\services\render.service.js
import api from "@/lib/axios";

export const renderService = {
  // Get user's renders (only COMPLETED status)
  getUserRenders: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/renders?${params.toString()}`);
      // Filter only renders with COMPLETED status for users
      if (response.data.success && Array.isArray(response.data.data)) {
        const completedRenders = response.data.data.filter(
          (render) => render.status === "COMPLETED"
        );
        return {
          ...response.data,
          data: {
            renders: completedRenders,
            pagination: response.data.pagination,
          },
        };
      }

      return response.data;
    } catch (error) {
      console.error("❌ Error loading renders:", error);
      return (
        error.response?.data || {
          success: false,
          message: "Failed to load renders",
        }
      );
    }
  },

  // Get single render (only if COMPLETED status)
  getRender: async (renderId) => {
    try {
      const response = await api.get(`/renders/${renderId}`);

      // Check if render has COMPLETED status before returning
      if (response.data.success && response.data.data) {
        const render = response.data.data;
        if (render.status !== "COMPLETED") {
          return {
            success: false,
            message: "Render not available or has not been sent yet",
          };
        }
      }

      return response.data;
    } catch (error) {
      return (
        error.response?.data || {
          success: false,
          message: "Failed to load render",
        }
      );
    }
  },

  // Get renders by project (only COMPLETED status)
  getRendersByProject: async (projectPublicId) => {
    try {
      const response = await api.get(`/renders/projects/${projectPublicId}`);

      // Handle both array and object response structures
      let renders = [];
      if (response.data.success) {
        if (Array.isArray(response.data.data)) {
          renders = response.data.data;
        } else if (response.data.data?.renders) {
          renders = response.data.data.renders;
        } else if (Array.isArray(response.data.data)) {
          renders = response.data.data;
        }

        // Filter only renders with COMPLETED status
        const completedRenders = renders.filter(
          (render) => render.status === "COMPLETED"
        );

        return {
          ...response.data,
          data: {
            renders: completedRenders,
            project: response.data.data?.project,
            pagination: response.data.data?.pagination,
            stats: response.data.data?.stats,
          },
        };
      }

      return response.data;
    } catch (error) {
      console.error("❌ Error loading project renders:", error);
      return (
        error.response?.data || {
          success: false,
          message: "Failed to load project renders",
        }
      );
    }
  },

  // Download render image - FIXED VERSION
  downloadRender: async (renderId) => {
    try {
      const response = await api.get(`/renders/${renderId}/download`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("❌ Download error:", error);
      // If the specific endpoint doesn't work, try getting the render and creating blob from image URL
      try {
        const renderResponse = await api.get(`/renders/${renderId}`);
        if (renderResponse.data.success) {
          const render = renderResponse.data.data;
          const imageResponse = await fetch(render.imageUrl);
          const blob = await imageResponse.blob();
          return blob;
        }
      } catch (fallbackError) {
        console.error("❌ Fallback download also failed:", fallbackError);
        throw new Error("Failed to download render");
      }
      throw new Error("Failed to download render");
    }
  },

  // Mark render as viewed (for notifications)
  markAsViewed: async (renderId) => {
    try {
      const response = await api.patch(`/renders/${renderId}/viewed`);
      return response.data;
    } catch (error) {
      console.error("Error marking render as viewed:", error);
      // Don't throw error for this as it's non-critical
    }
  },
};