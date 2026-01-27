// src\app\admin\vendors\assignment\page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Upload,
  Users,
  Building,
  MapPin,
  Clock,
  Search,
  Filter,
  FileText,
  Download,
  Check,
  ArrowUpDown,
  AlertCircle,
  Zap,
  PlayCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import api from "@/lib/axios";
import VendorAssignmentImport from "@/components/admin/vendors/VendorAssignmentImport";

export default function AssignVendorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState(new Set());
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  // Get project ID from URL
  const projectIdFromUrl = searchParams.get("project");

  // Update timer every second for real-time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine if project is single room plan (48 hours)
  const isSingleRoomPlan = (proj) => {
    return proj?.selectedPlan === 'Single Room Trial' || 
           proj?.selectedPlan?.toLowerCase().includes('single room') ||
           proj?.selectedPlan?.toLowerCase().includes('499') ||
           proj?.isSingleRoomPlan === true;
  };

  // Calculate time remaining for delivery
  const calculateTimeRemaining = (proj) => {
    if (!proj?.designStartTime) return null;
    const now = currentTime;
    const startTime = new Date(proj.designStartTime).getTime();
    const elapsed = now - startTime;
    const isSingleRoom = isSingleRoomPlan(proj);
    const totalTime = isSingleRoom ? 48 * 60 * 60 * 1000 : 72 * 60 * 60 * 1000;
    return Math.max(0, totalTime - elapsed);
  };

  // Get time remaining status
  const getTimeRemainingStatus = (timeRemaining, proj) => {
    if (timeRemaining === null) return "not-started";
    if (timeRemaining <= 0) return "overdue";
    const isSingleRoom = isSingleRoomPlan(proj);
    if (isSingleRoom) {
      if (timeRemaining <= (12 * 60 * 60 * 1000)) return "urgent";
      if (timeRemaining <= (24 * 60 * 60 * 1000)) return "warning";
    } else {
      if (timeRemaining <= (24 * 60 * 60 * 1000)) return "urgent";
      if (timeRemaining <= (48 * 60 * 60 * 1000)) return "warning";
    }
    return "normal";
  };

  // Format time remaining
  const formatTimeRemaining = (ms) => {
    if (ms === null) return "Not started";
    if (ms <= 0) return "Overdue";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${hours}h ${formattedMinutes}m ${formattedSeconds}s`;
  };

  // Check if project is completed
  const isProjectCompleted = (proj) => {
    if (!proj) return false;
    const rendersStatus = proj.rendersStatus;
    const vendorStatus = proj.vendorStatus;
    const boqStatus = proj.boqStatus;
    const isRendersComplete = rendersStatus === "COMPLETED";
    const isVendorComplete = vendorStatus === "SENT" || vendorStatus === "COMPLETED";
    const isBoqComplete = boqStatus === "SENT" || boqStatus === "COMPLETED";
    return isRendersComplete && isVendorComplete && isBoqComplete;
  };

  // Get time remaining badge
  const getTimeRemainingBadge = (timeRemaining, proj) => {
    if (isProjectCompleted(proj)) {
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
    const isReadyToStart = proj.paymentStatus === "COMPLETED" && !proj.designStartTime;
    const status = getTimeRemainingStatus(timeRemaining, proj);
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

  // Fetch pending projects
  useEffect(() => {
    loadProjects();
  }, []);

  // Fetch available vendors
  useEffect(() => {
    loadVendors();
  }, []);

  // Auto-select project when URL has projectId
  useEffect(() => {
    if (projects.length > 0 && projectIdFromUrl) {
      autoSelectProject(projectIdFromUrl);
    }
  }, [projects, projectIdFromUrl]);

  const autoSelectProject = (projectId) => {
    const foundProject = projects.find(
      (project) => project.publicId === projectId
    );
    if (foundProject) {
      setSelectedProject(foundProject);
      toast.success("Project Auto-Selected", {
        description: `Project ${foundProject.title} has been automatically selected.`,
      });
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get("/vendor-assignments/projects/pending", {
        params: { search: searchQuery }
      });
      if (response.data.success) {
        setProjects(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const loadVendors = async () => {
    try {
      const response = await api.get("/projects-vendor/vendors/list");
      if (response.data.success) {
        setVendors(response.data.data.vendors || []);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    }
  };

  const handleCancel = () => {
    router.back();
  };
  

  const handleImportComplete = (importResults) => {
    toast.success("Vendors Imported & Assigned", {
      description: `${importResults.successful} vendors have been successfully assigned to the project.`,
    });
    router.push("/admin/vendors/assignment/manage");
  };

  const handleVendorToggle = (vendorId) => {
    const newSelected = new Set(selectedVendors);
    if (newSelected.has(vendorId)) {
      newSelected.delete(vendorId);
    } else {
      newSelected.add(vendorId);
    }
    setSelectedVendors(newSelected);
  };

  const handleManualAssign = async () => {
    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }

    if (selectedVendors.size === 0) {
      toast.error("Please select at least one vendor");
      return;
    }

    try {
      const response = await api.post("/projects-vendor/assign", {
        projectId: selectedProject.id,
        vendorIds: Array.from(selectedVendors),
      });

      if (response.data.success) {
        toast.success("Vendors Assigned", {
          description: `${selectedVendors.size} vendors have been assigned successfully`,
        });
        // Refresh projects list
        loadProjects();
        setSelectedProject(null);
        setSelectedVendors(new Set());
        router.push("/admin/vendors/assignment/manage");
      }
    } catch (error) {
      console.error("Error assigning vendors:", error);
      toast.error(error.response?.data?.message || "Failed to assign vendors");
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.publicId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.displayId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="border-border"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Assign Vendors</h1>
              <p className="text-sm text-muted-foreground">
                {projectIdFromUrl
                  ? "Auto-selecting project from URL..."
                  : "Assign vendors to projects manually or import from Excel"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/admin/vendors/assignment/manage">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Users className="w-4 h-4 mr-2" />
                Manage Assignments
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Projects List */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-border">
              {/* <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pending Projects</CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {projects.length} Projects
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Projects waiting for vendor assignment
                </p>
              </CardHeader> */}
              <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Pending Projects</CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                    <span className="flex items-center gap-1">
                      <ArrowUpDown className="w-3 h-3" />
                      Newest First
                    </span>
                  </Badge>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {projects.length} Projects
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Projects waiting for vendor assignment • Sorted by newest first
              </p>
            </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects by title, client, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && loadProjects()}
                    className="pl-9 border-border"
                  />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No pending projects found</p>
                    </div>
                  ) : (
                    filteredProjects.map((project) => {
                      const timeRemaining = calculateTimeRemaining(project);
                      const isSingleRoom = isSingleRoomPlan(project);
                      
                      return (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          isSelected={selectedProject?.id === project.id}
                          onSelect={() => setSelectedProject(project)}
                          timeRemaining={timeRemaining}
                          isSingleRoom={isSingleRoom}
                          getTimeRemainingBadge={getTimeRemainingBadge}
                        />
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Vendor Assignment */}
          <div className="lg:col-span-2 space-y-6">
            {selectedProject ? (
              <>
                {/* Selected Project Info */}
                <Card className="border-border bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                            Selected Project
                          </h4>
                          {isSingleRoomPlan(selectedProject) && (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-gray-100 text-gray-700 border-gray-300"
                            >
                              {isSingleRoomPlan(selectedProject) ? '48H' : '72H'} plan
                            </Badge>
                          )}
                          {calculateTimeRemaining(selectedProject) !== null && (
                            <div className="ml-auto">
                              {getTimeRemainingBadge(calculateTimeRemaining(selectedProject), selectedProject)}
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                            <div>
                              <strong>ID:</strong>{" "}
                              {selectedProject.displayId ? (
                                <span className="font-mono font-semibold text-blue-800">
                                  {selectedProject.displayId}
                                </span>
                              ) : (
                                <span>{selectedProject.publicId || selectedProject.id}</span>
                              )}
                            </div>
                            <div>
                              <strong>Title:</strong> {selectedProject.title}
                            </div>
                            <div>
                              <strong>Type:</strong> {selectedProject.projectType}
                            </div>
                            <div>
                              <strong>Style:</strong>{" "}
                              {selectedProject.selectedStyle ? (
                                <span>{typeof selectedProject.selectedStyle === 'string' ? selectedProject.selectedStyle : selectedProject.selectedStyle?.name}</span>
                              ) : (
                                <span className="text-gray-500 italic">Not selected</span>
                              )}
                            </div>
                            {selectedProject.paymentStatus && (
                              <div>
                                <strong>Payment Status:</strong>{" "}
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] ${
                                    selectedProject.paymentStatus === "COMPLETED"
                                      ? "bg-green-100 text-green-800 border-green-300"
                                      : selectedProject.paymentStatus === "PENDING"
                                      ? "bg-amber-100 text-amber-800 border-amber-300"
                                      : "bg-gray-100 text-gray-800 border-gray-300"
                                  }`}
                                >
                                  {selectedProject.paymentStatus}
                                </Badge>
                              </div>
                            )}
                            {selectedProject.totalPaid !== undefined && selectedProject.totalPaid > 0 && (
                              <div>
                                <strong>Amount Paid:</strong>{" "}
                                <span className="font-semibold text-green-700">
                                  ₹{selectedProject.totalPaid.toLocaleString("en-IN")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                            <div>
                              <strong>Client:</strong> {selectedProject.user?.name}
                            </div>
                            <div>
                              <strong>Email:</strong> {selectedProject.user?.email}
                            </div>
                            {(selectedProject.user?.phone || selectedProject.userPhone) && (
                              <div>
                                <strong>Phone:</strong> {selectedProject.user?.phone || selectedProject.userPhone}
                              </div>
                            )}
                            <div>
                              <strong>City:</strong>{" "}
                              {selectedProject.city ? (
                                <>
                                  {selectedProject.city}
                                  {selectedProject.pincode && ` - ${selectedProject.pincode}`}
                                </>
                              ) : (
                                <span className="text-gray-500 italic">N/A</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <Button
                          onClick={() => setShowImportModal(true)}
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Import Vendors
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Manual Vendor Selection */}
                {/* <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Select Vendors to Assign</span>
                      <Badge variant="outline">
                        {selectedVendors.size} Selected
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Choose vendors to assign to this project
                    </p>
                  </CardHeader>
                  <CardContent>
                    {vendors.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No vendors available</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {vendors.map((vendor) => (
                          <VendorCard
                            key={vendor.id}
                            vendor={vendor}
                            isSelected={selectedVendors.has(vendor.id)}
                            onToggle={() => handleVendorToggle(vendor.id)}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card> */}

                {/* Action Buttons */}
                {/* <Card className="border-border sticky bottom-6 bg-background shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>Project: <strong className="text-foreground">{selectedProject.title}</strong></span>
                          <span>•</span>
                          <span>{selectedVendors.size} vendors selected</span>
                          <span>•</span>
                          <Button
                            variant="link"
                            onClick={() => setSelectedVendors(new Set())}
                            className="p-0 h-auto text-red-600"
                          >
                            Clear Selection
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedProject(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleManualAssign}
                          disabled={selectedVendors.size === 0}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Assign Selected Vendors
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
              </>
            ) : (
              <Card className="border-border">
                <CardContent className="p-12 text-center">
                  <Building className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No Project Selected
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Select a project from the list to assign vendors
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">You can:</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => document.querySelector('input[placeholder*="Search projects"]')?.focus()}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Search Projects
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowImportModal(true)}
                        disabled={!selectedProject}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import Vendors
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Import Modal */}
        <VendorAssignmentImport
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportComplete={handleImportComplete}
          selectedProject={selectedProject}
        />
      </div>
    </div>
  );
}

// Update the ProjectCard component in your frontend:
const ProjectCard = ({ project, isSelected, onSelect, timeRemaining, isSingleRoom, getTimeRemainingBadge }) => {
   const isNewProject = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now - createdDate) / (1000 * 60 * 60);
    return hoursDiff < 24; // Projects created within last 24 hours
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
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-border hover:border-blue-300 hover:bg-blue-25"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Display ID */}
            {project.displayId && (
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {project.displayId}
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-gray-100 text-gray-700 border-gray-300"
                >
                  {isSingleRoom ? '48H' : '72H'} plan
                </Badge>
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-foreground text-sm truncate">
                {project.title}
              </h4>
              {/* Add New Badge here */}
              {isNewProject(project.createdAt) && (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-[0.65rem] px-1 py-0.5 font-medium leading-none">
                  New
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {project.projectType}
              </Badge>
            </div>
            {/* Timer Badge */}
            {timeRemaining !== undefined && getTimeRemainingBadge && (
              <div className="mb-2">
                {getTimeRemainingBadge(timeRemaining, project)}
              </div>
            )}
            
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span className="truncate">{project.user?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{project.city}</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                <span>{project.budgetRange}</span>
              </div> */}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(project.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {isSelected && (
            <div className="ml-4">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>
        
        {/* Status Badge */}
        <div className="mt-3 flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`text-xs ${
              project.vendorListStatus === "PENDING" 
                ? "bg-yellow-50 text-yellow-700" 
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {project.vendorListStatus}
          </Badge>
          {project.hasBOQ && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
              Has BOQ
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Vendor Card Component
const VendorCard = ({ vendor, isSelected, onToggle }) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-green-500 bg-green-50"
          : "border-border hover:border-green-300 hover:bg-green-25"
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-foreground text-sm">
                {vendor.name}
              </h4>
              {vendor.isVerified && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 text-xs"
                >
                  Verified
                </Badge>
              )}
              {vendor.rating && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>⭐ {vendor.rating}</span>
                  <span>({vendor.reviewCount})</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-xs text-muted-foreground">
              {vendor.businessName && (
                <p className="font-medium">{vendor.businessName}</p>
              )}
              <div className="flex items-center gap-2">
                <span>{vendor.email}</span>
                <span>•</span>
                <span>{vendor.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{vendor.city}</span>
                {vendor.state && <span>, {vendor.state}</span>}
              </div>
              
              {/* Categories */}
              {vendor.categories && vendor.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {vendor.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 text-xs"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-4">
            {isSelected ? (
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};