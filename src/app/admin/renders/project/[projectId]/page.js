// src/app/admin/renders/project/[projectId]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Eye,
  Edit,
  Send,
  Undo,
  Trash2,
  User,
  MapPin,
  Building,
  Calendar,
  Image,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function ProjectRendersPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId;
  const selectedRenderId = searchParams.get("render");

  const [project, setProject] = useState(null);
  const [renders, setRenders] = useState([]);
  const [filteredRenders, setFilteredRenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRender, setSelectedRender] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  const [expandedRender, setExpandedRender] = useState(null);

  // Add pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const [stats, setStats] = useState({
    totalRenders: 0,
    pendingRenders: 0,
    completedRenders: 0,
    processingRenders: 0,
  });

  // Load project and renders
  const loadProjectRenders = async (page = 1, limit = 12) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(roomTypeFilter !== "all" && { roomType: roomTypeFilter }),
      });

      // Call the API endpoint
      const response = await api.get(
        `/renders/projects/${projectId}?${params}`
      );

      if (response.data.success) {
        const result = response.data.data;

        setProject(result.project);
        setRenders(result.renders);
        setFilteredRenders(result.renders);
        setStats(
          result.stats || {
            totalRenders: result.renders.length,
            pendingRenders: result.renders.filter((r) => r.status === "PENDING")
              .length,
            completedRenders: result.renders.filter(
              (r) => r.status === "COMPLETED"
            ).length,
            processingRenders: result.renders.filter(
              (r) => r.status === "PROCESSING"
            ).length,
          }
        );
        setPagination(
          result.pagination || {
            page: 1,
            limit: limit,
            total: result.renders.length,
            pages: Math.ceil(result.renders.length / limit),
          }
        );

        // Auto-select render if specified in URL
        if (selectedRenderId) {
          const renderToSelect = result.renders.find(
            (r) => r.publicId === selectedRenderId
          );
          if (renderToSelect) {
            setSelectedRender(renderToSelect);
          }
        }
      } else {
        throw new Error(
          response.data.message || "Failed to load project renders"
        );
      }
    } catch (error) {
      console.error("Error loading project renders:", error);
      toast.error("Error", {
        description: error.message || "Failed to load project renders",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadProjectRenders();
    }
  }, [projectId, selectedRenderId]);

  // Reload when filters change
  useEffect(() => {
    if (projectId) {
      loadProjectRenders(1, pagination.limit);
    }
  }, [searchQuery, statusFilter, roomTypeFilter]);

  // Bulk actions
  // Bulk actions
  const handleSendAllToClient = async () => {
    try {
      if (
        confirm(
          "Are you sure you want to send ALL pending renders to the client?"
        )
      ) {
        const response = await api.patch(
          `/renders/projects/${projectId}/bulk-status`,
          {
            status: "COMPLETED",
          }
        );

        if (response.data.success) {
          // Reload the project renders to get updated data
          await loadProjectRenders();

          toast.success("All Renders Sent", {
            description: response.data.message,
          });
        }
      }
    } catch (error) {
      console.error("Error sending all renders:", error);
      toast.error("Error", {
        description: error.message || "Failed to send all renders",
      });
    }
  };

  const handleRevokeAllFromClient = async () => {
    try {
      if (
        confirm(
          "Are you sure you want to revoke ALL completed renders from the client?"
        )
      ) {
        const response = await api.patch(
          `/renders/projects/${projectId}/bulk-status`,
          {
            status: "PENDING",
          }
        );

        if (response.data.success) {
          // Reload the project renders to get updated data
          await loadProjectRenders();

          toast.success("All Renders Revoked", {
            description: response.data.message,
          });
        }
      }
    } catch (error) {
      console.error("Error revoking all renders:", error);
      toast.error("Error", {
        description: error.message || "Failed to revoke all renders",
      });
    }
  };

  const handleDeleteRender = async (renderId) => {
    try {
      if (
        confirm(
          "Are you sure you want to delete this render? This action cannot be undone."
        )
      ) {
        const response = await api.delete(`/renders/${renderId}`);

        if (response.data.success) {
          const deletedRender = renders.find((r) => r.id === renderId);

          setRenders((prev) => prev.filter((render) => render.id !== renderId));

          if (selectedRender?.id === renderId) {
            setSelectedRender(null);
          }

          // Update stats
          setStats((prev) => ({
            ...prev,
            totalRenders: prev.totalRenders - 1,
            [deletedRender?.status === "COMPLETED"
              ? "completedRenders"
              : "pendingRenders"]:
              prev[
                deletedRender?.status === "COMPLETED"
                  ? "completedRenders"
                  : "pendingRenders"
              ] - 1,
          }));
          loadProjectRenders();
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

  const getRenderStatus = (render) => {
    if (render.status === "COMPLETED") {
      return {
        label: "Sent to Client",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle2,
      };
    } else if (render.status === "PROCESSING") {
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

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRoomTypeFilter("all");
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || roomTypeFilter !== "all";

  // Get unique room types for filter
  const roomTypes = [
    ...new Set(renders.map((render) => render.roomType).filter(Boolean)),
  ];

  if (loading && !project) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/renders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Renders
            </Button>
          </Link>
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-4">
                <div className="animate-pulse flex items-center gap-4">
                  <div className="h-16 w-20 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/renders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Renders
            </Button>
          </Link>
        </div>
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Project Not Found
            </h3>
            <p className="text-muted-foreground mb-4">
              The project you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Link href="/admin/renders">
              <Button>Back to Renders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/renders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Renders
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {project.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage renders for this project
            </p>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-2">
          {(stats.pendingRenders > 0 || stats.processingRenders > 0) && (
            <Button
              onClick={handleSendAllToClient}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send All to Client (
              {stats.pendingRenders + stats.processingRenders})
            </Button>
          )}
          {stats.completedRenders > 0 && (
            <Button onClick={handleRevokeAllFromClient} variant="outline">
              <Undo className="w-4 h-4 mr-2" />
              Revoke All ({stats.completedRenders})
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Renders List - Full width */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Filters */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by room type or style..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 border-border"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 text-muted-foreground" />

                  {/* Room Type Filter */}
                  {roomTypes.length > 0 && (
                    <select
                      value={roomTypeFilter}
                      onChange={(e) => setRoomTypeFilter(e.target.value)}
                      className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                    >
                      <option value="all">All Rooms</option>
                      {roomTypes.map((roomType) => (
                        <option key={roomType} value={roomType}>
                          {roomType.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="COMPLETED">Sent to Client</option>
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

          {/* Renders List View */}
          {filteredRenders.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No renders found
                </h3>
                <p className="text-muted-foreground">
                  {hasActiveFilters
                    ? "No renders match your current filters."
                    : "No renders have been uploaded for this project yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-3">
                {filteredRenders.map((render) => {
                  const renderStatus = getRenderStatus(render);
                  const StatusIcon = renderStatus.icon;
                  const isExpanded = expandedRender === render.id;

                  return (
                    <Card
                      key={render.id}
                      className={`border-border transition-all ${
                        isExpanded ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        {/* Main Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Thumbnail */}
                            <div className="h-16 w-20 rounded-lg overflow-hidden border border-border flex-shrink-0">
                              <img
                                src={
                                  process.env.NEXT_PUBLIC_SERVER_URL +
                                    render.imageUrl || "/placeholder-render.jpg"
                                }
                                alt={render.roomType}
                                className="h-16 w-20 object-cover cursor-pointer"
                                onClick={() => setSelectedRender(render)}
                              />
                            </div>

                            {/* Render Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-semibold text-foreground capitalize text-lg">
                                  {render.roomType
                                    ?.toLowerCase()
                                    .replace("_", " ") || "Unknown Room"}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={renderStatus.color}
                                >
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {renderStatus.label}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <div>
                                  Style:{" "}
                                  {render.styleApplied || "No style applied"}
                                </div>
                                <div>
                                  File Size: {render.fileSize || "Unknown"}
                                </div>
                                <div>
                                  Uploaded: {formatDate(render.createdAt)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRender(render)}
                              className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                              title="View Render"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Link
                              href={`/admin/renders/edit/${render.publicId}`}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200"
                                title="Edit Render"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteRender(render.publicId)
                              }
                              className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                              title="Delete Render"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setExpandedRender(isExpanded ? null : render.id)
                              }
                              className="h-8 w-8 p-0"
                              title={isExpanded ? "Collapse" : "Expand"}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-sm mb-2">
                                  Render Details
                                </h5>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">
                                      Render ID:
                                    </span>
                                    <div className="font-mono text-foreground">
                                      {render.publicId}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-medium">Angle:</span>
                                    <div className="text-foreground">
                                      {render.angle || "Not specified"}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Is Final:
                                    </span>
                                    <div className="text-foreground">
                                      {render.isFinal ? "Yes" : "No"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm mb-2">
                                  Timeline
                                </h5>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">
                                      Created:
                                    </span>
                                    <div className="text-foreground">
                                      {formatDate(render.createdAt)}
                                    </div>
                                  </div>
                                  {render.updatedAt &&
                                    render.updatedAt !== render.createdAt && (
                                      <div>
                                        <span className="font-medium">
                                          Last Updated:
                                        </span>
                                        <div className="text-foreground">
                                          {formatDate(render.updatedAt)}
                                        </div>
                                      </div>
                                    )}
                                  {render.generatedAt && (
                                    <div>
                                      <span className="font-medium">
                                        Generated:
                                      </span>
                                      <div className="text-foreground">
                                        {formatDate(render.generatedAt)}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {(pagination.page - 1) * pagination.limit + 1}{" "}
                        to{" "}
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}{" "}
                        of {pagination.total} renders
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            loadProjectRenders(pagination.page - 1)
                          }
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
                                    pagination.page === pageNum
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => loadProjectRenders(pageNum)}
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
                          onClick={() =>
                            loadProjectRenders(pagination.page + 1)
                          }
                          disabled={pagination.page === pagination.pages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sidebar - Project Info */}
        <div className="space-y-6">
          {/* Project Information */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Project ID:</span>
                  <div className="font-mono text-foreground mt-1">
                    {project.publicId}
                  </div>
                </div>

                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{project.user?.name || "Unknown User"}</span>
                </div>

                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{project.projectType}</span>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{project.address || "No address"}</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Created {formatDate(project.createdAt)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Renders:</span>
                  <Badge variant="outline">{stats.totalRenders}</Badge>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-medium">Completed:</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {stats.completedRenders}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-medium">Pending:</span>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200"
                  >
                    {stats.pendingRenders}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Render Preview Modal */}
      {selectedRender && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRender(null)}
        >
          <div
            className="relative max-w-4xl max-h-full bg-background rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground capitalize">
                  {selectedRender.roomType?.toLowerCase().replace("_", " ")}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRender(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image */}
                <div className="flex-1">
                  <img
                    src={
                      process.env.NEXT_PUBLIC_SERVER_URL +
                        selectedRender.imageUrl || "/placeholder-render.jpg"
                    }
                    alt={selectedRender.roomType}
                    className="w-full h-96 object-contain rounded-lg border border-border"
                  />
                </div>

                {/* Details */}
                <div className="w-80 space-y-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Status:</span>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className={getRenderStatus(selectedRender).color}
                        >
                          {getRenderStatus(selectedRender).label}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">Design Style:</span>
                      <div className="text-foreground mt-1">
                        {selectedRender.styleApplied || "No style applied"}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">File Size:</span>
                      <div className="text-foreground mt-1">
                        {selectedRender.fileSize || "Unknown"}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">Uploaded:</span>
                      <div className="text-foreground mt-1">
                        {formatDate(selectedRender.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/admin/renders/edit/${selectedRender.publicId}`}
                      className="flex-1"
                    >
                      <Button className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Render
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
