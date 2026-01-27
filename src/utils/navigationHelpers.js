// src/utils/navigationHelpers.js
export const navigationHelpers = {
  // Package purchase URLs
  getPackagePurchaseUrl: (projectId = null) => {
    if (projectId) {
      return `/packages?type=new-project&projectId=${projectId}`;
    }
    return '/packages?type=new-project';
  },

  // Addons purchase URLs
  getAddonsPurchaseUrl: (projectId = null) => {
    if (projectId) {
      return `/packages?type=addons-only&projectId=${projectId}`;
    }
    return '/packages?type=addons-only';
  },

  // General packages page
  getPackagesUrl: () => {
    return '/packages';
  },

  // Check current page type
  getPurchaseType: (searchParams) => {
    return searchParams.get('type') || searchParams.get('pr') || 'general';
  }
};