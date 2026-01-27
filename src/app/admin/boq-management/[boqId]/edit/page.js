// src\app\admin\boq-management\[boqId]\edit\page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BOQForm from "@/components/admin/boq/BOQForm";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function EditBOQPage() {
  const params = useParams();
  const router = useRouter();
  const [boq, setBoq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Memoize the loadBOQ function
  const loadBOQ = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/boq/${params.boqId}`);

      if (response.data.success) {
        const boqData = response.data.data;
        setBoq(boqData);

        // Transform project data for BOQForm
        const projectData = {
          projectId: boqData.project?.publicId,
          projectTitle: boqData.project?.title,
          userName: boqData.project?.user?.name,
          userEmail: boqData.project?.user?.email,
          userPhone: boqData.project?.user?.phone,
          area: boqData.project?.areaSqFt,
          configuration: boqData.project?.projectType,
          address: boqData.project?.address,
          city: boqData.project?.city,
          state: boqData.project?.state,
          status: boqData.project?.status,
          createdAt: boqData.project?.createdAt,
        };

        setSelectedProject(projectData);
      } else {
        toast.error("Failed to load BOQ", {
          description: response.data.message || "Failed to load BOQ data",
        });
      }
    } catch (error) {
      console.error("Error loading BOQ:", error);
      toast.error("Failed to load BOQ", {
        description: error.response?.data?.message || "Network error occurred",
      });
    } finally {
      setLoading(false);
    }
  }, [params.boqId]);

  useEffect(() => {
    if (params.boqId) {
      loadBOQ();
    }
  }, [params.boqId, loadBOQ]);

  // Transform API data to BOQForm format - memoize this
  const transformBOQData = useCallback((apiData) => {
    if (!apiData) return null;

    // Group items by category
    const categories = {};
    apiData.boqCategoryItems?.forEach((item) => {
      const categoryName = item.category?.name || "Uncategorized";
      if (!categories[categoryName]) {
        categories[categoryName] = [];
      }

      categories[categoryName].push({
        id: item.publicId,
        description: item.customName || item.item?.name || "",
        unit: item.customUnit || item.item?.unit || "",
        quantity: Number(item.quantity) || 0,
        rate: Number(item.rate) || 0,
        amount: Number(item.amount) || 0,
        remarks: item.remarks || "",
        // Keep _original for internal reference but we'll remove it before sending to API
        _original: item,
      });
    });

    return {
      title: apiData.title,
      description: apiData.description || "",
      categories: categories,
      totalAmount: Number(apiData.totalAmount) || 0,
      status: apiData.status,
      isPublished: apiData.isPublished,
      _original: apiData,
    };
  }, []);

  // Clean form data before sending to API - remove _original fields
  const cleanFormData = useCallback((formData) => {
    const cleanedCategories = {};
    
    // Remove _original fields from categories and items
    Object.entries(formData.categories || {}).forEach(([categoryName, items]) => {
      cleanedCategories[categoryName] = items.map(item => {
        const { _original, ...cleanItem } = item;
        return cleanItem;
      });
    });

    return {
      ...formData,
      categories: cleanedCategories
    };
  }, []);

  const handleSave = async (boqData) => {
    setSaving(true);

    try {
      // Clean the form data before sending to API
      const cleanedData = cleanFormData(boqData);

      // Transform form data for API
      const updateData = {
        title: cleanedData.title,
    
        totalAmount: cleanedData.totalAmount,
        status: cleanedData.status || "DRAFT",
        categories: cleanedData.categories,
      };

   

      // Use the complete update endpoint
      const response = await api.patch(`/boq/${params.boqId}/complete`, updateData);

      if (response.data.success) {
        toast.success("BOQ Updated", {
          description: "Bill of Quantities updated successfully with all items",
        });

        // Redirect to view page
        router.push(`/admin/boq-management/${params.boqId}`);
      } else {
        toast.error("Update Failed", {
          description: response.data.message || "Failed to update BOQ",
        });
      }
    } catch (error) {
      console.error("Error updating BOQ:", error);
      toast.error("Update Failed", {
        description: error.response?.data?.message || "Network error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading && !boq) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-9 w-24 bg-muted rounded"></div>
              <div>
                <div className="h-8 bg-muted rounded w-48 mb-2"></div>
                <div className="h-4 bg-muted rounded w-64"></div>
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!boq) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Budget not found
          </h1>
          <p className="text-muted-foreground mb-4">
            The requested BOQ could not be found.
          </p>
          <Button onClick={() => router.push("/admin/boq-management")}>
            Back to BOQ Management
          </Button>
        </div>
      </div>
    );
  }

  const transformedBOQ = transformBOQData(boq);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
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
              <h1 className="text-3xl font-bold text-foreground">Edit BOQ</h1>
              <p className="text-muted-foreground mt-2">
                Update the Bill of Quantities for{" "}
                {boq.project?.user?.name || "—"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">BOQ ID</div>
            <div className="font-mono text-sm font-semibold text-foreground">
              {boq.publicId}
            </div>
            <div className="text-xs text-muted-foreground">
              Created: {new Date(boq.createdAt).toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Status:{" "}
              <span className="font-semibold capitalize">
                {boq.status?.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        <BOQForm
          initialData={transformedBOQ}
          onSave={handleSave}
          onCancel={handleCancel}
          isEdit={true}
          loading={saving}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          projects={[]}
        />
      </div>
    </div>
  );
}