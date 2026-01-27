// // src/components/dashboard/ProjectCard.js
// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   MoreVertical,
//   Calendar,
//   MapPin,
//   Square,
//   Eye,
//   Edit,
//   Trash2,
//   PlayCircle,
//   Image as ImageIcon,
//   FileText as FileTextIcon,
//   Users,
//   CheckCircle2,
//   AlertCircle,
//   Clock,
//   CreditCard,
//   ArrowRight,
//   Sparkles,
//   Building,
//   Home,
//   Zap,
//   Rocket,
//   Timer,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Progress } from "@/components/ui/progress";
// import { cn } from "@/lib/utils";
// import {
//   getStatusConfig,
//   getProgressValue,
//   needsQuestionnaire,
//   hasCompletedPayment,
// } from "@/constants/projectStatus";
// import { boqService } from "@/services/boq.service";
// import { projectService } from "@/services/project.service";

// const formatDate = (dateString) => {
//   if (!dateString) return "N/A";

//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

//   if (diffInDays === 0) {
//     return "Today";
//   } else if (diffInDays === 1) {
//     return "Yesterday";
//   } else if (diffInDays < 7) {
//     return `${diffInDays} days ago`;
//   } else {
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
//     });
//   }
// };

// // ✅ UPDATED: Enhanced progress tracking based on ACTUAL deliverables status
// const getProjectProgressStatus = (project, enhancedProgress) => {
//   // Define phases with their completion criteria based on ACTUAL deliverables
//   const phases = [
//     {
//       id: "onboarding",
//       title: "Onboarding",
//       completed: project.currentPhase !== 'ONBOARDING_QUESTIONNAIRE' && 
//                 project.completedPhases?.includes('ONBOARDING_QUESTIONNAIRE'),
//       weight: 10 // 10% of total progress
//     },
//     {
//       id: "uploads",
//       title: "File Uploads",
//       completed: project.currentPhase !== 'FILE_UPLOADS' && 
//                 project.completedPhases?.includes('FILE_UPLOADS'),
//       weight: 10 // 10% of total progress
//     },
//     {
//       id: "payment",
//       title: "Payment",
//       completed: hasCompletedPayment(project),
//       weight: 10 // 10% of total progress
//     },
//     {
//       id: "design_questionnaire",
//       title: "Design Preferences",
//       completed: project.designQuestionnaireCompleted || 
//                 project.status === 'DESIGN_QUESTIONNAIRE_COMPLETED',
//       weight: 10 // 10% of total progress
//     },
//     {
//       id: "renders",
//       title: "3D Renders",
//       // ✅ ONLY complete when renders are actually COMPLETED/SENT
//       completed: enhancedProgress?.rendersStatus === 'COMPLETED' || 
//                 enhancedProgress?.rendersStatus === 'SENT',
//       weight: 25 // 25% of total progress
//     },
//     {
//       id: "budget",
//       title: "Budget Analysis",
//       // ✅ ONLY complete when BOQ is actually SENT
//       completed: enhancedProgress?.boqStatus === 'SENT',
//       weight: 25 // 25% of total progress
//     },
//     {
//       id: "vendors",
//       title: "Vendor Matching",
//       // ✅ ONLY complete when vendors are actually SENT
//       completed: enhancedProgress?.vendorListStatus === 'SENT',
//       weight: 10 // 10% of total progress
//     },
//   ];

//   // ✅ UPDATED: Calculate completion percentage based on ACTUAL weights and deliverables status
//   let completionPercentage = 0;
  
//   phases.forEach(phase => {
//     if (phase.completed) {
//       completionPercentage += phase.weight;
//     }
//   });

//   completionPercentage = Math.round(completionPercentage);

//   // Determine current phase and next action based on ACTUAL status
//   let currentPhase = null;
//   let nextAction = null;

//   if (completionPercentage === 100) {
//     currentPhase = "Completed";
//     nextAction = null;
//   } 
//   // ✅ UPDATED: Design in progress only if design started but deliverables not all completed
//   else if (project.designStartTime && completionPercentage < 100) {
//     currentPhase = "Design in Progress";
//     nextAction = {
//       label: "View Progress",
//       type: "progress",
//       priority: "medium"
//     };
//   }
//   else if (project.currentPhase === 'ONBOARDING_QUESTIONNAIRE') {
//     currentPhase = "Onboarding";
//     nextAction = {
//       label: "Complete Onboarding",
//       type: "onboarding",
//       priority: "high"
//     };
//   } else if (project.currentPhase === 'FILE_UPLOADS') {
//     currentPhase = "File Uploads";
//     nextAction = {
//       label: "Upload Files",
//       type: "uploads",
//       priority: "high"
//     };
//   } else if (!hasCompletedPayment(project)) {
//     currentPhase = "Payment Required";
//     nextAction = {
//       label: "Complete Payment",
//       type: "payment",
//       priority: "high"
//     };
//   } else if (needsQuestionnaire(project)) {
//     currentPhase = "Design Preferences";
//     nextAction = {
//       label: "Start Design Preferences",
//       type: "questionnaire",
//       priority: "high"
//     };
//   } else {
//     currentPhase = "Setup Required";
//     nextAction = {
//       label: "Continue Setup",
//       type: "setup",
//       priority: "medium"
//     };
//   }

//   return {
//     phases,
//     completionPercentage,
//     currentPhase,
//     nextAction,
//     isComplete: completionPercentage === 100,
//     // ✅ UPDATED: Design in progress only if not all deliverables are completed
//     isDesignInProgress: !!project.designStartTime && completionPercentage < 100,
//     designStartTime: project.designStartTime,
//   };
// };

// const ProjectThumbnail = ({ project, enhancedProgress, className }) => {
//   const [imageError, setImageError] = useState(false);
//   const progressStatus = getProjectProgressStatus(project, enhancedProgress);
//   const { completionPercentage, isComplete, isDesignInProgress } = progressStatus;

//   // Show project image if available and complete
//   if (project.thumbnailUrl && !imageError && isComplete) {
//     return (
//       <div className={cn("relative w-full h-full", className)}>
//         <img
//           src={project.thumbnailUrl}
//           alt={project.title}
//           className="w-full h-full object-cover"
//           onError={() => setImageError(true)}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
//       </div>
//     );
//   }

//   // Professional placeholder with progress
//   const getProjectTypeIcon = () => {
//     switch (project.projectType) {
//       case 'RESIDENTIAL':
//         return <Home className="w-8 h-8" />;
//       case 'COMMERCIAL':
//         return <Building className="w-8 h-8" />;
//       case 'OFFICE':
//         return <Building className="w-8 h-8" />;
//       default:
//         return <Home className="w-8 h-8" />;
//     }
//   };

//   return (
//     <div
//       className={cn(
//         "w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative",
//         className
//       )}
//     >
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="w-full h-full bg-grid-slate-200 dark:bg-grid-slate-700" />
//       </div>

//       {/* Content */}
//       <div className="relative z-10 text-center space-y-3 p-6">
//         {/* Project Type Icon - Hidden on mobile */}
//         <div className={cn(
//           "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto hidden md:flex",
//           isDesignInProgress 
//             ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
//             : completionPercentage === 100 
//             ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
//             : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
//         )}>
//           {isDesignInProgress ? <Rocket className="w-8 h-8" /> : getProjectTypeIcon()}
//         </div>

//         {/* Progress Circle */}
//         <div className="relative">
//           <div className="w-20 h-20 mx-auto">
//             <svg className="w-full h-full" viewBox="0 0 100 100">
//               {/* Background Circle */}
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="40"
//                 stroke="currentColor"
//                 strokeWidth="8"
//                 fill="none"
//                 className="text-slate-200 dark:text-slate-700"
//               />
//               {/* Progress Circle */}
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="40"
//                 stroke="currentColor"
//                 strokeWidth="8"
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeDasharray="251.2"
//                 strokeDashoffset={251.2 - (251.2 * completionPercentage) / 100}
//                 className={cn(
//                   "transition-all duration-500 ease-out",
//                   isDesignInProgress 
//                     ? "text-blue-500" 
//                     : completionPercentage === 100 
//                     ? "text-green-500" 
//                     : "text-amber-500"
//                 )}
//                 transform="rotate(-90 50 50)"
//               />
//             </svg>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <span className={cn(
//                 "text-lg font-bold",
//                 isDesignInProgress 
//                   ? "text-blue-600 dark:text-blue-400" 
//                   : completionPercentage === 100 
//                   ? "text-green-600 dark:text-green-400" 
//                   : "text-amber-600 dark:text-amber-400"
//               )}>
//                 {completionPercentage}%
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Status Text */}
//         <div className={cn(
//           "text-sm font-medium",
//           isDesignInProgress 
//             ? "text-blue-700 dark:text-blue-300" 
//             : completionPercentage === 100 
//             ? "text-green-700 dark:text-green-300" 
//             : "text-amber-700 dark:text-amber-300"
//         )}>
//           {isDesignInProgress ? "Design in Progress" : 
//           completionPercentage === 100 ? "Project Complete" : "In Progress"}
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatusIndicator = ({ project, enhancedProgress }) => {
//   const progressStatus = getProjectProgressStatus(project, enhancedProgress);
//   const { currentPhase, nextAction, isDesignInProgress, completionPercentage } = progressStatus;
  
//   const getStatusConfig = () => {
//     if (isDesignInProgress) {
//       return {
//         icon: Timer,
//         color: "blue",
//         bgColor: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
//         textColor: "text-blue-900 dark:text-blue-100",
//         description: `${completionPercentage}% complete - 72-hour design process active`
//       };
//     }
    
//     switch (nextAction?.type) {
//       case "payment":
//         return {
//           icon: CreditCard,
//           color: "amber",
//           bgColor: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
//           textColor: "text-amber-900 dark:text-amber-100",
//           description: "Complete payment to continue"
//         };
//       case "questionnaire":
//         return {
//           icon: PlayCircle,
//           color: "amber",
//           bgColor: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
//           textColor: "text-amber-900 dark:text-amber-100",
//           description: "Start design preferences"
//         };
//       case "onboarding":
//         return {
//           icon: Sparkles,
//           color: "purple",
//           bgColor: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
//           textColor: "text-purple-900 dark:text-purple-100",
//           description: "Complete onboarding questionnaire"
//         };
//       default:
//         return {
//           icon: CheckCircle2,
//           color: "green",
//           bgColor: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
//           textColor: "text-green-900 dark:text-green-100",
//           description: "Project complete - All deliverables ready"
//         };
//     }
//   };

//   const config = getStatusConfig();
//   const StatusIcon = config.icon;

//   return (
//     <div className={cn("flex items-center gap-3 p-3 rounded-lg border", config.bgColor)}>
//       <div className={cn(
//         "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
//         config.color === "blue" ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400" :
//         config.color === "amber" ? "bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-400" :
//         config.color === "purple" ? "bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400" :
//         "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400"
//       )}>
//         <StatusIcon className="w-4 h-4" />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className={cn("text-sm font-medium", config.textColor)}>
//           {currentPhase}
//         </p>
//         <p className={cn(
//           "text-xs",
//           config.color === "blue" ? "text-blue-700 dark:text-blue-300" :
//           config.color === "amber" ? "text-amber-700 dark:text-amber-300" :
//           config.color === "purple" ? "text-purple-700 dark:text-purple-300" :
//           "text-green-700 dark:text-green-300"
//         )}>
//           {config.description}
//         </p>
//       </div>
//     </div>
//   );
// };

// // ✅ UPDATED: Check status using enhanced progress data
// const hasAvailableRenders = (enhancedProgress) => {
//   return enhancedProgress?.rendersStatus === 'COMPLETED' || 
//          enhancedProgress?.rendersStatus === 'SENT';
// };

// // ✅ UPDATED: Check if BOQ is available (SENT status)
// const hasAvailableBOQ = (enhancedProgress) => {
//   return enhancedProgress?.boqStatus === 'SENT';
// };

// // ✅ UPDATED: Check if vendors are available (SENT status)
// const hasAvailableVendors = (enhancedProgress) => {
//   return enhancedProgress?.vendorListStatus === 'SENT';
// };

// export default function ProjectCard({
//   project,
//   viewMode = "grid",
//   style,
//   onStartQuestionnaire,
//   onStartOnboarding,
//   isHighlighted = false,
// }) {
//   const router = useRouter();
//   const [enhancedProgress, setEnhancedProgress] = useState(null);
//   const [loadingProgress, setLoadingProgress] = useState(false);

//    const isSingleRoomPlan = project?.selectedPlan === 'Single Room Trial' || 
//                           (project?.selectedPlan && project.selectedPlan.toLowerCase().includes('single room')) ||
//                           project?.selectedPlan?.toLowerCase().includes('499');

//   const status = getStatusConfig(project.status);
//   const progress = getProgressValue(project.status, project.progress);
//   const StatusIcon = status.icon;

//   const projectNeedsQuestionnaire = needsQuestionnaire(project);
//   const projectHasCompletedPayment = hasCompletedPayment(project);

//   // ✅ UPDATED: Use enhanced progress data for status checks
//   const projectHasRenders = hasAvailableRenders(enhancedProgress);
//   const projectHasBOQ = hasAvailableBOQ(enhancedProgress);
//   const projectHasVendors = hasAvailableVendors(enhancedProgress);

//   const progressStatus = getProjectProgressStatus(project, enhancedProgress);

//   const [loadingBudget, setLoadingBudget] = useState(false);

//   const buttonCount = [
//     progressStatus.nextAction && progressStatus.nextAction.type !== "progress",
//     projectHasRenders,
//     projectHasBOQ,
//     projectHasVendors,
//     !progressStatus.nextAction && !projectHasRenders && !projectHasBOQ && !projectHasVendors
//   ].filter(Boolean).length;

//   // Set grid columns based on actual button count FOR THIS PROJECT
//   const getGridClass = () => {
//     if (buttonCount === 1) return "grid-cols-1";
//     if (buttonCount === 2) return "grid-cols-2";
//     if (buttonCount >= 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
//     return "grid-cols-1";
//   };

//   const shouldShowViewDetails = !progressStatus.nextAction && !projectHasRenders && !projectHasBOQ && !projectHasVendors;

//   // ✅ NEW: Load enhanced progress data
//   useEffect(() => {
//     const loadEnhancedProgress = async () => {
//       if (!project.publicId && !project.id) return;
      
//       setLoadingProgress(true);
//       try {
//         const result = await projectService.getEnhancedProjectProgress(project.publicId || project.id);
//         if (result.success && result.data?.progress) {
//           setEnhancedProgress(result.data.progress);
//         }
//       } catch (error) {
//         console.error('Error loading enhanced progress:', error);
//       } finally {
//         setLoadingProgress(false);
//       }
//     };

//     loadEnhancedProgress();
//   }, [project.publicId, project.id]);

//   const handleActionClick = (e, actionType) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     switch (actionType) {
//       case "payment":
//         router.push(`/packages?type=new-project&projectId=${project.id}`);
//         break;
//       case "questionnaire":
//         onStartQuestionnaire?.(project);
//         break;
//       case "onboarding":
//         onStartOnboarding?.(project);
//         break;
//       case "uploads":
//         router.push(`/dashboard/projects/${project.id}/uploads`);
//         break;
//       case "progress":
//         router.push(`/dashboard/projects/${project.id}`);
//         break;
//       case "view":
//         router.push(`/dashboard/projects/${project.id}`);
//         break;
//       default:
//         router.push(`/dashboard/projects/${project.id}`);
//     }
//   };

//   // Handle specific button clicks
//   const handleRendersClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     router.push(`/dashboard/renders/${project.publicId || project.id}`);
//   };

//   const handleBudgetClick = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (loadingBudget) return;
    
//     setLoadingBudget(true);
    
//     try {
//       const response = await boqService.getBOQsByProject(project.publicId || project.id);
      
//       if (response.success && response.data && response.data.length > 0) {
//         const sentBOQ = response.data[0];
//         if (sentBOQ && sentBOQ.publicId) {
//           router.push(`/dashboard/boq/${sentBOQ.publicId}`);
//           return;
//         }
//       }
      
//       // Fallback
//       router.push(`/dashboard/boq/${project.publicId || project.id}`);
      
//     } catch (error) {
//       console.error('Error fetching BOQ:', error);
//       router.push(`/dashboard/boq/${project.publicId || project.id}`);
//     } finally {
//       setLoadingBudget(false);
//     }
//   };

//   const handleVendorsClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const projectId = enhancedProgress?.id || project.id;
//     router.push(`/dashboard/vendors/${projectId}`);
//   };

//   if (viewMode === "list") {
//     return (
//       <Card
//         className={cn(
//           "hover:shadow-lg transition-all duration-300 group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900",
//           isHighlighted && "ring-2 ring-blue-500 shadow-lg"
//         )}
//         style={style}
//       >
//         <CardContent className="p-6">
//           <div className="flex items-start gap-6">
//             {/* Thumbnail */}
//             <div className="flex-shrink-0">
//               <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
//                 <ProjectThumbnail project={project} enhancedProgress={enhancedProgress} className="w-full h-full" />
//               </div>
//             </div>

//             {/* Content */}
//             <div className="flex-1 min-w-0 space-y-4">
//               {/* Header */}
//               <div className="flex items-start justify-between">
//                 <div className="flex-1 min-w-0">
//                   <Link
//                     href={`/dashboard/projects/${project.publicId || project.id}`}
//                     className="group-hover:text-blue-600 transition-colors"
//                   >
//                     <h3 className="text-xl font-semibold text-slate-900 dark:text-white truncate">
//                       {project.title}
//                     </h3>
//                   </Link>
//                   <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 line-clamp-2">
//                     {project.description}
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-3 ml-4">
//                   <Badge
//                     variant={status.variant}
//                     className={cn(
//                       "px-3 py-1.5 text-sm font-medium",
//                       status.bgColor,
//                       status.color
//                     )}
//                   >
//                     <StatusIcon className="w-4 h-4 mr-1.5" />
//                     {status.label}
//                   </Badge>

//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                         <MoreVertical className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-48">
//                       <DropdownMenuItem asChild>
//                         <Link
//                           href={`/dashboard/projects/${project.publicId || project.id}`}
//                           className="flex items-center"
//                         >
//                           <Eye className="h-4 w-4 mr-2" />
//                           View Details
//                         </Link>
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Edit className="h-4 w-4 mr-2" />
//                         Edit Project
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-red-600">
//                         <Trash2 className="h-4 w-4 mr-2" />
//                         Delete
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>

//               {/* Project Info */}
//               <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
//                 {project.address && (
//                   <div className="flex items-center gap-2">
//                     <MapPin className="w-4 h-4" />
//                     <span className="truncate max-w-48">{project.address}</span>
//                   </div>
//                 )}
//                 {project.areaSqFt && (
//                   <div className="flex items-center gap-2">
//                     <Square className="w-4 h-4" />
//                     <span>{project.areaSqFt} sq ft</span>
//                   </div>
//                 )}
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   <span>{formatDate(project.updatedAt)}</span>
//                 </div>
//               </div>

//               {/* Status and Actions */}
//               <div className="flex items-center justify-between">
//                 <StatusIndicator project={project} enhancedProgress={enhancedProgress} />

//                 <div className="flex items-center gap-2">
//                   {progressStatus.nextAction && progressStatus.nextAction.type !== "progress" && (
//                     <Button
//                       onClick={(e) => handleActionClick(e, progressStatus.nextAction.type)}
//                       className={cn(
//                         progressStatus.nextAction.priority === "high" 
//                           ? "bg-amber-600 hover:bg-amber-700 text-white" 
//                           : progressStatus.nextAction.priority === "medium"
//                           ? "bg-blue-600 hover:bg-blue-700 text-white"
//                           : "bg-slate-600 hover:bg-slate-700 text-white"
//                       )}
//                     >
//                       {progressStatus.nextAction.type === "questionnaire" && <PlayCircle className="w-4 h-4 mr-2" />}
//                       {progressStatus.nextAction.type === "payment" && <CreditCard className="w-4 h-4 mr-2" />}
//                       {progressStatus.nextAction.type === "onboarding" && <Sparkles className="w-4 h-4 mr-2" />}
//                       {progressStatus.nextAction.type === "uploads" && <ArrowRight className="w-4 h-4 mr-2" />}
//                       {progressStatus.nextAction.label}
//                     </Button>
//                   )}

//                   {/* ✅ UPDATED: Show buttons only when status is SENT/COMPLETED from enhanced progress */}
//                   {projectHasRenders && (
//                     <Button variant="outline" onClick={handleRendersClick}>
//                       <ImageIcon className="w-4 h-4 mr-2" />
//                       Renders
//                     </Button>
//                   )}

//                   {projectHasBOQ && (
//                     <Button
//                       variant="outline"
//                       onClick={handleBudgetClick}
//                       size="sm"
//                       disabled={loadingBudget}
//                     >
//                       {loadingBudget ? (
//                         <>
//                           <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
//                           Loading...
//                         </>
//                       ) : (
//                         <>
//                           <FileTextIcon className="w-4 h-4 mr-2" />
//                           Budget
//                         </>
//                       )}
//                     </Button>
//                   )}

//                   {projectHasVendors && (
//                     <Button variant="outline" onClick={handleVendorsClick}>
//                       <Users className="w-4 h-4 mr-2" />
//                       Vendors
//                     </Button>
//                   )}

//                   <Button variant="ghost" asChild>
//                     <Link
//                       href={`/dashboard/projects/${project.publicId || project.id}`}
//                       className="flex items-center"
//                     >
//                       View Details
//                       <ArrowRight className="w-4 h-4 ml-2" />
//                     </Link>
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Grid view (default)
//   return (
//     <Card
//       className={cn(
//         "group cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 overflow-hidden",
//         isHighlighted && "ring-2 ring-blue-500 shadow-xl"
//       )}
//       style={style}
//     >
//       <Link href={`/dashboard/projects/${project.publicId || project.id}`}>
//         {/* Thumbnail Section */}
//         <div className="aspect-[4/3] relative overflow-hidden bg-slate-50 dark:bg-slate-800">
//           <ProjectThumbnail project={project} enhancedProgress={enhancedProgress} className="w-full h-full" />

//           {/* Status Badge */}
//           <div className="absolute top-3 left-3">
//             <Badge
//               variant={status.variant}
//               className={cn(
//                 "px-2.5 py-1 text-xs font-medium backdrop-blur-sm",
//                 status.bgColor,
//                 status.color
//               )}
//             >
//               <StatusIcon className="w-3 h-3 mr-1" />
//               {status.label}
//             </Badge>
//           </div>

//           {/* Project Type Badge */}
//           <div className="absolute top-3 right-3">
//             {isSingleRoomPlan ? (
//               // Show only Single Room badge for single room plans
//               <Badge 
//                 variant="default" 
//                 className="px-2.5 py-1 text-xs bg-amber-500 text-white z-10"
//               >
//                 Single Room
//               </Badge>
//             ) : (
//               // Show project type badge for regular plans
//               <Badge variant="secondary" className="px-2.5 py-1 text-xs bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-black">
//                 {project.projectType?.replace("_", " ")}
//               </Badge>
//             )}
//           </div>
//         </div>

//         {/* Content Section */}
//         <CardContent className="p-4 space-y-4">
//           {/* Title and Description */}
//           <div className="space-y-2">
//             <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
//               {project.title}
//             </CardTitle>
//             <CardDescription className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">
//               {project.description}
//             </CardDescription>
//           </div>

//           {/* Project Metadata */}
//           <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
//             <div className="flex items-center gap-4">
//               {project.address && (
//                 <div className="flex items-center gap-1.5">
//                   <MapPin className="w-4 h-4" />
//                   <span className="truncate max-w-24">
//                     {project.address.split(",")[0]}
//                   </span>
//                 </div>
//               )}
//               {project.areaSqFt && (
//                 <div className="flex items-center gap-1.5">
//                   <Square className="w-4 h-4" />
//                   <span>{project.areaSqFt} sq ft</span>
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center gap-1.5">
//               <Calendar className="w-4 h-4" />
//               <span>{formatDate(project.updatedAt)}</span>
//             </div>
//           </div>

//           {/* Status Indicator */}
//           <StatusIndicator project={project} enhancedProgress={enhancedProgress} />

//       {/* Action Buttons */}
//         <div className={`w-full grid ${getGridClass()} gap-2 pt-2`}>
//           {/* Show action button only if there's a next action AND it's NOT "progress" */}
//           {progressStatus.nextAction && progressStatus.nextAction.type !== "progress" && (
//             <Button
//               onClick={(e) => handleActionClick(e, progressStatus.nextAction.type)}
//               className={cn(
//                 "w-full",
//                 progressStatus.nextAction.priority === "high" 
//                   ? "bg-amber-600 hover:bg-amber-700 text-white" 
//                   : progressStatus.nextAction.priority === "medium"
//                   ? "bg-blue-600 hover:bg-blue-700 text-white"
//                   : "bg-slate-600 hover:bg-slate-700 text-white"
//               )}
//               size="sm"
//             >
//               {progressStatus.nextAction.type === "questionnaire" && <PlayCircle className="w-4 h-4 mr-2" />}
//               {progressStatus.nextAction.type === "payment" && <CreditCard className="w-4 h-4 mr-2" />}
//               {progressStatus.nextAction.type === "onboarding" && <Sparkles className="w-4 h-4 mr-2" />}
//               {progressStatus.nextAction.type === "uploads" && <ArrowRight className="w-4 h-4 mr-2" />}
//               {progressStatus.nextAction.label}
//             </Button>
//           )}

//           {/* ✅ UPDATED: Show buttons only when status is SENT/COMPLETED from enhanced progress */}
//           {projectHasRenders && (
//             <Button
//               variant="outline"
//               onClick={handleRendersClick}
//               size="sm"
//               className="w-full"
//             >
//               <ImageIcon className="w-4 h-4 mr-2" />
//               Renders
//             </Button>
//           )}

//           {projectHasBOQ && (
//             <Button
//               variant="outline"
//               onClick={handleBudgetClick}
//               size="sm"
//               className="w-full"
//             >
//               <FileTextIcon className="w-4 h-4 mr-2" />
//               Budget
//             </Button>
//           )}

//           {projectHasVendors && (
//             <Button
//               variant="outline"
//               onClick={handleVendorsClick}
//               size="sm"
//               className="w-full"
//             >
//               <Users className="w-4 h-4 mr-2" />
//               Vendors
//             </Button>
//           )}

//           {/* Show View Details only when no other buttons are shown */}
//           {!projectHasRenders && !projectHasBOQ && !projectHasVendors && (
//             <Button
//               variant="outline"
//               asChild
//               size="sm"
//               className="w-full"
//             >
//               <Link href={`/dashboard/projects/${project.publicId || project.id}`}>
//                 <Eye className="w-4 h-4 mr-2" />
//                 View Details
//               </Link>
//             </Button>
//           )}
//         </div>
//         </CardContent>
//       </Link>
//     </Card>
//   );
// }

// src/components/dashboard/ProjectCard.js
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Calendar,
  MapPin,
  Square,
  Eye,
  Edit,
  Trash2,
  PlayCircle,
  Image as ImageIcon,
  FileText as FileTextIcon,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  ArrowRight,
  Sparkles,
  Building,
  Home,
  Zap,
  Rocket,
  Timer,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  getStatusConfig,
  getProgressValue,
  needsQuestionnaire,
  hasCompletedPayment,
} from "@/constants/projectStatus";
import { boqService } from "@/services/boq.service";
import { projectService } from "@/services/project.service";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
};

// ✅ NEW: Helper function to check if it's a Single Room Trial plan
const isSingleRoomTrialPlan = (project) => {
  return project?.selectedPlan === 'Single Room Trial' || 
         (project?.selectedPlan && project.selectedPlan.toLowerCase().includes('single room trial')) ||
         project?.selectedPlan?.toLowerCase().includes('499');
};

// ✅ UPDATED: Enhanced progress tracking with Single Room Trial support
const getProjectProgressStatus = (project, enhancedProgress) => {
  const isSingleRoomTrial = isSingleRoomTrialPlan(project);
  
  // ✅ UPDATED: Different weight distribution for Single Room Trial plans
  const phases = isSingleRoomTrial ? [
    // Single Room Trial plan weights (total 100%)
    {
      id: "onboarding",
      title: "Onboarding",
      completed: hasCompletedPayment(project), // Onboarding considered complete on payment
      weight: 20 // 20% - completed on payment
    },
    {
      id: "renders",
      title: "3D Renders",
      completed: enhancedProgress?.rendersStatus === 'COMPLETED' || 
                enhancedProgress?.rendersStatus === 'SENT',
      weight: 25 // 25% - when renders are sent
    },
    {
      id: "budget",
      title: "Budget Analysis",
      completed: enhancedProgress?.boqStatus === 'SENT',
      weight: 25 // 25% - when BOQ is sent
    },
    {
      id: "vendors",
      title: "Vendor Matching",
      completed: enhancedProgress?.vendorListStatus === 'SENT',
      weight: 30 // 30% - when vendors are sent
    }
  ] : [
    // Regular plan weights (total 100%)
    {
      id: "onboarding",
      title: "Onboarding",
      completed: project.currentPhase !== 'ONBOARDING_QUESTIONNAIRE' && 
                project.completedPhases?.includes('ONBOARDING_QUESTIONNAIRE'),
      weight: 10 // 10% of total progress
    },
    {
      id: "uploads",
      title: "File Uploads",
      completed: project.currentPhase !== 'FILE_UPLOADS' && 
                project.completedPhases?.includes('FILE_UPLOADS'),
      weight: 10 // 10% of total progress
    },
    {
      id: "payment",
      title: "Payment",
      completed: hasCompletedPayment(project),
      weight: 10 // 10% of total progress
    },
    {
      id: "design_questionnaire",
      title: "Design Preferences",
      completed: project.designQuestionnaireCompleted || 
                project.status === 'DESIGN_QUESTIONNAIRE_COMPLETED',
      weight: 10 // 10% of total progress
    },
    {
      id: "renders",
      title: "3D Renders",
      completed: enhancedProgress?.rendersStatus === 'COMPLETED' || 
                enhancedProgress?.rendersStatus === 'SENT',
      weight: 25 // 25% of total progress
    },
    {
      id: "budget",
      title: "Budget Analysis",
      completed: enhancedProgress?.boqStatus === 'SENT',
      weight: 25 // 25% of total progress
    },
    {
      id: "vendors",
      title: "Vendor Matching",
      completed: enhancedProgress?.vendorListStatus === 'SENT',
      weight: 10 // 10% of total progress
    },
  ];

  // ✅ UPDATED: Calculate completion percentage based on ACTUAL weights
  let completionPercentage = 0;
  
  phases.forEach(phase => {
    if (phase.completed) {
      completionPercentage += phase.weight;
    }
  });

  completionPercentage = Math.round(completionPercentage);

  // ✅ UPDATED: For Single Room Trial plans, check if all deliverables are sent
  const allDeliverablesSent = isSingleRoomTrial && 
    enhancedProgress?.rendersStatus === 'SENT' &&
    enhancedProgress?.boqStatus === 'SENT' &&
    enhancedProgress?.vendorListStatus === 'SENT';

  // Determine current phase and next action based on ACTUAL status
  let currentPhase = null;
  let nextAction = null;

  if (completionPercentage === 100 || (isSingleRoomTrial && allDeliverablesSent)) {
    currentPhase = "Completed";
    nextAction = null;
  } 
  else if (project.designStartTime && completionPercentage < 100) {
    currentPhase = "Design in Progress";
    nextAction = {
      label: "View Progress",
      type: "progress",
      priority: "medium"
    };
  }
  else if (project.currentPhase === 'ONBOARDING_QUESTIONNAIRE') {
    currentPhase = "Onboarding";
    nextAction = {
      label: "Complete Onboarding",
      type: "onboarding",
      priority: "high"
    };
  } else if (project.currentPhase === 'FILE_UPLOADS') {
    currentPhase = "File Uploads";
    nextAction = {
      label: "Upload Files",
      type: "uploads",
      priority: "high"
    };
  } else if (!hasCompletedPayment(project)) {
    currentPhase = "Payment Required";
    nextAction = {
      label: "Complete Payment",
      type: "payment",
      priority: "high"
    };
  } else if (needsQuestionnaire(project)) {
    currentPhase = "Design Preferences";
    nextAction = {
      label: "Start Design Preferences",
      type: "questionnaire",
      priority: "high"
    };
  } else {
    currentPhase = "Setup Required";
    nextAction = {
      label: "Continue Setup",
      type: "setup",
      priority: "medium"
    };
  }

  return {
    phases,
    completionPercentage,
    currentPhase,
    nextAction,
    isComplete: completionPercentage === 100 || (isSingleRoomTrial && allDeliverablesSent),
    isDesignInProgress: !!project.designStartTime && completionPercentage < 100,
    designStartTime: project.designStartTime,
    isSingleRoomTrial,
    allDeliverablesSent,
  };
};

const ProjectThumbnail = ({ project, enhancedProgress, className }) => {
  const [imageError, setImageError] = useState(false);
  const progressStatus = getProjectProgressStatus(project, enhancedProgress);
  const { completionPercentage, isComplete, isDesignInProgress } = progressStatus;

  // Show project image if available and complete
  if (project.thumbnailUrl && !imageError && isComplete) {
    return (
      <div className={cn("relative w-full h-full", className)}>
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    );
  }

  // Professional placeholder with progress
  const getProjectTypeIcon = () => {
    switch (project.projectType) {
      case 'RESIDENTIAL':
        return <Home className="w-8 h-8" />;
      case 'COMMERCIAL':
        return <Building className="w-8 h-8" />;
      case 'OFFICE':
        return <Building className="w-8 h-8" />;
      default:
        return <Home className="w-8 h-8" />;
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-grid-slate-200 dark:bg-grid-slate-700" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-3 p-6">
        {/* Project Type Icon - Hidden on mobile */}
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto hidden md:flex",
          isDesignInProgress 
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            : completionPercentage === 100 
            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
        )}>
          {isDesignInProgress ? <Rocket className="w-8 h-8" /> : getProjectTypeIcon()}
        </div>

        {/* Progress Circle */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-200 dark:text-slate-700"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * completionPercentage) / 100}
                className={cn(
                  "transition-all duration-500 ease-out",
                  isDesignInProgress 
                    ? "text-blue-500" 
                    : completionPercentage === 100 
                    ? "text-green-500" 
                    : "text-amber-500"
                )}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn(
                "text-lg font-bold",
                isDesignInProgress 
                  ? "text-blue-600 dark:text-blue-400" 
                  : completionPercentage === 100 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-amber-600 dark:text-amber-400"
              )}>
                {completionPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className={cn(
          "text-sm font-medium",
          isDesignInProgress 
            ? "text-blue-700 dark:text-blue-300" 
            : completionPercentage === 100 
            ? "text-green-700 dark:text-green-300" 
            : "text-amber-700 dark:text-amber-300"
        )}>
          {isDesignInProgress ? "Design in Progress" : 
          completionPercentage === 100 ? "Project Complete" : "In Progress"}
        </div>
      </div>
    </div>
  );
};

const StatusIndicator = ({ project, enhancedProgress }) => {
  const progressStatus = getProjectProgressStatus(project, enhancedProgress);
  const { currentPhase, nextAction, isDesignInProgress, completionPercentage, isSingleRoomTrial } = progressStatus;
  
  const getStatusConfig = () => {
    if (isDesignInProgress) {
      return {
        icon: Timer,
        color: "blue",
        bgColor: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
        textColor: "text-blue-900 dark:text-blue-100",
        description: isSingleRoomTrial 
          ? `${completionPercentage}% complete - Single Room Trial in progress` 
          : `${completionPercentage}% complete - 72-hour design process active`
      };
    }
    
    switch (nextAction?.type) {
      case "payment":
        return {
          icon: CreditCard,
          color: "amber",
          bgColor: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
          textColor: "text-amber-900 dark:text-amber-100",
          description: "Complete payment to continue"
        };
      case "questionnaire":
        return {
          icon: PlayCircle,
          color: "amber",
          bgColor: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
          textColor: "text-amber-900 dark:text-amber-100",
          description: "Start design preferences"
        };
      case "onboarding":
        return {
          icon: Sparkles,
          color: "purple",
          bgColor: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
          textColor: "text-purple-900 dark:text-purple-100",
          description: "Complete onboarding questionnaire"
        };
      default:
        // ✅ UPDATED: For Single Room Trial, show special completion message
        if (isSingleRoomTrial && completionPercentage === 100) {
          return {
            icon: CheckCircle2,
            color: "green",
            bgColor: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
            textColor: "text-green-900 dark:text-green-100",
            description: "All deliverables sent - Project Complete"
          };
        }
        return {
          icon: CheckCircle2,
          color: "green",
          bgColor: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
          textColor: "text-green-900 dark:text-green-100",
          description: "Project complete - All deliverables ready"
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-lg border", config.bgColor)}>
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        config.color === "blue" ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400" :
        config.color === "amber" ? "bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-400" :
        config.color === "purple" ? "bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400" :
        "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400"
      )}>
        <StatusIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", config.textColor)}>
          {currentPhase}
        </p>
        <p className={cn(
          "text-xs",
          config.color === "blue" ? "text-blue-700 dark:text-blue-300" :
          config.color === "amber" ? "text-amber-700 dark:text-amber-300" :
          config.color === "purple" ? "text-purple-700 dark:text-purple-300" :
          "text-green-700 dark:text-green-300"
        )}>
          {config.description}
        </p>
      </div>
    </div>
  );
};

// ✅ UPDATED: Check status using enhanced progress data
const hasAvailableRenders = (enhancedProgress) => {
  return enhancedProgress?.rendersStatus === 'COMPLETED' || 
         enhancedProgress?.rendersStatus === 'SENT';
};

// ✅ UPDATED: Check if BOQ is available (SENT status)
const hasAvailableBOQ = (enhancedProgress) => {
  return enhancedProgress?.boqStatus === 'SENT';
};

// ✅ UPDATED: Check if vendors are available (SENT status)
const hasAvailableVendors = (enhancedProgress) => {
  return enhancedProgress?.vendorListStatus === 'SENT';
};

export default function ProjectCard({
  project,
  viewMode = "grid",
  style,
  onStartQuestionnaire,
  onStartOnboarding,
  isHighlighted = false,
}) {
  const router = useRouter();
  const [enhancedProgress, setEnhancedProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // ✅ UPDATED: Use the helper function
  const isSingleRoomPlan = isSingleRoomTrialPlan(project);

  const status = getStatusConfig(project.status);
  const progress = getProgressValue(project.status, project.progress);
  const StatusIcon = status.icon;

  const projectNeedsQuestionnaire = needsQuestionnaire(project);
  const projectHasCompletedPayment = hasCompletedPayment(project);

  // ✅ UPDATED: Use enhanced progress data for status checks
  const projectHasRenders = hasAvailableRenders(enhancedProgress);
  const projectHasBOQ = hasAvailableBOQ(enhancedProgress);
  const projectHasVendors = hasAvailableVendors(enhancedProgress);

  const progressStatus = getProjectProgressStatus(project, enhancedProgress);

  const [loadingBudget, setLoadingBudget] = useState(false);

  const buttonCount = [
    progressStatus.nextAction && progressStatus.nextAction.type !== "progress",
    projectHasRenders,
    projectHasBOQ,
    projectHasVendors,
    !progressStatus.nextAction && !projectHasRenders && !projectHasBOQ && !projectHasVendors
  ].filter(Boolean).length;

  // Set grid columns based on actual button count FOR THIS PROJECT
  const getGridClass = () => {
    if (buttonCount === 1) return "grid-cols-1";
    if (buttonCount === 2) return "grid-cols-2";
    if (buttonCount >= 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1";
  };

  const shouldShowViewDetails = !progressStatus.nextAction && !projectHasRenders && !projectHasBOQ && !projectHasVendors;

  // ✅ NEW: Load enhanced progress data
  useEffect(() => {
    const loadEnhancedProgress = async () => {
      if (!project.publicId && !project.id) return;
      
      setLoadingProgress(true);
      try {
        const result = await projectService.getEnhancedProjectProgress(project.publicId || project.id);
        if (result.success && result.data?.progress) {
          setEnhancedProgress(result.data.progress);
        }
      } catch (error) {
        console.error('Error loading enhanced progress:', error);
      } finally {
        setLoadingProgress(false);
      }
    };

    loadEnhancedProgress();
  }, [project.publicId, project.id]);

  const handleActionClick = (e, actionType) => {
    e.preventDefault();
    e.stopPropagation();
    
    switch (actionType) {
      case "payment":
        router.push(`/packages?type=new-project&projectId=${project.id}`);
        break;
      case "questionnaire":
        onStartQuestionnaire?.(project);
        break;
      case "onboarding":
        onStartOnboarding?.(project);
        break;
      case "uploads":
        router.push(`/dashboard/projects/${project.id}/uploads`);
        break;
      case "progress":
        router.push(`/dashboard/projects/${project.id}`);
        break;
      case "view":
        router.push(`/dashboard/projects/${project.id}`);
        break;
      default:
        router.push(`/dashboard/projects/${project.id}`);
    }
  };

  // Handle specific button clicks
  const handleRendersClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/dashboard/renders/${project.publicId || project.id}`);
  };

  const handleBudgetClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loadingBudget) return;
    
    setLoadingBudget(true);
    
    try {
      const response = await boqService.getBOQsByProject(project.publicId || project.id);
      
      if (response.success && response.data && response.data.length > 0) {
        const sentBOQ = response.data[0];
        if (sentBOQ && sentBOQ.publicId) {
          router.push(`/dashboard/boq/${sentBOQ.publicId}`);
          return;
        }
      }
      
      // Fallback
      router.push(`/dashboard/boq/${project.publicId || project.id}`);
      
    } catch (error) {
      console.error('Error fetching BOQ:', error);
      router.push(`/dashboard/boq/${project.publicId || project.id}`);
    } finally {
      setLoadingBudget(false);
    }
  };

  const handleVendorsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const projectId = enhancedProgress?.id || project.id;
    router.push(`/dashboard/vendors/${projectId}`);
  };

  if (viewMode === "list") {
    return (
      <Card
        className={cn(
          "hover:shadow-lg transition-all duration-300 group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900",
          isHighlighted && "ring-2 ring-blue-500 shadow-lg"
        )}
        style={style}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <ProjectThumbnail project={project} enhancedProgress={enhancedProgress} className="w-full h-full" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/dashboard/projects/${project.publicId || project.id}`}
                    className="group-hover:text-blue-600 transition-colors"
                  >
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white truncate">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <Badge
                    variant={status.variant}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium",
                      status.bgColor,
                      status.color
                    )}
                  >
                    <StatusIcon className="w-4 h-4 mr-1.5" />
                    {status.label}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/projects/${project.publicId || project.id}`}
                          className="flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Project Info */}
              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                {project.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-48">{project.address}</span>
                  </div>
                )}
                {project.areaSqFt && (
                  <div className="flex items-center gap-2">
                    <Square className="w-4 h-4" />
                    <span>{project.areaSqFt} sq ft</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(project.updatedAt)}</span>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <StatusIndicator project={project} enhancedProgress={enhancedProgress} />

                <div className="flex items-center gap-2">
                  {progressStatus.nextAction && progressStatus.nextAction.type !== "progress" && (
                    <Button
                      onClick={(e) => handleActionClick(e, progressStatus.nextAction.type)}
                      className={cn(
                        progressStatus.nextAction.priority === "high" 
                          ? "bg-amber-600 hover:bg-amber-700 text-white" 
                          : progressStatus.nextAction.priority === "medium"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-slate-600 hover:bg-slate-700 text-white"
                      )}
                    >
                      {progressStatus.nextAction.type === "questionnaire" && <PlayCircle className="w-4 h-4 mr-2" />}
                      {progressStatus.nextAction.type === "payment" && <CreditCard className="w-4 h-4 mr-2" />}
                      {progressStatus.nextAction.type === "onboarding" && <Sparkles className="w-4 h-4 mr-2" />}
                      {progressStatus.nextAction.type === "uploads" && <ArrowRight className="w-4 h-4 mr-2" />}
                      {progressStatus.nextAction.label}
                    </Button>
                  )}

                  {/* ✅ UPDATED: Show buttons only when status is SENT/COMPLETED from enhanced progress */}
                  {projectHasRenders && (
                    <Button variant="outline" onClick={handleRendersClick}>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Renders
                    </Button>
                  )}

                  {projectHasBOQ && (
                    <Button
                      variant="outline"
                      onClick={handleBudgetClick}
                      size="sm"
                      disabled={loadingBudget}
                    >
                      {loadingBudget ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <FileTextIcon className="w-4 h-4 mr-2" />
                          Budget
                        </>
                      )}
                    </Button>
                  )}

                  {projectHasVendors && (
                    <Button variant="outline" onClick={handleVendorsClick}>
                      <Users className="w-4 h-4 mr-2" />
                      Vendors
                    </Button>
                  )}

                  <Button variant="ghost" asChild>
                    <Link
                      href={`/dashboard/projects/${project.publicId || project.id}`}
                      className="flex items-center"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card
      className={cn(
        "group cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 overflow-hidden",
        isHighlighted && "ring-2 ring-blue-500 shadow-xl"
      )}
      style={style}
    >
      <Link href={`/dashboard/projects/${project.publicId || project.id}`}>
        {/* Thumbnail Section */}
        <div className="aspect-[4/3] relative overflow-hidden bg-slate-50 dark:bg-slate-800">
          <ProjectThumbnail project={project} enhancedProgress={enhancedProgress} className="w-full h-full" />

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant={status.variant}
              className={cn(
                "px-2.5 py-1 text-xs font-medium backdrop-blur-sm",
                status.bgColor,
                status.color
              )}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>

          {/* Project Type Badge */}
          <div className="absolute top-3 right-3">
            {isSingleRoomPlan ? (
              // Show only Single Room badge for single room plans
              <Badge 
                variant="default" 
                className="px-2.5 py-1 text-xs bg-amber-500 text-white z-10"
              >
                Single Room Trial
              </Badge>
            ) : (
              // Show project type badge for regular plans
              <Badge variant="secondary" className="px-2.5 py-1 text-xs bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-black">
                {project.projectType?.replace("_", " ")}
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4 space-y-4">
          {/* Title and Description */}
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
              {project.title}
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">
              {project.description}
            </CardDescription>
          </div>

          {/* Project Metadata */}
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              {project.address && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate max-w-24">
                    {project.address.split(",")[0]}
                  </span>
                </div>
              )}
              {project.areaSqFt && (
                <div className="flex items-center gap-1.5">
                  <Square className="w-4 h-4" />
                  <span>{project.areaSqFt} sq ft</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(project.updatedAt)}</span>
            </div>
          </div>

          {/* Status Indicator */}
          <StatusIndicator project={project} enhancedProgress={enhancedProgress} />

          {/* Action Buttons */}
          <div className={`w-full grid ${getGridClass()} gap-2 pt-2`}>
            {/* Show action button only if there's a next action AND it's NOT "progress" */}
            {progressStatus.nextAction && progressStatus.nextAction.type !== "progress" && (
              <Button
                onClick={(e) => handleActionClick(e, progressStatus.nextAction.type)}
                className={cn(
                  "w-full",
                  progressStatus.nextAction.priority === "high" 
                    ? "bg-amber-600 hover:bg-amber-700 text-white" 
                    : progressStatus.nextAction.priority === "medium"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-600 hover:bg-slate-700 text-white"
                )}
                size="sm"
              >
                {progressStatus.nextAction.type === "questionnaire" && <PlayCircle className="w-4 h-4 mr-2" />}
                {progressStatus.nextAction.type === "payment" && <CreditCard className="w-4 h-4 mr-2" />}
                {progressStatus.nextAction.type === "onboarding" && <Sparkles className="w-4 h-4 mr-2" />}
                {progressStatus.nextAction.type === "uploads" && <ArrowRight className="w-4 h-4 mr-2" />}
                {progressStatus.nextAction.label}
              </Button>
            )}

            {/* ✅ UPDATED: Show buttons only when status is SENT/COMPLETED from enhanced progress */}
            {projectHasRenders && (
              <Button
                variant="outline"
                onClick={handleRendersClick}
                size="sm"
                className="w-full"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Renders
              </Button>
            )}

            {projectHasBOQ && (
              <Button
                variant="outline"
                onClick={handleBudgetClick}
                size="sm"
                className="w-full"
              >
                <FileTextIcon className="w-4 h-4 mr-2" />
                Budget
              </Button>
            )}

            {projectHasVendors && (
              <Button
                variant="outline"
                onClick={handleVendorsClick}
                size="sm"
                className="w-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Vendors
              </Button>
            )}

            {/* Show View Details only when no other buttons are shown */}
            {!projectHasRenders && !projectHasBOQ && !projectHasVendors && (
              <Button
                variant="outline"
                asChild
                size="sm"
                className="w-full"
              >
                <Link href={`/dashboard/projects/${project.publicId || project.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}