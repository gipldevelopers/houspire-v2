// src/constants/projectSteps.js
export const PROJECT_STEPS = {
  uploads: { step: 1, name: 'Upload Your Space', description: 'Upload floor plans & photos' },
  questionnaire: { step: 2, name: 'Design Preferences', description: 'Share your style preferences' },
  styles: { step: 3, name: 'Style Selection', description: 'Choose your design style' },
  renders: { step: 4, name: 'Renders', description: 'View 3D visualizations' },
  boq: { step: 5, name: 'BOQ & Budget', description: 'Review materials & costs' }
};

export const getStepConfig = (currentSection) => {
  return PROJECT_STEPS[currentSection] || PROJECT_STEPS.uploads;
};