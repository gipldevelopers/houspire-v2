// src/components/projects/uploads/ProjectUploadsHeader.js
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Camera,
  RotateCcw,
  FolderOpen,
  Database,
  RefreshCw,
} from "lucide-react";

export default function ProjectUploadsHeader({
  project,
  stats,
  formatFileSize,
  hasFloorPlan,
  onResetChoice,
  onRefresh,
  refreshing = false,
  mobileView = false,
}) {
  const statCards = [
    {
      title: "Floor Plans",
      value: stats.floorPlans,
      icon: FileText,
      description: "Architectural drawings",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      title: "Room Photos",
      value: stats.roomPhotos,
      icon: Camera,
      description: "Space photographs",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      textColor: "text-green-700 dark:text-green-300",
    },
    {
      title: "Total Files",
      value: stats.totalFiles,
      icon: FolderOpen,
      description: "All uploads",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      textColor: "text-purple-700 dark:text-purple-300",
    },
    {
      title: "Total Size",
      value: formatFileSize(stats.totalSize),
      icon: Database,
      description: "Storage used",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/20",
      textColor: "text-amber-700 dark:text-amber-300",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
      {/* Main Header Section */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="space-y-2 sm:space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-2">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
            Upload Your Project Files
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Add floor plans and room photos to bring your{" "}
            <span className="font-semibold text-foreground">
              {project?.title || 'Project'}
            </span>{" "}
            to life
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
          {/* Reset Choice Button - Only show when choice is made */}
          {hasFloorPlan !== null && (
            <Button
              variant="outline"
              size={mobileView ? "sm" : "default"}
              onClick={onResetChoice}
              className="border-border hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 group"
            >
              <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
              {mobileView ? "Change Preference" : "Change Upload Preference"}
            </Button>
          )}
          
          {/* Refresh Button */}
          {/* <Button
            variant="outline"
            size={mobileView ? "sm" : "default"}
            onClick={onRefresh}
            disabled={refreshing}
            className="border-border hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button> */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-border bg-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {mobileView && stat.title === "Total Files" ? "Files" : 
                       mobileView && stat.title === "Total Size" ? "Size" : stat.title}
                    </p>
                    <p className={`text-lg sm:text-2xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}