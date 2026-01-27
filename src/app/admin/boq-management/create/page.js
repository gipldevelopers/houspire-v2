// src\app\admin\boq-management\create\page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import BOQForm from "@/components/admin/boq/BOQForm";
import BOQImport from "@/components/admin/boq/BOQImport";
import { toast } from "sonner";
import Link from "next/link";
import api from "@/lib/axios";

export default function CreateBOQPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedData, setImportedData] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Get project ID from URL
  const projectIdFromUrl = searchParams.get("project");

  // Fetch projects for BOQ creation
  useEffect(() => {
    loadProjects();
  }, []);

  // Auto-select project when projects are loaded and URL has projectId
  useEffect(() => {
    if (projects.length > 0 && projectIdFromUrl) {
      autoSelectProject(projectIdFromUrl);
    }
  }, [projects, projectIdFromUrl]);

  const autoSelectProject = (projectId) => {
    // Search through all users and their projects to find the matching project
    for (const user of projects) {
      const foundProject = user.projects.find(
        (project) => project.id === projectId
      );
      if (foundProject) {
        const selectedProjectData = {
          projectId: foundProject.id,
          projectTitle: foundProject.title,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone,
          area: foundProject.area,
          configuration: foundProject.configuration,
          location: foundProject.location,
          status: foundProject.status,
          hasBOQ: foundProject.hasBOQ,
          budgetRange: foundProject.budgetRange,
          selectedStyle: foundProject.selectedStyle,
          createdAt: foundProject.createdAt,
        };
        setSelectedProject(selectedProjectData);
        toast.success("Project Auto-Selected", {
          description: `Project ${foundProject.title} has been automatically selected.`,
        });
        break;
      }
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/projects/boq/projects");
      if (response.data.success) {
        setProjects(response.data.data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (boqData) => {
    setSaving(true);
    try {
      const categoriesArray = Object.entries(boqData.categories).map(
        ([categoryName, items]) => ({
          categoryName,
          items: items.map((item) => ({
            name: item.description || item.name,
            description: item.description,
            unit: item.unit,
            quantity: parseFloat(item.quantity) || 0,
            rate: parseFloat(item.rate) || 0,
            amount: parseFloat(item.amount) || 0,
            remarks: item.remarks || "",
          })),
        })
      );

      const payload = {
        projectId: selectedProject.projectId,
        title: boqData.title,
        categories: categoriesArray,
        totalAmount: boqData.totalAmount,
        saveItemsToDatabase: true,
      };

      const response = await api.post("/boq", payload);

      if (response.data.success) {
        toast.success("BOQ Created", {
          description: response.data.message,
        });
        router.push("/admin/boq-management");
      } else {
        toast.error("Something went wrong!", {
          description: response.data.message,
          boqs,

        });
      }
    } catch (error) {
      toast.error("Creation Failed", {
        description: error.response?.data?.message || "Failed to create BOQ",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setImportedData(null);
    router.back();
  };

  const handleImportComplete = (importedBOQData) => {
    setImportedData(importedBOQData);
    toast.success("Data Imported", {
      description:
        "BOQ data has been imported. You can now review and edit before saving.",
    });
  };

  const transformProjectsToUsers = () => {
    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      email: project.email,
      phone: project.phone,
      projects: project.projects.map((proj) => ({
        id: proj.id,
        title: proj.title,
        area: proj.area,
        configuration: proj.configuration,
        location: proj.location,
        status: proj.status,
        hasBOQ: proj.hasBOQ,
        budgetRange: proj.budgetRange,
        selectedStyle: proj.selectedStyle,
        createdAt: proj.createdAt,
      })),
    }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="border-border"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create BOQ</h1>
              <p className="text-sm text-muted-foreground">
                {projectIdFromUrl
                  ? "Auto-selecting project from URL..."
                  : "Build your Bill of Quantities with categorized items"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/admin/boq-management/categories">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                Manage Categories
              </Button>
            </Link>

            <Link href="/admin/boq-management/items">
              <Button
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                Manage Items
              </Button>
            </Link>

            <Button
              onClick={() => setShowImportModal(true)}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import from Excel
            </Button>
          </div>
        </div>

        {/* Auto-selection Status */}
        {projectIdFromUrl && !selectedProject && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-blue-700">
                Looking for project ID: {projectIdFromUrl}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-blue-700">Loading projects...</p>
            </div>
          </div>
        )}

        {/* Import Status Banner */}
        {importedData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">
                    Excel Data Imported
                  </h4>
                  <p className="text-sm text-green-700">
                    {importedData.totalCategories} categories and{" "}
                    {importedData.totalItems} items have been imported. You can
                    review and edit below before saving.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImportedData(null)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear Import
              </Button>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && projects.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-semibold text-yellow-900">
                  No Projects Available
                </h4>
                <p className="text-sm text-yellow-700">
                  There are no projects available for BOQ creation. Projects
                  need to be in a ready state.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Project Not Found */}
        {!loading &&
          projectIdFromUrl &&
          projects.length > 0 &&
          !selectedProject && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-900">
                    Project Not Found
                  </h4>
                  <p className="text-sm text-red-700">
                    Project with ID "{projectIdFromUrl}" was not found in
                    available projects. Please select a project manually from
                    the list below.
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* BOQ Form */}
        {!loading && projects.length > 0 && (
          <BOQForm
            users={transformProjectsToUsers()}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={saving}
            importedData={importedData}
            projects={projects}
            setSelectedProject={setSelectedProject}
            selectedProject={selectedProject}
          />
        )}

        {/* Import Modal */}
        <BOQImport
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportComplete={handleImportComplete}
        />
      </div>
    </div>
  );
}
