// src\app\admin\vendors\assignment\manage\page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  Building,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Globe,
  Undo,
  Send,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import api from "@/lib/axios";

export default function VendorManagementPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [selectedVendors, setSelectedVendors] = useState(new Set());

  // Fetch all vendor assignments
  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/projects-vendor");
      if (response.data.success) {
        setAssignments(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading assignments:", error);
      toast.error("Failed to load vendor assignments");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // Group assignments by project
  const groupedByProject = assignments.reduce((acc, assignment) => {
    const projectId = assignment.projectId;
    if (!acc[projectId]) {
      acc[projectId] = {
        project: assignment.project,
        vendors: []
      };
    }
    acc[projectId].vendors.push(assignment);
    return acc;
  }, {});

  // Convert to array and add vendor count
  const projectsWithVendors = Object.values(groupedByProject).map(group => ({
    ...group.project,
    vendors: group.vendors,
    vendorCount: group.vendors.length
  }));

  // Filter projects based on search
  const filteredProjects = projectsWithVendors.filter(project => {
    const matchesSearch = 
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.vendors.some(vendor => 
        vendor.vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.vendor?.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus = statusFilter === "all" || 
      project.vendors.some(vendor => vendor.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  const toggleProjectExpansion = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleVendorStatusUpdate = async (projectId, vendorId, newStatus, feedback = null, rating = null) => {
    try {
      const payload = {
        status: newStatus,
        ...(feedback && { clientFeedback: feedback }),
        ...(rating && { clientRating: rating })
      };

      const response = await api.patch(
        `/projects-vendor/project/${projectId}/vendor/${vendorId}/status`,
        payload
      );

      if (response.data.success) {
        toast.success("Status Updated", {
          description: `Vendor status updated to ${newStatus}`,
        });
        loadAssignments(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleRemoveVendor = async (projectId, vendorId) => {
    if (!confirm("Are you sure you want to remove this vendor from the project?")) {
      return;
    }

    try {
      const response = await api.delete(
        `/projects-vendor/project/${projectId}/vendor/${vendorId}`
      );

      if (response.data.success) {
        toast.success("Vendor Removed", {
          description: "Vendor has been removed from the project",
        });
        loadAssignments(); // Refresh data
      }
    } catch (error) {
      console.error("Error removing vendor:", error);
      toast.error("Failed to remove vendor");
    }
  };

  const handleSendToUser = async (projectId) => {
  if (confirm("Are you sure you want to send these vendors to the user?")) {
    try {
      const response = await api.patch(
        `/projects-vendor/${projectId}/send-to-user`
      );
      if (response.data.success) {
        toast.success("Vendors Sent", {
          description: "Vendors have been sent to the user",
        });
        loadAssignments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send vendors");
    }
  }
};

const handleRevokeFromUser = async (projectId) => {
  if (confirm("Are you sure you want to revoke vendors from the user?")) {
    try {
      const response = await api.patch(
        `/projects-vendor/${projectId}/revoke-from-user`
      );
      if (response.data.success) {
        toast.success("Vendors Revoked", {
          description: "Vendors have been revoked from the user",
        });
        loadAssignments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to revoke vendors");
    }
  }
};

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedVendors.size === 0) {
      toast.error("Please select at least one vendor");
      return;
    }

    try {
      const promises = Array.from(selectedVendors).map(({ projectId, vendorId }) => 
        api.patch(`/projects-vendor/project/${projectId}/vendor/${vendorId}/status`, {
          status: newStatus
        })
      );

      await Promise.all(promises);
      toast.success("Bulk Update Complete", {
        description: `Updated ${selectedVendors.size} vendors to ${newStatus}`,
      });
      setSelectedVendors(new Set());
      loadAssignments();
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast.error("Failed to update vendors");
    }
  };

  const handleExportData = () => {
    const headers = ["Project", "Client", "Vendor", "Business", "Status", "City", "Rating", "Assigned Date"];
    const csvData = assignments.map(assignment => [
      assignment.project?.title || "N/A",
      assignment.project?.user?.name || "N/A",
      assignment.vendor?.name || "N/A",
      assignment.vendor?.businessName || "N/A",
      assignment.status,
      assignment.vendor?.city || "N/A",
      assignment.clientRating || "N/A",
      new Date(assignment.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendor-assignments.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
      SENT: "text-blue-600 bg-blue-50 border-blue-200",
      VIEWED: "text-purple-600 bg-purple-50 border-purple-200",
      CONTACTED: "text-orange-600 bg-orange-50 border-orange-200",
      ACCEPTED: "text-green-600 bg-green-50 border-green-200",
      REJECTED: "text-red-600 bg-red-50 border-red-200"
    };
    return colors[status] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getStatusCounts = () => {
    const counts = {
      PENDING: 0,
      SENT: 0,
      VIEWED: 0,
      CONTACTED: 0,
      ACCEPTED: 0,
      REJECTED: 0,
      TOTAL: assignments.length
    };

    assignments.forEach(assignment => {
      if (counts[assignment.status] !== undefined) {
        counts[assignment.status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
               <Link href="/admin/vendors">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Vendors
                </Button>
              </Link>
              <div>
              <h1 className="text-3xl font-bold text-foreground">Vendor Assignments</h1>
              <p className="text-sm text-muted-foreground">
                Manage vendor assignments grouped by project
              </p>
              </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>

            <Link href="/admin/vendors/assignment/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Assign Vendors
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{statusCounts.TOTAL}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.PENDING}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.SENT}</p>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.ACCEPTED}</p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects, clients, vendors, cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md text-sm bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="SENT">Sent</option>
                  <option value="VIEWED">Viewed</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                {selectedVendors.size > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Bulk Actions ({selectedVendors.size})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Update Status To</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleBulkStatusUpdate("SENT")}>
                        Mark as Sent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusUpdate("VIEWED")}>
                        Mark as Viewed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusUpdate("CONTACTED")}>
                        Mark as Contacted
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusUpdate("ACCEPTED")}>
                        Mark as Accepted
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusUpdate("REJECTED")}>
                        Mark as Rejected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Projects with Vendor Assignments ({filteredProjects.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No vendor assignments found</p>
                <Link href="/admin/vendors/assignment/">
                  <Button className="mt-4">Assign Vendors to Projects</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isExpanded={expandedProjects.has(project.id)}
                    onToggle={() => toggleProjectExpansion(project.id)}
                    onVendorStatusUpdate={handleVendorStatusUpdate}
                    onRemoveVendor={handleRemoveVendor}
                    onSendToUser={handleSendToUser}        // ← ADD THIS
                    onRevokeFromUser={handleRevokeFromUser} // ← ADD THIS
                    selectedVendors={selectedVendors}
                    onVendorSelect={(vendorId, isSelected) => {
                      const vendorKey = `${project.id}-${vendorId}`;
                      const newSelected = new Set(selectedVendors);
                      
                      if (isSelected) {
                        newSelected.add({
                          projectId: project.id,
                          vendorId: vendorId,
                          key: vendorKey
                        });
                      } else {
                        // Find and remove the vendor with this key
                        for (const item of newSelected) {
                          if (item.key === vendorKey) {
                            newSelected.delete(item);
                            break;
                          }
                        }
                      }
                      setSelectedVendors(newSelected);
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Project Card Component
const ProjectCard = ({ 
  project, 
  isExpanded, 
  onToggle, 
  onVendorStatusUpdate, 
  onRemoveVendor,
  onSendToUser,        // ← ADD THIS
  onRevokeFromUser,    // ← ADD THIS
  selectedVendors,
  onVendorSelect
}) => {
  const getStatusSummary = (vendors) => {
    const summary = {
      PENDING: 0,
      SENT: 0,
      VIEWED: 0,
      CONTACTED: 0,
      ACCEPTED: 0,
      REJECTED: 0
    };

    vendors.forEach(vendor => {
      if (summary[vendor.status] !== undefined) {
        summary[vendor.status]++;
      }
    });

    return summary;
  };

  const statusSummary = getStatusSummary(project.vendors);

  return (
    <Card className="border-border">
      <CardContent className="p-0">
        {/* Project Header */}
        <div 
          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground text-lg truncate">
                    {project.title}
                  </h3>
                  <Badge variant="outline">{project.projectType}</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {project.vendorCount} vendors
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{project.user?.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{project.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{project.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{project.budgetRange}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Summary */}
            {/* <div className="flex items-center gap-2">
              {statusSummary.ACCEPTED > 0 && (
                <Badge variant="success" className="text-xs">
                  {statusSummary.ACCEPTED} Accepted
                </Badge>
              )}
              {statusSummary.PENDING > 0 && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
                  {statusSummary.PENDING} Pending
                </Badge>
              )}
              {statusSummary.REJECTED > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {statusSummary.REJECTED} Rejected
                </Badge>
              )}
            </div> */}
            {/* Status Summary and Actions */}
              <div className="flex items-center gap-2 mt-3">
                {/* Existing status badges */}
                {statusSummary.ACCEPTED > 0 && (
                  <Badge variant="success" className="text-xs">
                    {statusSummary.ACCEPTED} Accepted
                  </Badge>
                )}
                {statusSummary.PENDING > 0 && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
                    {statusSummary.PENDING} Pending
                  </Badge>
                )}
                {statusSummary.REJECTED > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {statusSummary.REJECTED} Rejected
                  </Badge>
                )}
                
                {/* ADD THESE ACTION BUTTONS - NEW CODE */}
                {project.vendorListStatus === "PENDING" && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent expanding/collapsing
                      // You'll need to pass handleSendToUser to ProjectCard component
                      // Add this prop in the ProjectCard call above
                      onSendToUser(project.id);
                    }}
                    className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Send to User
                  </Button>
                )}
                
                {project.vendorListStatus === "SENT" && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add this prop to ProjectCard component
                      onRevokeFromUser(project.id);
                    }}
                    className="h-6 px-2 text-xs border-red-600 text-red-600 hover:bg-red-50"
                    variant="outline"
                  >
                    <Undo className="w-3 h-3 mr-1" />
                    Revoke
                  </Button>
                )}
              </div>
          </div>
        </div>

        {/* Vendors List */}
        {isExpanded && (
          <div className="border-t">
            <div className="p-4 bg-gray-50">
              <h4 className="font-medium text-sm text-muted-foreground mb-3">
                ASSIGNED VENDORS ({project.vendors.length})
              </h4>
              
              <div className="space-y-3">
                {project.vendors.map((vendorAssignment) => (
                  <VendorRow
                    key={vendorAssignment.id}
                    vendorAssignment={vendorAssignment}
                    project={project}
                    onStatusUpdate={onVendorStatusUpdate}
                    onRemove={onRemoveVendor}
                    isSelected={Array.from(selectedVendors).some(
                      item => item.projectId === project.id && item.vendorId === vendorAssignment.vendorId
                    )}
                    onSelect={(isSelected) => onVendorSelect(vendorAssignment.vendorId, isSelected)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Vendor Row Component
const VendorRow = ({ 
  vendorAssignment, 
  project, 
  onStatusUpdate, 
  onRemove, 
  isSelected,
  onSelect 
}) => {
  const getStatusColor = (status) => {
    const colors = {
      PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
      SENT: "text-blue-600 bg-blue-50 border-blue-200",
      VIEWED: "text-purple-600 bg-purple-50 border-purple-200",
      CONTACTED: "text-orange-600 bg-orange-50 border-orange-200",
      ACCEPTED: "text-green-600 bg-green-50 border-green-200",
      REJECTED: "text-red-600 bg-red-50 border-red-200"
    };
    return colors[vendorAssignment.status] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
      {/* Selection Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(e.target.checked)}
        className="rounded border-gray-300"
      />

      {/* Vendor Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h5 className="font-semibold text-foreground">
            {vendorAssignment.vendor?.name}
          </h5>
          {vendorAssignment.vendor?.businessName && (
            <span className="text-sm text-muted-foreground">
              ({vendorAssignment.vendor.businessName})
            </span>
          )}
          <Badge 
            variant="outline"
            className={`text-xs ${getStatusColor(vendorAssignment.status)}`}
          >
            {vendorAssignment.status}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{vendorAssignment.vendor?.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{vendorAssignment.vendor?.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            <span>{vendorAssignment.vendor?.email}</span>
          </div>
          {vendorAssignment.vendor?.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{vendorAssignment.vendor.rating}</span>
              <span>({vendorAssignment.vendor.reviewCount} reviews)</span>
            </div>
          )}
        </div>

        {/* Vendor Categories */}
        <div className="flex flex-wrap gap-1 mt-2">
          {vendorAssignment.vendor?.categories?.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="bg-blue-50 text-blue-700 text-xs"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Client Feedback */}
        {vendorAssignment.clientFeedback && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Feedback:</span> {vendorAssignment.clientFeedback}
            </p>
          </div>
        )}

        {/* Client Rating */}
        {vendorAssignment.clientRating && (
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>Client Rating: {vendorAssignment.clientRating}/5</span>
          </div>
        )}

        {/* Assignment Date */}
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Assigned: {new Date(vendorAssignment.createdAt).toLocaleDateString()}</span>
          {vendorAssignment.respondedAt && (
            <>
              <span>•</span>
              <span>Responded: {new Date(vendorAssignment.respondedAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => window.open(`/admin/vendors/assignment/${vendorAssignment.id}`, '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onStatusUpdate(project.id, vendorAssignment.vendorId, "SENT")}>
            Mark as Sent
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusUpdate(project.id, vendorAssignment.vendorId, "VIEWED")}>
            Mark as Viewed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusUpdate(project.id, vendorAssignment.vendorId, "CONTACTED")}>
            Mark as Contacted
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusUpdate(project.id, vendorAssignment.vendorId, "ACCEPTED")}>
            Mark as Accepted
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusUpdate(project.id, vendorAssignment.vendorId, "REJECTED")}>
            Mark as Rejected
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onRemove(project.id, vendorAssignment.vendorId)}
            className="text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Vendor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};