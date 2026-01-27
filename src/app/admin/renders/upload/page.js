// src\app\admin\renders\upload\page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import RoomRenderManager from "@/components/admin/renders/RoomRenderManager";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function UploadRenderPage() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState(null);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const projectFromUrl = searchParams.get("project");
  // Fetch pending projects on component mount
  useEffect(() => {
    fetchPendingProjects();
  }, []);
  useEffect(() => {
    if (projectFromUrl && pendingProjects.length > 0) {
      const found = pendingProjects.find(
        (proj) => proj.projectId.toString() === projectFromUrl.toString()
      );
      if (found) {
        setSelectedProject(found);
      }
    }
  }, [projectFromUrl, pendingProjects]);

  const fetchPendingProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/renders/admin/pending-projects");

      // Access the data correctly - response.data.data contains the array
      if (response.data.success) {
        setPendingProjects(response.data.data || []);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch pending projects"
        );
      }
    } catch (err) {
      console.error("Error fetching pending projects:", err);
      setError(err.message || "Failed to load pending projects");

      // Fallback to empty array if API fails
      setPendingProjects([]);
    } finally {
      setLoading(false);
    }
  };



const handleUpload = async (uploadData) => {
  try {

    // Show loading toast
    const uploadToast = toast.loading("Uploading renders...");

    // Prepare form data for file upload
    const formData = new FormData();

    // Add project ID
    formData.append("projectId", uploadData.project.projectId);

    // Filter room renders that have files
    const rendersWithFiles = uploadData.roomRenders.filter(
      (render) => render.imageFile
    );

    if (rendersWithFiles.length === 0) {
      toast.error("Please select at least one file to upload");
      throw new Error("Please select at least one file to upload");
    }

    // Add each file with its metadata
    rendersWithFiles.forEach((roomRender, index) => {
      formData.append("renderImages", roomRender.imageFile);
      formData.append("roomTypes", roomRender.roomType);

      if (roomRender.angle) {
        formData.append("angles", roomRender.angle);
      } else {
        formData.append("angles", ""); // Send empty string if no angle
      }

      if (roomRender.styleApplied) {
        formData.append("stylesApplied", roomRender.styleApplied);
      } else {
        formData.append("stylesApplied", ""); // Send empty string if no style
      }

      const isFinal = roomRender.isFinal ?? false;
      formData.append("isFinal", isFinal.toString());
    });

    const response = await api.post("/renders/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      // Dismiss loading toast and show success
      toast.dismiss(uploadToast);
      toast.success(`Successfully uploaded ${rendersWithFiles.length} renders for ${uploadData.project.projectTitle}!`);
      
      router.push("/admin/renders");
    } else {
      throw new Error(response.data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    
    // Dismiss loading toast if it exists and show error
    toast.dismiss();
    toast.error(error.response?.data?.message || error.message || "Upload failed. Please try again.");
    
    throw error;
  }
};

  // Handle project change from RoomRenderManager
  const handleProjectChange = (project) => {
    setSelectedProject(project);
  };

  // Retry loading pending projects
  const handleRetry = () => {
    fetchPendingProjects();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading pending projects...</p>
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
              Upload Project Renders
            </h1>
            <p className="text-muted-foreground mt-1">
              Select pending project and upload renders for rooms
            </p>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={handleRetry} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Projects State */}
      {!loading && !error && pendingProjects.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                No pending projects found. All projects have renders or are
                completed.
              </p>
              <Link href="/admin/projects">
                <Button variant="outline">View All Projects</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Form */}
      {!loading && !error && pendingProjects.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          <RoomRenderManager
            project={selectedProject}
            setSelectedProject={setSelectedProject}
            onUpload={handleUpload}
            onCancel={() => router.push("/admin/renders")}
            onProjectChange={handleProjectChange}
            mode="create"
            pendingProjects={pendingProjects}
          />
        </div>
      )}
    </div>
  );
}
