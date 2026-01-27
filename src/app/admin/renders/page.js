// src\app\admin\renders\page.js
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  X,
  Upload,
  MapPin,
  Edit,
  Send,
  Undo,
  Copy,
  Trash2,
  Building,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function AdminRendersPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Calculate stats
  const stats = {
    total: projects.length,
    pending: projects.filter(
      (p) => p.rendersStatus === "PENDING" || p.rendersStatus === "PROCESSING"
    ).length,
    completed: projects.filter((p) => p.rendersStatus === "COMPLETED").length,
  };

  // Load projects with renders
  const loadProjects = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await api.get(`/renders?${params}`);

      if (response.data.success) {
        const renders = response.data.data || [];

        // Transform renders array into projects with renders
        const projectsMap = {};

        renders.forEach((render) => {
          const project = render.project;
          const projectId = project.publicId;

          if (!projectsMap[projectId]) {
            // Create new project entry
            projectsMap[projectId] = {
              id: project.id,
              publicId: project.publicId,
              displayId: project.displayId,
              projectTitle: project.title,
              projectType: project.projectType,
              address: project.address,
              city: project.city,
              state: project.state,
              country: project.country,
              rendersStatus: project.rendersStatus,
              selectedStyle:
                project.selectedStyle?.name || project.selectedStyle,
              createdAt: project.createdAt,
              updatedAt: project.updatedAt,
              user: {
                id: project.user?.id,
                name: project.user?.name,
                email: project.user?.email,
                publicId: project.user?.publicId,
              },
              renders: [],
              totalRenders: 0,
              completedRenders: 0,
            };
          }

          // Add render to project
          const renderData = {
            id: render.id,
            publicId: render.publicId,
            roomType: render.roomType,
            styleApplied: render.styleApplied,
            imageUrl: render.imageUrl,
            thumbnailUrl: render.thumbnailUrl,
            status: render.status,
            fileSize: render.fileSize
              ? `${(render.fileSize / 1024).toFixed(1)} KB`
              : "Unknown",
            angle: render.angle,
            isFinal: render.isFinal,
            createdAt: render.createdAt,
            updatedAt: render.updatedAt,
            generatedAt: render.generatedAt,
          };

          projectsMap[projectId].renders.push(renderData);
          projectsMap[projectId].totalRenders++;

          if (render.status === "COMPLETED") {
            projectsMap[projectId].completedRenders++;
          }
        });

        // Convert map to array and sort by creation date
        const projects = Object.values(projectsMap).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProjects(projects);
        setPagination(
          response.data.pagination || {
            page: parseInt(page),
            limit: parseInt(limit),
            total: projects.length,
            pages: Math.ceil(projects.length / limit),
          }
        );
      } else {
        throw new Error(response.data.message || "Failed to load projects");
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Error", {
        description: error.message || "Failed to load projects",
      });
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadProjects();
  }, []);

  // Filter projects when search or filters change
  useEffect(() => {
    loadProjects(1, pagination.limit);
  }, [searchQuery, statusFilter]);

  const handleSendToClient = async (projectId, renderId) => {
    try {
      if (confirm("Are you sure you want to send this render to the client?")) {
        const response = await api.patch(
          `/renders/projects/${projectId}/bulk-status`,
          {
            status: "COMPLETED",
          }
        );
        if (response.data.success) {
          // Update local state
          loadProjects();

          toast.success("Render Sent", {
            description: "Render has been sent to the client successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error sending render:", error);
      toast.error("Error", {
        description: error.message || "Failed to send render",
      });
    }
  };

  const handleRevokeRender = async (projectId, renderId) => {
    try {
      if (confirm("Are you sure you want to revoke this render?")) {
        const response = await api.patch(
          `/renders/projects/${projectId}/bulk-status`,
          {
            status: "PENDING",
          }
        );
        if (response.data.success) {
          loadProjects();
          toast.success("Render Revoked", {
            description: "Render has been revoked from the client",
          });
        }
      }
    } catch (error) {
      console.error("Error revoking render:", error);
      toast.error("Error", {
        description: error.message || "Failed to revoke render",
      });
    }
  };

  const handleDeleteRender = async (projectId, renderId) => {
    try {
      if (
        confirm(
          "Are you sure you want to delete this render? This action cannot be undone."
        )
      ) {
        const response = await api.delete(`/renders/${renderId}`);

        if (response.data.success) {
          setProjects((prev) =>
            prev.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    renders: project.renders.filter(
                      (render) => render.id !== renderId
                    ),
                    totalRenders: project.totalRenders - 1,
                    completedRenders:
                      project.renders.find((r) => r.id === renderId)?.status ===
                      "COMPLETED"
                        ? project.completedRenders - 1
                        : project.completedRenders,
                  }
                : project
            )
          );

          toast.success("Render Deleted", {
            description: "Render has been deleted successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error deleting render:", error);
      toast.error("Error", {
        description: error.message || "Failed to delete render",
      });
    }
  };

  const handleCopyProjectId = (projectId) => {
    navigator.clipboard.writeText(projectId);
    toast.success("Copied!", {
      description: `ID ${projectId} copied to clipboard`,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all";

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProjectStatus = (project) => {
    if (project.rendersStatus === "COMPLETED") {
      return {
        label: "Completed",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle2,
      };
    } else if (project.rendersStatus === "PROCESSING") {
      return {
        label: "Processing",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
      };
    } else {
      return {
        label: "Pending",
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Clock,
      };
    }
  };

  const getRenderStatus = (render) => {
    if (render.status === "COMPLETED") {
      return {
        label: "Sent to Client",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    } else {
      return {
        label: "Pending",
        color: "bg-amber-100 text-amber-800 border-amber-200",
      };
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Renders Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage client project renders
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Renders Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage client project renders
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/renders/upload">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Renders
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
          <CardContent className="p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Projects</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <Building className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending Renders</p>
                <p className="text-2xl font-bold mt-1 text-amber-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Completed</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Project ID, client name, project title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-border"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
              </select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      {projects.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters
                ? "No projects match your current filters."
                : "No projects with renders found."}
            </p>
            <Link href="/admin/renders/upload">
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Render
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Project ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Project Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Client
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Renders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {projects.map((project) => {
                    const projectStatus = getProjectStatus(project);
                    const StatusIcon = projectStatus.icon;

                    return (
                      <tr
                        key={project.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        {/* Project ID Column */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <div className="text-xs text-muted-foreground">
                                <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                  {project.displayId}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Created {formatDate(project.createdAt)}
                            </div>
                          </div>
                        </td>

                        {/* Project Details Column */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-foreground">
                              {project.projectTitle}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Building className="w-3 h-3 mr-1" />
                              {project.projectType}
                            </div>
                            {project.selectedStyle && (
                              <div className="text-xs text-muted-foreground">
                                Style: {project.selectedStyle}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Client Column */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-foreground">
                              <User className="w-3 h-3 mr-1" />
                              {project.user?.name || "Unknown User"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {project.user?.email || "No email"}
                            </div>
                          </div>
                        </td>

                        {/* Renders Column */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-foreground">
                              {project.completedRenders || 0}/
                              {project.totalRenders || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Completed/Total
                            </div>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={projectStatus.color}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {projectStatus.label}
                          </Badge>
                        </td>

                        {/* Created Date Column */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-foreground">
                            {formatDate(project.createdAt)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(project.createdAt)}
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Project Button */}
                            <Link
                              href={`/admin/renders/project/${project.publicId}`}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                                title="View Project"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {/* Edit Project Button */}
                            <Link
                              href={`/admin/renders/edit/${project.publicId}`}
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
                            {/* Quick Actions Dropdown could be added here for individual render actions */}
                            {project.rendersStatus === "PENDING" ||
                            project.rendersStatus === "PROCESSING" ? (
                              <Link
                                href={`/admin/renders/upload?project=${project.publicId}`}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-xs bg-green-50 hover:bg-green-100 text-green-600 border border-green-200"
                                  title="Add Renders"
                                >
                                  <Upload className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </Link>
                            ) : null}
                            {project.rendersStatus === "PENDING" ||
                            project.rendersStatus === "PROCESSING" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendToClient(project.publicId);
                                }}
                                className="h-7 px-2 text-xs bg-green-50 hover:bg-green-100 text-green-600"
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Send
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRevokeRender(project.publicId);
                                }}
                                className="h-7 px-2 text-xs bg-amber-50 hover:bg-amber-100 text-amber-600"
                              >
                                <Undo className="w-3 h-3 mr-1" />
                                Revoke
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} projects
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadProjects(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pagination.page === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => loadProjects(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadProjects(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
