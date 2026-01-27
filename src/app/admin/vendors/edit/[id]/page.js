// src/app/admin/vendors/edit/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import VendorForm from "@/components/admin/vendors/VendorForm";
import api from "@/lib/axios";
import { toast } from "sonner";

// Mock data

export default function EditVendorPage() {
  const params = useParams(); // get route params
  const { id } = params; // vendor id from URL
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchVendor = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/vendors/${id}`);
        if (res.data.success) {
          setVendor(res.data.data);
        } else {
          toast?.error("Vendor not found");
        }
      } catch (error) {
        console.error(error);
        toast?.error("Failed to fetch vendor data");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  const handleSubmit = async (formData, vendorId) => {
    setLoading(true);

    try {
      // Send PATCH request to backend
      const res = await api.put(`/vendors/${vendorId}`, {
        ...formData,
        updatedAt: new Date().toISOString(),
      });

      if (res.data.success) {
        toast?.success("Vendor updated successfully!");
        router.push("/admin/vendors");
      } else {
        toast?.error(res.data.message || "Failed to update vendor");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast?.error("Failed to update vendor. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    router.push("/admin/vendors");
  };

  // const handleDelete = async () => {
  //   if (
  //     !confirm(
  //       "Are you sure you want to delete this vendor? This action cannot be undone."
  //     )
  //   ) {
  //     return;
  //   }

  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     alert("Vendor deleted successfully!");
  //     router.push("/admin/vendors");
  //   } catch (error) {
  //     console.error("Delete failed:", error);
  //     alert("Failed to delete vendor. Please try again.");
  //   }
  // };

  if (!vendor) {
    return <div>Loading...</div>;
  }

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
            <h1 className="text-3xl font-bold text-foreground">Edit Vendor</h1>
            <p className="text-muted-foreground mt-1">
              Update vendor details and settings
            </p>
          </div>
        </div>

        {/* <Button
          variant="outline"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Vendor
        </Button> */}
      </div>

      <VendorForm
        vendor={vendor}
        onSubmit={(formData) => handleSubmit(formData, vendor.id)}
        onCancel={handleCancel}
        loading={loading}
        submitButtonText="Update Vendor"
      />
    </div>
  );
}
