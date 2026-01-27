// src/app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  FileText,
  Palette,
  Image,
  Search,
  Filter,
  Grid3X3,
  List,
  Users,
  Sparkles,
  Zap,
  Target,
  Calendar,
  Home,
  IndianRupee,
  PlayCircle,
  Brain,
  Rocket,
  ShoppingCart,
  Star,
  Shield,
  Heart,
  ArrowRight,
  Crown,
  BadgeCheck,
  Gift,
  Menu,
  X,
  Receipt,
  AlertTriangle,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Settings,
  EyeOff,
  Hammer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ProjectCard from "@/components/dashboard/ProjectCard";
import QuestionnaireModal from "@/components/dashboard/QuestionnaireModal";
import CelebrationScreen from "@/components/dashboard/CelebrationScreen";
import DashboardNotifications from "@/components/dashboard/DashboardNotifications";
import { projectService } from "@/services/project.service";
import { packageService } from "@/services/package.service";
import { toast } from "sonner";
import { PROJECT_STATUS, needsQuestionnaire, hasCompletedPayment } from "@/constants/projectStatus";
import ProgressCards from "@/components/dashboard/ProgressCards";
import Link from "next/link";
import { useProjectStatus } from "@/hooks/useProjectStatus";
import PendingStepsModal from "@/components/projects/PendingStepsModal";
import OnboardingModal from "@/components/projects/OnboardingModal";
import DashboardTour from "@/components/tour/DashboardTour";
import TourTrigger from "@/components/tour/TourTrigger";
import CombinedTour from "@/components/tour/CombinedTour";
import { useTour } from "@/context/TourContext";

const quickActions = [
  {
    title: "Renders",
    description: "View designs",
    icon: Image,
    href: "/dashboard/renders",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Budget",
    description: "Cost breakdown",
    icon: Receipt,
    href: "/dashboard/boq",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Vendors",
    description: "Find partners",
    icon: Users,
    href: "/dashboard/vendors",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Support",
    description: "Get help",
    icon: Zap,
    href: "/dashboard/support",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

export default function DashboardPage() {
  const { 
    hasCompletedTour, 
    showTourPrompt, 
    isLoading: tourLoading,
    dismissTour,
    acceptTour 
  } = useTour();
  
  const { 
    pendingProjects: allPendingProjects, 
    redirectToPendingStep,
    checkPendingProjects 
  } = useProjectStatus();
  
  const pendingProjects = allPendingProjects.filter(project => 
    project.currentPhase !== 'DESIGN_QUESTIONNAIRE'
  );
  
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [questionnairePopupShown, setQuestionnairePopupShown] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  
  // ✅ NEW: Onboarding modal states
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingProject, setOnboardingProject] = useState(null);
  
  // ✅ NEW: Activity accordion state
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  
  // ✅ NEW: Dashboard customization state
  const [dashboardSettings, setDashboardSettings] = useState({
    showActiveProjects: true,
    showActivityTimeline: true,
    showDesignProgress: true,
  });
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  
  // Load dashboard preferences from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      try {
        setDashboardSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading dashboard settings:', error);
      }
    }
  }, []);
  
  // Save dashboard preferences
  const saveDashboardSettings = (newSettings) => {
    setDashboardSettings(newSettings);
    localStorage.setItem('dashboardSettings', JSON.stringify(newSettings));
    toast.success('Dashboard preferences saved');
  };

  const resetQuestionnaireState = () => {
    setShowQuestionnaire(false);
    setSelectedProject(null);
    setQuestionnairePopupShown(true);
    localStorage.removeItem("paymentCompleted");
    localStorage.removeItem("paymentProjectId");
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Show modal automatically if there are pending projects
  useEffect(() => {
    if (!loading && pendingProjects.length > 0) {
      // Check if user recently dismissed the modal
      const dismissed = localStorage.getItem('pendingProjectsDismissed');
      const dismissTime = localStorage.getItem('pendingProjectsDismissedTime');
      
      // Show modal if not dismissed or dismissed more than 1 hour ago
      if (!dismissed || (dismissTime && Date.now() - parseInt(dismissTime) > 3600000)) {
        setShowPendingModal(true);
      }
    }
  }, [loading, pendingProjects]);

  const handleResumeProject = (project) => {
    setShowPendingModal(false);
    
    if (project.currentPhase === 'PAYMENT' || project.needsPayment) {
      router.push(`/packages?type=new-project&projectId=${project.id}`);
    } else {
      redirectToPendingStep(project);
    }
  };

  const handleCloseModal = () => {
    setShowPendingModal(false);
    // Store dismissal with timestamp
    localStorage.setItem('pendingProjectsDismissed', 'true');
    localStorage.setItem('pendingProjectsDismissedTime', Date.now().toString());
  };

  const handleShowPendingModal = () => {
    setShowPendingModal(true);
  };

  // ✅ NEW: Check for projects needing onboarding
  const checkPendingOnboarding = async () => {
    try {
      // Find projects that need onboarding questionnaire
      const projectsNeedingOnboarding = projects.filter(project => 
        project.currentPhase === 'ONBOARDING_QUESTIONNAIRE'
      );

      if (projectsNeedingOnboarding.length > 0 && !showOnboardingModal) {
        const project = projectsNeedingOnboarding[0];
        setOnboardingProject(project);
        setShowOnboardingModal(true);
      }
    } catch (error) {
      console.error('Error checking pending onboarding:', error);
    }
  };

  const loadProjects = async () => {
    setLoading(true);

    try {
      const result = await projectService.getUserProjects();

      let projectsData = [];

      if (result.success && result.data?.projects) {
        projectsData = result.data.projects;
      } else {
        toast.error(result.message || "Failed to load projects");
        projectsData = [];
      }

      const processedProjects = await Promise.all(
        projectsData.map(async (project) => {
          const paymentCompleted = hasCompletedPayment(project);

          const designPreferencesCompleted =
            project.status === "DESIGN_QUESTIONNAIRE_COMPLETED" ||
            project.status === "RENDER_IN_PROGRESS" ||
            project.status === "RENDER_COMPLETED" ||
            project.status === "BOQ_GENERATED" ||
            project.status === "COMPLETED";

          // ✅ FIX: Ensure we have the correct project ID
          const projectPublicId = project.publicId || project.id;
          
          // ✅ LOAD PROGRESS DATA for each project
          let progressData = null;
          if (project.designStartTime && projectPublicId) {
            try {
              const progressResult = await projectService.getProjectProgress(projectPublicId);
              if (progressResult.success) {
                progressData = progressResult.data.progress;
              }
            } catch (error) {
              console.error(
                "Error loading progress for project:",
                projectPublicId,
                error
              );
            }
          }

          return {
            ...project,
            publicId: projectPublicId, // ✅ Ensure publicId is always set
            id: projectPublicId, // ✅ Also set id for backward compatibility
            paymentCompleted,
            designPreferencesCompleted,
            progress: PROJECT_STATUS[project.status]?.progress || 0,
            designStartTime: project.designStartTime || null,
            progressData: progressData,
            // ✅ NEW: Add onboarding status for easy filtering
            needsOnboarding: project.currentPhase === 'ONBOARDING_QUESTIONNAIRE',
            // ✅ NEW: Add payment status for filtering
            paymentStatus: project.paymentStatus || 'PENDING'
          };
        })
      );

      setProjects(processedProjects);
      setFilteredProjects(processedProjects);

      checkAndShowDesignQuestionnairePopup(processedProjects);
    } catch (error) {
      console.error("❌ Error loading projects:", error);
      toast.error("Failed to load projects. Please try again.");
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const checkAndShowDesignQuestionnairePopup = (projectsList) => {    
    const paymentCompleted = localStorage.getItem("paymentCompleted") === "true";
    const paymentProjectId = localStorage.getItem("paymentProjectId");

    // ✅ FIX: Only show design questionnaire for projects that NEED it AND have completed payment
    const projectsNeedingQuestionnaire = projectsList.filter((project) => 
      !project.isSingleRoomPlan &&
      needsQuestionnaire(project) && 
      hasCompletedPayment(project) &&
      !project.designQuestionnaireCompleted && // ✅ Add this check
      !project.designQuestionnaireCompletedAt // ✅ Add this check too
    );

    if (paymentCompleted && paymentProjectId && !questionnairePopupShown) {
      const paidProject = projectsList.find(
        (project) =>
          (project.publicId === paymentProjectId || project.id === paymentProjectId) &&
          hasCompletedPayment(project) &&
          needsQuestionnaire(project) && // ✅ Add this
          !project.designQuestionnaireCompleted // ✅ Add this
      );

      if (paidProject) {
        setTimeout(() => {
          setSelectedProject(paidProject);
          setShowQuestionnaire(true);
          setQuestionnairePopupShown(true);
        }, 3000);
      } else {
        // Clear flags if project doesn't need questionnaire anymore
        localStorage.removeItem("paymentCompleted");
        localStorage.removeItem("paymentProjectId");
      }
    } else {
      const anyProjectNeedsDesignQuestionnaire = projectsNeedingQuestionnaire[0];

      if (anyProjectNeedsDesignQuestionnaire && !questionnairePopupShown) {
        setTimeout(() => {
          setSelectedProject(anyProjectNeedsDesignQuestionnaire);
          setShowQuestionnaire(true);
          setQuestionnairePopupShown(true);
        }, 3000);
      }
    }
  };

  const calculateProjectProgress = (status) => {
    return PROJECT_STATUS[status]?.progress || 0;
  };

  useEffect(() => {
    let filtered = projects;

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => {
        switch (statusFilter) {
          case "ONBOARDING_QUESTIONNAIRE":
            return project.currentPhase === 'ONBOARDING_QUESTIONNAIRE';
          case "PAYMENT_PENDING":
            return needsQuestionnaire(project) && !hasCompletedPayment(project);
          case "DESIGN_QUESTIONNAIRE_READY":
            return needsQuestionnaire(project) && hasCompletedPayment(project);
          case "DESIGN_QUESTIONNAIRE_COMPLETED":
            return project.status === "DESIGN_QUESTIONNAIRE_COMPLETED" || 
                   project.status === "RENDER_IN_PROGRESS";
          case "COMPLETED":
            return project.status === "COMPLETED";
          default:
            return project.status === statusFilter;
        }
      });
    }

    setFilteredProjects(filtered);
  }, [projects, searchQuery, statusFilter]);

  const handleQuickAction = (action) => {
    if (action === "questionnaire") {
      // ✅ Only show for projects with completed payment
      const projectNeedsDesignQuestionnaire = projects.find((p) =>
        needsQuestionnaire(p) && hasCompletedPayment(p)
      );
      
      if (projectNeedsDesignQuestionnaire) {
        setSelectedProject(projectNeedsDesignQuestionnaire);
        setShowQuestionnaire(true);
      } else {
        // Check if there are projects that need payment
        const projectsNeedingPayment = projects.find((p) =>
          needsQuestionnaire(p) && !hasCompletedPayment(p)
        );
        
        if (projectsNeedingPayment) {
          toast.info(
            "Please complete payment to start design preferences questionnaire."
          );
        } else {
          toast.info(
            "No projects require design preferences questionnaire at the moment."
          );
        }
      }
    }
  };

  const handleQuestionnaireComplete = async (projectId) => {
    try {
      localStorage.removeItem("paymentCompleted");
      localStorage.removeItem("paymentProjectId");

      const updateResult = await projectService.updateProject(projectId, {
        status: "DESIGN_QUESTIONNAIRE_COMPLETED",
      });

      if (updateResult.success) {
        const updatedProjects = projects.map((project) =>
          project.publicId === projectId || project.id === projectId
            ? {
                ...project,
                designPreferencesCompleted: true,
                status: "DESIGN_QUESTIONNAIRE_COMPLETED",
                progress:
                  PROJECT_STATUS["DESIGN_QUESTIONNAIRE_COMPLETED"].progress,
                designStartTime: new Date().toISOString(),
                paymentCompleted: true, // ✅ Keep as true since payment was completed
              }
            : project
        );

        setProjects(updatedProjects);
        setFilteredProjects(updatedProjects);
        setShowQuestionnaire(false);
        setSelectedProject(null);
        setQuestionnairePopupShown(true);

        const completedProject = updatedProjects.find(
          (p) => p.publicId === projectId || p.id === projectId
        );
        setActiveProject(completedProject);
        setShowCelebration(true);

        toast.success(
          "Design preferences completed successfully! Design process has started."
        );
      } else {
        throw new Error(updateResult.message);
      }
    } catch (error) {
      console.error("Error handling design questionnaire completion:", error);
      toast.error("Failed to complete design preferences questionnaire");
    }
  };

  // ✅ NEW: Handle onboarding completion
  const handleOnboardingComplete = async (projectId) => {
    try {
      // Refresh projects to update status
      await loadProjects();
      setShowOnboardingModal(false);
      setOnboardingProject(null);
      
      toast.success('Onboarding completed! You can now upload your floor plans.');
    } catch (error) {
      console.error('Error handling onboarding completion:', error);
      toast.error('Failed to update project status');
    }
  };

  // ✅ FIX: Updated handleQuestionnaireClose function
  const handleQuestionnaireClose = () => {
    resetQuestionnaireState();
  };

  // ✅ FIX: Updated handleCelebrationClose function
  const handleCelebrationClose = () => {
    setShowCelebration(false);
    setActiveProject(null);
    resetQuestionnaireState();
  };

  const getStatusCounts = () => {
    const counts = {
      all: projects.length,
      DRAFT: projects.filter((p) => p.status === "DRAFT").length,
      PAYMENT_COMPLETED: projects.filter(
        (p) => p.status === "PAYMENT_COMPLETED"
      ).length,
      DESIGN_QUESTIONNAIRE_COMPLETED: projects.filter(
        (p) => p.status === "DESIGN_QUESTIONNAIRE_COMPLETED"
      ).length,
      RENDER_IN_PROGRESS: projects.filter(
        (p) => p.status === "RENDER_IN_PROGRESS"
      ).length,
      COMPLETED: projects.filter((p) => p.status === "COMPLETED").length,
    };

    return {
      total: counts.all,
      active: counts.DESIGN_QUESTIONNAIRE_COMPLETED + counts.RENDER_IN_PROGRESS,
      needsDesignQuestionnaire: projects.filter((p) => needsQuestionnaire(p)).length,
      // ✅ NEW: Add onboarding count
      needsOnboarding: projects.filter(p => p.needsOnboarding).length,
      // ✅ NEW: Add payment pending count
      needsPayment: projects.filter(p => needsQuestionnaire(p) && !hasCompletedPayment(p)).length,
      // ✅ NEW: Add ready for design count
      readyForDesign: projects.filter(p => needsQuestionnaire(p) && hasCompletedPayment(p)).length,
      inProgress: counts.RENDER_IN_PROGRESS,
      completed: counts.COMPLETED,
    };
  };

  const stats = getStatusCounts();
  
  // Calculate budget summary
  const totalInvestment = projects.reduce(
    (sum, project) => {
      // Use budget field if available, otherwise estimate from payment status
      if (project.budget) {
        return sum + (parseFloat(project.budget) || 0);
      }
      // If payment is completed but no budget, estimate based on budgetRange
      if (hasCompletedPayment(project) && project.budgetRange) {
        // Rough estimates based on budget range
        const rangeEstimates = {
          ECONOMY: 750000, // 7.5L average
          STANDARD: 1750000, // 17.5L average
          PREMIUM: 3750000, // 37.5L average
          LUXURY: 5000000, // 50L+ average
        };
        return sum + (rangeEstimates[project.budgetRange] || 0);
      }
      return sum;
    },
    0
  );

  // Helper function to calculate overall progress (same logic as ProgressCards)
  const calculateOverallProgressForProject = (project) => {
    if (!project.designStartTime) return 0;
    
    // If progressData is not loaded yet, return 0 (it will be calculated when ProgressCards loads)
    if (!project.progressData) {
      // Fallback to status-based progress if progressData not available
      return PROJECT_STATUS[project.status]?.progress || 0;
    }
    
    const isSingleRoomPlan = project?.selectedPlan === 'Single Room Trial' || 
                            project?.selectedPlan?.toLowerCase().includes('single room') ||
                            project?.selectedPlan?.toLowerCase().includes('499');
    
    const phaseHours = isSingleRoomPlan ? 16 : 24;
    const progressData = project.progressData;
    
    // Calculate progress for each phase (same logic as ProgressCards)
    const calculatePhaseProgress = (phaseId) => {
      if (!progressData?.designStartTime) return 0;

      const now = new Date();
      const designStart = new Date(progressData.designStartTime);
      
      const phaseStartTimes = {
        'renders': progressData.rendersStartTime ? new Date(progressData.rendersStartTime) : designStart,
        'budget': progressData.budgetStartTime ? new Date(progressData.budgetStartTime) : new Date(designStart.getTime() + (phaseHours * 60 * 60 * 1000)),
        'vendors': progressData.vendorsStartTime ? new Date(progressData.vendorsStartTime) : new Date(designStart.getTime() + (2 * phaseHours * 60 * 60 * 1000))
      };

      const phaseStart = phaseStartTimes[phaseId];
      const phaseDuration = phaseHours * 60 * 60 * 1000;

      if (!phaseStart || now < phaseStart) return 0;

      // Check if phase is completed (same logic as ProgressCards getPhaseStatus)
      const phaseCompletions = {
        'renders': progressData.rendersStatus === 'COMPLETED' || progressData.rendersCompletedAt,
        'budget': progressData.boqStatus === 'SENT' || progressData.budgetCompletedAt,
        'vendors': progressData.vendorListStatus === 'SENT' || progressData.vendorsCompletedAt
      };

      if (phaseCompletions[phaseId]) return 100;

      const phaseEnd = new Date(phaseStart.getTime() + phaseDuration);
      if (now >= phaseEnd) return 100;

      const elapsed = Math.min(now - phaseStart, phaseDuration);
      const progress = (elapsed / phaseDuration) * 100;

      return Math.round(progress);
    };

    // Calculate average progress across all phases (same as ProgressCards calculateOverallProgress)
    const phases = ['renders', 'budget', 'vendors'];
    const phaseProgresses = phases.map(phase => calculatePhaseProgress(phase));
    const averageProgress = phaseProgresses.reduce((sum, progress) => sum + progress, 0) / phases.length;
    
    return Math.round(averageProgress);
  };

  // Get active projects (in design process + projects needing Design Preferences)
  const activeProjects = projects
    .filter((project) => {
      // Include projects that need Design Preferences (payment completed but questionnaire not started)
      const needsDesignPrefs = !project.isSingleRoomPlan &&
                               needsQuestionnaire(project) &&
                               hasCompletedPayment(project) &&
                               !project.designStartTime;
      
      // Include projects already in design process
      const inDesignProcess = project.designStartTime || 
                              project.status === "DESIGN_QUESTIONNAIRE_COMPLETED" ||
                              project.status === "RENDER_IN_PROGRESS";
      
      return needsDesignPrefs || inDesignProcess;
    })
    .map(project => {
      const needsDesignPrefs = !project.isSingleRoomPlan &&
                               needsQuestionnaire(project) &&
                               hasCompletedPayment(project) &&
                               !project.designStartTime;
      
      return {
        ...project,
        calculatedProgress: calculateOverallProgressForProject(project),
        needsDesignPreferences: needsDesignPrefs
      };
    })
    // Sort: projects needing Design Preferences first, then by progress
    .sort((a, b) => {
      if (a.needsDesignPreferences && !b.needsDesignPreferences) return -1;
      if (!a.needsDesignPreferences && b.needsDesignPreferences) return 1;
      return (b.calculatedProgress || 0) - (a.calculatedProgress || 0);
    });

  // Get project steps/phases for activity timeline
  const getProjectSteps = (project) => {
    const isSingleRoomPlan = project?.selectedPlan === 'Single Room Trial' || 
                            project?.selectedPlan?.toLowerCase().includes('single room') ||
                            project?.selectedPlan?.toLowerCase().includes('499');
    
    const steps = [];
    
    if (!isSingleRoomPlan) {
      // Regular project steps
      steps.push({
        id: 'onboarding',
        title: 'Onboarding Questionnaire',
        description: 'Complete onboarding to understand your preferences',
        completed: project.currentPhase !== 'ONBOARDING_QUESTIONNAIRE' && 
                   project.completedPhases?.includes('ONBOARDING_QUESTIONNAIRE'),
        inProgress: project.currentPhase === 'ONBOARDING_QUESTIONNAIRE',
        timestamp: project.onboardingStartedAt || project.createdAt,
        icon: Sparkles,
        color: 'blue'
      });
      
      steps.push({
        id: 'file_uploads',
        title: 'File Uploads',
        description: 'Upload floor plans and room photos',
        completed: project.currentPhase !== 'FILE_UPLOADS' && 
                   project.completedPhases?.includes('FILE_UPLOADS'),
        inProgress: project.currentPhase === 'FILE_UPLOADS',
        timestamp: project.updatedAt,
        icon: FileText,
        color: 'purple'
      });
      
      steps.push({
        id: 'payment',
        title: 'Payment',
        description: 'Complete payment to proceed',
        completed: hasCompletedPayment(project),
        inProgress: project.paymentStatus === 'PENDING' && 
                   project.currentPhase !== 'ONBOARDING_QUESTIONNAIRE' &&
                   project.currentPhase !== 'FILE_UPLOADS',
        timestamp: project.paymentCompletedAt || project.updatedAt,
        icon: CreditCard,
        color: 'purple'
      });
      
      steps.push({
        id: 'design_preferences',
        title: 'Design Preferences',
        description: 'Complete design preferences questionnaire',
        completed: project.designQuestionnaireCompleted || 
                   project.status === 'DESIGN_QUESTIONNAIRE_COMPLETED',
        inProgress: needsQuestionnaire(project) && 
                   hasCompletedPayment(project) && 
                   !project.designQuestionnaireCompleted,
        timestamp: project.designQuestionnaireCompletedAt || project.updatedAt,
        icon: Brain,
        color: 'amber'
      });
    }
    
    // Design process steps (for all projects)
    if (project.designStartTime || project.status === 'DESIGN_QUESTIONNAIRE_COMPLETED') {
      steps.push({
        id: 'renders',
        title: '3D Renders',
        description: 'Professional-grade visualizations',
        completed: project.progressData?.rendersStatus === 'COMPLETED' || 
                   project.progressData?.rendersCompletedAt,
        inProgress: project.progressData?.currentProgressPhase === 'RENDERS' && 
                   !project.progressData?.rendersCompletedAt,
        timestamp: project.progressData?.rendersCompletedAt || 
                   project.progressData?.rendersStartTime || 
                   project.designStartTime,
        icon: Image,
        color: 'blue',
        actionUrl: `/dashboard/projects/${project.publicId}/renders`,
        actionLabel: 'View Renders'
      });
      
      steps.push({
        id: 'budget',
        title: 'Budget Analysis',
        description: 'Smart cost estimation and BOQ',
        completed: project.progressData?.boqStatus === 'SENT' || 
                   project.progressData?.budgetCompletedAt,
        inProgress: project.progressData?.currentProgressPhase === 'BUDGET' && 
                   !project.progressData?.budgetCompletedAt,
        timestamp: project.progressData?.budgetCompletedAt || 
                   project.progressData?.budgetStartTime,
        icon: Receipt,
        color: 'green',
        actionUrl: `/dashboard/projects/${project.publicId}/boq`,
        actionLabel: 'View BOQ'
      });
      
      steps.push({
        id: 'vendors',
        title: 'Vendor Matching',
        description: 'Curated professional partners',
        completed: project.progressData?.vendorListStatus === 'SENT' || 
                   project.progressData?.vendorsCompletedAt,
        inProgress: project.progressData?.currentProgressPhase === 'VENDORS' && 
                   !project.progressData?.vendorsCompletedAt,
        timestamp: project.progressData?.vendorsCompletedAt || 
                   project.progressData?.vendorsStartTime,
        icon: Hammer,
        color: 'purple',
        actionUrl: `/dashboard/vendors/${project.publicId}`,
        actionLabel: 'View Vendors'
      });
    }
    
    return steps;
  };

  // Toggle accordion
  const toggleProjectAccordion = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // ✅ FIX: Updated priorityProjects calculation - only show for paid projects
  const priorityProjects = projects.filter((project) =>
    !project.isSingleRoomPlan &&
    needsQuestionnaire(project) &&
    hasCompletedPayment(project)
  );

  // ✅ NEW: Projects needing payment - only show after onboarding and file uploads completed
  const paymentPendingProjects = projects.filter((project) => {
    const hasCompletedOnboarding = 
      project.currentPhase !== 'ONBOARDING_QUESTIONNAIRE' &&
      project.completedPhases?.includes('ONBOARDING_QUESTIONNAIRE');
    
    const hasCompletedFileUploads = 
      project.currentPhase !== 'FILE_UPLOADS' &&
      project.completedPhases?.includes('FILE_UPLOADS');
    
    return (
      needsQuestionnaire(project) && 
      !hasCompletedPayment(project) &&
      hasCompletedOnboarding &&
      hasCompletedFileUploads
    );
  });

  useEffect(() => {
    if (!showQuestionnaire && selectedProject) {
      const refreshProjects = async () => {
        await loadProjects();
        setSelectedProject(null);
      };
      refreshProjects();
    }
  }, [showQuestionnaire, selectedProject]);

  // ✅ FIX: Add useEffect to clear flags when no projects need questionnaire
  useEffect(() => {
    const projectsNeedingQuestionnaire = projects.filter((project) =>
      needsQuestionnaire(project)
    );

    if (projectsNeedingQuestionnaire.length === 0) {
      // No projects need questionnaire, clear any leftover flags
      localStorage.removeItem("paymentCompleted");
      localStorage.removeItem("paymentProjectId");
    }
  }, [projects]);

  // Show loading state if tour is still loading
  if (tourLoading || loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Combined Tour - Only show if not completed */}
      {!hasCompletedTour('combined') && <CombinedTour />}
      
      {/* Tour Prompt Modal is handled in TourContext */}
      
      {/* Mobile Header */}
            {/* Mobile Header - REMOVED sticky positioning */}
      <div className="lg:hidden bg-background border-b border-border p-4 dashboard-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Design Studio</h1>
            <p className="text-sm text-muted-foreground">Welcome back!</p>
          </div>
          <div className="flex items-center gap-2">
            <TourTrigger />
            {/* Customize Dashboard Button - Mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomizeModal(true)}
              className="flex items-center justify-center"
            >
              <Settings className="h-4 w-4" />
            </Button>
            {/* Pending Projects Badge - Mobile */}
            {!loading && pendingProjects.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleShowPendingModal}
                size="sm"
                className="relative flex items-center justify-center"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center p-0 text-xs"
                >
                  {pendingProjects.length}
                </Badge>
              </Button>
            )}
            <Button
              onClick={() => router.push("/dashboard/projects/new")}
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header Section - Clean & Minimal */}
        <div className="animate-slide-up dashboard-header">
          <div className="hidden lg:flex items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage your interior design projects
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TourTrigger />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomizeModal(true)}
                className="h-9 px-3 text-muted-foreground hover:text-foreground"
              >
                <Settings className="w-4 h-4" />
              </Button>
              {!loading && pendingProjects.length > 0 && (
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleShowPendingModal}
                  className="h-9 px-3 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  <AlertTriangle className="w-4 h-4 mr-1.5" />
                  {pendingProjects.length} Pending
                </Button>
              )}
              <Link href="/dashboard/projects/new" className="new-project-btn">
                <Button
                  size="sm"
                  className="h-9 bg-foreground hover:bg-foreground/90 text-background font-medium"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>

          {/* Action Alerts - Clean Minimal */}
          {(priorityProjects.length > 0 || paymentPendingProjects.length > 0 || projects.filter(p => p.needsOnboarding).length > 0) && (
            <div className="space-y-2 mb-4 sm:mb-6">
              {/* Design Preferences Alert */}
              {priorityProjects.length > 0 && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Complete Design Preferences</p>
                      <p className="text-xs text-muted-foreground">{priorityProjects.length} project{priorityProjects.length > 1 ? 's' : ''} waiting</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedProject(priorityProjects[0]);
                      setShowQuestionnaire(true);
                    }}
                    className="h-8 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium flex-shrink-0"
                  >
                    Start
                  </Button>
                </div>
              )}

              {/* Payment Alert */}
              {paymentPendingProjects.length > 0 && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Payment Required</p>
                      <p className="text-xs text-muted-foreground">{paymentPendingProjects.length} project{paymentPendingProjects.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const project = paymentPendingProjects[0];
                      if (project) {
                        router.push(`/packages?type=new-project&projectId=${project.id}`);
                      }
                    }}
                    className="h-8 px-3 text-xs font-medium flex-shrink-0"
                  >
                    Pay Now
                  </Button>
                </div>
              )}

              {/* Onboarding Alert */}
              {projects.filter(p => p.needsOnboarding).length > 0 && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Complete Onboarding</p>
                      <p className="text-xs text-muted-foreground">{projects.filter(p => p.needsOnboarding).length} project{projects.filter(p => p.needsOnboarding).length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const project = projects.find(p => p.needsOnboarding);
                      if (project) {
                        setOnboardingProject(project);
                        setShowOnboardingModal(true);
                      }
                    }}
                    className="h-8 px-3 text-xs font-medium flex-shrink-0"
                  >
                    Start
                  </Button>
                </div>
              )}
            </div>
          )}

          <DashboardNotifications />

          {/* Quick Actions - Clean Minimal Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6 quick-actions">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={() =>
                    action.action
                      ? handleQuickAction(action.action)
                      : router.push(action.href)
                  }
                  className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-muted-foreground/20 transition-all duration-200 touch-manipulation active:scale-95 group"
                >
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${action.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                    <Icon className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${action.iconColor}`} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-medium text-foreground">
                      {action.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                      {action.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Dashboard Content - Active Projects Section */}
        {dashboardSettings.showActiveProjects && (
        <Card className="border-border bg-card">
          <CardHeader className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 pb-3 sm:pb-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg lg:text-xl mb-1">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                  <span className="line-clamp-1">Active Projects</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {activeProjects.filter(p => p.needsDesignPreferences).length > 0 && (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      {activeProjects.filter(p => p.needsDesignPreferences).length} need action •{' '}
                    </span>
                  )}
                  {activeProjects.length} project{activeProjects.length !== 1 ? 's' : ''} total
                </CardDescription>
              </div>
              <Link href="/dashboard/projects" className="flex-shrink-0">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-9 sm:h-10 px-2 sm:px-3">
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                  <ArrowRight className="w-3 h-3 sm:ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
            {activeProjects.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {activeProjects.slice(0, 3).map((project) => (
                  <div
                    key={project.publicId}
                    className={`p-3 sm:p-4 border rounded-lg transition-colors cursor-pointer touch-manipulation active:scale-[0.98] ${
                      project.needsDesignPreferences
                        ? 'border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 active:from-amber-100 active:to-orange-100 dark:active:from-amber-950/30 dark:active:to-orange-950/30'
                        : 'border-border active:bg-muted/50'
                    }`}
                    onClick={() => {
                      if (project.needsDesignPreferences) {
                        setSelectedProject(project);
                        setShowQuestionnaire(true);
                      } else {
                        router.push(`/dashboard/projects/${project.publicId}`);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-base sm:text-lg mb-1.5 line-clamp-2">
                          {project.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2.5 line-clamp-1">
                          {project.address || project.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge variant="outline" className="text-xs sm:text-sm px-2 py-0.5">
                            {project.projectType?.replace("_", " ") || "Project"}
                          </Badge>
                          {project.needsDesignPreferences ? (
                            <Badge className="text-xs sm:text-sm bg-amber-500 text-white border-amber-600 px-2 py-0.5">
                              <Brain className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                              Action Required
                            </Badge>
                          ) : project.designStartTime ? (
                            <Badge variant="secondary" className="text-xs sm:text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5">
                              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                              In Progress
                            </Badge>
                          ) : null}
                        </div>
                        {project.needsDesignPreferences && (
                          <p className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300 mb-2.5">
                            ⚠️ Please complete Design Preferences to start the project
                          </p>
                        )}
                      </div>
                      {project.needsDesignPreferences ? (
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-base sm:text-lg animate-pulse">
                            <Brain className="w-7 h-7 sm:w-8 sm:h-8" />
                          </div>
                        </div>
                      ) : project.designStartTime ? (
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-base sm:text-lg">
                            {project.calculatedProgress || 0}%
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {project.needsDesignPreferences ? (
                      <Button
                        className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-white h-11 sm:h-10 text-sm sm:text-base font-semibold"
                        size="lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                          setShowQuestionnaire(true);
                        }}
                      >
                        <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Start Design Preferences
                      </Button>
                    ) : project.designStartTime ? (
                      <div className="mt-3">
                        <Progress 
                          value={project.calculatedProgress || 0} 
                          className="h-2.5 sm:h-2"
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
                {activeProjects.length > 3 && (
                  <Button
                    variant="outline"
                    className="w-full h-11 sm:h-10 text-sm sm:text-base font-semibold"
                    onClick={() => router.push("/dashboard/projects")}
                  >
                    View {activeProjects.length - 3} more project{activeProjects.length - 3 !== 1 ? 's' : ''}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground mb-4">
                  No active projects yet
                </p>
                <Link href="/dashboard/projects/new">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Recent Activity Section - Accordion Style */}
        {dashboardSettings.showActivityTimeline && (
        <Card className="border-border bg-card">
          <CardHeader className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 pb-3 sm:pb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg lg:text-xl mb-1">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0" />
                  <span className="line-clamp-1">Project Activity Timeline</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Track all your projects' progress and next steps
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects
                  .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                  .map((project) => {
                    const steps = getProjectSteps(project);
                    const completedSteps = steps.filter(s => s.completed).length;
                    const totalSteps = steps.length;
                    const isExpanded = expandedProjects.has(project.publicId);
                    const hasPendingSteps = steps.some(s => !s.completed && !s.inProgress);
                    
                    return (
                      <div
                        key={project.publicId}
                        className="border border-border rounded-lg overflow-hidden bg-card"
                      >
                        {/* Accordion Header */}
                        <button
                          onClick={() => toggleProjectAccordion(project.publicId)}
                          className="w-full p-3 sm:p-4 flex items-center justify-between active:bg-muted/50 transition-colors text-left touch-manipulation min-h-[60px] sm:min-h-[70px]"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <h4 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1 flex-1 min-w-0">
                                {project.title}
                              </h4>
                              {hasPendingSteps && (
                                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/20 dark:text-amber-400 flex-shrink-0">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {completedSteps} of {totalSteps} steps completed
                              </p>
                              <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {project.projectType?.replace("_", " ") || "Project"}
                              </p>
                            </div>
                            {/* Progress Bar */}
                            <div className="mt-1.5">
                              <Progress 
                                value={(completedSteps / totalSteps) * 100} 
                                className="h-2 sm:h-1.5"
                              />
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                            )}
                          </div>
                        </button>

                        {/* Accordion Content */}
                        {isExpanded && (
                          <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-border bg-muted/30">
                            <div className="space-y-2.5 sm:space-y-3 mt-2 sm:mt-3">
                              {steps.map((step, index) => {
                                const StepIcon = step.icon;
                                const isCompleted = step.completed;
                                const isInProgress = step.inProgress;
                                const isPending = !isCompleted && !isInProgress;
                                
                                return (
                                  <div
                                    key={step.id}
                                    className={`flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg bg-background border border-border ${
                                      isCompleted && step.actionUrl ? 'active:border-green-300 dark:active:border-green-700 transition-colors' : ''
                                    }`}
                                  >
                                    {/* Timeline Line */}
                                    <div className="flex flex-col items-center flex-shrink-0">
                                      <div
                                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                                          isCompleted
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                            : isInProgress
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 animate-pulse'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                                        }`}
                                      >
                                        {isCompleted ? (
                                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                        ) : (
                                          <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                        )}
                                      </div>
                                      {index < steps.length - 1 && (
                                        <div
                                          className={`w-0.5 flex-1 mt-1.5 ${
                                            isCompleted
                                              ? 'bg-green-300 dark:bg-green-700'
                                              : 'bg-gray-200 dark:bg-gray-700'
                                          }`}
                                          style={{ minHeight: '20px' }}
                                        />
                                      )}
                                    </div>

                                    {/* Step Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                        <div className="flex-1 min-w-0">
                                          <h5
                                            className={`font-semibold text-sm sm:text-base mb-1 ${
                                              isCompleted
                                                ? 'text-green-700 dark:text-green-300'
                                                : isInProgress
                                                ? 'text-blue-700 dark:text-blue-300'
                                                : 'text-muted-foreground'
                                            }`}
                                          >
                                            {step.title}
                                          </h5>
                                          <p className="text-xs sm:text-sm text-muted-foreground">
                                            {step.description}
                                          </p>
                                        </div>
                                        <Badge
                                          variant="outline"
                                          className={`text-xs sm:text-sm flex-shrink-0 self-start sm:self-auto ${
                                            isCompleted
                                              ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400'
                                              : isInProgress
                                              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400'
                                              : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                          }`}
                                        >
                                          {isCompleted
                                            ? 'Completed'
                                            : isInProgress
                                            ? 'In Progress'
                                            : 'Pending'}
                                        </Badge>
                                      </div>
                                      {step.timestamp && (
                                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                                          {isCompleted || isInProgress
                                            ? `${
                                                isCompleted ? 'Completed' : 'Started'
                                              } ${new Date(step.timestamp).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              })}`
                                            : 'Not started yet'}
                                        </p>
                                      )}
                                      {/* Action Button for Completed Steps */}
                                      {isCompleted && step.actionUrl && (
                                        <Link href={step.actionUrl} className="mt-2 inline-block w-full sm:w-auto">
                                          <Button
                                            size="lg"
                                            variant="outline"
                                            className="w-full sm:w-auto h-11 sm:h-10 text-sm sm:text-base font-semibold bg-green-50 hover:bg-green-100 active:bg-green-200 text-green-700 border-green-200 dark:bg-green-950/20 dark:hover:bg-green-950/30 dark:text-green-400 dark:border-green-800 touch-manipulation"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            {step.actionLabel || 'View Details'}
                                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                                          </Button>
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground mb-4">
                  No projects yet
                </p>
                <Link href="/dashboard/projects/new">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Progress Cards for Projects with Design Started */}
        {dashboardSettings.showDesignProgress && projects.filter((p) => p.designStartTime).length > 0 && (
          <Card className="border-border bg-card">
            <CardHeader className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
              <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg lg:text-xl mb-1">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                <span>72-Hour Design Progress</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm lg:text-base">
                Track your project through our 3-phase design process
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
              <div className="space-y-4 sm:space-y-6">
                {projects
                  .filter((p) => p.designStartTime)
                  .map((project) => (
                    <div key={project.publicId} className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base lg:text-lg line-clamp-1 flex-1">
                          {project.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-xs sm:text-sm flex-shrink-0 px-2 py-0.5"
                        >
                          {project.projectType?.replace("_", " ")}
                        </Badge>
                      </div>
                      <ProgressCards project={project} />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Section */}
        <Card className="border-border bg-card projects-section">
          <CardHeader className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <CardTitle className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-foreground">
                  Your Design Projects
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                  Manage and track your interior design journey
                </CardDescription>
              </div>

              {/* Mobile Filter Toggle */}
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="w-full h-11 text-sm sm:text-base font-semibold touch-manipulation"
                >
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Filters & Search
                  {mobileFiltersOpen ? (
                    <X className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                  ) : (
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                  )}
                </Button>
              </div>

              {/* Search and Filters */}
              <div
                className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block`}
              >
                <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 sm:pl-10 h-11 sm:h-10 text-sm sm:text-base border-border bg-background w-full"
                    />
                  </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-1 bg-muted p-1 rounded-lg self-start">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="lg"
                        onClick={() => setViewMode("grid")}
                        className="px-3 sm:px-4 h-11 sm:h-10 touch-manipulation"
                      >
                        <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="lg"
                        onClick={() => setViewMode("list")}
                        className="px-3 sm:px-4 h-11 sm:h-10 touch-manipulation"
                      >
                        <List className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
            {filteredProjects.length > 0 ? (
              <div
                className={`grid gap-4 lg:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredProjects.map((project, index) => (
                  // <ProjectCard
                  //   key={project.publicId}
                  //   project={project}
                  //   viewMode={viewMode}
                  //   onStartQuestionnaire={(proj) => {
                  //     // ✅ Only allow starting questionnaire if payment completed
                  //     if (hasCompletedPayment(proj)) {
                  //       setSelectedProject(proj);
                  //       setShowQuestionnaire(true);
                  //     } else {
                  //       toast.info("Please complete payment to start design preferences");
                  //     }
                  //   }}
                  //   isHighlighted={
                  //     selectedProject?.publicId === project.publicId &&
                  //     needsQuestionnaire(project)
                  //   }
                  //   style={{ animationDelay: `${index * 0.1}s` }}
                  // />
                  <ProjectCard
                    key={project.publicId}
                    project={project}
                    viewMode={viewMode}
                    onStartQuestionnaire={(proj) => {
                      if (hasCompletedPayment(proj)) {
                        setSelectedProject(proj);
                        setShowQuestionnaire(true);
                      } else {
                        toast.info("Please complete payment to start design preferences");
                      }
                    }}
                    onStartOnboarding={(proj) => {
                      setOnboardingProject(proj);
                      setShowOnboardingModal(true);
                    }}
                    isHighlighted={
                      selectedProject?.publicId === project.publicId &&
                      needsQuestionnaire(project)
                    }
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                onNewProject={() => router.push("/dashboard/projects/new")}
              />
            )}
          </CardContent>
        </Card>

        {/* Questionnaire Modal */}
        {showQuestionnaire && selectedProject && (
          <QuestionnaireModal
            project={selectedProject}
            onComplete={handleQuestionnaireComplete}
            onClose={handleQuestionnaireClose}
          />
        )}

        {/* Celebration Screen */}
        {showCelebration && activeProject && (
          <CelebrationScreen
            project={activeProject}
            onClose={handleCelebrationClose}
          />
        )}

        {/* ✅ NEW: Onboarding Modal */}
        {showOnboardingModal && onboardingProject && (
          <OnboardingModal
            isOpen={showOnboardingModal}
            onClose={() => {
              setShowOnboardingModal(false);
              setOnboardingProject(null);
            }}
            onComplete={() => handleOnboardingComplete(onboardingProject.id)}
            projectId={onboardingProject.id}
          />
        )}

        {/* Pending Steps Modal */}
        <PendingStepsModal
          isOpen={showPendingModal}
          onClose={handleCloseModal}
          pendingProjects={pendingProjects}
          onResumeProject={handleResumeProject}
        />

        {/* Floating Customize Dashboard Button - Mobile-First */}
        {/* <Button
          onClick={() => setShowCustomizeModal(true)}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 sm:h-12 sm:w-auto sm:px-4 rounded-full sm:rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all group flex items-center justify-center gap-2 touch-manipulation"
          size="lg"
        >
          <Settings className="w-5 h-5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform" />
          <span className="hidden sm:inline font-semibold">Customize</span>
        </Button> */}

        {/* Customize Dashboard Modal - Mobile-First */}
        <Dialog open={showCustomizeModal} onOpenChange={setShowCustomizeModal}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                Customize Dashboard
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Choose which sections to show or hide on your dashboard
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
              <div 
                className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg active:bg-muted/50 transition-colors touch-manipulation"
                onClick={() =>
                  saveDashboardSettings({
                    ...dashboardSettings,
                    showActiveProjects: !dashboardSettings.showActiveProjects,
                  })
                }
              >
                <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="active-projects" className="text-sm sm:text-base font-semibold cursor-pointer block">
                      Active Projects
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Show your active projects with progress
                    </p>
                  </div>
                </div>
                <Switch
                  id="active-projects"
                  checked={dashboardSettings.showActiveProjects}
                  onCheckedChange={(checked) =>
                    saveDashboardSettings({
                      ...dashboardSettings,
                      showActiveProjects: checked,
                    })
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div 
                className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg active:bg-muted/50 transition-colors touch-manipulation"
                onClick={() =>
                  saveDashboardSettings({
                    ...dashboardSettings,
                    showActivityTimeline: !dashboardSettings.showActivityTimeline,
                  })
                }
              >
                <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="activity-timeline" className="text-sm sm:text-base font-semibold cursor-pointer block">
                      Project Activity Timeline
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Track all project steps and progress
                    </p>
                  </div>
                </div>
                <Switch
                  id="activity-timeline"
                  checked={dashboardSettings.showActivityTimeline}
                  onCheckedChange={(checked) =>
                    saveDashboardSettings({
                      ...dashboardSettings,
                      showActivityTimeline: checked,
                    })
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div 
                className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg active:bg-muted/50 transition-colors touch-manipulation"
                onClick={() =>
                  saveDashboardSettings({
                    ...dashboardSettings,
                    showDesignProgress: !dashboardSettings.showDesignProgress,
                  })
                }
              >
                <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="design-progress" className="text-sm sm:text-base font-semibold cursor-pointer block">
                      72-Hour Design Progress
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Detailed 3-phase design progress tracking
                    </p>
                  </div>
                </div>
                <Switch
                  id="design-progress"
                  checked={dashboardSettings.showDesignProgress}
                  onCheckedChange={(checked) =>
                    saveDashboardSettings({
                      ...dashboardSettings,
                      showDesignProgress: checked,
                    })
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 sm:pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowCustomizeModal(false)}
                className="w-full sm:w-auto h-11 sm:h-10 text-sm sm:text-base font-semibold touch-manipulation"
                size="lg"
              >
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Skeleton Loader
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      {/* Mobile Skeleton Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-background border-b border-border p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-32 bg-muted mb-1" />
            <Skeleton className="h-4 w-24 bg-muted" />
          </div>
          <Skeleton className="h-9 w-9 rounded-md bg-muted" />
        </div>
      </div>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Desktop Header Skeleton */}
        <div className="hidden lg:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <Skeleton className="h-8 w-64 bg-muted mb-2" />
            <Skeleton className="h-5 w-48 bg-muted" />
          </div>
          <Skeleton className="h-10 w-32 bg-muted" />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 bg-muted mb-1" />
                    <Skeleton className="h-3 w-16 bg-muted" />
                  </div>
                  <Skeleton className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-16 bg-muted mb-2" />
                    <Skeleton className="h-6 lg:h-8 w-12 bg-muted mb-1" />
                    <Skeleton className="h-3 w-20 bg-muted mb-1" />
                    <Skeleton className="h-3 w-16 bg-muted" />
                  </div>
                  <Skeleton className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects Skeleton */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-7 w-40 bg-muted" />
            <Skeleton className="h-9 w-32 bg-muted" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg" />
                <CardHeader className="p-4">
                  <Skeleton className="h-5 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted mt-2" />
                  <Skeleton className="h-4 w-2/3 bg-muted mt-1" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20 bg-muted" />
                    <Skeleton className="h-4 w-16 bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ searchQuery, statusFilter, onNewProject }) {
  return (
    <div className="text-center py-8 lg:py-12">
      <div className="mx-auto w-16 h-16 lg:w-24 lg:h-24 bg-muted rounded-full flex items-center justify-center mb-4">
        <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg lg:text-xl font-semibold mb-2 text-foreground">
        {searchQuery || statusFilter !== "all"
          ? "No projects found"
          : "No projects yet"}
      </h3>
      <p className="text-muted-foreground mb-6 text-sm lg:text-base max-w-md mx-auto">
        {searchQuery || statusFilter !== "all"
          ? "Try adjusting your search or filters"
          : "Start your interior design journey by creating your first project"}
      </p>
      {!searchQuery && statusFilter === "all" && (
        <Button
          onClick={onNewProject}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          size="lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Project
        </Button>
      )}
    </div>
  );
}