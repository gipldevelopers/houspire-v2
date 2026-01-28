// src/app/dashboard/projects/new/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Home,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Sparkles,
  Calendar,
  Ruler,
  IndianRupee,
  Lightbulb,
  Target,
  Clock,
  Zap,
  Heart,
  Search,
  Palette,
  Star,
  TrendingUp,
  Grid3X3,
  List,
  Loader2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import OnboardingModal from '@/components/projects/OnboardingModal';
import { projectService } from '@/services/project.service';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';

const projectTypes = [
  {
    id: 'TWO_BHK',
    name: '2 BHK',
    description: '2 Bedroom, Hall, Kitchen',
    icon: Home,
    popular: true,
    rooms: 2
  },
  {
    id: 'THREE_BHK',
    name: '3 BHK',
    description: '3 Bedroom, Hall, Kitchen',
    icon: Home,
    popular: true,
    rooms: 3
  },
  {
    id: 'FOUR_BHK',
    name: '4 BHK',
    description: '4 Bedroom, Hall, Kitchen',
    icon: Home,
    popular: false,
    rooms: 4
  },
  {
    id: 'CUSTOM',
    name: 'Custom',
    description: 'Villa, Penthouse, Duplex, etc.',
    icon: Building,
    popular: false,
    rooms: 'Custom'
  }
];

const budgetRanges = [
  { value: 'ECONOMY', label: 'Economy', range: '₹5-10 Lakhs', icon: Target },
  { value: 'STANDARD', label: 'Standard', range: '₹10-25 Lakhs', icon: Clock },
  { value: 'PREMIUM', label: 'Premium', range: '₹25-50 Lakhs', icon: Lightbulb },
  { value: 'LUXURY', label: 'Luxury', range: '₹50 Lakhs +', icon: Zap }
];

const timelines = [
  { value: 'URGENT', label: 'Urgent', duration: '2-4 weeks', icon: Zap },
  { value: 'STANDARD', label: 'Standard', duration: '1-2 months', icon: Clock },
  { value: 'FLEXIBLE', label: 'Flexible', duration: '2+ months', icon: Calendar }
];

const formSteps = [
  { id: 1, name: 'Project Type', description: 'Select your space type', icon: Home },
  { id: 2, name: 'Space Details', description: 'Location & dimensions', icon: MapPin },
  { id: 3, name: 'Budget & Timeline', description: 'Investment plan', icon: IndianRupee },
  { id: 4, name: 'Design Style', description: 'Choose your style', icon: Sparkles }
];

// Storage key for form data
const FORM_STORAGE_KEY = 'houspire_new_project_form';
const POPUP_DATA_KEY = 'pendingProject';

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [designStyles, setDesignStyles] = useState([]);
  const [loadingStyles, setLoadingStyles] = useState(false);
  const [stylesError, setStylesError] = useState(null);
  const [mobileView, setMobileView] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [formData, setFormData] = useState({
    projectType: '',
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    areaSqFt: '',
    budgetRange: '',
    timeline: '',
    selectedStyleId: null
  });

  const [projectCreated, setProjectCreated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState(null);
  const [userName, setUserName] = useState('');

  // NEW: Phase tracking states
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [existingProject, setExistingProject] = useState(null);

  // Check mobile view on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load user profile to get name
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await userService.getUserProfile();
        if (response.success && response.data?.user?.name) {
          setUserName(response.data.user.name);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };
    fetchUserName();
  }, []);

  // Load saved form data and check for popup data - FIXED
  useEffect(() => {
    const initializeData = async () => {
      await loadSavedFormData();
      await checkPopupData();
      await fetchDesignStyles();
      setIsInitialized(true);
    };

    initializeData();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/styles/default-style.jpg';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Prepend server URL for relative paths
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    return `${serverUrl}${imagePath}`;
  };

  const checkPopupData = async () => {
    const popupData = localStorage.getItem(POPUP_DATA_KEY);
    if (popupData) {
      try {
        const parsedData = JSON.parse(popupData);

        // Map popup data to form data structure
        const mappedData = {
          projectType: mapPropertyTypeToProjectType(parsedData.propertyType),
          title: parsedData.title || '',
          description: parsedData.description || '',
          address: parsedData.address || '',
          city: parsedData.city || '',
          pincode: parsedData.pincode || '',
          areaSqFt: parsedData.areaSqFt || '',
          budgetRange: parsedData.budgetRange || '',
          timeline: parsedData.timeline || ''
        };

        // Update form data with popup data
        setFormData(prev => ({
          ...prev,
          ...mappedData
        }));

        // Auto-advance to style selection step since first 3 steps are pre-filled
        setCurrentStep(4);

        // Clear popup data immediately so user is treated as normal
        localStorage.removeItem(POPUP_DATA_KEY);

        toast.success('Project details loaded successfully!');

      } catch (error) {
        console.error('❌ Error loading popup data:', error);
        localStorage.removeItem(POPUP_DATA_KEY);
      }
    }
  };

  const mapPropertyTypeToProjectType = (propertyType) => {
    const mapping = {
      '2bhk': 'TWO_BHK',
      '3bhk': 'THREE_BHK',
      '4bhk': 'FOUR_BHK',
      'other': 'CUSTOM'
    };
    return mapping[propertyType] || 'CUSTOM';
  };

  const loadSavedFormData = () => {
    const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);

        setFormData(prev => ({
          ...prev,
          ...parsedData.formData,
          pincode: parsedData.formData?.pincode || ''
        }));
        setCurrentStep(parsedData.currentStep || 1);
        setFavorites(new Set(parsedData.favorites || []));

        // Restore UI state
        if (parsedData.searchQuery) setSearchQuery(parsedData.searchQuery);
        if (parsedData.sortBy) setSortBy(parsedData.sortBy);
        if (parsedData.viewMode) setViewMode(parsedData.viewMode);
      } catch (error) {
        console.error('Error loading saved form data:', error);
        localStorage.removeItem(FORM_STORAGE_KEY);
      }
    }
  };

  const handlePincodeChange = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    // Limit to 6 digits
    const formattedValue = numericValue.slice(0, 6);
    handleInputChange('pincode', formattedValue);
  };

  const fetchDesignStyles = async () => {
    setLoadingStyles(true);
    setStylesError(null);

    try {
      const response = await projectService.getDesignStyles({
        // ✅ REMOVE: featured: true, 
        limit: 50
      });

      if (response.success) {
        setDesignStyles(response.data.styles || []);
      } else {
        setStylesError(response.message || 'Failed to load design styles');
      }
    } catch (error) {
      console.error('Error fetching styles:', error);
      setStylesError('Failed to load design styles. Please try again.');
    } finally {
      setLoadingStyles(false);
    }
  };

  // Save form data whenever it changes
  useEffect(() => {
    if (!isInitialized) return;

    const dataToSave = {
      formData,
      currentStep,
      favorites: Array.from(favorites),
      searchQuery,
      sortBy,
      viewMode,
      timestamp: Date.now()
    };

    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData, currentStep, favorites, searchQuery, sortBy, viewMode, isInitialized]);

  const progress = (currentStep / formSteps.length) * 100;

  // Generate project title based on user name and project type
  const generateProjectTitle = (projectType) => {
    if (!projectType || !userName) return '';

    const typeMap = {
      'TWO_BHK': '2 BHK',
      'THREE_BHK': '3 BHK',
      'FOUR_BHK': '4 BHK',
      'CUSTOM': 'Custom Space'
    };

    const typeName = typeMap[projectType] || 'Project';
    // Extract first name if full name exists
    const firstName = userName.split(' ')[0];
    return `${firstName}'s ${typeName}`;
  };

  // Stabilize the template choice for this session
  const [templateIndex] = useState(Math.floor(Math.random() * 7));

  // Generate meaningful project description (30 words)
  const generateProjectDescription = (title, projectType, city, budgetRangeValue, styleName) => {
    if (!title && !projectType) return '';

    const typeMap = {
      'TWO_BHK': '2 BHK',
      'THREE_BHK': '3 BHK',
      'FOUR_BHK': '4 BHK',
      'CUSTOM': 'custom space'
    };

    const budgetMap = {
      'ECONOMY': 'economy',
      'STANDARD': 'standard',
      'PREMIUM': 'premium',
      'LUXURY': 'luxury'
    };

    const typeName = typeMap[projectType] || 'space';
    const budgetName = budgetMap[budgetRangeValue] || 'flexible';
    const styleStr = styleName || 'modern';
    const cityPart = city ? ` in ${city}` : '';

    // 7 Meaningful variants (Customer POV)
    const templates = [
      `I want to transform my ${typeName}${cityPart} into a beautiful ${styleStr} sanctuary. I'm looking for smart space utilization and premium finishes, carefully planned within a ${budgetName} budget to meet my lifestyle needs.`,

      `I'm seeking the perfect blend of ${styleStr} aesthetics and functionality in this ${typeName}${cityPart}. My goal is to create a tailored living space that elevates my daily life, within a ${budgetName} investment plan.`,

      `My vision is a modern home: Redesigning this ${typeName}${cityPart} with a focus on ${styleStr} elegance. Optimizing for a ${budgetName} range, I want a space that offers comfort, style, and enduring value.`,

      `I want to unlock the potential of my ${typeName}${cityPart}. Embracing a ${styleStr} design philosophy, I want a sophisticated home that balances luxury and practicality, perfectly aligned with my ${budgetName} goals.`,

      `I'm looking to reimagine urban living${cityPart} with this ${typeName} renovation. Featuring ${styleStr} elements and a calculated ${budgetName} approach, I want a home that is both beautiful and highly functional.`,

      `I'm crafting my dream home${cityPart}. This ${typeName} makeover needs to combine ${styleStr} vibes with smart planning. Targeting the ${budgetName} segment, I want every square foot to reflect my personality.`,

      `I want to elevate my lifestyle with this ${styleStr} inspired ${typeName}${cityPart}. I need a harmonious environment that maximizes space and light, all delivered within a ${budgetName} framework.`
    ];

    // Select template (use stored index for stability)
    const description = templates[templateIndex % templates.length];

    // Limit to approximately 30 words
    const words = description.split(' ');
    // Filter out empty strings from double spaces if variables are missing
    const cleanWords = words.filter(w => w.length > 0);
    return cleanWords.slice(0, 35).join(' ') + (cleanWords.length > 35 ? '...' : '');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-generate title when project type is selected
      if (field === 'projectType' && value && !prev.title) {
        const generatedTitle = generateProjectTitle(value);
        if (generatedTitle) {
          updated.title = generatedTitle;
        }
      }

      return updated;
    });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Auto-update description when key fields change
  useEffect(() => {
    if (!formData.projectType) return;

    const currentTitle = formData.title || generateProjectTitle(formData.projectType);
    if (!currentTitle) return;

    // Get style name if selected
    const selectedStyle = designStyles.find(s => s.id === formData.selectedStyleId);

    const generatedDesc = generateProjectDescription(
      currentTitle,
      formData.projectType,
      formData.city,
      formData.budgetRange,
      selectedStyle?.name
    );

    if (!generatedDesc) return;

    // Auto-generate description if empty
    if (!formData.description) {
      setFormData(prev => ({ ...prev, description: generatedDesc }));
      return;
    }

    // Update description if it was auto-generated.
    const autoGenMarkers = [
      'I want to transform', 'I\'m seeking the perfect', 'My vision is',
      'I want to unlock', 'I\'m looking to reimagine', 'I\'m crafting my dream',
      'I want to elevate', 'beautiful, functional' // fallback for old ones
    ];

    const isAutoGenerated = autoGenMarkers.some(marker => formData.description.includes(marker));

    if (isAutoGenerated) {
      setFormData(prev => ({ ...prev, description: generatedDesc }));
    }
  }, [
    formData.projectType,
    formData.title,
    formData.city,
    formData.budgetRange,
    formData.selectedStyleId,
    userName,
    designStyles,
    templateIndex
  ]);

  const toggleFavorite = (styleId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(styleId)) {
      newFavorites.delete(styleId);
    } else {
      newFavorites.add(styleId);
    }
    setFavorites(newFavorites);
  };

  const toggleStyleSelection = (stylePublicId) => {
    if (formData.selectedStyleId === stylePublicId) {
      handleInputChange('selectedStyleId', null);
    } else {
      handleInputChange('selectedStyleId', stylePublicId);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.projectType) newErrors.projectType = 'Project type is required';
        break;

      case 2:
        if (!formData.title?.trim()) newErrors.title = 'Project title is required';
        if (!formData.city?.trim()) newErrors.city = 'City is required';
        // Add pincode validation
        if (!formData.pincode?.trim() || formData.pincode.length !== 6) newErrors.pincode = 'Valid 6-digit pincode is required';
        break;

      case 3:
        // if (!formData.budgetRange) newErrors.budgetRange = 'Budget range is required';
        // if (!formData.timeline) newErrors.timeline = 'Timeline is required';
        break;

      case 4:
        if (!formData.selectedStyleId) newErrors.selectedStyleId = 'Please select a design style';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (step) => {
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4) || projectCreated) return;

    setIsSubmitting(true);

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        projectType: formData.projectType,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode || null,
        state: formData.state,
        country: formData.country,
        areaSqFt: formData.areaSqFt ? parseFloat(formData.areaSqFt) : null,
        // budgetRange: formData.budgetRange,
        // timeline: formData.timeline,
        budgetRange: formData.budgetRange || null,
        timeline: formData.timeline || null,
        selectedStyleId: formData.selectedStyleId
      };

      const response = await projectService.createProject(projectData);

      if (response.success) {
        const projectId = response.data.project.id;
        setCreatedProjectId(projectId);
        setProjectCreated(true);

        // ✅ Automatically set phase to onboarding questionnaire
        await projectService.updateProjectPhase(projectId, {
          currentPhase: 'ONBOARDING_QUESTIONNAIRE'
        });

        // Clear stored data
        localStorage.removeItem(FORM_STORAGE_KEY);
        localStorage.removeItem(POPUP_DATA_KEY);

        toast.success('Project created successfully!');

        // Show onboarding modal for ALL users (treat everyone the same)
        setShowOnboardingModal(true);
      } else {
        throw new Error(response.message || 'Failed to create project');
      }

    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.message || 'Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowOnboardingModal(false);
  }

  const handleOnboardingComplete = () => {
    setShowOnboardingModal(false);
    if (createdProjectId) {
      router.push(`/dashboard/projects/${createdProjectId}/uploads`);
    } else {
      router.push('/dashboard/projects');
    }
  };

  // Clear form data
  const clearFormData = () => {
    setFormData({
      projectType: '',
      title: '',
      description: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      areaSqFt: '',
      budgetRange: '',
      timeline: '',
      selectedStyleId: null
    });
    setCurrentStep(1);
    setFavorites(new Set());
    setSearchQuery('');
    setSortBy('popularity');
    setViewMode('grid');
    setProjectCreated(false);
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(POPUP_DATA_KEY);
  };

  // NEW: Resume Modal Component
  const ResumeModal = () => {
    if (!showResumeModal || !existingProject) return null;

    const getPhaseName = (phase) => {
      const phaseNames = {
        'PROJECT_SETUP': 'Project Setup',
        'ONBOARDING_QUESTIONNAIRE': 'Onboarding Questions',
        'FILE_UPLOADS': 'File Uploads',
        'PAYMENT': 'Payment',
        'DESIGN_QUESTIONNAIRE': 'Design Questionnaire'
      };
      return phaseNames[phase] || phase;
    };

    const handleResume = () => {
      const redirectUrls = {
        'ONBOARDING_QUESTIONNAIRE': `/dashboard/projects/${existingProject.id}`,
        'FILE_UPLOADS': `/dashboard/projects/${existingProject.id}/uploads`,
        'PAYMENT': `/packages?type=new-project&projectId=${existingProject.id}`,
        'DESIGN_QUESTIONNAIRE': `/dashboard/projects/${existingProject.id}/design-questionnaire`
      };

      const redirectUrl = redirectUrls[existingProject.currentPhase];
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/dashboard/projects');
      }
      setShowResumeModal(false);
    };

    const handleStartNew = () => {
      setShowResumeModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md mx-4">
          <h3 className="text-lg font-bold mb-4">Continue Your Project?</h3>
          <p className="text-gray-600 mb-4">
            You have an incomplete project. Continue from where you left off?
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Current step: <strong>{getPhaseName(existingProject.currentPhase)}</strong>
          </p>
          <div className="flex gap-3">
            <Button onClick={handleResume} className="bg-blue-600 text-white flex-1">
              Resume Project
            </Button>
            <Button
              onClick={handleStartNew}
              variant="outline"
              className="flex-1"
            >
              Start New
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Filter and sort styles
  const filteredStyles = designStyles
    .filter(style => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        style.name.toLowerCase().includes(query) ||
        style.description.toLowerCase().includes(query) ||
        style.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        style.characteristics?.some(char => char.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const selectedStyle = designStyles.find(style => style.id === formData.selectedStyleId);

  // Enhanced Step Indicators Component
  const StepIndicators = () => (
    <div className="bg-card border border-border rounded-xl p-4 lg:p-6 shadow-sm">
      <div className="relative">
        {/* Connecting Line - Hidden on mobile, visible on larger screens */}
        <div
          className="absolute top-6 left-4 right-4 h-0.5 bg-border z-0 hidden lg:block"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, hsl(var(--border)) ${progress}%)`
          }}
        />

        {/* Steps Grid - 2x2 on mobile, single row on larger screens */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 relative z-10">
          {formSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isClickable = step.id < currentStep;

            return (
              <button
                key={step.id}
                onClick={() => isClickable && handleStepClick(step.id)}
                disabled={!isClickable}
                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl transition-all duration-300 ${isClickable ? 'cursor-pointer hover:bg-accent/50' : 'cursor-default'
                  } ${isCurrent
                    ? 'bg-primary/10 border-2 border-primary/30 shadow-lg scale-105'
                    : isCompleted
                      ? 'bg-green-50 dark:bg-green-950/20 border-2 border-green-300 dark:border-green-700 shadow-sm'
                      : 'bg-muted/30 border-2 border-border'
                  }`}
              >
                {/* Step Circle with Icon */}
                <div className="relative">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${isCompleted
                    ? 'bg-green-500 border-green-600 text-white shadow-md'
                    : isCurrent
                      ? 'bg-primary border-primary text-white shadow-lg'
                      : 'bg-background border-border text-muted-foreground'
                    }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    ) : (
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    )}
                  </div>

                  {/* Step Number Badge */}
                  <div className={`absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center border-2 ${isCompleted
                    ? 'bg-white border-green-500 text-green-700'
                    : isCurrent
                      ? 'bg-white border-primary text-primary shadow-md'
                      : 'bg-muted border-border text-muted-foreground'
                    }`}>
                    {step.id}
                  </div>
                </div>

                {/* Step Text */}
                <div className="text-center space-y-1 flex-1 w-full">
                  <p className={`text-xs font-semibold transition-colors line-clamp-1 ${isCurrent ? 'text-primary' :
                    isCompleted ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'
                    }`}>
                    {step.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 hidden sm:block">
                    {step.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 sm:hidden">
                    {isCurrent ? 'Current' : isCompleted ? 'Completed' : 'Upcoming'}
                  </p>
                </div>

                {/* Current Step Indicator */}
                {isCurrent && (
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping absolute -top-0.5 -right-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step Title for Mobile */}
      {mobileView && (
        <div className="mt-4 text-center lg:hidden">
          <h3 className="text-base font-semibold text-foreground">
            {formSteps.find(step => step.id === currentStep)?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formSteps.find(step => step.id === currentStep)?.description}
          </p>
        </div>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 lg:space-y-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Home className="w-6 h-6 lg:w-8 lg:h-8 text-foreground" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Project Type
                </h2>
                <p className="text-muted-foreground text-base lg:text-lg mt-2">Select the type of space you're designing</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-2">
              {projectTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.projectType === type.id;

                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-300 border-2 ${isSelected
                      ? 'border-primary bg-primary/5 shadow-lg scale-105'
                      : 'border-border hover:border-primary/50 hover:scale-102'
                      }`}
                    onClick={() => {
                      handleInputChange('projectType', type.id);
                      // Auto-advance to next step after project type is set
                      setTimeout(() => {
                        setCurrentStep(2);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 200);
                    }}
                  >
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center space-x-3 lg:space-x-4">
                        <div className={`p-2 lg:p-3 rounded-xl flex-shrink-0 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                          <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                        </div>
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold text-base lg:text-lg line-clamp-1 ${isSelected ? 'text-primary' : 'text-foreground'
                              }`}>
                              {type.name}
                            </h3>
                            {type.popular && (
                              <Badge variant="secondary" className="text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{type.description}</p>
                          <div className="text-xs text-muted-foreground">
                            {typeof type.rooms === 'number' ? `${type.rooms} rooms + living areas` : 'Custom configuration'}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {errors.projectType && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {errors.projectType}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 lg:space-y-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <MapPin className="w-6 h-6 lg:w-8 lg:h-8 text-foreground" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Space Details
                </h2>
                <p className="text-muted-foreground text-base lg:text-lg mt-2">Tell us about your space</p>
              </div>
            </div>

            <div className="grid gap-4 lg:gap-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-semibold text-foreground">
                  Project Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Modern 3BHK Apartment Design"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`h-12 text-base ${errors.title ? 'border-destructive' : 'border-border'}`}
                />
                {errors.title && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold text-foreground">
                  Project Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your vision, requirements, and any specific needs..."
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="min-h-[100px] text-base resize-none border-border"
                />
                <p className="text-sm text-muted-foreground">Share details about your dream space</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="address" className="text-base font-semibold text-foreground">
                    Complete Address (Optional)
                  </Label>
                  <Input
                    id="address"
                    placeholder="Full street address with landmark"
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="h-12 text-base border-border"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="city" className="text-base font-semibold text-foreground">City *</Label>
                  <Input
                    id="city"
                    placeholder="Mumbai"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`h-12 text-base ${errors.city ? 'border-destructive' : 'border-border'}`}
                  />
                  {errors.city && (
                    <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      {errors.city}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="pincode" className="text-base font-semibold text-foreground">Pincode *</Label>
                  <Input
                    id="pincode"
                    type="text"
                    placeholder="400001"
                    value={formData.pincode || ''}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    className={`h-12 text-base ${errors.pincode ? 'border-destructive' : 'border-border'}`}
                    maxLength="6"
                  />
                  {errors.pincode && (
                    <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      {errors.pincode}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">postal code for your area</p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="areaSqFt" className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Total Area - sq ft (Optional)
                  </Label>
                  <Input
                    id="areaSqFt"
                    type="number"
                    placeholder="1200"
                    value={formData.areaSqFt || ''}
                    onChange={(e) => handleInputChange('areaSqFt', e.target.value)}
                    className="h-12 text-base border-border"
                  />
                  <p className="text-sm text-muted-foreground">Approximate total area of your space</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 lg:space-y-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <IndianRupee className="w-6 h-6 lg:w-8 lg:h-8 text-foreground" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Budget & Timeline
                </h2>
                <p className="text-muted-foreground text-base lg:text-lg mt-2">Set your investment range and project timeline</p>
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8">
              {/* Budget Range - Clickable Cards */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Budget Range
                </Label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
                  {budgetRanges.map((range) => {
                    const Icon = range.icon;
                    const isSelected = formData.budgetRange === range.value;
                    return (
                      <Card
                        key={range.value}
                        className={`cursor-pointer transition-all duration-300 border-2 touch-manipulation active:scale-95 ${isSelected
                          ? 'border-primary bg-primary/5 shadow-lg scale-105'
                          : 'border-border hover:border-primary/50 hover:scale-102'
                          }`}
                        onClick={() => {
                          handleInputChange('budgetRange', range.value);
                          // Auto-advance to next step if both budget and timeline are selected
                          setTimeout(() => {
                            if (formData.timeline || formData.budgetRange) {
                              // Check if we can advance (both selected or optional)
                              if (formData.timeline && formData.budgetRange) {
                                setCurrentStep(4);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }
                          }, 200);
                        }}
                      >
                        <CardContent className="p-3 sm:p-4 lg:p-5">
                          <div className="flex flex-col items-center text-center space-y-2">
                            <div className={`p-2 lg:p-3 rounded-xl flex-shrink-0 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                              }`}>
                              <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                            </div>
                            <div className="flex-1 min-w-0 w-full">
                              <h3 className={`font-semibold text-sm sm:text-base lg:text-lg line-clamp-1 ${isSelected ? 'text-primary' : 'text-foreground'
                                }`}>
                                {range.label}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{range.range}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {errors.budgetRange && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {errors.budgetRange}
                  </div>
                )}
              </div>

              {/* Project Timeline - Clickable Cards */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Project Timeline
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
                  {timelines.map((timeline) => {
                    const Icon = timeline.icon;
                    const isSelected = formData.timeline === timeline.value;
                    return (
                      <Card
                        key={timeline.value}
                        className={`cursor-pointer transition-all duration-300 border-2 touch-manipulation active:scale-95 ${isSelected
                          ? 'border-primary bg-primary/5 shadow-lg scale-105'
                          : 'border-border hover:border-primary/50 hover:scale-102'
                          }`}
                        onClick={() => {
                          handleInputChange('timeline', timeline.value);
                          // Auto-advance to next step if both budget and timeline are selected
                          setTimeout(() => {
                            if (formData.budgetRange && timeline.value) {
                              setCurrentStep(4);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }, 200);
                        }}
                      >
                        <CardContent className="p-3 sm:p-4 lg:p-5">
                          <div className="flex items-center space-x-3 lg:space-x-4">
                            <div className={`p-2 lg:p-3 rounded-xl flex-shrink-0 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                              }`}>
                              <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                            </div>
                            <div className="flex-1 space-y-1 min-w-0">
                              <h3 className={`font-semibold text-sm sm:text-base lg:text-lg line-clamp-1 ${isSelected ? 'text-primary' : 'text-foreground'
                                }`}>
                                {timeline.label}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">{timeline.duration}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {errors.timeline && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {errors.timeline}
                  </div>
                )}
              </div>

              {/* Budget Guidance */}
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                      <Lightbulb className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-base lg:text-lg mb-2">
                        Budget Guidance
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm lg:text-base">
                        Your budget range helps us recommend the best materials and design options.
                        Don't worry - you can always adjust this later.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 lg:space-y-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-foreground" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Design Style Selection
                </h2>
                <p className="text-muted-foreground text-base lg:text-lg mt-2">
                  Choose your preferred design style
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loadingStyles && (
              <div className="flex items-center justify-center py-8 lg:py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Loading design styles...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {stylesError && !loadingStyles && (
              <Card className="border-destructive/20 bg-destructive/10">
                <CardContent className="p-4 lg:p-6 text-center">
                  <AlertCircle className="w-8 h-8 lg:w-12 lg:h-12 text-destructive mx-auto mb-3 lg:mb-4" />
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Failed to load styles
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm lg:text-base">{stylesError}</p>
                  <Button onClick={fetchDesignStyles} variant="outline" size="sm" className="text-sm">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Styles Content */}
            {!loadingStyles && !stylesError && (
              <>
                {/* Filters and Search */}
                <Card className="bg-card border-border">
                  <CardContent className="p-3 lg:p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-4">
                      {/* Search */}
                      <div className="relative lg:col-span-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search styles, tags, or descriptions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-background border-border text-sm lg:text-base"
                        />
                      </div>

                      {/* Sort Options */}
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="text-sm lg:text-base">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popularity">Most Popular</SelectItem>
                          <SelectItem value="name">Alphabetical</SelectItem>
                          <SelectItem value="newest">Newest</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* View Mode Toggle */}
                      <div className="flex gap-2">
                        <Button
                          variant={viewMode === 'grid' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="border-border flex-1 lg:flex-none"
                        >
                          {mobileView ? <Grid3X3 className="h-4 w-4" /> : (
                            <>
                              <Grid3X3 className="h-4 w-4 mr-2" />
                              Grid
                            </>
                          )}
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="border-border flex-1 lg:flex-none"
                        >
                          {mobileView ? <List className="h-4 w-4" /> : (
                            <>
                              <List className="h-4 w-4 mr-2" />
                              List
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* View Mode Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredStyles.length} design styles
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Click on any style to select it
                  </div>
                </div>

                {/* Styles Grid/List - Mobile Optimized */}
                {filteredStyles.length === 0 ? (
                  <div className="text-center py-8 lg:py-12">
                    <Palette className="w-12 h-12 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-3 lg:mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No styles found
                    </h3>
                    <p className="text-muted-foreground text-sm lg:text-base">
                      {searchQuery ? 'Try adjusting your search' : 'No design styles available'}
                    </p>
                  </div>
                ) : (
                  <div className={
                    viewMode === 'grid'
                      ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4"
                      : "space-y-2 sm:space-y-3 lg:space-y-4"
                  }>
                    {filteredStyles.map((style) => {
                      const isSelected = formData.selectedStyleId === style.id;
                      const isFavorite = favorites.has(style.id);

                      if (viewMode === 'grid') {
                        return (
                          <Card
                            key={style.id}
                            className={`bg-card border-2 transition-all duration-300 overflow-hidden group cursor-pointer touch-manipulation active:scale-95 ${isSelected
                              ? 'border-primary shadow-lg scale-105'
                              : 'border-border hover:border-primary/50 hover:shadow-md'
                              }`}
                            onClick={() => toggleStyleSelection(style.id)}
                          >
                            <div className="relative">
                              <div className="h-32 sm:h-36 lg:h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                                <img
                                  src={getImageUrl(style.imageUrl)}
                                  alt={style.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-active:scale-110"
                                  onError={(e) => {
                                    e.target.src = getImageUrl('/styles/default-style.jpg');
                                  }}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-active:opacity-100'
                                  }`} />
                              </div>

                              {/* Selection Badge - Always visible when selected */}
                              {isSelected && (
                                <div className="absolute top-2 left-2 z-10">
                                  <div className="bg-green-500 text-white rounded-full p-1.5 sm:p-2 shadow-lg">
                                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </div>
                                </div>
                              )}

                              {/* Favorite Button - Visible on mobile too */}
                              <div className={`absolute top-2 right-2 z-10 transition-all duration-300 ${isSelected || mobileView ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-background/90 hover:bg-background shadow-sm touch-manipulation"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(style.id);
                                  }}
                                >
                                  <Heart
                                    className={`h-3 w-3 sm:h-4 sm:w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                                  />
                                </Button>
                              </div>

                              {/* Popularity Badge */}
                              {style.popularity > 85 && (
                                <div className="absolute bottom-2 left-2 z-10">
                                  <Badge className="bg-amber-500 text-white border-0 shadow-sm text-xs px-1.5 py-0.5">
                                    <Star className="h-2 w-2 sm:h-3 sm:w-3 mr-1 fill-current" />
                                    Popular
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <CardContent className="p-2 sm:p-3 lg:p-4">
                              <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                                <div>
                                  <h3 className={`font-semibold transition-colors line-clamp-1 mb-0.5 sm:mb-1 text-xs sm:text-sm lg:text-base ${isSelected ? 'text-primary' : 'text-foreground group-active:text-primary'
                                    }`}>
                                    {style.name}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2">
                                    {style.description}
                                  </p>
                                </div>

                                {/* Tags - Hidden on mobile to save space */}
                                {!mobileView && (
                                  <div className="flex flex-wrap gap-1">
                                    {style.tags?.slice(0, 2).map((tag, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs border-border text-muted-foreground"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      } else {
                        // List View
                        return (
                          <Card
                            key={style.id}
                            className="bg-card border-border hover:shadow-md transition-all duration-300 cursor-pointer"
                            onClick={() => toggleStyleSelection(style.id)}
                          >
                            <CardContent className="p-3 lg:p-4">
                              <div className="flex items-start gap-3 lg:gap-4">
                                {/* Style Image */}
                                <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center overflow-hidden">
                                  <img
                                    src={getImageUrl(style.imageUrl)}
                                    alt={style.name}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                    onError={(e) => {
                                      e.target.src = getImageUrl('/styles/default-style.jpg');  // Add getImageUrl here too
                                    }}
                                  />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-foreground text-base lg:text-lg line-clamp-1">{style.name}</h3>
                                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{style.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2">
                                      {isSelected && (
                                        <Badge className="bg-green-500 text-white text-xs">Selected</Badge>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleFavorite(style.id);
                                        }}
                                      >
                                        <Heart
                                          className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                                        />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {style.tags?.slice(0, 4).map((tag, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs border-border text-muted-foreground"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {/* Action Button */}
                                <div className="flex-shrink-0">
                                  <Button
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleStyleSelection(style.id);
                                    }}
                                  >
                                    {isSelected ? 'Selected' : 'Select'}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                    })}
                  </div>
                )}

                {/* Selection Summary */}
                {selectedStyle && (
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-900 dark:text-green-100 text-base lg:text-lg">
                            Style Selected!
                          </h3>
                          <p className="text-green-700 dark:text-green-300 text-sm lg:text-base">
                            You've chosen <strong>{selectedStyle.name}</strong>
                          </p>
                          <p className="text-green-600 dark:text-green-400 text-xs lg:text-sm mt-1 line-clamp-2">
                            {selectedStyle.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-white dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 self-start lg:self-center">
                          Ready to continue
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {errors.selectedStyleId && (
                  <div className="flex items-center gap-2 text-destructive text-sm justify-center p-3 lg:p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {errors.selectedStyleId}
                  </div>
                )}
              </>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link href="/dashboard/projects" className="w-full sm:w-auto">
              <Button variant="outline" className="border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all group w-full sm:w-auto justify-center sm:justify-start">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Back to Projects</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div className="flex items-center justify-between w-full sm:w-auto gap-2">
              <Badge variant="secondary" className="text-xs lg:text-sm bg-muted text-foreground font-medium px-2 lg:px-3 py-1">
                Step {currentStep} of {formSteps.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFormData}
                className="text-xs text-muted-foreground hover:text-destructive hidden sm:flex"
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3 lg:space-y-4">
            <div className="flex justify-between text-xs lg:text-sm text-muted-foreground">
              <span>Project Setup Progress</span>
              <span className="font-semibold text-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-muted" />
          </div>

          {/* Enhanced Step Indicators - All 4 steps visible */}
          <StepIndicators />

          {/* Form Content */}
          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-4 lg:p-6 xl:p-8">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-border bg-background hover:bg-accent w-full sm:w-auto order-2 sm:order-1"
              size={mobileView ? "sm" : "default"}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Back</span>
            </Button>

            <div className="text-center order-1 sm:order-2 w-full sm:w-auto">
              <p className="text-sm text-muted-foreground">
                {currentStep === 4 ? (
                  selectedStyle ? (
                    <span className="flex items-center justify-center gap-2">
                      Selected: <span className="font-semibold truncate max-w-[120px] sm:max-w-[200px]">{selectedStyle.name}</span>
                    </span>
                  ) : 'No style selected'
                ) : (
                  `${currentStep} of ${formSteps.length} steps completed`
                )}
              </p>
            </div>

            {currentStep < formSteps.length ? (
              <Button
                onClick={handleNext}
                className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto order-3"
                size={mobileView ? "sm" : "default"}
              >
                <span className="hidden sm:inline">Continue</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || loadingStyles || projectCreated}
                className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto order-3"
                size={mobileView ? "sm" : "default"}
              >
                {projectCreated ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Project Created</span>
                    <span className="sm:hidden">Created</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Creating Project...</span>
                    <span className="sm:hidden">Creating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Create Project</span>
                    <span className="sm:hidden">Create</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Onboarding Modal - Show for ALL users */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={handleModalClose}
        onComplete={handleOnboardingComplete}
        projectId={createdProjectId}
      />

      {/* NEW: Resume Project Modal */}
      <ResumeModal />
    </>
  );
}