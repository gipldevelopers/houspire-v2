// src/services/project.service.js
import api from '@/lib/axios';

export const projectService = {
  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to create project'
      };
    }
  },

  // Get user's projects
  getUserProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load projects'
      };
    }
  },

  // Get single project
  getProject: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load project'
      };
    }
  },

  // Get project details (comprehensive)
  getProjectDetails: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/details`);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load project details'
      };
    }
  },

  // Update project
  updateProject: async (projectId, updateData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, updateData);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to update project'
      };
    }
  },

  // Save questionnaire answers (onboarding questionnaire)
  saveQuestionnaire: async (projectId, answers) => {
    try {
      const response = await api.post(`/projects/${projectId}/questionnaire`, { answers });
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to save questionnaire'
      };
    }
  },

  // ✅ NEW: Start onboarding
startOnboarding: async (projectId) => {
  try {
    const response = await api.post(`/projects/${projectId}/onboarding/start`);
    return response.data;
  } catch (error) {
    return error.response?.data || {
      success: false,
      message: 'Failed to start onboarding'
    };
  }
},

// ✅ NEW: Get onboarding status
getOnboardingStatus: async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/onboarding/status`);
    return response.data;
  } catch (error) {
    return error.response?.data || {
      success: false,
      message: 'Failed to get onboarding status'
    };
  }
},

// ✅ NEW: Get projects needing onboarding
getProjectsNeedingOnboarding: async () => {
  try {
    const response = await api.get('/projects/onboarding/pending');
    return response.data;
  } catch (error) {
    return error.response?.data || {
      success: false,
      message: 'Failed to get projects needing onboarding'
    };
  }
},

  // Select design style
  selectStyle: async (projectId, styleId) => {
    try {
      const response = await api.post(`/projects/${projectId}/select-style`, { styleId });
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to select style'
      };
    }
  },

getDesignStyles: async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // ✅ ADD THIS LINE: Always filter for active styles on dashboard
    params.append('isActive', 'true');
    
    // Add other filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && key !== 'featured') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/styles?${params.toString()}`);
    return response.data;
  } catch (error) {
    return error.response?.data || {
      success: false,
      message: 'Failed to load design styles. Please try again.'
    };
  }
},

  getActiveStyles: async (limit = 6) => {
    try {
      const response = await api.get(`/styles?isActive=true&limit=${limit}`);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load active styles. Please try again.'
      };
    }
  },

  // Get project with BOQs
  getProjectWithBOQs: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/details`);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load project with BOQs'
      };
    }
  },

  // Get project BOQs
  getProjectBOQs: async (projectId) => {
    try {
      const response = await boqService.getBOQsByProject(projectId);
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to load project BOQs'
      };
    }
  },

  // Save design questionnaire (after payment questionnaire)
  saveDesignQuestionnaire: async (projectId, answers) => {
    try {
      const response = await api.post(`/projects/${projectId}/design-questionnaire`, { answers });
      return response.data;
    } catch (error) {
      console.error("❌ Error saving design questionnaire:", error);
      return error.response?.data || {
        success: false,
        message: 'Failed to save design preferences questionnaire'
      };
    }
  },

// In src/services/project.service.js - Update initializeProjectProgress method:
initializeProjectProgress: async (projectId) => {
  try {
    // First get project details to check plan type
    const projectResult = await api.get(`/projects/${projectId}`);
    
    let isSingleRoomPlan = false;
    if (projectResult.success) {
      const project = projectResult.data?.project || projectResult.data;
      isSingleRoomPlan = project?.selectedPlan === 'Single Room Trial' || 
                        project?.selectedPlan?.toLowerCase().includes('single room') ||
                        project?.selectedPlan?.toLowerCase().includes('499');
    }
    
    const response = await api.post(`/projects/${projectId}/progress/initialize`, {
      isSingleRoomPlan: isSingleRoomPlan
    });
    return response.data;
  } catch (error) {
    console.error('Error initializing project progress:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to initialize project progress'
    };
  }
},

  getProjectProgress: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project progress:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to load project progress'
      };
    }
  },

  updateProjectProgress: async (projectId, updates) => {
    try {
      const response = await api.patch(`/projects/${projectId}/progress/phase`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating project progress:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to update project progress'
      };
    }
  },

  //  NEW: Initialize progress for single room plans
  initializeSingleRoomProgress: async (projectId) => {
    try {
      const response = await api.post(`/projects/${projectId}/progress/initialize`);
      return response.data;
    } catch (error) {
      console.error('Error starting single room progress:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to start design progress'
      };
    }
  },

  // Remove duplicate methods and keep only these:
  updateProgressFromStatus: async (projectId, status) => {
    try {
      const response = await api.patch(`/projects/${projectId}/progress/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating progress from status:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to update progress from status'
      };
    }
  },

  // Get project progress stats (admin)
  getProjectProgressStats: async () => {
    try {
      const response = await api.get('/projects/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching project progress stats:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to load project progress statistics'
      };
    }
  },

  // ✅ UPDATED: Get enhanced project progress
  getEnhancedProjectProgress: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/progress/enhanced`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enhanced project progress:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to load enhanced project progress'
      };
    }
  },

  // ✅ NEW: Complete specific phase
  completePhase: async (projectId, phase) => {
    try {
      const response = await api.post(`/projects/${projectId}/progress/complete-phase`, { phase });
      return response.data;
    } catch (error) {
      console.error('Error completing phase:', error);
      return error.response?.data || {
        success: false,
        message: 'Failed to complete phase'
      };
    }
  },

  updateProjectPhase: async (projectId, phaseData) => {
    try {
      const response = await api.patch(`/projects/${projectId}/phase`, phaseData);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to update project phase'
      };
    }
  },

    getProjectPaymentUrl: (projectId, type = 'new-project') => {
      return `/packages?type=${type}&projectId=${projectId}`;
    },

    // ✅ NEW: Get addons purchase URL
    getAddonsPurchaseUrl: () => {
      return '/packages?type=addons-only';
    },

     // ✅ NEW: Create single room project
  createSingleRoomProject: async (projectData) => {
    try {
      const response = await api.post('/projects/single-room', projectData);
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to create single room project'
      };
    }
  },

  // ✅ NEW: Update single room project with image
  updateSingleRoomImage: async (projectId, imageUrl, roomType) => {
    try {
      const response = await api.patch(`/projects/${projectId}/single-room/image`, {
        roomImageUrl: imageUrl,
        roomType: roomType
      });
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to update single room image'
      };
    }
  },

  // ✅ NEW: Update single room progress
  updateSingleRoomProgress: async (projectId, progress) => {
    try {
      const response = await api.patch(`/projects/${projectId}/single-room/progress`, {
        singleRoomProgress: progress
      });
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to update single room progress'
      };
    }
  },

  // ✅ NEW: Get single room projects
  getSingleRoomProjects: async () => {
    try {
      const response = await api.get('/projects/single-room');
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: 'Failed to load single room projects'
      };
    }
  }
};