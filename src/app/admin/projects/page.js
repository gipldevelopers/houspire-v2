// src\app\admin\projects\page.js
"use client";

import { useState, useEffect } from "react";
import {
  Building,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  FileText,
  Image,
  Plus,
  MapPin,
  Calendar,
  Building2,
  ArrowUpDown,
  Zap,
  PlayCircle,
  Trash2,
  Lock,
  DollarSign,
  IndianRupee,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Pagination from "@/components/ui/pagination";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";
import {
  getBOQStatusConfig,
  getRendersStatusConfig,
  getStatusConfig,
} from "@/constants/projectStatus";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [packageFilter, setPackageFilter] = useState("all");
  const [boqStatusFilter, setBoqStatusFilter] = useState("all");
  const [rendersStatusFilter, setRendersStatusFilter] = useState("all");
  const [vendorStatusFilter, setVendorStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [timeRemainingFilter, setTimeRemainingFilter] = useState("all");
  // const [sortBy, setSortBy] = useState("timeRemaining"); // Default sort by time remaining
  const [sortBy, setSortBy] = useState("createdAt"); // Default sort by time remaining
  const [sortOrder, setSortOrder] = useState("desc"); // asc for shortest time first

  // Delete confirmation states
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Real-time timer state - updates every second
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  useEffect(() => {
    loadProjects();
  }, []);

  // Update timer every second for real-time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/projects");
      setProjects(response.data.data.projects || []);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // Determine if project is single room plan (48 hours)
  const isSingleRoomPlan = (project) => {
    return project?.selectedPlan === 'Single Room Trial' || 
           project?.selectedPlan?.toLowerCase().includes('single room') ||
           project?.selectedPlan?.toLowerCase().includes('499') ||
           project?.isSingleRoomPlan === true;
  };

  // Map renders status for display: PROCESSING -> GENERATED, COMPLETED -> SENT
  const getRendersDisplayStatus = (status) => {
    if (status === "PROCESSING") return "GENERATED";
    if (status === "COMPLETED") return "SENT";
    return status; // PENDING, FAILED, etc. remain unchanged
  };

  // Map BOQ status for display: DRAFT -> PENDING (for consistency with RENDERS and VENDORS)
  const getBOQDisplayStatus = (status) => {
    if (status === "DRAFT") return "PENDING";
    return status; // GENERATED, SENT, APPROVED, PENDING remain unchanged
  };

  // Map Vendor status for display (no mapping needed, but ensure consistent styling)
  const getVendorDisplayStatus = (status) => {
    return status; // Vendors already use GENERATED and SENT directly
  };

  // Calculate time remaining for delivery (48h for single room, 72h for others)
  // Uses currentTime state for real-time updates
  const calculateTimeRemaining = (project) => {
    if (!project.designStartTime) return null;
    
    const now = currentTime; // Use state instead of new Date() for real-time updates
    const startTime = new Date(project.designStartTime).getTime();
    const elapsed = now - startTime;
    const isSingleRoom = isSingleRoomPlan(project);
    const totalTime = isSingleRoom ? 48 * 60 * 60 * 1000 : 72 * 60 * 60 * 1000; // 48h or 72h in milliseconds
    
    return Math.max(0, totalTime - elapsed);
  };

  // Get time remaining status for color coding (adjusted for 48h/72h plans)
  const getTimeRemainingStatus = (timeRemaining, project) => {
    if (timeRemaining === null) return "not-started";
    if (timeRemaining <= 0) return "overdue";
    
    const isSingleRoom = isSingleRoomPlan(project);
    const totalHours = isSingleRoom ? 48 : 72;
    
    // For 48h plans: urgent < 12h, warning < 24h
    // For 72h plans: urgent < 24h, warning < 48h
    if (isSingleRoom) {
      if (timeRemaining <= (12 * 60 * 60 * 1000)) return "urgent"; // Less than 12h
      if (timeRemaining <= (24 * 60 * 60 * 1000)) return "warning"; // Less than 24h
    } else {
      if (timeRemaining <= (24 * 60 * 60 * 1000)) return "urgent"; // Less than 24h
      if (timeRemaining <= (48 * 60 * 60 * 1000)) return "warning"; // Less than 48h
    }
    return "normal";
  };

  // Format time remaining for display
const formatTimeRemaining = (ms) => {
  if (ms === null) return "Not started";
  if (ms <= 0) return "Overdue";
  
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  
  // Format to always show 2 digits for minutes and seconds
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  
  return `${hours}h ${formattedMinutes}m ${formattedSeconds}s`;
};

  // Check if project is completed based on statuses
const isProjectCompleted = (project) => {
  // Safeguard in case project is undefined/null
  if (!project) return false;

  const rendersStatus = project.rendersStatus;
  const vendorStatus = project.vendorStatus;
  const boqStatus = project.boqStatus;
  
  // Check if all three statuses are "SENT" (renders: COMPLETED means SENT, BOQ/Vendors: SENT)
  const isRendersComplete = rendersStatus === "COMPLETED"; // COMPLETED means sent to user
  const isVendorComplete = vendorStatus === "SENT" || vendorStatus === "COMPLETED";
  const isBoqComplete = boqStatus === "SENT" || boqStatus === "COMPLETED";
  
  return isRendersComplete && isVendorComplete && isBoqComplete;
};

// Get time remaining badge with color coding (updated to include seconds)
const getTimeRemainingBadge = (timeRemaining, project) => {
  // If all key steps (renders, BOQ, vendors) are sent/completed,
  // always show Completed regardless of timer state
  if (isProjectCompleted(project)) {
    return (
      <Badge
        variant="outline"
        className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
      >
        <CheckCircle className="h-3 w-3" />
        Completed
      </Badge>
    );
  }

  // Check if payment is completed but timer hasn't started (awaiting design questionnaire)
  const isReadyToStart = project.paymentStatus === "COMPLETED" && !project.designStartTime;
  
  const status = getTimeRemainingStatus(timeRemaining, project);
  
  const config = {
    "not-started": { 
      color: isReadyToStart 
        ? "bg-purple-100 text-purple-800 border-purple-200" 
        : "bg-gray-100 text-gray-800 border-gray-200", 
      label: isReadyToStart ? "Awaiting Questionnaire" : "Not Started",
      icon: PlayCircle
    },
    "normal": { 
      color: "bg-blue-100 text-blue-800 border-blue-200", 
      label: formatTimeRemaining(timeRemaining),
      icon: Clock
    },
    "warning": { 
      color: "bg-amber-100 text-amber-800 border-amber-200", 
      label: formatTimeRemaining(timeRemaining),
      icon: AlertCircle
    },
    "urgent": { 
      color: "bg-orange-100 text-orange-800 border-orange-200", 
      label: formatTimeRemaining(timeRemaining),
      icon: Zap
    },
    "overdue": { 
      color: "bg-red-100 text-red-800 border-red-200", 
      label: "Overdue",
      icon: AlertCircle
    }
  };

  const IconComponent = config[status].icon;

  return (
    <Badge variant="outline" className={`px-2 py-1 text-xs font-medium ${config[status].color} flex items-center gap-1`}>
      <IconComponent className="h-3 w-3" />
      {config[status].label}
    </Badge>
  );
};

const getSortedProjects = (projects) => {
  return [...projects].sort((a, b) => {
    switch (sortBy) {
      case "createdAt":
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return sortOrder === "desc" ? bDate - aDate : aDate - bDate; // desc = newest first
      
      case "timeRemaining":
        const aTime = calculateTimeRemaining(a) ?? 999 * 60 * 60 * 1000;
        const bTime = calculateTimeRemaining(b) ?? 999 * 60 * 60 * 1000;
        return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
      
      case "title":
        return sortOrder === "asc" 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      
      default:
        const defaultADate = new Date(a.createdAt);
        const defaultBDate = new Date(b.createdAt);
        return defaultBDate - defaultADate; // Default to newest first
    }
  });
};

  const filteredProjects = getSortedProjects(projects.filter((project) => {
    // Enhanced search - includes user name, email, phone, and project title
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      project.title?.toLowerCase().includes(searchLower) ||
      project.user?.name?.toLowerCase().includes(searchLower) ||
      project.user?.email?.toLowerCase().includes(searchLower) ||
      project.user?.phone?.toLowerCase().includes(searchLower) ||
      project.publicId?.toLowerCase().includes(searchLower) ||
      project.displayId?.toLowerCase().includes(searchLower) ||
      project.address?.toLowerCase().includes(searchLower) ||
      project.city?.toLowerCase().includes(searchLower);

    // Package filter - based on selectedPackage or selectedPlan
    const matchesPackage = (() => {
      if (packageFilter === "all") return true;
      
      // Check by selectedPackage or selectedPlan name/price
      const packageName = (project.selectedPackage || project.selectedPlan || "").toLowerCase();
      const isSingleRoom = project.isSingleRoomPlan || packageName.includes("single room") || packageName.includes("499");
      
      switch (packageFilter) {
        case "single-room":
          return isSingleRoom;
        case "essential":
          return packageName.includes("essential") || packageName.includes("4999");
        case "premium":
          return packageName.includes("premium") || packageName.includes("9999");
        case "luxury":
          return packageName.includes("luxury") || packageName.includes("14999");
        default:
          return true;
      }
    })();

    // BOQ Status filter - match renders format (All, Pending, Generated, Sent)
    const matchesBoqStatus = (() => {
      if (boqStatusFilter === "all") return true;
      if (boqStatusFilter === "PENDING") {
        return project.boqStatus === "PENDING" || project.boqStatus === "DRAFT";
      }
      if (boqStatusFilter === "GENERATED") {
        return project.boqStatus === "GENERATED";
      }
      if (boqStatusFilter === "SENT") {
        return project.boqStatus === "SENT" || project.boqStatus === "COMPLETED";
      }
      return project.boqStatus === boqStatusFilter;
    })();

    // Renders Status filter - handle null/undefined cases
    const matchesRendersStatus = (() => {
      if (rendersStatusFilter === "all") return true;
      const rendersStatus = project.rendersStatus || "PENDING"; // Default to PENDING if null/undefined
      if (rendersStatusFilter === "PENDING") {
        return rendersStatus === "PENDING";
      }
      if (rendersStatusFilter === "GENERATED") {
        return rendersStatus === "PROCESSING";
      }
      if (rendersStatusFilter === "SENT") {
        return rendersStatus === "COMPLETED";
      }
      return rendersStatus === rendersStatusFilter;
    })();

    // Vendor Status filter - only PENDING and SENT
    const matchesVendorStatus = (() => {
      if (vendorStatusFilter === "all") return true;
      const vendorStatus = project.vendorStatus || "PENDING"; // Default to PENDING if null/undefined
      if (vendorStatusFilter === "PENDING") {
        return vendorStatus === "PENDING";
      }
      if (vendorStatusFilter === "SENT") {
        return vendorStatus === "SENT" || vendorStatus === "COMPLETED";
      }
      return false; // If filter is set but doesn't match PENDING or SENT, exclude
    })();

    const matchesPaymentStatus =
      paymentStatusFilter === "all" || project.paymentStatus === paymentStatusFilter;

    // Delivery Status filter - based on statistics cards
    const timeRemaining = calculateTimeRemaining(project);
    const timeStatus = getTimeRemainingStatus(timeRemaining, project);
    const isReadyToStart = project.paymentStatus === "COMPLETED" && !project.designStartTime;
    const isCompleted = isProjectCompleted(project);
    const isOverdue = timeRemaining !== null && timeRemaining <= 0 && !isCompleted;
    const isActive = timeRemaining !== null && timeRemaining > 0 && !isCompleted;
    const isUrgent = timeStatus === "urgent" && !isCompleted;
    const isPending = !project.designStartTime || 
                     (project.rendersStatus === "PENDING" && project.boqStatus === "PENDING" && project.vendorStatus === "PENDING");

    const matchesTimeRemaining = (() => {
      if (timeRemainingFilter === "all") return true;
      if (timeRemainingFilter === "completed") return isCompleted;
      if (timeRemainingFilter === "urgent") return isUrgent;
      if (timeRemainingFilter === "overdue") return isOverdue;
      if (timeRemainingFilter === "active") return isActive;
      if (timeRemainingFilter === "ready-to-start") return isReadyToStart;
      if (timeRemainingFilter === "pending") return isPending;
      if (timeRemainingFilter === "payment-pending") return project.paymentStatus === "PENDING";
      return timeStatus === timeRemainingFilter;
    })();

    return matchesSearch && matchesPackage && 
           matchesBoqStatus && matchesRendersStatus && matchesVendorStatus && 
           matchesPaymentStatus && matchesTimeRemaining;
  }));

  // Calculate pagination
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, packageFilter, boqStatusFilter, rendersStatusFilter, vendorStatusFilter, paymentStatusFilter, timeRemainingFilter, sortBy, sortOrder, currentTime]);

  // Calculate statistics
  const stats = {
    total: projects.length,
    
    // Project completion status
    pending: projects.filter(p => {
      // Projects that haven't started or are in early stages
      return !p.designStartTime || 
             (p.rendersStatus === "PENDING" && p.boqStatus === "PENDING" && p.vendorStatus === "PENDING");
    }).length,
    
    completed: projects.filter(p => isProjectCompleted(p)).length,
    
    overdue: projects.filter(p => {
      // Timeline has expired but not all three phases are sent
      const timeRemaining = calculateTimeRemaining(p);
      const isOverdue = timeRemaining !== null && timeRemaining <= 0;
      return isOverdue && !isProjectCompleted(p);
    }).length,
    
    // Timeline status
    active: projects.filter(p => {
      const timeRemaining = calculateTimeRemaining(p);
      return timeRemaining !== null && timeRemaining > 0 && !isProjectCompleted(p);
    }).length,
    
    urgent: projects.filter(p => {
      const timeRemaining = calculateTimeRemaining(p);
      return getTimeRemainingStatus(timeRemaining, p) === "urgent" && !isProjectCompleted(p);
    }).length,
    
    readyToStart: projects.filter(p => !p.designStartTime && p.paymentStatus === "COMPLETED").length,
    
    // Phase-specific stats
    rendersPending: projects.filter(p => p.rendersStatus === "PENDING" || p.rendersStatus === "PROCESSING").length,
    boqPending: projects.filter(p => p.boqStatus === "PENDING" || p.boqStatus === "DRAFT").length,
    vendorsPending: projects.filter(p => p.vendorStatus === "PENDING").length,
    
    // Payment stats
    paymentPending: projects.filter(p => p.paymentStatus === "PENDING").length,
    paymentCompleted: projects.filter(p => p.paymentStatus === "COMPLETED").length,
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const handleViewProject = (projectId) => {
    toast.success("Opening Project", {
      description: "Navigating to project details",
    });
  };

  const handleManageProject = (projectId) => {
    toast.success("Manage Project", {
      description: "Opening project management interface",
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleExportProjects = () => {
    toast.success("Export Started", {
      description: "Project data export has been initiated",
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Format date and time for display
  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    const timeStr = date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return `${dateStr} at ${timeStr}`;
  };


  // Handle delete button click - show first warning
  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteWarning(true);
  };

  // Handle "I have read and understand" button - show confirmation
  const handleConfirmWarning = () => {
    setShowDeleteWarning(false);
    setShowDeleteConfirm(true);
    setDeleteConfirmationText("");
  };

  // Handle final delete
  const handleFinalDelete = async () => {
    if (!projectToDelete) return;

    const confirmationPhrase = projectToDelete.title || "DELETE";
    
    if (deleteConfirmationText !== confirmationPhrase) {
      toast.error("Confirmation text does not match");
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/admin/projects/${projectToDelete.publicId}`);
      toast.success("Project deleted successfully");
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
      setDeleteConfirmationText("");
      loadProjects(); // Reload projects list
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(error.response?.data?.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  // Add this helper function
const isNewProject = (createdAt) => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now - createdDate) / (1000 * 60 * 60);
  return hoursDiff < 24; // Projects created within last 24 hours
};

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Projects Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage all customer projects - 72 Hour Delivery
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Projects Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage all customer projects - 48H/72H Delivery Timeline
          </p>
        </div>
        {/* <div className="flex gap-3">
          <Button onClick={handleExportProjects} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div> */}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
          <CardContent className="p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-blue-100 text-sm font-medium">Total Projects</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
                <p className="text-xs text-blue-100 mt-1.5 opacity-90 mt-2">
                  All projects in the system
                </p>
              </div>
              <Building2 className="h-8 w-8 opacity-80 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        {/* Completed Projects */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-green-600 text-sm font-medium">Completed Projects</p>
                <p className="text-2xl font-bold mt-1 text-green-700">
                  {stats.completed}
                </p>
                <p className="text-xs text-green-600 mt-1.5 leading-relaxed">
                  All phases sent: Renders, BOQ, and Vendors delivered
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-60 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        {/* Urgent Projects */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-orange-600 text-sm font-medium">Urgent Projects</p>
                <p className="text-2xl font-bold mt-1 text-orange-700">
                  {stats.urgent}
                </p>
                <p className="text-xs text-orange-600 mt-1.5 leading-relaxed">
                  Less than 24H (72H plan) or 12H (48H plan) remaining
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600 opacity-60 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        {/* Overdue Projects */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-red-600 text-sm font-medium">Overdue Projects</p>
                <p className="text-2xl font-bold mt-1 text-red-700">
                  {stats.overdue}
                </p>
                <p className="text-xs text-red-600 mt-1.5 leading-relaxed">
                  Timeline expired but not all phases sent to user
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600 opacity-60 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Timeline */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-blue-600 text-sm font-medium">Active Timeline</p>
                <p className="text-2xl font-bold mt-1 text-blue-700">
                  {stats.active}
                </p>
                <p className="text-xs text-blue-600 mt-1.5 leading-relaxed">
                  Projects with running 48H/72H delivery timer
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-600 opacity-60 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        {/* Ready to Start */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-purple-600 text-sm font-medium">Ready to Start</p>
                <p className="text-2xl font-bold mt-1 text-purple-700">
                  {stats.readyToStart}
                </p>
                <p className="text-xs text-purple-600 mt-1.5 leading-relaxed">
                  Payment completed, awaiting design questionnaire submission
                </p>
              </div>
              <PlayCircle className="h-8 w-8 text-purple-600 opacity-60 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Projects */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-amber-600 text-sm font-medium">Pending Projects</p>
                <p className="text-2xl font-bold mt-1 text-amber-700">
                  {stats.pending}
                </p>
                <p className="text-xs text-amber-600 mt-1.5 leading-relaxed">
                  Pending action(s) from user side
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-600 opacity-60 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        {/* Payment Pending */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Payment Pending</p>
                <p className="text-2xl font-bold mt-1 text-gray-700">
                  {stats.paymentPending}
                </p>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                  Projects awaiting customer payment completion
                </p>
              </div>
              <IndianRupee className="h-8 w-8 text-gray-600 opacity-60 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters Section */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, users, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm flex-1"
              >
                <option value="createdAt">Newest First</option>
                <option value="title">Project Name (A-Z)</option>
                <option value="timeRemaining">Delivery Time Remaining</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="h-10 px-3"
                title={sortOrder === "desc" ? "Descending" : "Ascending"}
              >
                {sortBy === "createdAt" ? (sortOrder === "desc" ? "↓ Newest" : "↑ Oldest") : (sortOrder === "asc" ? "↑" : "↓")}
              </Button>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">

            {/* Renders Status Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Renders Status</label>
              <select
                value={rendersStatusFilter}
                onChange={(e) => setRendersStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Renders</option>
                <option value="PENDING">Pending</option>
                <option value="GENERATED">Generated</option>
                <option value="SENT">Sent</option>
              </select>
            </div>

            {/* BOQ Status Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">BOQ Status</label>
              <select
                value={boqStatusFilter}
                onChange={(e) => setBoqStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All BOQ</option>
                <option value="PENDING">Pending</option>
                <option value="GENERATED">Generated</option>
                <option value="SENT">Sent</option>
              </select>
            </div>

            {/* Vendor Status Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Vendor Status</label>
              <select
                value={vendorStatusFilter}
                onChange={(e) => setVendorStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Vendors</option>
                <option value="PENDING">Pending</option>
                <option value="SENT">Sent</option>
              </select>
            </div>

            {/* Package Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Package</label>
              <select
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Packages</option>
                <option value="single-room">Single Room (₹499)</option>
                <option value="essential">Essential (₹4,999)</option>
                <option value="premium">Premium (₹9,999)</option>
                <option value="luxury">Luxury (₹14,999)</option>
              </select>
            </div>

            {/* Delivery Status Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Delivery Status</label>
              <select
                value={timeRemainingFilter}
                onChange={(e) => setTimeRemainingFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Delivery Status</option>
                <option value="completed">Completed</option>
                <option value="active">Active Timeline</option>
                <option value="urgent">Urgent</option>
                <option value="overdue">Overdue</option>
                <option value="ready-to-start">Ready to Start</option>
                <option value="pending">Pending</option>
                <option value="payment-pending">Payment Pending</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Payment</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Payments</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Active Filters Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {packageFilter !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Package: {packageFilter === "single-room" ? "Single Room" : packageFilter === "essential" ? "Essential" : packageFilter === "premium" ? "Premium" : "Luxury"}
              </Badge>
            )}
            {timeRemainingFilter !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Delivery: {timeRemainingFilter.replace(/-/g, " ")}
              </Badge>
            )}
            {boqStatusFilter !== "all" && (
              <Badge variant="secondary" className="text-xs">
                BOQ: {boqStatusFilter}
              </Badge>
            )}
            {rendersStatusFilter !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Renders: {rendersStatusFilter}
              </Badge>
            )}
            {vendorStatusFilter !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Vendors: {vendorStatusFilter}
              </Badge>
            )}
            {paymentStatusFilter !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Payment: {paymentStatusFilter}
              </Badge>
            )}
            {(packageFilter !== "all" || timeRemainingFilter !== "all" || 
              boqStatusFilter !== "all" || rendersStatusFilter !== "all" || 
              vendorStatusFilter !== "all" || paymentStatusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPackageFilter("all");
                  setTimeRemainingFilter("all");
                  setBoqStatusFilter("all");
                  setRendersStatusFilter("all");
                  setVendorStatusFilter("all");
                  setPaymentStatusFilter("all");
                }}
                className="h-6 text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                    #
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                    <div className="flex items-center gap-1">
                      #
                      {sortBy === "createdAt" && sortOrder === "desc" && (
                        <span className="text-xs text-green-600" title="Newest projects first">●</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Project Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Delivery Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Client
                  </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Renders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    BOQ
                  </th>
                 
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Vendors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedProjects.map((project, index) => {
                  const statusConfig = getStatusConfig(project.status);
                  const boqStatusConfig = getBOQStatusConfig(project.boqStatus);
                  const rendersStatusConfig = getRendersStatusConfig(project.rendersStatus);
                  const serialNumber = startIndex + index + 1;
                  const timeRemaining = calculateTimeRemaining(project);

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-gray-50 transition-colors border-b"
                    >
                      {/* Serial Number */}
                      <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                        {serialNumber}
                      </td>

                      {/* Project Info */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          {/* Display ID - Project ID */}
                          {project.displayId && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                {project.displayId}
                              </span>
                            </div>
                          )}
                          
                          {/* Project Title */}
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {project.title}
                            </p>
                            {isNewProject(project.createdAt) && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-[8px] px-1.5 py-0.5">
                                New
                              </Badge>
                            )}
                          </div>
                          
                          {/* City and Pincode */}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">
                              {project.city || "—"}
                              {project.pincode && `, ${project.pincode}`}
                            </span>
                          </div>
                          
                          {/* Project Type */}
                          <div className="text-xs text-gray-500">
                            {project.projectType || "—"}
                          </div>
                          
                          {/* Selected Style */}
                          {project.selectedStyle && (
                            <div className="text-xs text-gray-500">
                              Style: <span className="font-medium text-gray-700">{project.selectedStyle}</span>
                            </div>
                          )}
                          
                          {/* Created Date and Time */}
                          <div className="text-xs text-gray-400">
                            {formatDateTime(project.createdAt)}
                          </div>
                        </div>
                      </td>

                      {/* Delivery Status */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          {getTimeRemainingBadge(timeRemaining, project)}
                          {timeRemaining !== null && (
                            <span className="text-xs text-muted-foreground">
                              {isSingleRoomPlan(project) ? '48H' : '72H'} plan
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Client */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {project.user?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {project.user?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {project.user?.email || "No email"}
                            </p>
                            {project.user?.phone && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                <p className="text-xs text-gray-500 truncate">
                                  {project.user.phone}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                       {/* Renders Status */}
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            !project.rendersStatus || project.rendersStatus === "PENDING"
                              ? "bg-gray-50 text-gray-700 border-gray-200"
                              : project.rendersStatus === "PROCESSING"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : project.rendersStatus === "COMPLETED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {getRendersDisplayStatus(project.rendersStatus)}
                        </Badge>
                      </td>

                      {/* BOQ Status */}
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            project.boqStatus === "DRAFT" || project.boqStatus === "PENDING"
                              ? "bg-gray-50 text-gray-700 border-gray-200"
                              : project.boqStatus === "GENERATED"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : project.boqStatus === "SENT"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : project.boqStatus === "APPROVED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {getBOQDisplayStatus(project.boqStatus)}
                        </Badge>
                      </td>

                     

                      {/* Vendor Status */}
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            project.vendorStatus === "PENDING"
                              ? "bg-gray-50 text-gray-700 border-gray-200"
                              : project.vendorStatus === "SENT"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : project.vendorStatus === "VIEWED"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : project.vendorStatus === "ACCEPTED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : project.vendorStatus === "REJECTED"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {getVendorDisplayStatus(project.vendorStatus)}
                        </Badge>
                      </td>

                      {/* Payment Status */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <Badge
                            variant="outline"
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              project.paymentStatus === "COMPLETED"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                          >
                            {project.paymentStatus}
                          </Badge>
                          {project.paymentStatus === "COMPLETED" && project.selectedPlan && (
                            <p className="text-xs text-gray-600 font-medium">
                              {project.selectedPlan}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/projects/${project.publicId}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                              title="View Project"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/admin/projects/${project.publicId}/edit`}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200"
                              title="Edit Project"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                            title="Delete Project"
                            onClick={() => handleDeleteClick(project)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || packageFilter !== "all" || timeRemainingFilter !== "all" || 
               boqStatusFilter !== "all" || rendersStatusFilter !== "all" || 
               vendorStatusFilter !== "all" || paymentStatusFilter !== "all"
                ? "No projects match your current filters. Try adjusting your search criteria."
                : "No projects have been created yet."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setPackageFilter("all");
                  setTimeRemainingFilter("all");
                  setBoqStatusFilter("all");
                  setRendersStatusFilter("all");
                  setVendorStatusFilter("all");
                  setPaymentStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Warning Modal - Step 1 */}
      <Dialog open={showDeleteWarning} onOpenChange={setShowDeleteWarning}>
        <DialogContent className="sm:max-w-[540px] bg-[#0d1117] border-[#30363d] text-white">
          <DialogHeader className="border-b border-[#30363d] pb-4">
            <DialogTitle className="text-white text-xl">
              Delete {projectToDelete?.title || "Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Project Info with Lock Icon */}
            <div className="flex flex-col items-center text-center space-y-3">
              <Lock className="h-12 w-12 text-[#8b949e]" />
              <div>
                <h3 className="text-2xl font-semibold text-white mb-1">
                  {projectToDelete?.title || "Project"}
                </h3>
                <div className="flex items-center justify-center gap-4 text-sm text-[#8b949e]">
                  <span>{projectToDelete?.projectType || "—"}</span>
                  {projectToDelete?.areaSqFt && (
                    <>
                      <span>•</span>
                      <span>{projectToDelete.areaSqFt.toLocaleString()} sq ft</span>
                    </>
                  )}
                  {projectToDelete?.user?.name && (
                    <>
                      <span>•</span>
                      <span>Owner: {projectToDelete.user.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-200">
                  Please read the effects below before proceeding.
                </p>
              </div>
            </div>

            {/* Effects List */}
            <div className="space-y-2 text-sm text-[#c9d1d9]">
              <p className="text-white font-medium">This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  The <strong className="text-white">{projectToDelete?.title || "project"}</strong> project and all associated data (files, floor plans, BOQs, renders, payments, questionnaire responses).
                </li>
                <li>This action cannot be undone.</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="border-t border-[#30363d] pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteWarning(false);
                setProjectToDelete(null);
              }}
              className="bg-transparent border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmWarning}
              className="bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d]"
            >
              I have read and understand these effects
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal - Step 2 */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[540px] bg-[#0d1117] border-[#30363d] text-white">
          <DialogHeader className="border-b border-[#30363d] pb-4">
            <DialogTitle className="text-white text-xl">
              Delete {projectToDelete?.title || "Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Project Info with Lock Icon */}
            <div className="flex flex-col items-center text-center space-y-3">
              <Lock className="h-12 w-12 text-[#8b949e]" />
              <div>
                <h3 className="text-2xl font-semibold text-white mb-1">
                  {projectToDelete?.title || "Project"}
                </h3>
                <div className="flex items-center justify-center gap-4 text-sm text-[#8b949e]">
                  <span>{projectToDelete?.projectType || "—"}</span>
                  {projectToDelete?.areaSqFt && (
                    <>
                      <span>•</span>
                      <span>{projectToDelete.areaSqFt.toLocaleString()} sq ft</span>
                    </>
                  )}
                  {projectToDelete?.user?.name && (
                    <>
                      <span>•</span>
                      <span>Owner: {projectToDelete.user.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Confirmation Instruction */}
            <div className="space-y-3">
              <p className="text-[#c9d1d9] text-sm">
                To confirm, type <span className="font-mono text-white font-semibold">"{projectToDelete?.title || "DELETE"}"</span> in the box below
              </p>
              <Input
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder={projectToDelete?.title || "DELETE"}
                className={`font-mono bg-[#0d1117] border-2 ${
                  deleteConfirmationText && 
                  deleteConfirmationText !== (projectToDelete?.title || "DELETE")
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#30363d] focus:border-[#58a6ff]"
                } text-white placeholder:text-[#6e7681] focus:ring-0`}
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="border-t border-[#30363d] pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setProjectToDelete(null);
                setDeleteConfirmationText("");
              }}
              disabled={isDeleting}
              className="bg-transparent border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFinalDelete}
              disabled={
                isDeleting ||
                deleteConfirmationText !== (projectToDelete?.title || "DELETE")
              }
              className={`${
                deleteConfirmationText === (projectToDelete?.title || "DELETE")
                  ? "bg-[#da3633] hover:bg-[#f85149]"
                  : "bg-[#21262d] border border-[#30363d] cursor-not-allowed opacity-50"
              } text-white`}
            >
              {isDeleting ? "Deleting..." : "Delete this project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}