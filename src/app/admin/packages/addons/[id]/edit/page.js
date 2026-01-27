// src\app\admin\packages\addons\[id]\edit\page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PackageForm from "@/components/admin/packages/PackageForm";
import { packageService } from "@/services/package.service";
import { toast } from "sonner";

export default function EditAddonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    setFetchLoading(true);
    try {
      const response = await packageService.getAddon(id);

      if (response.success) {
        setData(response.data.addon);
      } else {
        throw new Error(response.message || "Failed to load addon");
      }
    } catch (err) {
      console.error("Error loading addon:", err);
      toast.error(err.message || "Failed to load addon");
      router.push("/admin/packages?tab=addons"); // Updated redirect
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await packageService.updateAddon(id, formData);

      if (response.success) {
        toast.success("Addon updated successfully!");
        router.push("/admin/packages?tab=addons"); // CHANGED: Redirect to addons tab
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating addon:", err);
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <div className="animate-pulse h-8 w-8 bg-muted rounded"></div>
          <div className="animate-pulse h-8 w-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Addon not found</h1>
          <p className="text-muted-foreground mt-2">
            The addon you're trying to edit doesn't exist.
          </p>
          <Link href="/admin/packages?tab=addons"> {/* Updated link */}
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Addons
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/packages?tab=addons"> {/* Updated link */}
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Addons
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Addon</h1>
            <p className="text-muted-foreground mt-1">Update addon details</p>
          </div>
        </div>
      </div>

      {/* Addon Form */}
      <PackageForm
        type="addon"
        data={data}
        onSubmit={handleSubmit}
        loading={loading}
        submitButtonText="Update Addon"
        onCancel={() => router.push("/admin/packages?tab=addons")} // Updated cancel
      />
    </div>
  );
}