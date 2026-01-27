// src\app\admin\styles\edit\[id]\page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import StyleForm from "@/components/admin/styles/StyleForm";
import api from "@/lib/axios";
import { toast } from "sonner";

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/styles/default-style.jpg';
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
  return `${serverUrl}${imagePath}`;
};

export default function EditStylePage() {
  const params = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [styleData, setStyleData] = useState(null);
  const [loading, setLoading] = useState(true);

  const styleId = params.id;

useEffect(() => {
  const fetchStyle = async () => {
    setLoading(true);
    try {
      const res = await api.get(`styles/${styleId}`);

      if (!res.data.success)
        throw new Error(res.data.message || "Failed to fetch style");

      // ✅ CONVERT RELATIVE URLs TO ABSOLUTE URLs
      const style = res.data.data.style;
      const enhancedStyle = {
        ...style,
        imageUrl: getImageUrl(style.imageUrl),
        thumbnailUrl: getImageUrl(style.thumbnailUrl)
      };

      setStyleData(enhancedStyle);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load style data.");
    } finally {
      setLoading(false);
    }
  };

  if (styleId) fetchStyle();
}, [styleId]);
  const handleSubmit = async (formData) => {
  
  setIsSubmitting(true);

  try {
    const form = new FormData();

    // Append all form fields
    form.append("name", formData.name || "");
    form.append("description", formData.description || "");
    form.append("category", formData.category || "");
    form.append("popularity", formData.popularity || 50);
    
    // ✅ FIX THIS LINE - Handle undefined isActive:
    // Current: form.append("isActive", formData.isActive === true ? "true" : "false");
    // Change to:
    const isActiveValue = formData.isActive !== undefined ? formData.isActive : (styleData?.isActive || true);
    form.append("isActive", isActiveValue === true ? "true" : "false");
    
    // Handle tags and characteristics
    if (formData.tags && Array.isArray(formData.tags)) {
      formData.tags.forEach((tag, index) => {
        form.append(`tags[${index}]`, tag);
      });
    }
    
    if (formData.characteristics && Array.isArray(formData.characteristics)) {
      formData.characteristics.forEach((char, index) => {
        form.append(`characteristics[${index}]`, char);
      });
    }

    // Handle image
    if (formData.file && formData.file instanceof File) {
      form.append("image", formData.file);
    }

    const response = await api.put(`/styles/${styleId}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Update failed");
    }

    toast.success(response.data.message || "Style updated successfully!");
    router.push("/admin/styles");
  } catch (error) {
    console.error("Update failed:", error);
    toast.error(error.response?.data?.message || error.message || "Failed to update style");
  } finally {
    setIsSubmitting(false);
  }
};

  
  const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this style? This cannot be undone."))
    return;

  try {
    const response = await api.delete(`/styles/${styleId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Delete failed");
    }

    toast.success("Style deleted successfully!");
    router.push("/admin/styles");
  } catch (error) {
    console.error("Delete failed:", error);
    toast.error(error.response?.data?.message || error.message || "Failed to delete style");
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading style data...</p>
        </div>
      </div>
    );
  }

  if (!styleData) {
    return (
      <div className="text-center text-red-600">Failed to load style data.</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/styles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Styles
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Style</h1>
            <p className="text-muted-foreground mt-1">
              Update design style details
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Style
        </Button>
      </div>

      {/* Style Form */}
      <Card className="border-border">
        <CardContent className="p-6">
          <StyleForm
            initialData={styleData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Update Style"
            showDeleteButton={true}
            onDelete={handleDelete}
            getImageUrl={getImageUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
}
