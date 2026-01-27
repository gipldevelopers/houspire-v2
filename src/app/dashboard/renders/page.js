// src\app\dashboard\renders\page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Image,
  Download,
  ZoomIn,
  CheckCircle2,
  Clock,
  Building,
  Search,
  Filter,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { renderService } from "@/services/render.service";
import { toast } from "sonner";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const roomTypeLabels = {
  LIVING_ROOM: "Living Room",
  BEDROOM: "Bedroom",
  MASTER_BEDROOM: "Master Bedroom",
  KITCHEN: "Kitchen",
  BATHROOM: "Bathroom",
  DINING_ROOM: "Dining Room",
  STUDY_ROOM: "Study Room",
  BALCONY: "Balcony",
  OTHER: "Other",
};

export default function RendersListPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");

  useEffect(() => {
    loadRenders();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, roomTypeFilter]);

  const loadRenders = async () => {
    setLoading(true);
    try {
      const result = await renderService.getUserRenders();

      if (result.success) {
        let rendersData = [];
        if (result.data?.renders) {
          rendersData = result.data.renders;
        } else if (Array.isArray(result.data)) {
          rendersData = result.data;
        }

        // Group renders by project
        const projectsMap = {};
        rendersData.forEach((render) => {
          if (render.project) {
            const projectId = render.project.publicId;
            if (!projectsMap[projectId]) {
              projectsMap[projectId] = {
                ...render.project,
                renders: [],
              };
            }
            projectsMap[projectId].renders.push(render);
          }
        });

        const projectsList = Object.values(projectsMap);
        setProjects(projectsList);

        // Clear render notifications when user visits this page
        localStorage.setItem("new_renders", "[]");
        localStorage.setItem("new_renders_count", "0");

      } else {
        toast.error(result.message || "Failed to load renders");
        setProjects([]);
      }
    } catch (error) {
      console.error("Error loading renders:", error);
      toast.error("Failed to load renders");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchQuery || roomTypeFilter !== "all") {
      filtered = filtered
        .map((project) => {
          const filteredRenders = project.renders.filter((render) => {
            const matchesSearch =
              !searchQuery ||
              project.title
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              roomTypeLabels[render.roomType]
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              render.styleApplied
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              render.angle?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRoomType =
              roomTypeFilter === "all" || render.roomType === roomTypeFilter;

            return matchesSearch && matchesRoomType;
          });

          return {
            ...project,
            renders: filteredRenders,
          };
        })
        .filter((project) => project.renders.length > 0);
    }

    setFilteredProjects(filtered);
  };

  const getTotalRendersCount = () => {
    return projects.reduce(
      (total, project) => total + project.renders.length,
      0
    );
  };

  const getRoomTypesCount = () => {
    const allRoomTypes = projects.flatMap((project) =>
      project.renders.map((render) => render.roomType)
    );
    return new Set(allRoomTypes).size;
  };

  const roomTypes = [
    ...new Set(
      projects.flatMap((project) =>
        project.renders.map((render) => render.roomType)
      )
    ),
  ];

  if (loading) {
    return <RendersListSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              3D Renders
            </h1>
            <p className="text-muted-foreground text-lg">
              Your completed design visualizations by project
            </p>
          </div>

          <div className="flex gap-2">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects or renders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 border-border bg-background"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Projects
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {projects.length}
                  </p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Renders
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {getTotalRendersCount()}
                  </p>
                </div>
                <Image className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Room Types
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {getRoomTypesCount()}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Filter by room:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={roomTypeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRoomTypeFilter("all")}
                >
                  All Rooms
                </Button>
                {roomTypes.map((roomType) => (
                  <Button
                    key={roomType}
                    variant={
                      roomTypeFilter === roomType ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setRoomTypeFilter(roomType)}
                  >
                    {roomTypeLabels[roomType]}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.publicId} project={project} />
            ))}
          </div>
        ) : (
          <Card className="border-border bg-card">
            <CardContent className="p-12 text-center">
              {projects.length === 0 ? (
                <>
                  <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Projects with Renders
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Your 3D renders will appear here once they're completed and
                    sent by our team.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      Typically ready within 72 hours of project completion
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Projects Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms or filters.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setRoomTypeFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Project Card Component - Shows project with render summary and redirects to project details
function ProjectCard({ project }) {
  const latestRender = project.renders[0]; // Most recent render
  const roomTypesCount = new Set(
    project.renders.map((render) => render.roomType)
  ).size;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border bg-card group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg text-foreground">Project</CardTitle>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {project.renders.length} Renders
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {project.areaSqFt} sq ft •{" "}
              {project.projectType?.replace("_", " ")}
            </p>
          </div>

          {/* Project & Renders Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Renders:</span>
              <span className="font-medium text-foreground">
                {project.renders.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Room Types:</span>
              <span className="font-medium text-foreground">
                {roomTypesCount} types
              </span>
            </div>

            {latestRender && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Latest Render:</span>
                <div className="flex items-center gap-1 text-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(latestRender.createdAt)}</span>
                </div>
              </div>
            )}

            {/* Room Types Preview */}
            <div className="pt-2">
              <span className="text-muted-foreground text-xs">Room Types:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {Array.from(
                  new Set(project.renders.map((render) => render.roomType))
                )
                  .slice(0, 3)
                  .map((roomType) => (
                    <Badge key={roomType} variant="outline" className="text-xs">
                      {roomTypeLabels[roomType]?.split(" ")[0]}
                    </Badge>
                  ))}
                {roomTypesCount > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{roomTypesCount - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted/30 rounded">
            <Image className="w-3 h-3" />
            <span className="truncate">
              {project.renders.length} render
              {project.renders.length !== 1 ? "s" : ""} available
            </span>
          </div>

          <Button asChild className="w-full">
            <Link href={`/dashboard/renders/${project.publicId}`}>
              <Eye className="w-4 h-4 mr-2" />
              View All Renders
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Loader
function RendersListSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-muted" />
            <Skeleton className="h-4 w-64 bg-muted" />
          </div>
          <Skeleton className="h-10 w-64 bg-muted" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>

        <Skeleton className="h-16 w-full bg-muted rounded-lg" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-9 h-9 bg-muted rounded-lg" />
                    <Skeleton className="h-5 w-16 bg-muted" />
                  </div>
                  <Skeleton className="h-6 w-16 bg-muted" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-3 w-1/2 bg-muted" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16 bg-muted" />
                    <Skeleton className="h-3 w-8 bg-muted" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12 bg-muted" />
                    <Skeleton className="h-3 w-10 bg-muted" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20 bg-muted" />
                    <Skeleton className="h-3 w-16 bg-muted" />
                  </div>
                </div>
                <div className="flex gap-1 pt-2">
                  <Skeleton className="h-5 w-12 bg-muted" />
                  <Skeleton className="h-5 w-10 bg-muted" />
                  <Skeleton className="h-5 w-14 bg-muted" />
                </div>
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-9 w-full bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
