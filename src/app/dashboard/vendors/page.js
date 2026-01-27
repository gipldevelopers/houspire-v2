// src/app/dashboard/vendors/page.js
"use client";

import { useState, useEffect } from "react";
import {
  Building,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Filter,
  Search,
  Grid3X3,
  List,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Home,
  Ruler,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const projectTypeColors = {
  FOUR_BHK:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  THREE_BHK: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  TWO_BHK: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  OFFICE:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  COMMERCIAL: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const budgetColors = {
  ECONOMY: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  STANDARD:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  PREMIUM:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  LUXURY: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusColors = {
  QUESTIONNAIRE_COMPLETED:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  VENDOR_SELECTION:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  IN_PROGRESS:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  COMPLETED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  const loadProjects = async (page = 1, search = "") => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/projects-vendor/user/my-projects", {
        params: {
          page,
          limit: 50,
          search,
        },
      });

      if (response.data.success) {
        // The projects are in response.data.data array
        setProjects(response.data.data || []);
        setFilteredProjects(response.data.data || []);
        setPagination(
          response.data.pagination || {
            page: 1,
            limit: 50,
            total: response.data.data?.length || 0,
            pages: 1,
          }
        );
      } else {
        throw new Error(response.data.message || "Failed to load projects");
      }
    } catch (err) {
      console.error("Error loading projects:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load projects";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshProjects = () => {
    loadProjects(1, searchQuery);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (project) => project.projectType === typeFilter
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    // Budget filter
    if (budgetFilter !== "all") {
      filtered = filtered.filter(
        (project) => project.budgetRange === budgetFilter
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchQuery, typeFilter, statusFilter, budgetFilter]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounced server-side search
    if (value.length === 0 || value.length > 2) {
      loadProjects(1, value);
    }
  };

  const allProjectTypes = [
    ...new Set(projects.map((project) => project.projectType)),
  ].filter(Boolean);
  const allStatuses = [
    ...new Set(projects.map((project) => project.status)),
  ].filter(Boolean);
  const allBudgets = [
    ...new Set(projects.map((project) => project.budgetRange)),
  ].filter(Boolean);

  const formatProjectType = (type) => {
    const typeMap = {
      FOUR_BHK: "4 BHK",
      THREE_BHK: "3 BHK",
      TWO_BHK: "2 BHK",
      OFFICE: "Office",
      COMMERCIAL: "Commercial",
    };
    return typeMap[type] || type;
  };

  const formatStatus = (status) => {
    const statusMap = {
      QUESTIONNAIRE_COMPLETED: "Questionnaire Completed",
      VENDOR_SELECTION: "Vendor Selection",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
    };
    return statusMap[status] || status;
  };

  const handleViewProject = (project) => {
    toast.info(`Viewing project: ${project.title}`);
    // You can navigate to project detail page here
    // router.push(`/dashboard/projects/${project.publicId}`);
  };

  const handleContactClient = (project) => {
    toast.info(`Contact Vendor for project: ${project.title}`);
    router.push(`/dashboard/vendors/${project.id}`);
  };

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={refreshProjects}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Available Projects
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse and apply for projects that match your expertise
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={refreshProjects}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                disabled={loading}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                disabled={loading}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Projects
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {pagination.total || projects.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {projects.filter((p) => p.status === "IN_PROGRESS").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    New Requests
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      projects.filter(
                        (p) => p.status === "QUESTIONNAIRE_COMPLETED"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Cities Covered
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(projects.map((p) => p.city).filter(Boolean)).size}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects, locations, descriptions..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 border-border"
                  disabled={loading}
                />
              </div>

              {/* Project Type Filter */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  disabled={loading}
                >
                  <option value="all">All Types</option>
                  {allProjectTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatProjectType(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  disabled={loading}
                >
                  <option value="all">All Status</option>
                  {allStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Filter */}
              <div>
                <select
                  value={budgetFilter}
                  onChange={(e) => setBudgetFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  disabled={loading}
                >
                  <option value="all">All Budgets</option>
                  {allBudgets.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                  setBudgetFilter("all");
                  loadProjects(1, "");
                }}
                className="border-border"
                disabled={loading}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && <ProjectsSkeleton />}

        {/* Error State */}
        {error && !loading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Projects Grid/List */}
        {!loading && !error && filteredProjects.length > 0 ? (
          <>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProjects.length} of {pagination.total} projects
              </p>
              {pagination.pages > 1 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      loadProjects(pagination.page - 1, searchQuery)
                    }
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      loadProjects(pagination.page + 1, searchQuery)
                    }
                    disabled={pagination.page >= pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              }
            >
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewMode={viewMode}
                  formatProjectType={formatProjectType}
                  formatStatus={formatStatus}
                  onView={handleViewProject}
                  onContact={handleContactClient}
                />
              ))}
            </div>
          </>
        ) : (
          !loading &&
          !error && (
            <Card className="border-border bg-card">
              <CardContent className="p-12 text-center">
                <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Projects Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {projects.length === 0
                    ? "No projects are currently available."
                    : "Try adjusting your search criteria or filters."}
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                    setStatusFilter("all");
                    setBudgetFilter("all");
                    loadProjects(1, "");
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({
  project,
  viewMode,
  formatProjectType,
  formatStatus,
  onView,
  onContact,
}) {
  if (viewMode === "list") {
    return (
      <Card className="border-border bg-card hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Project Image */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {project.selectedStyle?.imageUrl ? (
                  <img
                    src={project.selectedStyle.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Home className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <Badge className={statusColors[project.status]}>
                      {formatStatus(project.status)}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      <span>{project.areaSqFt} sq.ft.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Palette className="w-4 h-4" />
                      <span>
                        {project.selectedStyle?.name || "No style selected"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <Badge
                    className={`mb-2 ${projectTypeColors[project.projectType]}`}
                  >
                    {formatProjectType(project.projectType)}
                  </Badge>
                  {project.budgetRange && (
                    <Badge className={budgetColors[project.budgetRange]}>
                      {project.budgetRange}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Budget & Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-4">
                  {project.boqAmount > 0 && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-foreground">
                        {project.boqAmount.toLocaleString()}{" "}
                        {project.boqCurrency}
                      </span>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onContact(project)}>
                    <Users className="w-4 h-4 mr-2" />
                    Contact Client
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid View (default)
  return (
    <Card className="border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <CardContent className="p-0">
        {/* Header with Image and Status */}
        <div className="relative">
          {/* <div className="h-48 bg-muted overflow-hidden">
            {project.selectedStyle?.imageUrl ? (
              <img
                src={project.selectedStyle.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div> */}
          <div className="absolute top-4 right-4 flex gap-2">
            {/* <Badge className={statusColors[project.status]}>
              {formatStatus(project.status)}
            </Badge> */}
            <Badge className={projectTypeColors[project.projectType]}>
              {formatProjectType(project.projectType)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Project Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Location
              </div>
              <span className="font-medium text-foreground">
                {project.city}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Ruler className="w-4 h-4" />
                Area
              </div>
              <span className="font-medium text-foreground">
                {project.areaSqFt} sq.ft.
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Palette className="w-4 h-4" />
                Style
              </div>
              <span className="font-medium text-foreground">
                {project.selectedStyle?.name || "Not specified"}
              </span>
            </div>

            {project.budgetRange && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  Budget
                </div>
                <Badge className={budgetColors[project.budgetRange]}>
                  {project.budgetRange}
                </Badge>
              </div>
            )}
          </div>

          {/* Budget and Actions */}
          <div className="space-y-3">
            {project.boqAmount > 0 && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">
                  BOQ Amount
                </span>
                <span className="font-semibold text-foreground">
                  {project.boqAmount.toLocaleString()} {project.boqCurrency}
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onContact(project)}
              >
                <Users className="w-4 h-4 mr-2" />
                More Details
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-muted" />
            <Skeleton className="h-4 w-64 bg-muted" />
          </div>
          <Skeleton className="h-10 w-20 bg-muted" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 bg-muted" />
                    <Skeleton className="h-6 w-12 bg-muted" />
                  </div>
                  <Skeleton className="w-12 h-12 bg-muted rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-muted rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-full bg-muted" />
                    <Skeleton className="h-4 w-2/3 bg-muted" />
                  </div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex justify-between">
                        <Skeleton className="h-4 w-20 bg-muted" />
                        <Skeleton className="h-4 w-16 bg-muted" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1 bg-muted" />
                    <Skeleton className="h-9 flex-1 bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
