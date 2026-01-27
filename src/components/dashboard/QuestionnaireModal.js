// src\components\dashboard\QuestionnaireModal.js
'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Sparkles,
  Brain,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { projectService } from '@/services/project.service';
import { toast } from 'sonner';

// Updated questionnaire steps for Design Preferences
const questionnaireSteps = [
  {
    id: 1,
    title: 'Space Users & Lifestyle',
    description: 'Understand who uses your space',
    question: 'Who will be using the space, and how do you usually spend time at home?',
    type: 'radio',
    field: 'spaceUsersLifestyle',
    required: true,
    options: [
      { value: 'JUST_ME', label: 'Just me — simple routines', description: 'Individual living with minimal needs' },
      { value: 'COUPLE', label: 'Couple — relaxed, functional living', description: 'Shared space for two with practical needs' },
      { value: 'FAMILY_WITH_KIDS', label: 'Family with kids — active, storage-heavy', description: 'Active household with children requiring ample storage' },
      { value: 'MULTIGENERATIONAL', label: 'Multigenerational home — shared needs', description: 'Multiple generations living together with diverse requirements' },
      { value: 'FREQUENT_TRAVELER', label: 'I travel a lot — low-maintenance living', description: 'Requires easy maintenance and minimal upkeep' }
    ]
  },
  {
    id: 2,
    title: 'Home Atmosphere',
    description: 'The feeling you want to create',
    question: 'How do you want your home to feel when you walk in?',
    type: 'radio',
    field: 'homeAtmosphere',
    required: true,
    options: [
      { value: 'CALM_MINIMAL', label: 'Calm & minimal', description: 'Peaceful and uncluttered space' },
      { value: 'WARM_COZY', label: 'Warm & cozy', description: 'Comfortable and inviting atmosphere' },
      { value: 'MODERN_STYLISH', label: 'Modern & stylish', description: 'Contemporary and fashionable design' },
      { value: 'SIMPLE_LUXE', label: 'Simple & luxe', description: 'Elegant luxury with simplicity' },
      { value: 'FUNCTIONAL_PRACTICAL', label: 'Functional & practical', description: 'Practical and efficient living space' }
    ]
  },
  {
    id: 3,
    title: 'Material Preferences',
    description: 'Elements you love',
    question: 'What materials, colours or styles are you drawn to?',
    type: 'checkbox',
    field: 'materialPreferences',
    required: true,
    options: [
      { value: 'WARM_WOODS_NEUTRALS', label: 'Warm woods & neutrals', description: 'Natural wood tones and neutral colors' },
      { value: 'MODERN_FINISHES', label: 'Modern finishes, glass & metal', description: 'Contemporary materials like glass and metal accents' },
      { value: 'LIGHT_WOODS_SOFT_PASTELS', label: 'Light woods & soft pastels', description: 'Light-colored woods and gentle pastel shades' },
      { value: 'RICH_TONES_PREMIUM_TEXTURES', label: 'Rich tones & premium textures', description: 'Deep colors and luxurious textures' },
      { value: 'SIMPLE_DURABLE_MATERIALS', label: 'Simple & durable materials', description: 'Practical materials that last long' }
    ]
  },
  {
    id: 4,
    title: 'Storage Style',
    description: 'Your approach to organization',
    question: 'What\'s your storage style?',
    type: 'radio',
    field: 'storageStyle',
    required: true,
    options: [
      { value: 'MINIMAL_ESSENTIALS', label: 'Minimal — just the essentials', description: 'Only keep what is absolutely necessary' },
      { value: 'CLEAN_CONCEALED', label: 'Clean & concealed', description: 'Everything hidden away for a clean look' },
      { value: 'FUNCTIONAL_EVERYWHERE', label: 'Functional — storage everywhere', description: 'Maximize storage in all possible areas' },
      { value: 'MAXIMIZE_EVERY_INCH', label: 'Maximise every inch', description: 'Utilize every available space for storage' }
    ]
  },
  {
    id: 5,
    title: 'Cultural Requirements',
    description: 'Spiritual and cultural preferences',
    question: 'Any cultural, spiritual or Vastu requirements?',
    type: 'radio',
    field: 'culturalRequirements',
    required: true,
    options: [
      { value: 'STRICT_VASTU', label: 'Yes, strict Vastu', description: 'Need strict adherence to Vastu principles' },
      { value: 'PREFER_VASTU_FLEXIBLE', label: 'Prefer Vastu but flexible', description: 'Prefer Vastu but open to adjustments' },
      { value: 'CULTURAL_SPIRITUAL_NEEDS', label: 'Cultural/spiritual needs', description: 'Specific cultural or spiritual requirements' },
      { value: 'NO_REQUIREMENTS', label: 'No specific requirements', description: 'Modern approach without specific traditions' },
      { value: 'NOT_SURE_YET', label: 'Not sure yet', description: 'Still exploring options and preferences' }
    ]
  },
  {
    id: 6,
    title: 'Lifestyle Must-Haves',
    description: 'Essential features for your daily life',
    question: 'Any lifestyle must-haves we should know about?',
    type: 'checkbox',
    field: 'lifestyleMustHaves',
    required: true,
    options: [
      { value: 'LOW_MAINTENANCE_MATERIALS', label: 'Low-maintenance materials', description: 'Materials that require minimal upkeep' },
      { value: 'PET_KID_FRIENDLY', label: 'Pet-friendly / kid-friendly choices', description: 'Durable and safe options for pets and children' },
      { value: 'SMART_HOME_FEATURES', label: 'Smart home features', description: 'Automation and smart technology integration' },
      { value: 'SPECIFIC_FURNITURE_PREFERENCES', label: 'Specific furniture preferences', description: 'Particular furniture styles or pieces' },
      { value: 'HIGH_DURABILITY_FINISHES', label: 'High-durability finishes', description: 'Finishes that withstand heavy use' },
      { value: 'NOTHING_SPECIFIC', label: 'Nothing specific', description: 'No particular requirements' }
    ]
  },
  {
    id: 7,
    title: 'Special Requirements',
    description: 'Make it uniquely yours',
    question: 'Any special requirements or must-haves for your space?',
    type: 'textarea',
    field: 'specialRequirements',
    required: false,
    placeholder: 'Examples: Pet-friendly furniture, wheelchair accessibility, home office setup, meditation corner, specific cultural elements, entertainment system, reading nook, plant-friendly spaces...'
  }
];

// Initialize all answer fields to prevent uncontrolled/controlled warnings
const initializeAnswers = () => {
  const initialAnswers = {};
  
  questionnaireSteps.forEach(step => {
    if (step.type === 'checkbox') {
      initialAnswers[step.field] = [];
    } else if (step.type === 'textarea') {
      initialAnswers[step.field] = '';
    } else {
      initialAnswers[step.field] = '';
    }
  });
  
  return initialAnswers;
};

export default function QuestionnaireModal({ project, onComplete, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState(initializeAnswers());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const totalSteps = questionnaireSteps.length;
  const progress = (currentStep / totalSteps) * 100;
  
  // Add safety check and debugging
  const currentStepData = questionnaireSteps.find(step => step.id === currentStep);

  // Safety check - reset step if out of bounds
  useEffect(() => {
    if (currentStep > totalSteps) {
      console.warn('Step out of bounds, resetting to last step');
      setCurrentStep(totalSteps);
      return;
    }
    if (currentStep < 1) {
      console.warn('Step below 1, resetting to first step');
      setCurrentStep(1);
      return;
    }
    if (!currentStepData) {
      console.error('Current step data not found for step:', currentStep);
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [currentStep, currentStepData, totalSteps]);

  const handleAnswer = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-advance to next question after a short delay (only for radio buttons)
    if (currentStepData?.type === 'radio') {
      const stepAtClick = currentStep; // Capture current step
      setTimeout(() => {
        // Use functional update to check actual current value
        setCurrentStep(prev => {
          if (prev === stepAtClick && prev < totalSteps) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return prev + 1;
          } else if (prev === stepAtClick && prev === totalSteps) {
            // Last step - submit instead
            handleSubmit();
          }
          return prev; // No change if already moved
        });
      }, 300);
    }
  };

  const handleCheckboxChange = (field, value, checked) => {
    const stepAtClick = currentStep; // Capture current step at time of click
    
    setAnswers(prev => {
      const currentValues = prev[field] || [];
      let newValues;
      if (checked) {
        newValues = [...currentValues, value];
      } else {
        newValues = currentValues.filter(item => item !== value);
      }
      return { ...prev, [field]: newValues };
    });
    
    // Only auto-advance for checkboxes if checking (not unchecking)
    // This prevents multiple advances when selecting multiple options
    if (!checked) return;
    
    setTimeout(() => {
      setCurrentStep(prev => {
        // Only advance if we're still on the same step (prevent double advance)
        if (prev !== stepAtClick) return prev;
        
        if (prev < totalSteps) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return prev + 1;
        } else if (prev === totalSteps) {
          handleSubmit();
        }
        return prev;
      });
    }, 500);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!project?.publicId) {
      toast.error('Project information is missing');
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save design preferences questionnaire to backend
      const response = await projectService.saveDesignQuestionnaire(project.publicId, answers);
      
      if (response.success) {         
        // NEW: Update project phase after design questionnaire completion
        await projectService.updateProjectPhase(project.publicId, {
          completedPhase: 'DESIGN_QUESTIONNAIRE',
          currentPhase: 'COMPLETED'
        });
        
        // Clear payment flags when questionnaire is completed
        localStorage.removeItem('paymentCompleted');
        localStorage.removeItem('paymentProjectId');
        
        toast.success('Design preferences completed successfully! Design process has started.');
        
        // ✅ FIX: Call the parent completion handler to update dashboard state
        onComplete(project.publicId);
      } else {
        throw new Error(response.message || 'Failed to save questionnaire');
      }
    } catch (error) {
      console.error('Error saving design questionnaire:', error);
      toast.error(error.message || 'Failed to complete design preferences questionnaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentStepValid = () => {
    if (!currentStepData || !currentStepData.required) return true;
    
    const answer = answers[currentStepData.field];
    
    if (currentStepData.type === 'textarea') {
      return answer !== undefined && answer !== null && answer.trim() !== '';
    }
    
    if (currentStepData.type === 'checkbox') {
      return answer !== undefined && answer !== null && answer.length > 0;
    }
    
    return answer !== undefined && answer !== null && answer !== '';
  };

  const renderQuestion = () => {
    if (!currentStepData) {
      return (
        <div className="text-center py-8">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Question Not Found</h3>
          <p className="text-muted-foreground">Unable to load question for step {currentStep}</p>
          <Button onClick={() => setCurrentStep(1)} className="mt-4">
            Restart Questionnaire
          </Button>
        </div>
      );
    }

    const currentAnswer = answers[currentStepData.field];

    switch (currentStepData.type) {
      case 'radio':
        return (
          <div className="space-y-1.5 sm:space-y-2">
            {currentStepData.options.map((option) => {
              const isSelected = currentAnswer === option.value;
              return (
                <div 
                  key={option.value} 
                  onClick={() => handleAnswer(currentStepData.field, option.value)}
                  className={`
                    flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 sm:p-3 rounded-lg sm:rounded-xl border cursor-pointer 
                    transition-all duration-150 touch-manipulation active:scale-[0.99]
                    ${isSelected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/40 hover:bg-accent/30'
                    }
                  `}
                >
                  <div className={`
                    w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'}
                  `}>
                    {isSelected && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-xs sm:text-sm leading-tight">{option.label}</div>
                    <div className="text-muted-foreground text-[10px] sm:text-xs leading-snug line-clamp-1">{option.description}</div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-1.5 sm:space-y-2">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Select all that apply</p>
            {currentStepData.options.map((option) => {
              const isSelected = (currentAnswer || []).includes(option.value);
              return (
                <div 
                  key={option.value}
                  onClick={() => handleCheckboxChange(currentStepData.field, option.value, !isSelected)}
                  className={`
                    flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 sm:p-3 rounded-lg sm:rounded-xl border cursor-pointer 
                    transition-all duration-150 touch-manipulation active:scale-[0.99]
                    ${isSelected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/40 hover:bg-accent/30'
                    }
                  `}
                >
                  <div className={`
                    w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'}
                  `}>
                    {isSelected && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-xs sm:text-sm leading-tight">{option.label}</div>
                    <div className="text-muted-foreground text-[10px] sm:text-xs leading-snug line-clamp-1">{option.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'textarea':
        return (
          <Textarea
            value={currentAnswer || ''}
            onChange={(e) => handleAnswer(currentStepData.field, e.target.value)}
            placeholder={currentStepData.placeholder}
            className="min-h-[100px] sm:min-h-[150px] resize-none border border-border text-sm sm:text-base p-3 rounded-lg sm:rounded-xl focus:border-primary"
          />
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Unknown question type: {currentStepData.type}</p>
          </div>
        );
    }
  };

  // Show error state if questionnaire steps are not loading properly
  if (hasError || !currentStepData) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card border-border rounded-2xl shadow-2xl w-full max-w-2xl p-4 sm:p-6 text-center">
          <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Questionnaire Error</h2>
          <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
            There was an issue loading the questionnaire. Please try refreshing the page.
          </p>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
            <p>Current Step: {currentStep}</p>
            <p>Total Steps: {totalSteps}</p>
            <p>Steps Available: {questionnaireSteps.length}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <Button onClick={onClose} variant="outline" size="sm" className="w-full sm:w-auto">
              Close
            </Button>
            <Button onClick={() => window.location.reload()} size="sm" className="w-full sm:w-auto">
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 sm:bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-card border-t sm:border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl h-[85vh] sm:h-auto sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95">
        
        {/* Header - Very Compact */}
        <div className="flex items-center justify-between px-3 py-2 sm:p-4 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Brain className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-foreground truncate leading-tight">
                Design Preferences
              </h2>
            </div>
          </div>
          
          {/* Progress inline with header on mobile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium text-primary">
              {currentStep}/{totalSteps}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0 rounded-full hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-muted/20 flex-shrink-0">
          <Progress value={progress} className="h-1 sm:h-1.5" />
        </div>

        {/* Content Area - Flexible & Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-3 sm:p-5">
            {/* Question Title */}
            <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2 sm:mb-3 leading-snug">
              {currentStepData.question}
              {currentStepData.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </h3>
            
            {/* Answer Options */}
            {renderQuestion()}
          </div>
        </div>

        {/* Navigation Footer - Always Visible */}
        <div className="flex items-center justify-between px-3 py-2 sm:p-4 border-t border-border bg-card flex-shrink-0">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="h-9 px-3 text-xs sm:text-sm"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4 mr-0.5 sm:mr-1" />
            Back
          </Button>

          {/* Progress Dots - Center (hidden on very small screens) */}
          <div className="hidden xs:flex gap-1 mx-2">
            {questionnaireSteps.map((step) => (
              <div
                key={step.id}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  step.id === currentStep 
                    ? 'bg-primary' 
                    : step.id < currentStep 
                    ? 'bg-green-500' 
                    : 'bg-border'
                }`}
              />
            ))}
          </div>

          {/* Next/Complete Button */}
          <Button
            onClick={handleNext}
            disabled={!isCurrentStepValid() || isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white h-9 px-4 sm:px-5 text-xs sm:text-sm font-medium"
            size="sm"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin border-2 border-white border-t-transparent rounded-full" />
                <span className="hidden sm:inline">Saving...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : currentStep === totalSteps ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Done
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}