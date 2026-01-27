"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  FileText,
  Camera,
  Grid3X3,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import ProjectUploadsHeader from "@/components/projects/uploads/ProjectUploadsHeader";
import UploadTabsNavigation from "@/components/projects/uploads/UploadTabsNavigation";
import FloorPlanUpload from "@/components/projects/uploads/FloorPlanUpload";
import RoomPhotoUpload from "@/components/projects/uploads/RoomPhotoUpload";
import UploadGallery from "@/components/projects/uploads/UploadGallery";
import NextStepCard from "@/components/ui/NextStepCard";
import { toast } from "sonner";
import { uploadService } from "@/services/upload.service";
import { projectService } from "@/services/project.service";

const FLOOR_PLAN_CHOICE_KEY = "houspire_floor_plan_choice";

export default function ProjectUploadsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId;
  const [activeTab, setActiveTab] = useState("floorplans");
  
  // This is the Source of Truth
  const [uploads, setUploads] = useState({
    floorPlans: [],
    roomPhotos: [],
    fileUploads: [],
  });
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFloorPlan, setHasFloorPlan] = useState(null);
  const [showChoiceCard, setShowChoiceCard] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    loadProjectData();
    loadUploads();
  }, [projectId]);

  const loadProjectData = async () => {
    setLoading(true);
    const savedChoice = localStorage.getItem(`${FLOOR_PLAN_CHOICE_KEY}_${projectId}`);

    if (savedChoice) {
      const choice = JSON.parse(savedChoice);
      setHasFloorPlan(choice.hasFloorPlan);
      setActiveTab(choice.hasFloorPlan ? "floorplans" : "photos");
      setShowChoiceCard(false);
    }

    try {
      const result = await projectService.getProject(projectId);
      if (result.success) {
        setProject(result.data.project);
      }
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setLoading(false);
    }
  };

  // The Master Refresh Function
  const loadUploads = async () => {
    try {
      const result = await uploadService.getProjectUploads(projectId);
      if (result.success) {
        setUploads(result.data.files);
      }
    } catch (error) {
      console.error("Error loading uploads:", error);
    }
  };

  const refreshUploads = async () => {
    setRefreshing(true);
    await loadUploads();
    setRefreshing(false);
  };

  // Called when RoomPhotoUpload finishes a file
  const handleUploadComplete = async (newFile, type) => {
    try {
      await loadUploads(); // Refresh data immediately
      
      const totalFiles = (uploads.floorPlans?.length || 0) + (uploads.roomPhotos?.length || 0) + 1;
      
      if (totalFiles === 1) {
        await projectService.updateProjectPhase(projectId, {
          completedPhase: "FILE_UPLOADS",
          currentPhase: "PAYMENT",
        });
      }
      
      // Toast handled in the child component usually, but we can do it here too
    } catch (error) {
      console.error("Error refreshing uploads:", error);
    }
  };

  const handleDelete = async (fileId, fileType) => {
    try {
      const result = await uploadService.deleteFile(fileId, fileType);
      if (result.success) {
        toast.success("File deleted successfully");
        await loadUploads(); // UI updates immediately
      } else {
        toast.error(result.message || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const handleFloorPlanChoice = (choice) => {
    setHasFloorPlan(choice);
    setShowChoiceCard(false);
    localStorage.setItem(
      `${FLOOR_PLAN_CHOICE_KEY}_${projectId}`,
      JSON.stringify({ hasFloorPlan: choice, timestamp: Date.now() })
    );
    setActiveTab(choice ? "floorplans" : "photos");
  };

  const resetFloorPlanChoice = () => {
    setShowChoiceCard(true);
    setHasFloorPlan(null);
    setActiveTab("floorplans");
    localStorage.removeItem(`${FLOOR_PLAN_CHOICE_KEY}_${projectId}`);
  };

  const handleContinueToSummary = async () => {
    if (isContinuing) return;
    setIsContinuing(true);
    try {
      const hasUploads = (uploads.floorPlans?.length || 0) + (uploads.roomPhotos?.length || 0) > 0;
      if (!hasUploads) {
        toast.error("Upload Required", { description: "Please upload at least one file." });
        setIsContinuing(false);
        return;
      }
      await projectService.updateProjectPhase(projectId, {
        completedPhase: "FILE_UPLOADS",
        currentPhase: "PAYMENT",
      });
      router.push(`/dashboard/projects/${projectId}/summary`);
    } catch (error) {
      toast.error("Navigation Error");
      setIsContinuing(false);
    }
  };

  const stats = {
    floorPlans: uploads.floorPlans?.length || 0,
    roomPhotos: uploads.roomPhotos?.length || 0,
    totalFiles: (uploads.floorPlans?.length || 0) + (uploads.roomPhotos?.length || 0),
    totalSize: [...(uploads.floorPlans || []), ...(uploads.roomPhotos || [])].reduce((acc, file) => acc + (file.fileSize || 0), 0),
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Generate tabs
  const getTabs = () => {
    const tabs = [];
    if (hasFloorPlan) {
      tabs.push({
        id: "floorplans",
        label: mobileView ? "Plans" : "Floor Plans",
        icon: FileText,
        badge: stats.floorPlans,
        description: "Upload architectural drawings",
      });
    } else {
      tabs.push({
        id: "photos",
        label: mobileView ? "Photos" : "Room Photos",
        icon: Camera,
        badge: stats.roomPhotos,
        description: "Add space photographs",
      });
    }
    if (stats.totalFiles > 0) {
      tabs.push({
        id: "gallery",
        label: mobileView ? "Gallery" : "All Uploads",
        icon: Grid3X3,
        badge: stats.totalFiles,
        description: "View all uploaded files",
      });
    }
    return tabs;
  };

  if (loading) return <div className="min-h-screen bg-background p-6"><Loader2 className="animate-spin" /></div>;

  const tabs = getTabs();

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <ProjectUploadsHeader
          project={project}
          stats={stats}
          formatFileSize={formatFileSize}
          hasFloorPlan={hasFloorPlan}
          onResetChoice={resetFloorPlanChoice}
          onRefresh={refreshUploads}
          refreshing={refreshing}
          mobileView={mobileView}
        />

        {showChoiceCard ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                How would you like to start?
              </h3>
              <p className="text-muted-foreground">
                Choose your preferred upload method to begin
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Floor Plans Card */}
              <Card 
                className="group relative overflow-hidden border-2 border-border hover:border-blue-500 transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-background"
                onClick={() => handleFloorPlanChoice(true)}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon Container */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
                      <div className="relative bg-blue-100 dark:bg-blue-900/30 p-6 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-2">
                      <h4 className="text-xl font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Start with Floor Plans
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Upload architectural drawings and floor plans for precise design planning
                      </p>
                    </div>
                    
                    {/* Arrow Indicator */}
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                      <span className="text-sm font-medium">Get started</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </CardContent>
              </Card>

              {/* Room Photos Card */}
              <Card 
                className="group relative overflow-hidden border-2 border-border hover:border-purple-500 transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/20 dark:to-background"
                onClick={() => handleFloorPlanChoice(false)}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon Container */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl group-hover:bg-purple-500/30 transition-all duration-300"></div>
                      <div className="relative bg-purple-100 dark:bg-purple-900/30 p-6 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <Camera className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-2">
                      <h4 className="text-xl font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        Start with Room Photos
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Upload photos of your rooms to get personalized design recommendations
                      </p>
                    </div>
                    
                    {/* Arrow Indicator */}
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                      <span className="text-sm font-medium">Get started</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <UploadTabsNavigation
              activeTab={activeTab}
              tabs={tabs}
              stats={stats}
              formatFileSize={formatFileSize}
              hasFloorPlan={hasFloorPlan}
              refreshing={refreshing}
              onRefresh={refreshUploads}
              mobileView={mobileView}
            />

            {hasFloorPlan && (
              <TabsContent value="floorplans" className="space-y-6">
                <FloorPlanUpload
                  projectId={projectId}
                  onUploadComplete={(file) => handleUploadComplete(file, "floorPlans")}
                  onSwitchToPhotos={resetFloorPlanChoice}
                  mobileView={mobileView}
                />
                <UploadGallery
                  files={uploads.floorPlans || []}
                  type="floorplan"
                  onDelete={(id) => handleDelete(id, "floorPlans")}
                  onRefresh={refreshUploads}
                  mobileView={mobileView}
                />
              </TabsContent>
            )}

            {!hasFloorPlan && (
              <TabsContent value="photos" className="space-y-6">
                {/* CRITICAL CHANGE: 
                  We pass 'existingFiles' (from server) and 'onUploadComplete' (parent refresh)
                */}
                <RoomPhotoUpload
                  projectId={projectId}
                  existingFiles={uploads.roomPhotos || []} 
                  onUploadComplete={(file) => handleUploadComplete(file, "roomPhotos")}
                  mobileView={mobileView}
                />
                <UploadGallery
                  files={uploads.roomPhotos || []}
                  type="photo"
                  onDelete={(id) => handleDelete(id, "roomPhotos")}
                  onRefresh={refreshUploads}
                  mobileView={mobileView}
                />
              </TabsContent>
            )}

            {stats.totalFiles > 0 && (
              <TabsContent value="gallery" className="space-y-6">
                <UploadGallery
                  files={[...(uploads.floorPlans || []), ...(uploads.roomPhotos || [])]}
                  type="all"
                  showFilters={true}
                  onDelete={(id, type) => handleDelete(id, type === "floorplan" ? "floorPlans" : "roomPhotos")}
                  onRefresh={refreshUploads}
                  mobileView={mobileView}
                />
              </TabsContent>
            )}
          </Tabs>
        )}

        {(stats.floorPlans > 0 || stats.roomPhotos > 0) && !showChoiceCard && (
          <NextStepCard
            title="Uploads Complete!"
            description={`You have uploaded ${stats.totalFiles} files. Review your project summary and continue.`}
            buttonText={isContinuing ? "Processing..." : "Review Summary & Continue"}
            onButtonClick={handleContinueToSummary}
            buttonIcon={isContinuing ? Loader2 : CheckCircle2}
            disabled={isContinuing}
            mobileView={mobileView}
          />
        )}
      </div>
    </div>
  );
}