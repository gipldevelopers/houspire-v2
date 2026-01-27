"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, PlusSquare } from "lucide-react";
import PackageForm from "@/components/admin/packages/PackageForm";
import { packageService } from "@/services/package.service";
import { toast } from "sonner";

export default function CreatePackagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "package"; // "package" or "addon"

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      let response;
      
      if (type === "package") {
        response = await packageService.createPackage(formData);
      } else {
        response = await packageService.createAddon(formData);
      }

      if (response.success) {
        toast.success(
          `${type === "package" ? "Package" : "Addon"} created successfully!`
        );
        // FIX: Use "addons" (plural) instead of "addon" for the tab parameter
        const redirectTab = type === "package" ? "packages" : "addons";
        router.push(`/admin/packages?tab=${redirectTab}`);
      } else {
        throw new Error(response.message || "Creation failed");
      }
    } catch (err) {
      toast.error(err.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* FIX: Use correct tab parameter for back link */}
          <Link href={`/admin/packages?tab=${type === "package" ? "packages" : "addons"}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {type === "package" ? "Packages" : "Addons"}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create New {type === "package" ? "Package" : "Addon"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Add a new {type === "package" ? "pricing package" : "addon"} to the platform
            </p>
          </div>
        </div>

        {/* Type Switcher */}
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
          <Link href="/admin/packages/create?type=package">
            <Button
              variant={type === "package" ? "default" : "ghost"}
              size="sm"
              className="flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Package
            </Button>
          </Link>
          <Link href="/admin/packages/create?type=addon">
            <Button
              variant={type === "addon" ? "default" : "ghost"}
              size="sm"
              className="flex items-center gap-2"
            >
              <PlusSquare className="w-4 h-4" />
              Addon
            </Button>
          </Link>
        </div>
      </div>

      {/* Package Form */}
      <PackageForm
        type={type}
        onSubmit={handleSubmit}
        loading={loading}
        submitButtonText={`Create ${type === "package" ? "Package" : "Addon"}`}
        // FIX: Use correct tab parameter for cancel
        onCancel={() => router.push(`/admin/packages?tab=${type === "package" ? "packages" : "addons"}`)}
      />
    </div>
  );
}