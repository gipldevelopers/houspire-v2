// src/app/admin/vendors/create/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import VendorForm from "@/components/admin/vendors/VendorForm";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function CreateVendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      // Remove validation - accept any data
      const submitData = {
        ...formData,
        // Ensure required fields for backend have fallbacks
        name: formData.name || "Unknown Vendor",
        email: formData.email || `vendor-${Date.now()}@example.com`,
        phone: formData.phone || "Not Provided",
      };

      // Call backend API
      const response = await api.post("/vendors", submitData);

      if (response.data.success) {
        toast.success("Vendor created successfully!");
        router.push("/admin/vendors");
      } else {
        toast.error(response.data.message || "Failed to create vendor.");
      }
    } catch (error) {
      console.error("Vendor creation error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create vendor. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/vendors");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/vendors">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vendors
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Add New Vendor
            </h1>
            <p className="text-muted-foreground mt-1">
              Register a new vendor to the platform
            </p>
          </div>
        </div>
      </div>

      <VendorForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        submitButtonText="Create Vendor"
      />
    </div>
  );
}