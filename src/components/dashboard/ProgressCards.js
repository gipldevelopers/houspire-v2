// src\components\dashboard\ProgressCards.js
"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Image,
  IndianRupee,
  Users,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  Rocket,
  Zap,
  Sparkles,
  Timer,
  Calendar,
  ArrowRight,
  Crown,
  BadgeCheck,
  TrendingUp,
  Loader2,
  FileText,
  Hammer,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projectService } from "@/services/project.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ProgressCards = ({ project }) => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredPhase, setHoveredPhase] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

    // ✅ FIXED: DETERMINE PLAN TYPE FROM selectedPlan FIELD
  const isSingleRoomPlan = project?.selectedPlan === 'Single Room Trial' || 
                          project?.selectedPlan?.toLowerCase().includes('single room') ||
                          project?.selectedPlan?.toLowerCase().includes('499');
  
  const totalHours = isSingleRoomPlan ? 48 : 72; // 48 hours for single room, 72 for regular
  const phaseHours = isSingleRoomPlan ? 16 : 24; // 16 hours per phase for single room

  // ✅ Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ FIX: Ensure we have a valid project ID
  const projectPublicId = project?.publicId || project?.id;
   const phases = [
    {
      id: "renders",
      title: "3D Renders",
      description: isSingleRoomPlan ? "Single room visualization" : "Professional-grade visualizations",
      icon: Image,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-700 dark:text-blue-300",
      duration: phaseHours, // ✅ Dynamic duration
      nextPhase: "BUDGET",
      features: isSingleRoomPlan 
        ? ["Single room render", "Quick turnaround", "Style preview", "Instant preview"]
        : ["Photorealistic renders", "Multiple angles", "Style application", "Instant preview"],
      adminAction: "Mark renders as completed",
    },
    {
      id: "budget",
      title: "Budget Analysis",
      description: isSingleRoomPlan ? "Quick cost estimation" : "Smart cost estimation",
      icon: FileText,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-700 dark:text-green-300",
      duration: phaseHours, // ✅ Dynamic duration
      nextPhase: "VENDORS",
      features: isSingleRoomPlan
        ? ["Room cost breakdown", "Material estimates", "Quick budget", "Optimized pricing"]
        : ["Cost breakdown", "Material pricing", "Labor estimates", "Budget optimization"],
      adminAction: "Send BOQ to client",
    },
    {
      id: "vendors",
      title: "Vendor Matching",
      description: "Curated professional partners",
      icon: Hammer,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-700 dark:text-purple-300",
      duration: phaseHours, // ✅ Dynamic duration
      nextPhase: "COMPLETED",
      features: isSingleRoomPlan
        ? ["Local partners", "Quick quotes", "Fast execution", "Single room specialists"]
        : ["Verified partners", "Best pricing", "Quality assurance", "Fast delivery"],
      adminAction: "Assign vendors to project",
    },
  ];

  // ✅ FIX: Load enhanced progress data from API with proper project ID
  const loadProgressData = async () => {
    if (!projectPublicId) {
      console.error("❌ No project ID available");
      return;
    }

    setRefreshing(true);
    try {
      // Try enhanced progress first
      const result = await projectService.getEnhancedProjectProgress(projectPublicId);

      if (result.success && result.data?.progress) {
        const progress = result.data.progress;
        setProgressData(progress);
      } else {
        console.error("Failed to load enhanced progress:", result.message);
        // Fallback to basic progress
        await loadBasicProgress();
      }
    } catch (error) {
      console.error("Error loading enhanced progress data:", error);
      // Fallback to basic progress
      await loadBasicProgress();
    } finally {
      setRefreshing(false);
    }
  };

  // Fallback to basic progress
  const loadBasicProgress = async () => {
    try {
      const result = await projectService.getProjectProgress(projectPublicId);
      if (result.success && result.data?.progress) {
        setProgressData(result.data.progress);
      }
    } catch (error) {
      console.error("Error loading basic progress:", error);
    }
  };
  const calculatePhaseTimeRemaining = (phaseId) => {
    if (!progressData?.designStartTime) {
      return { hours: phaseHours, minutes: 0, seconds: 0 };
    }

    const now = new Date();
    
    // ✅ FIXED: Use actual phase start times from backend
    const phaseStartTimes = {
      'renders': progressData.rendersStartTime ? new Date(progressData.rendersStartTime) : new Date(progressData.designStartTime),
      'budget': progressData.budgetStartTime ? new Date(progressData.budgetStartTime) : new Date(new Date(progressData.designStartTime).getTime() + (phaseHours * 60 * 60 * 1000)),
      'vendors': progressData.vendorsStartTime ? new Date(progressData.vendorsStartTime) : new Date(new Date(progressData.designStartTime).getTime() + (2 * phaseHours * 60 * 60 * 1000))
    };

    const phaseStart = phaseStartTimes[phaseId];
    const phaseEnd = new Date(phaseStart.getTime() + (phaseHours * 60 * 60 * 1000));

    // If phase hasn't started yet
    if (!phaseStart || now < phaseStart) {
      return { hours: phaseHours, minutes: 0, seconds: 0 };
    }

    // If phase is completed (by admin action or time)
    const isPhaseCompleted = getPhaseStatus(phaseId) === 'completed';
    if (isPhaseCompleted || now >= phaseEnd) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    // Calculate remaining time for active phase
    const remaining = Math.max(0, phaseEnd - now);
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return { 
      hours: Math.max(0, hours), 
      minutes: Math.max(0, minutes), 
      seconds: Math.max(0, seconds) 
    };
  };
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
    const phaseDuration = phaseHours * 60 * 60 * 1000; // Dynamic hours in milliseconds

    // If phase hasn't started yet
    if (!phaseStart || now < phaseStart) return 0;

    // If phase is completed (by admin action)
    const isPhaseCompleted = getPhaseStatus(phaseId) === 'completed';
    if (isPhaseCompleted) return 100;

    // ✅ FIXED: Check if phase should be completed based on time
    const phaseEnd = new Date(phaseStart.getTime() + phaseDuration);
    if (now >= phaseEnd) return 100;

    // Calculate progress based on time elapsed
    const elapsed = Math.min(now - phaseStart, phaseDuration);
    const progress = (elapsed / phaseDuration) * 100;

    return Math.round(progress);
  };

  // Add this useEffect to auto-refresh progress when phases change
  useEffect(() => {
    if (progressData?.currentProgressPhase === 'RENDERS' && 
        progressData?.rendersStatus === 'COMPLETED') {
      // Auto-refresh progress data when renders are completed
      loadProgressData();
    }
  }, [progressData?.rendersStatus, progressData?.currentProgressPhase]);

  // Load progress data when project changes
  useEffect(() => {
    if (projectPublicId) {
      loadProgressData();
    }
  }, [projectPublicId]);

  // ✅ FIX: Real-time countdown for each phase
  useEffect(() => {
    if (!progressData?.designStartTime) return;

    const interval = setInterval(() => {
      // Force re-render to update timers
      setProgressData(prev => ({ ...prev, _timestamp: Date.now() }));
    }, 1000);

    // API calls for real-time updates every 30 seconds
    const apiInterval = setInterval(() => {
      loadProgressData();
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(apiInterval);
    };
  }, [progressData?.designStartTime]);

  const formatTimeLeft = (timeObj) => {
    return {
      hours: timeObj.hours.toString().padStart(2, '0'),
      minutes: timeObj.minutes.toString().padStart(2, '0'),
      seconds: timeObj.seconds.toString().padStart(2, '0')
    };
  };

  // ✅ FIX: Get phase status based on actual completion from backend
  const getPhaseStatus = (phaseId) => {
    if (!progressData) return "upcoming";

    // First check backend completion status from enhanced data
    if (progressData.progressData?.phases?.[phaseId]?.completed) {
      return "completed";
    }

    // Check basic completion status from direct fields
    const phaseCompletions = {
      'renders': progressData.rendersStatus === 'COMPLETED' || progressData.rendersCompletedAt,
      'budget': progressData.boqStatus === 'SENT' || progressData.budgetCompletedAt,
      'vendors': progressData.vendorListStatus === 'SENT' || progressData.vendorsCompletedAt
    };

    if (phaseCompletions[phaseId]) {
      return "completed";
    }

    // ✅ FIX: Check current phase from backend data
    const currentPhase = progressData.currentProgressPhase?.toLowerCase();
    
    if (currentPhase === phaseId) {
      return "active";
    }

    // If this phase is before the current phase, it should be completed
    const phaseOrder = ['renders', 'budget', 'vendors'];
    const currentPhaseIndex = phaseOrder.indexOf(currentPhase);
    const phaseIndex = phaseOrder.indexOf(phaseId);
    
    if (phaseIndex < currentPhaseIndex) {
      return "completed";
    }
    
    if (phaseIndex > currentPhaseIndex) {
      return "upcoming";
    }

    return "upcoming";
  };

  // ✅ FIX: Get items count for each phase
  const getPhaseItemsCount = (phaseId) => {
    if (!progressData?.progressData?.phases) return 0;
    return progressData.progressData.phases[phaseId]?.itemsCount || 0;
  };

  const handleManualComplete = async (phaseId) => {
    if (loading || !projectPublicId) return;

    setLoading(true);
    try {
      const phase = phases.find((p) => p.id === phaseId);

      const result = await projectService.updateProjectProgress(
        projectPublicId,
        {
          phase: phase.nextPhase,
        }
      );

      if (result.success) {
        toast.success(`${phase.title} phase completed! Moving to next phase.`);
        await loadProgressData(); // Refresh data
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error completing phase:", error);
      toast.error(error.message || "Failed to complete phase");
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeProgress = async () => {
    if (!projectPublicId) return;

    setLoading(true);
    try {
      const result = await projectService.initializeProjectProgress(
        projectPublicId
      );

      if (result.success) {
        toast.success(
          "Design progress started! Your 72-hour timeline has begun."
        );
        await loadProgressData();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error initializing progress:", error);
      toast.error(error.message || "Failed to start design progress");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        badge:
          "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        progress: "bg-blue-500",
        icon: "text-blue-600",
        pulse: true,
      },
      completed: {
        badge:
          "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800",
        progress: "bg-green-500",
        icon: "text-green-600",
        pulse: false,
      },
      upcoming: {
        badge:
          "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
        progress: "bg-gray-300",
        icon: "text-gray-400",
        pulse: false,
      },
    };
    return configs[status] || configs.upcoming;
  };

  // Calculate overall progress percentage
  const calculateOverallProgress = () => {
    if (!progressData) return 0;
    
    const phaseProgresses = phases.map(phase => calculatePhaseProgress(phase.id));
    const averageProgress = phaseProgresses.reduce((sum, progress) => sum + progress, 0) / phases.length;
    
    return Math.round(averageProgress);
  };

  // Mobile-optimized timer component
  const MobileTimer = ({ timeLeft, formattedTime }) => (
    <div className="text-center space-y-2 mb-3">
      <div className="flex justify-center gap-1">
        {["hours", "minutes", "seconds"].map((unit, index) => (
          <div key={unit} className="text-center">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded px-2 py-1.5 min-w-[2.5rem] shadow-md">
              <span className="text-sm font-mono font-bold tracking-tighter">
                {formattedTime[unit]}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 capitalize">
              {unit.charAt(0)}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
        <Zap className="w-3 h-3" />
        In progress...
      </p>
    </div>
  );

  // Desktop timer component
  const DesktopTimer = ({ timeLeft, formattedTime, phase }) => (
    <div className="text-center space-y-3 mb-4">
      <div className="flex justify-center gap-2 mb-2">
        {["hours", "minutes", "seconds"].map((unit, index) => (
          <div key={unit} className="text-center">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-lg px-3 py-2 min-w-[3.5rem] shadow-lg">
              <span className="text-lg font-mono font-bold tracking-tighter">
                {formattedTime[unit]}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 capitalize font-medium">
              {unit}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
        <Zap className="w-4 h-4" />
        {phase.title} in progress...
      </p>
      {/* <p className="text-xs text-gray-500 dark:text-gray-400">
        {24 - timeLeft.hours}h elapsed of 24h total
      </p> */}
    </div>
  );

  // Show initialization card if payment is completed but progress not started
  if (!project.designStartTime && project.paymentStatus === "COMPLETED") {
    return (
      <Card className="border-2 border-dashed border-amber-300 bg-amber-50 dark:bg-amber-950/10 hover:border-amber-400 transition-all duration-300 mx-2 md:mx-0">
        <CardContent className="p-4 md:p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4">
            <div className="p-3 md:p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Rocket className="w-8 h-8 md:w-12 md:h-12 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-amber-900 dark:text-amber-100 mb-1 md:mb-2">
                Ready to Start Design Process?
              </h3>
              <p className="text-xs md:text-sm text-amber-700 dark:text-amber-300 mb-4 md:mb-6 max-w-md">
                Begin your 72-hour design journey. We'll create 3D renders,
                budget analysis, and connect you with verified vendors.
              </p>
            </div>
            <Button
              onClick={handleInitializeProgress}
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 md:px-8 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm md:text-base w-full md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 md:w-4 md:h-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  Start 72-Hour Design Process
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show placeholder if no design start time and payment not completed
  if (!project.designStartTime) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 mx-2 md:mx-0">
        <CardContent className="p-4 md:p-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-2 md:space-y-3">
            <Clock className="w-8 h-8 md:w-10 md:h-10 text-gray-400 dark:text-gray-600" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base">
              Design Progress
            </h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              Complete payment to start the design process
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error if no project ID
  if (!projectPublicId) {
    return (
      <Card className="border border-red-200 bg-red-50 dark:bg-red-950/20 mx-2 md:mx-0">
        <CardContent className="p-4 md:p-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-2 md:space-y-3">
            <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
            <h3 className="font-semibold text-red-700 dark:text-red-300 text-sm md:text-base">
              Project Error
            </h3>
            <p className="text-xs md:text-sm text-red-600 dark:text-red-400">
              Unable to load project progress. Project ID is missing.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Overall Progress Header */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-100 dark:border-blue-800 mx-2 md:mx-0">
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Timer className="w-4 h-4 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
          </div>
         <div className="flex flex-col items-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              {isSingleRoomPlan ? "48-Hour Quick Design" : "72-Hour Design Progress"}
            </h3>
            {isSingleRoomPlan && (
              <Badge className="mt-1 bg-amber-500 hover:bg-amber-600 text-white text-xs">
                Single Room Plan
              </Badge>
            )}
          </div>
          {refreshing && (
            <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin text-blue-600" />
          )}
        </div>

         <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-3 px-2 md:px-4">
          <span>Started</span>
          <span className="font-medium text-blue-600 dark:text-blue-400 text-base md:text-lg">
            {calculateOverallProgress()}% Complete
          </span>
          <span>{totalHours} Hours</span>
        </div>
         <Progress
          value={calculateOverallProgress()}
          className="h-2 md:h-3 bg-gray-200 dark:bg-gray-700 rounded-full"
        />

        {/* Timeline markers */}
        <div className="flex justify-between text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1 md:mt-2 px-1 md:px-2">
          <span className="text-center flex-1">Renders<br />({phaseHours}h)</span>
          <span className="text-center flex-1">Budget<br />({phaseHours}h)</span>
          <span className="text-center flex-1">Vendors<br />({phaseHours}h)</span>
        </div>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-1 gap-3 md:gap-5 md:grid-cols-3">
        {phases.map((phase) => {
          const status = getPhaseStatus(phase.id);
          const PhaseIcon = phase.icon;
          const config = getStatusConfig(status);
          const isActive = status === "active";
          const isCompleted = status === "completed";
          const isUpcoming = status === "upcoming";

          const phaseProgress = calculatePhaseProgress(phase.id);
          const itemsCount = getPhaseItemsCount(phase.id);
          const timeLeft = calculatePhaseTimeRemaining(phase.id);
          const formattedTime = formatTimeLeft(timeLeft);

          return (
            <Card
              key={phase.id}
              className={cn(
                "relative overflow-hidden transition-all duration-500",
                "border-2 backdrop-blur-sm mx-2 md:mx-0",
                isActive && "shadow-xl md:shadow-2xl shadow-blue-500/20 border-blue-300",
                isCompleted && "shadow-lg shadow-green-500/10 border-green-300",
                isUpcoming && "border-gray-200 dark:border-gray-700 opacity-80",
                !isMobile && "hover:scale-105 group cursor-pointer"
              )}
              onMouseEnter={!isMobile ? () => setHoveredPhase(phase.id) : undefined}
              onMouseLeave={!isMobile ? () => setHoveredPhase(null) : undefined}
            >
              {/* Animated Background */}
              <div
                className={cn(
                  "absolute inset-0 transition-all duration-500",
                  isActive && "bg-gradient-to-br from-blue-500/5 to-cyan-500/5",
                  isCompleted &&
                    "bg-gradient-to-br from-green-500/5 to-emerald-500/5",
                  isUpcoming &&
                    "bg-gradient-to-br from-gray-500/5 to-gray-400/5"
                )}
              />

              {/* Status Glow Effect */}
              {isActive && (
                <div className="absolute inset-0 bg-blue-500/10 rounded-lg animate-pulse" />
              )}

              <CardContent className="p-3 md:p-5 relative z-10">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <div
                      className={cn(
                        "p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-300",
                        "shadow-md md:shadow-lg flex-shrink-0",
                        isActive &&
                          "bg-blue-100 dark:bg-blue-900/40 shadow-blue-500/25",
                        isCompleted &&
                          "bg-green-100 dark:bg-green-900/40 shadow-green-500/25",
                        isUpcoming &&
                          "bg-gray-100 dark:bg-gray-800 shadow-gray-500/25",
                        !isMobile && "group-hover:scale-110"
                      )}
                    >
                      <PhaseIcon
                        className={cn(
                          "w-4 h-4 md:w-6 md:h-6 transition-all duration-300",
                          config.icon
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                        <h4
                          className={cn(
                            "font-bold text-sm md:text-lg truncate",
                            isActive && "text-blue-900 dark:text-blue-100",
                            isCompleted && "text-green-900 dark:text-green-100",
                            isUpcoming && "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {phase.title}
                        </h4>
                        {isActive && !isMobile && (
                          <div className="flex-shrink-0">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-ping" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div
                    className={cn(
                      "flex-shrink-0 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-bold transition-all duration-300",
                      "border shadow-sm ml-2",
                      isActive && "bg-blue-500 text-white border-blue-600",
                      isCompleted && "bg-green-500 text-white border-green-600",
                      isUpcoming && "bg-gray-400 text-white border-gray-500"
                    )}
                  >
                    {phase.duration}h
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-semibold px-2 py-1 md:px-3 md:py-1.5 border transition-all duration-300",
                      config.badge,
                      isActive && !isMobile && "animate-pulse"
                    )}
                  >
                    {isActive && <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />}
                    {isCompleted && <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />}
                    {isActive
                      ? "Active"
                      : isCompleted
                      ? "Completed"
                      : "Upcoming"}
                  </Badge>

                  {/* Progress Percentage */}
                  <span
                    className={cn(
                      "text-sm font-bold transition-all duration-300",
                      isActive && "text-blue-600 dark:text-blue-400",
                      isCompleted && "text-green-600 dark:text-green-400",
                      isUpcoming && "text-gray-400"
                    )}
                  >
                    {phaseProgress}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
                  <Progress
                    value={phaseProgress}
                    className={cn(
                      "h-1.5 md:h-2.5 rounded-full transition-all duration-500",
                      isActive &&
                        "[&>div]:bg-gradient-to-r from-blue-500 to-cyan-500",
                      isCompleted &&
                        "[&>div]:bg-gradient-to-r from-green-500 to-emerald-500",
                      isUpcoming && "[&>div]:bg-gray-300"
                    )}
                  />
                </div>

                {/* Timer or Status Content */}
                {isActive && (
                  <>
                    {isMobile ? (
                      <MobileTimer timeLeft={timeLeft} formattedTime={formattedTime} />
                    ) : (
                      <DesktopTimer timeLeft={timeLeft} formattedTime={formattedTime} phase={phase} />
                    )}
                  </>
                )}

                {isCompleted && (
                  <div className="text-center space-y-2 md:space-y-3 mb-3 md:mb-4">
                    <div className="flex justify-center">
                      <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <CheckCircle2 className="w-5 h-5 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-green-600 dark:text-green-400">
                      {isMobile ? 'Completed' : `${phase.title} completed`}
                    </p>
                    {/* {itemsCount > 0 && (
                      <p className="text-[10px] md:text-xs text-green-700 dark:text-green-300">
                        {itemsCount} {itemsCount === 1 ? 'item' : 'items'} delivered
                      </p>
                    )} */}
                  </div>
                )}

                {isUpcoming && (
                  <div className="text-center space-y-2 md:space-y-3 mb-3 md:mb-4">
                    <div className="flex justify-center">
                      <div className="p-2 md:p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                        <Clock className="w-5 h-5 md:w-8 md:h-8 text-gray-400 dark:text-gray-600" />
                      </div>
                    </div>
                    {/* <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                      Starting in {Math.max(0, 24 - (calculatePhaseProgress(phase.id) / 100 * 24)).toFixed(1)}h
                    </p> */}
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                      Waiting for previous phase
                    </p>
                  </div>
                )}

                {/* Action Button */}
                {isActive && phaseProgress >= 95 && (
                  <Button
                    size={isMobile ? "sm" : "default"}
                    className={cn(
                      "w-full font-semibold transition-all duration-300",
                      "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
                      "text-white shadow-lg hover:shadow-xl text-xs md:text-sm",
                      !isMobile && "hover:scale-105"
                    )}
                    onClick={() => handleManualComplete(phase.id)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 animate-spin" />
                        {isMobile ? '...' : 'Completing...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        {isMobile ? 'Complete' : `Complete ${phase.title}`}
                      </>
                    )}
                  </Button>
                )}

                {/* Features List on Hover (Desktop only) */}
                {!isMobile && hoveredPhase === phase.id && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 md:p-4 flex flex-col justify-center">
                    <h5 className="font-semibold text-center mb-2 md:mb-3 text-gray-900 dark:text-white text-sm md:text-base">
                      What's Included
                    </h5>
                    <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                      {phase.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-1 md:gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <BadgeCheck className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mobile tap to see features */}
                {isMobile && (
                  <div className="mt-2 text-center">
                    <button
                      onClick={() => setHoveredPhase(hoveredPhase === phase.id ? null : phase.id)}
                      className="text-xs text-blue-600 dark:text-blue-400 font-medium"
                    >
                      {hoveredPhase === phase.id ? 'Hide details' : 'See features'}
                    </button>
                  </div>
                )}

                {/* Mobile features list */}
                {isMobile && hoveredPhase === phase.id && (
                  <div className="mt-3 p-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg">
                    <h5 className="font-semibold text-center mb-2 text-gray-900 dark:text-white text-sm">
                      What's Included
                    </h5>
                    <ul className="space-y-1.5 text-xs">
                      {phase.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <BadgeCheck className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>

              {/* Corner Accent */}
              <div
                className={cn(
                  "absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 rounded-bl-full transition-all duration-300",
                  isActive && "bg-blue-500",
                  isCompleted && "bg-green-500",
                  isUpcoming && "bg-gray-400"
                )}
              />
            </Card>
          );
        })}
      </div>

      {/* Progress Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-lg md:rounded-xl p-3 md:p-4 backdrop-blur-sm mx-2 md:mx-0">
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Active Phase</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-400 rounded-full"></div>
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressCards;