// src/app/admin/vendors/assignments/draft/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  Send,
  Undo,
  Trash2,
  Users,
  Building,
  MapPin,
  Clock,
  Filter,
  Plus,
  ChevronDown,
  ChevronRight,
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

export default function DraftVendorAssignmentsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [sendingProjects, setSendingProjects] = useState(new Set());
  const [revokingProjects, setRevokingProjects] = useState(new Set());

  useEffect(() => {
    loadDraftProjects();
  }, []);

  const loadDraftProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get("/vendor-assignments/draft/projects");
      if (response.data.success) {
        setProjects(response.data.data.projects || []);
      }
    } catch (error) {
      console.error("Error loading draft projects:", error);
      toast.error("Failed to load draft vendor assignments");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProjectExpansion = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleSendToClient = async (projectId) => {
    if (!confirm("Are you sure you want to send these vendors to the client? The client will be notified immediately.")) {
      return;
    }

    setSendingProjects(prev => new Set(prev).add(projectId));
    try {
      const response = await api.post(`/vendor-assignments/${projectId}/send`);
      if (response.data.success) {
        toast.success("Vendors Sent", {
          description: response.data.message,
        });
        loadDraftProjects(); // Refresh list
      } else {
        toast.error("Send Failed", {
          description: response.data.message,
        });
      }
    } catch (error) {
      toast.error("Send Failed", {
        description: error.response?.data?.message || "Failed to send vendors",
      });
    } finally {
      setSendingProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const handleRevoke = async (projectId) => {
    if (!confirm("Are you sure you want to revoke all vendors from this project? This will remove all sent vendor assignments.")) {
      return;
    }

    setRevokingProjects(prev => new Set(prev).add(projectId));
    try {
      const response = await api.post(`/vendor-assignments/${projectId}/revoke`);
      if (response.data.success) {
        toast.success("Vendors Revoked", {
          description: response.data.message,
        });
        loadDraftProjects(); // Refresh list
      } else {
        toast.error("Revoke Failed", {
          description: response.data.message,
        });
      }
    } catch (error) {
      toast.error("Revoke Failed", {
        description: error.response?.data?.message || "Failed to revoke vendors",
      });
    } finally {
      setRevokingProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const handleDeleteDraftVendor = async (projectId, vendorId, vendorName) => {
    if (!confirm(`Are you sure you want to remove "${vendorName}" from the draft list?`)) {
      return;
    }

    try {
      const response = await api.delete(`/vendor-assignments/${projectId}/draft/vendor/${vendorId}`);
      if (response.data.success) {
        toast.success("Vendor Removed", {
          description: response.data.message,
        });
        loadDraftProjects(); // Refresh list
      } else {
        toast.error("Delete Failed", {
          description: response.data.message,
        });
      }
    } catch (error) {
      toast.error("Delete Failed", {
        description: error.response?.data?.message || "Failed to remove vendor",
      });
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      DRAFT: {
        label: "Draft",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "📝",
      },
      SENT: {
        label: "Sent to Client",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "✅",
      },
      PENDING: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "⏳",
      },
    };
    return configs[status] || configs.DRAFT;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Draft Vendor Assignments</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage draft vendor assignments before sending to clients
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/vendors/assign">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create New Assignment
              </Button>
            </Link>

            <Link href="/admin/vendors/assignment/manage">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <Users className="w-4 h-4 mr-2" />
                View Sent Assignments
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Draft Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Draft Vendors</p>
                  <p className="text-2xl font-bold">
                    {projects.reduce((sum, project) => sum + project.draftVendorCount, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready to Send</p>
                  <p className="text-2xl font-bold text-green-600">
                    {projects.filter(p => p.draftVendorCount > 0).length}
                  </p>
                </div>
                <Send className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects, clients, cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-border"
                  onClick={loadDraftProjects}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Draft Assignments ({filteredProjects.length})
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
                <p className="mb-2">No draft vendor assignments found</p>
                <p className="text-sm mb-4">
                  {searchQuery ? "Try adjusting your search" : "Create your first vendor assignment"}
                </p>
                <Link href="/admin/vendors/assign">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
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
                    onSendToClient={handleSendToClient}
                    onRevoke={handleRevoke}
                    onDeleteDraftVendor={handleDeleteDraftVendor}
                    sending={sendingProjects.has(project.id)}
                    revoking={revokingProjects.has(project.id)}
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
  onSendToClient, 
  onRevoke,
  onDeleteDraftVendor,
  sending,
  revoking
}) => {
  const statusConfig = getStatusConfig(project.vendorListStatus);

  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Project Header */}
        <div 
          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="pt-1">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground text-lg truncate">
                    {project.title}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {project.projectType}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${statusConfig.color}`}
                  >
                    {statusConfig.icon} {statusConfig.label}
                  </Badge>
                  {project.draftVendorCount > 0 && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                      {project.draftVendorCount} vendors
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{project.user?.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{project.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{project.budgetRange}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {project.draftVendorCount > 0 ? (
                <>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSendToClient(project.id);
                    }}
                    disabled={sending || revoking}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {sending ? "Sending..." : "Send to Client"}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRevoke(project.id);
                    }}
                    disabled={revoking || sending}
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    {revoking ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Undo className="w-4 h-4 mr-2" />
                    )}
                    {revoking ? "Revoking..." : "Revoke All"}
                  </Button>
                </>
              ) : (
                <Link href={`/admin/vendors/assign?project=${project.publicId}`}>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vendors
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={`/admin/projects/${project.publicId}`} passHref>
                    <DropdownMenuItem>
                      View Project Details
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/admin/vendors/assign?project=${project.publicId}`} passHref>
                    <DropdownMenuItem>
                      Edit Vendor Assignments
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onRevoke(project.id)}
                    disabled={project.draftVendorCount === 0}
                  >
                    <Undo className="w-4 h-4 mr-2" />
                    Revoke All Vendors
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Vendors List (Expanded) */}
        {isExpanded && project.draftVendors && project.draftVendors.length > 0 && (
          <div className="border-t">
            <div className="p-4 bg-gray-50">
              <h4 className="font-medium text-sm text-muted-foreground mb-3">
                DRAFT VENDORS ({project.draftVendors.length})
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.draftVendors.map((assignment) => (
                  <VendorCard
                    key={`${project.id}-${assignment.vendor.id}`}
                    vendor={assignment.vendor}
                    projectId={project.id}
                    onDelete={onDeleteDraftVendor}
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

// Vendor Card Component
const VendorCard = ({ vendor, projectId, onDelete }) => {
  return (
    <Card className="border border-blue-200 bg-white">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h5 className="font-semibold text-foreground text-sm">
                {vendor.name}
              </h5>
              {vendor.rating && (
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                  ⭐ {vendor.rating}
                </Badge>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              {vendor.businessName && (
                <p className="font-medium">{vendor.businessName}</p>
              )}
              <div className="flex items-center gap-2">
                <span>{vendor.city}</span>
                {vendor.categories && vendor.categories.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{vendor.categories.join(", ")}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(projectId, vendor.id, vendor.name)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function for status config
const getStatusConfig = (status) => {
  const configs = {
    DRAFT: {
      label: "Draft",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: "📝",
    },
    SENT: {
      label: "Sent to Client",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: "✅",
    },
    PENDING: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: "⏳",
    },
  };
  return configs[status] || configs.DRAFT;
};