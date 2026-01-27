// src/app/lp3/components/PlanningWizardModal.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Step1 } from './wizard/Step1';
import { Step2 } from './wizard/Step2';
import { Step2Simple } from './wizard/Step2Simple';
import { Step3 } from './wizard/Step3';
import { Step4 } from './wizard/Step4';

// Storage key for form data
const FORM_STORAGE_KEY = 'houspire_wizard_form_data';

export const PlanningWizardModal = ({ open, onOpenChange, selectedPackage = null }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 3 is always skipped
  const skipStep3 = true;
  
  // Step 2 is skipped for ₹499 package - show simplified version
  const skipStep2 = selectedPackage === 499;
  
  const [isVisible, setIsVisible] = useState(false);
  const [animationState, setAnimationState] = useState('closed');
  const [formData, setFormData] = useState({
    // Step 1
    propertyType: '',
    uploadedImage: null,
    
    // Step 2
    title: '',
    description: '',
    address: '',
    city: '',
    pincode: '',
    areaSqFt: '',
    
    // Step 3
    budgetRange: '',
    timeline: '',
    
    // Step 4
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  // OTP verification state
  const [isOtpVerification, setIsOtpVerification] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Load saved form data on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData.formData || {});
        setCurrentStep(parsedData.currentStep || 1);
        setIsOtpVerification(parsedData.isOtpVerification || false);
      } catch (error) {
        console.error('Error loading saved form data:', error);
        localStorage.removeItem(FORM_STORAGE_KEY);
      }
    }
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    const dataToSave = {
      formData,
      currentStep,
      isOtpVerification,
      selectedPackage, // Save selected package
      timestamp: Date.now()
    };
    
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData, currentStep, isOtpVerification, selectedPackage]);

  // Handle open/close animations
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setAnimationState('opening');
      const timer = setTimeout(() => {
        setAnimationState('open');
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setAnimationState('closing');
      const timer = setTimeout(() => {
        setIsVisible(false);
        setAnimationState('closed');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open && !isVisible) {
      const timer = setTimeout(() => {
        setCurrentStep(1);
        setIsOtpVerification(false);
        setIsCreatingProject(false);
        setFormData({
          propertyType: '',
          uploadedImage: null,
          title: '',
          description: '',
          address: '',
          city: '',
          pincode: '',
          areaSqFt: '',
          budgetRange: '',
          timeline: '',
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          terms: false,
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, isVisible]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const handleClose = () => {
    onOpenChange(false);
  };

  // ✅ NEW: Handle ₹499 plan completion
  const handle499PlanComplete = async () => {
    handleClose();
  };

  // Original complete handler for other packages
  const handleComplete = async () => {
    // Save final form data
    const finalData = {
      ...formData,
      completedAt: new Date().toISOString(),
      projectId: 'proj_' + Date.now()
    };
    
    // Save to localStorage
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({
      formData: finalData,
      currentStep: 4,
      completed: true,
      selectedPackage,
      timestamp: Date.now()
    }));
    
    // Close the popup
    handleClose();
    
    // Redirect to project creation for other packages
    setTimeout(() => {
      router.push('/dashboard/projects/new');
    }, 500);
  };

  if (!open && !isVisible) return null;

  // Calculate total steps and step mapping based on package
  let totalSteps;
  let stepMapping;

  if (skipStep2) {
    // For ₹499: Step 1 (Upload) -> Step 2 (Simple Details) -> Step 4 (Account) = 3 steps
    totalSteps = 3;
    stepMapping = {
      1: 1, // Step 1: Image Upload
      2: 2, // Step 2: Simple Details
      3: 4  // Step 3: Account (Step 4)
    };
  } else {
    // For others: Step 1 (Property) -> Step 2 (Details) -> Step 4 (Account) = 3 steps
    totalSteps = 3;
    stepMapping = {
      1: 1, // Step 1: Property Type
      2: 2, // Step 2: Detailed Details
      3: 4  // Step 3: Account (Step 4)
    };
  }

  // Map logical step to actual step number
  const getActualStep = (logicalStep) => {
    return stepMapping[logicalStep] || logicalStep;
  };

  // Map actual step to logical step for display
  const getLogicalStep = (actualStep) => {
    const mapping = Object.entries(stepMapping).find(([logical, actual]) => actual === actualStep);
    return mapping ? parseInt(mapping[0]) : actualStep;
  };

  const progress = (getLogicalStep(currentStep) / totalSteps) * 100;

  const handleNext = () => {
    const logicalStep = getLogicalStep(currentStep);
    if (logicalStep < totalSteps) {
      const nextLogicalStep = logicalStep + 1;
      const nextActualStep = getActualStep(nextLogicalStep);
      setCurrentStep(nextActualStep);
    } else {
      // Use appropriate completion handler based on package
      if (selectedPackage === 499) {
        handle499PlanComplete();
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    const logicalStep = getLogicalStep(currentStep);
    if (logicalStep > 1) {
      const prevLogicalStep = logicalStep - 1;
      const prevActualStep = getActualStep(prevLogicalStep);
      setCurrentStep(prevActualStep);
    }
  };

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  // Handle OTP verification state
  const handleOtpVerificationStart = () => {
    setIsOtpVerification(true);
  };

  const handleOtpVerificationComplete = () => {
    setIsOtpVerification(false);
    // Use appropriate completion handler based on package
    if (selectedPackage === 499) {
      handle499PlanComplete();
    } else {
      handleComplete();
    }
  };

  const handleOtpVerificationBack = () => {
    setIsOtpVerification(false);
  };

  const canProceed = () => {
    switch (currentStep) {
       case 1:
      // For ₹499 package, check if image is uploaded
      if (selectedPackage === 499) {
        return !!(formData.uploadedImage && (formData.uploadedImage.url || formData.uploadedImage.temporaryId));
      }
      return !!formData.propertyType;
       case 2:
      // For ₹499 package, simplified validation including pincode
      if (selectedPackage === 499) {
        return !!formData.title && !!formData.city && !!formData.pincode && formData.pincode.length === 6;
      }
      // For other packages, also require pincode
      return !!formData.title && !!formData.city && !!formData.pincode && formData.pincode.length === 6;
      case 4:
        // For step 4, the signup form handles its own validation
        return false; // Let Step4 handle its own button state
      default:
        return false;
    }
  };

  const getButtonText = () => {
    const logicalStep = getLogicalStep(currentStep);
    if (currentStep === 4) {
      if (isCreatingProject) {
        return 'Creating Project...';
      }
      return 'Sign Up';
    }
    
    if (logicalStep === totalSteps) {
      if (selectedPackage === 499) {
        return 'Complete & Create Project';
      }
      return 'Complete Project';
    }
    
    return 'Continue';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1 
            selectedType={formData.propertyType} 
            onSelectType={(type) => updateFormData({ propertyType: type })}
            selectedPackage={selectedPackage}
            uploadedImage={formData.uploadedImage}
            onImageUpload={(image) => updateFormData({ uploadedImage: image })}
          />
        );
      case 2:
        // Render different Step2 based on package
        if (selectedPackage === 499) {
          return (
            <Step2Simple 
              formData={formData} 
              onUpdate={updateFormData} 
            />
          );
        } else {
          return (
            <Step2 
              formData={formData} 
              onUpdate={updateFormData} 
            />
          );
        }
      case 4:
        return (
          <Step4
            formData={formData} 
            onUpdate={updateFormData} 
            onNext={handleNext}
            onOtpVerificationStart={handleOtpVerificationStart}
            onOtpVerificationComplete={handleOtpVerificationComplete}
            onOtpVerificationBack={handleOtpVerificationBack}
            isInPopup={true}
            isOtpVerification={isOtpVerification}
            selectedPackage={selectedPackage}
            isCreatingProject={isCreatingProject}
            onClose={handleClose}
            setIsCreatingProject={setIsCreatingProject}
          />
        );
      default:
        return null;
    }
  };

  // Don't show navigation during OTP verification - ONLY HIDE BOTTOM NAVIGATION
  const showNavigation = !isOtpVerification;

  // Animation styles
  const backdropStyle = {
    opacity: animationState === 'open' ? 1 : animationState === 'closing' ? 0 : 0,
    transition: 'opacity 300ms ease-out',
  };

  const popupStyle = {
    transform: animationState === 'open' ? 'scale(1)' : 
               animationState === 'opening' ? 'scale(0.8)' : 'scale(0.8)',
    opacity: animationState === 'open' ? 1 : 
             animationState === 'opening' ? 0 : 0,
    transition: 'all 300ms ease-out',
  };

  // Get step titles for display
  const getStepTitle = (stepNumber) => {
    if (skipStep2) {
      // For ₹499 package
      switch (stepNumber) {
        case 1: return 'Upload Image';
        case 2: return 'Room Details';
        case 3: return 'Account';
        default: return '';
      }
    } else {
      // For other packages
      switch (stepNumber) {
        case 1: return 'Property Type';
        case 2: return 'Space Details';
        case 3: return 'Account';
        default: return '';
      }
    }
  };

  const getStepDescription = (stepNumber) => {
    if (skipStep2) {
      // For ₹499 package
      switch (stepNumber) {
        case 1: return 'Upload your room photo';
        case 2: return 'Basic project information';
        case 3: return 'Create your profile';
        default: return '';
      }
    } else {
      // For other packages
      switch (stepNumber) {
        case 1: return 'Select your space type';
        case 2: return 'Location & dimensions';
        case 3: return 'Create your profile';
        default: return '';
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
      style={backdropStyle}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col lg:flex-row"
        style={popupStyle}
      >
        
        {/* Mobile Header with Close Button */}
        <div className="lg:hidden flex items-center justify-between p-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#e48b53] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#042939]">
                {isOtpVerification ? 'Verify Your Email' : 
                 isCreatingProject ? 'Creating Project...' : 'Design Your Dream Home'}
              </h2>
              <p className="text-xs text-[#042939]/70">
                {isOtpVerification ? 'Enter verification code' : 
                 isCreatingProject ? 'Setting up your project...' : `Step ${getLogicalStep(currentStep)} of ${totalSteps}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isCreatingProject}
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Left Side - Progress & Steps - ALWAYS VISIBLE (even during OTP) */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 bg-gradient-to-b from-[#e48b53] to-[#d47b43] p-6 flex-col text-white">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">
              {isOtpVerification ? 'Verify Your Email' : 
               isCreatingProject ? 'Creating Project...' : 
               selectedPackage === 499 ? 'Single Room Design' : 'Design Your Dream Home'}
            </h2>
            <p className="text-white/80 text-sm">
              {isOtpVerification ? 'Almost there!' : 
               isCreatingProject ? 'Please wait...' : `Step ${getLogicalStep(currentStep)} of ${totalSteps}`}
            </p>
            {selectedPackage === 499 && (
              <div className="mt-2 bg-white/20 rounded-lg p-2 text-xs">
                <strong>₹499 Single Room Plan</strong>
                <p className="text-white/90">Quick design for one room</p>
              </div>
            )}
          </div>

          {/* Step Indicators */}
          <div className="space-y-4 flex-1">
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNumber = index + 1;
              const actualStepNumber = getActualStep(stepNumber);
              const isCompleted = currentStep > actualStepNumber;
              const isCurrent = currentStep === actualStepNumber;
              
              return (
                <div key={stepNumber} className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                    isCompleted 
                      ? 'bg-white border-white text-[#e48b53] shadow-md' 
                      : isCurrent
                      ? 'border-white bg-white/20 text-white shadow-md'
                      : 'border-white/60 bg-transparent text-white/80'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{stepNumber}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold transition-colors text-sm mb-1 ${
                      isCurrent || isCompleted ? 'text-white' : 'text-white/90'
                    }`}>
                      {getStepTitle(stepNumber)}
                    </div>
                    <div className="text-white/70 text-xs leading-tight">
                      {getStepDescription(stepNumber)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* OTP Verification Message */}
          {isOtpVerification && (
            <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
              <p className="text-white/90 text-sm font-medium mb-2">Email Verification</p>
              <p className="text-white/70 text-xs">
                We've sent a 6-digit code to your email. Please enter it to verify your account and continue with your project.
              </p>
            </div>
          )}

          {/* Creating Project Message */}
          {isCreatingProject && (
            <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
              <p className="text-white/90 text-sm font-medium mb-2">Setting Up Your Project</p>
              <p className="text-white/70 text-xs">
                We're creating your single room design project. You'll be redirected to payment shortly.
              </p>
            </div>
          )}
        </div>

        {/* Right Side - Content & Navigation */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header with Progress Bar - Desktop - ALWAYS VISIBLE (even during OTP) */}
          <div className="hidden lg:flex items-center justify-between p-3 border-b border-gray-200">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-[#042939] mb-1">
                <span>
                  {isOtpVerification ? 'Email Verification' : 
                   isCreatingProject ? 'Creating Project' : `Step ${getLogicalStep(currentStep)} of ${totalSteps}`}
                </span>
                <span className="font-semibold">
                  {isOtpVerification ? 'Verification' : 
                   isCreatingProject ? 'Processing...' : `${Math.round(progress)}% Complete`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-[#e48b53] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${isOtpVerification ? 100 : progress}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors ml-2"
              disabled={isCreatingProject}
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {renderStep()}
          </div>

          {/* Desktop Navigation - HIDDEN during OTP verification */}
          {showNavigation && (
            <div className="hidden lg:flex justify-between items-center p-4 border-t border-gray-200 bg-white">
              <button
                onClick={handleBack}
                disabled={currentStep === 1 || isCreatingProject}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-colors ${
                  currentStep === 1 
                    ? 'text-gray-400 cursor-not-allowed border border-gray-300' 
                    : 'text-[#042939] border border-[#e48b53] hover:bg-[#e48b53]/5 hover:border-[#d47b43]'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back</span>
              </button>
              
              {currentStep === 4 ? (
                // Step 4 handles its own button internally
                <div></div>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isCreatingProject}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                    canProceed()
                      ? 'bg-[#e48b53] text-white hover:bg-[#d47b43] shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span className="font-medium">
                    {getButtonText()}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Mobile Navigation - HIDDEN during OTP verification */}
          {showNavigation && (
            <div className="lg:hidden border-t border-gray-200 bg-white p-3">
              <div className="flex justify-between items-center gap-2">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1 || isCreatingProject}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors flex-1 justify-center ${
                    currentStep === 1 
                      ? 'text-gray-400 cursor-not-allowed border border-gray-300' 
                      : 'text-[#042939] border border-[#e48b53] hover:bg-[#e48b53]/5'
                  }`}
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span className="text-xs font-medium">Back</span>
                </button>
                
                {currentStep === 4 ? (
                  // Step 4 handles its own button internally on mobile
                  <div className="flex-1"></div>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed() || isCreatingProject}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all flex-1 justify-center ${
                      canProceed()
                        ? 'bg-[#e48b53] text-white hover:bg-[#d47b43] shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {getButtonText()}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};