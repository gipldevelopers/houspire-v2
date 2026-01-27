// src\app\admin\styles\create\page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import StyleForm from "@/components/admin/styles/StyleForm";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function CreateStylePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
  
  setIsSubmitting(true);
  try {
    const formDataToSend = new FormData();
    
    // Add all form fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("popularity", formData.popularity || 50);
    
    // ✅ FIX: Get isActive from form data or default to true
    // The form dropdown sets isActive to boolean true/false
    const isActiveValue = formData.isActive !== undefined ? formData.isActive : true;
    formDataToSend.append("isActive", isActiveValue === true ? "true" : "false");
    
    // Add tags as individual fields
    if (formData.tags && Array.isArray(formData.tags)) {
      formData.tags.forEach((tag, index) => {
        formDataToSend.append(`tags[${index}]`, tag);
      });
    }
    
    // Add characteristics as individual fields
    if (formData.characteristics && Array.isArray(formData.characteristics)) {
      formData.characteristics.forEach((char, index) => {
        formDataToSend.append(`characteristics[${index}]`, char);
      });
    }
    
    // Add the image file
    if (formData.file && formData.file instanceof File) {
      formDataToSend.append("image", formData.file);
    }
    
    const response = await api.post("/styles", formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success("Style created successfully!");
    router.push("/admin/styles");
    
  } catch (error) {
    console.error("❌ Save failed:", error);
    toast.error(error.response?.data?.message || error.message || "Failed to create style");
  } finally {
    setIsSubmitting(false);
  }
};

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
            <h1 className="text-3xl font-bold text-foreground">
              Create New Style
            </h1>
            <p className="text-muted-foreground mt-1">
              Add a new design style to the collection
            </p>
          </div>
        </div>
      </div>

      {/* Style Form */}
      <Card className="border-border">
        <CardContent className="p-6">
          <StyleForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Create Style"
          />
        </CardContent>
      </Card>
    </div>
  );
}