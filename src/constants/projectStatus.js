// src/constants/projectStatus.js
import {
  Edit,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Palette,
  Image as ImageIcon,
  Trash2,
  Brain,
  Building,
  CheckCircle,
  FileText,
  AlertCircle,
  Image, // Added this import for renders status
} from "lucide-react";

export const PROJECT_STATUS = {
  DRAFT: {
    label: "Draft",
    variant: "secondary",
    color: "text-muted-foreground dark:text-slate-300",
    bgColor: "bg-muted dark:bg-slate-800",
    icon: Edit,
    progress: 10,
  },
  STYLE_SELECTED: {
    label: "Style Selected",
    variant: "default",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/30",
    icon: Palette,
    progress: 20,
  },
  QUESTIONNAIRE_COMPLETED: {
    label: "Onboarding Complete",
    variant: "default",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/30",
    icon: CheckCircle2,
    progress: 30,
  },
  UPLOADED: {
    label: "Files Uploaded",
    variant: "default",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/30",
    icon: CheckCircle2,
    progress: 40,
  },
  PAYMENT_COMPLETED: {
    label: "Questionnaire Required",
    variant: "default",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/30",
    icon: AlertTriangle,
    progress: 50,
  },
  DESIGN_QUESTIONNAIRE_COMPLETED: {
    label: "Design Preferences Complete",
    variant: "default",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/30",
    icon: Brain,
    progress: 60,
  },
  RENDER_IN_PROGRESS: {
    label: "Rendering",
    variant: "default",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/30",
    icon: Clock,
    progress: 75,
  },
  RENDER_COMPLETED: {
    label: "Renders Ready",
    variant: "default",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/30",
    icon: ImageIcon,
    progress: 85,
  },
  BOQ_GENERATED: {
    label: "BOQ Ready",
    variant: "default",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/30",
    icon: CheckCircle2,
    progress: 90,
  },
  COMPLETED: {
    label: "Completed",
    variant: "default",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900-30",
    icon: CheckCircle2,
    progress: 100,
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "destructive",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/30",
    icon: Trash2,
    progress: 0,
  },
};

// Helper functions
export const getProgressValue = (status, customProgress) => {
  if (customProgress !== undefined) return customProgress;
  return PROJECT_STATUS[status]?.progress || 0;
};

export const needsQuestionnaire = (project) => {
  // If design questionnaire is already completed, return false
  if (project.designQuestionnaireCompleted) {
    return false;
  }
  
  // If status indicates questionnaire is completed, return false
  if (project.status === "DESIGN_QUESTIONNAIRE_COMPLETED" || 
      project.status === "QUESTIONNAIRE_COMPLETED" ||
      project.status === "RENDER_IN_PROGRESS" ||
      project.status === "RENDER_COMPLETED" ||
      project.status === "BOQ_GENERATED" ||
      project.status === "COMPLETED") {
    return false;
  }
  
  // Check if design questionnaire was completed at specific time
  if (project.designQuestionnaireCompletedAt) {
    return false;
  }
  
  // Default: questionnaire is needed for these statuses
  return project.status === "PAYMENT_COMPLETED" || 
         project.status === "DRAFT" ||
         project.currentPhase === "DESIGN_QUESTIONNAIRE";
};

export const isQuestionnaireCompleted = (project) => {
  return project.status === 'DESIGN_QUESTIONNAIRE_COMPLETED' || 
         project.designPreferencesCompleted;
};

// NEW: Check if project is eligible for questionnaire popup
export const shouldShowQuestionnairePopup = (project) => {
  return needsQuestionnaire(project) && !isQuestionnaireCompleted(project);
};

export const hasRenders = (project) => {
  return project.status === "RENDER_COMPLETED" || project._count?.renders > 0;
};

// UPDATED: Check if project has BOQs with SENT status
export const hasBOQ = (project) => {
  // Check if project has BOQs that are sent to user
  if (project.boqs && Array.isArray(project.boqs)) {
    const result = project.boqs.some(boq => boq.status === 'SENT');
    return result;
  }
  
  // ✅ FIXED: Check boqStatus from project OR progressData
  const hasSentBOQ = project.boqStatus === 'SENT' || project.progressData?.boqStatus === 'SENT';
  
  // ✅ FIXED: Update fallback condition to include COMPLETED status
  const fallbackResult = (project._count?.boqs > 0) && 
                        (project.status === "BOQ_GENERATED" || project.status === "COMPLETED");

  return hasSentBOQ || fallbackResult;
};

// UPDATED: Get the available BOQ for user (first SENT one) with proper ID
export const getAvailableBOQ = (project) => {
  // First priority: Check if project has boqs array with SENT status
  if (project.boqs && Array.isArray(project.boqs)) {
    const sentBOQ = project.boqs.find(boq => boq.status === 'SENT');
    if (sentBOQ) {
      return {
        id: sentBOQ.publicId || sentBOQ.id, // ✅ Use BOQ ID, not project ID
        status: sentBOQ.status,
        title: sentBOQ.title,
        totalAmount: sentBOQ.totalAmount,
        // Include other BOQ properties you need
      };
    }
  }
  
  // Second priority: Check boqStatus from project
  if (project.boqStatus === 'SENT' || project.progressData?.boqStatus === 'SENT') {
    return {
      id: project.publicId || project.id, // Fallback to project ID
      status: 'SENT',
      title: 'Budget Analysis',
    };
  }
  
  return null;
};
// UPDATED: Check if BOQ is available for viewing
export const isBOQAvailable = (project) => {
  return hasBOQ(project);
};

export const getStatusConfig = (status) => {
  const configs = {
    DRAFT: {
      label: "Draft",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: Clock,
    },
    UPLOADED: {
      label: "Files Uploaded",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Building,
    },
    STYLE_SELECTED: {
      label: "Style Selected",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: CheckCircle,
    },
    BOQ_GENERATED: {
      label: "BOQ Ready",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: FileText,
    },
    BOQ_APPROVED: {
      label: "BOQ Approved",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: CheckCircle,
    },
    COMPLETED: {
      label: "Completed",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: CheckCircle,
    },
    CANCELLED: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertCircle,
    },
  };
  return configs[status] || configs.DRAFT;
};

export const getBOQStatusConfig = (status) => {
  const configs = {
    DRAFT: {
      label: "Draft",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: Clock,
    },
    GENERATED: {
      label: "Generated",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: FileText,
    },
    SENT: {
      label: "Sent to User",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    APPROVED: {
      label: "Approved",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: CheckCircle2,
    },
    PENDING: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
    },
  };
  return configs[status] || configs.PENDING;
};

export const getRendersStatusConfig = (status) => {
  const configs = {
    PENDING: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
    },
    UPLOADED: {
      label: "Uploaded",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Image,
    },
    PROCESSING: {
      label: "Generated",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Image,
    },
    COMPLETED: {
      label: "Sent",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
  };
  return configs[status] || configs.PENDING;
};

export const hasCompletedPayment = (project) => {
  return project.paymentStatus === 'COMPLETED' || 
         project.status === 'PAYMENT_COMPLETED' ||
         (project.payments && project.payments.length > 0 && 
          project.payments.some(payment => payment.status === 'COMPLETED'));
};