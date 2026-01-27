"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import RoomRenderManager from "@/components/admin/renders/RoomRenderManager";
import api from "@/lib/axios";

// Mock function to fetch render data by ID

export default function EditRenderPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.renderId;

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [renders, setRenders] = useState([]);
  const loadProjectRenders = async (page = 1, limit = 12) => {
    try {
      setLoading(true);

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
  }, [projectId]);

  // Handle update from RoomRenderManager
  const handleUpdate = async (updateData) => {
    try {
      // Simulate update process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      alert(
        `Successfully updated ${updateData.roomRenders.length} renders for ${updateData.project.projectTitle}!`
      );
      router.push("/admin/renders");
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              Edit Project Renders
            </h1>
            <p className="text-muted-foreground mt-1">
              Update or replace existing room renders
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Form */}
        <div>
          <RoomRenderManager
            project={project}
            initialRenders={renders}
            onUpload={handleUpdate}
            onCancel={() => router.push("/admin/renders")}
            mode="edit"
          />
        </div>
      </div>
    </div>
  );
}
