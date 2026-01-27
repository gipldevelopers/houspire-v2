// src\services\upload.service.js
import api from '@/lib/axios';

export const uploadService = {
  // Generate QR code session
  generateQRSession: async (projectId) => {
    try {
      const response = await api.post('/uploads/qr-session', { projectId });
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to generate QR code'
      };
    }
  },

  // Check QR session status
  checkQRSession: async (projectId) => {
    try {
      const response = await api.get(`/uploads/qr-session/${projectId}`);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to check QR session'
      };
    }
  },

  // Verify QR token (public endpoint)
  verifyQRToken: async (token) => {
    try {
      const response = await api.get(`/mobile-upload/verify-qr/${token}`);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to verify QR token'
      };
    }
  },

  // Mobile upload (public endpoint)
  mobileUpload: async (token, formData) => {
    try {
      const response = await api.post(`/mobile-upload/upload/${token}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to upload files'
      };
    }
  },

  // Upload file (generic - for both floor plans and room photos)
  uploadFile: async (formData) => {
    try {
      const response = await api.post('/uploads/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to upload file'
      };
    }
  },

  // NEW: Upload temporary file for pre-signup users
  uploadTemporaryFile: async (formData) => {
  try {
    const response = await api.post('/uploads/temporary', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Temporary upload error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to upload temporary file'
    };
  }
},

  // NEW: Move temporary file to permanent location after signup
 moveTemporaryFile: async (temporaryId, projectId, fileName, roomType = 'OTHER') => {
  try {
    const response = await api.post('/uploads/move-temporary', {
      temporaryId,
      projectId,
      fileName,
      roomType
    });
    return response.data;
  } catch (error) {
    console.error('Move temporary file error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to move temporary file: ' + (error.message || 'Unknown error')
    };
  }
},
  // Upload room photo
  uploadRoomPhoto: async (projectId, formData) => {
    try {
      const uploadFormData = new FormData();
      
      // Copy all fields except projectId
      for (const [key, value] of formData.entries()) {
        if (key !== 'projectId') {
          uploadFormData.append(key, value);
        }
      }
      
      // Add type if not present
      if (!uploadFormData.has('type')) {
        uploadFormData.append('type', 'ROOM_PHOTO');
      }
      
      const response = await api.post(`/uploads/project/${projectId}/upload`, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Room photo upload error:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to upload room photo'
      };
    }
  },

  // Upload floor plan
  uploadFloorPlan: async (projectId, formData) => {
    try {
      const uploadFormData = new FormData();
      
      for (const [key, value] of formData.entries()) {
        if (key !== 'projectId') {
          uploadFormData.append(key, value);
        }
      }
      
      // Add type if not present
      if (!uploadFormData.has('type')) {
        uploadFormData.append('type', 'FLOOR_PLAN');
      }
      
      const response = await api.post(`/uploads/project/${projectId}/upload`, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Floor plan upload error:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to upload floor plan'
      };
    }
  },

  // Get project uploads
  getProjectUploads: async (projectId) => {
    try {
      const response = await api.get(`/uploads/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching uploads:', error);
      console.error('Error details:', error.response?.data);
      return error.response?.data || {
        success: false,
        message: 'Failed to load uploads'
      };
    }
  },

  // Delete file
  deleteFile: async (fileId, fileType) => {
    try {
      let normalizedFileType;
      
      if (fileType === 'ROOM_PHOTO' || fileType === 'roomPhotos' || fileType === 'photo') {
        normalizedFileType = 'ROOM_PHOTO';
      } else if (fileType === 'FLOOR_PLAN' || fileType === 'floorPlans' || fileType === 'floorplan') {
        normalizedFileType = 'FLOOR_PLAN';
      } else {
        throw new Error('Invalid file type');
      }
      
      const response = await api.delete(`/uploads/${normalizedFileType}/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Delete error:', error.response?.data || error.message);
      return error.response?.data || {
        success: false,
        message: 'Failed to delete file'
      };
    }
  },

  // Get upload statistics
  getUploadStats: async (projectId) => {
    try {
      const response = await api.get(`/uploads/project/${projectId}/stats`);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load upload stats'
      };
    }
  }
};