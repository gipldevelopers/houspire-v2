"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PackageForm from "@/components/admin/packages/PackageForm";
import { packageService } from "@/services/package.service";
import { toast } from "sonner";

export default function EditPackagePage() {
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
      const response = await packageService.getPackage(id);

      if (response.success) {
        setData(response.data.package);
      } else {
        throw new Error(response.message || "Failed to load package");
      }
    } catch (err) {
      console.error("Error loading package:", err);
      toast.error(err.message || "Failed to load package");
      router.push("/admin/packages");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await packageService.updatePackage(id, formData);

      if (response.success) {
        toast.success("Package updated successfully!");
        router.push("/admin/packages");
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating package:", err);
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
          <h1 className="text-2xl font-bold text-foreground">Package not found</h1>
          <p className="text-muted-foreground mt-2">
            The package you're trying to edit doesn't exist.
          </p>
          <Link href="/admin/packages">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Packages
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
          <Link href="/admin/packages">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Packages
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Package</h1>
            <p className="text-muted-foreground mt-1">Update package details</p>
          </div>
        </div>
      </div>

      {/* Package Form */}
      <PackageForm
        type="package"
        data={data}
        onSubmit={handleSubmit}
        loading={loading}
        submitButtonText="Update Package"
        onCancel={() => router.back()}
      />
    </div>
  );
}