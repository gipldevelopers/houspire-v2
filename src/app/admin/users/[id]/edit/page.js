"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; // <--- useParams for dynamic segment
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import UserForm from "@/components/admin/users/UsersForm";
import api from "@/lib/axios";
import { toast } from "sonner";

const UserPage = () => {
  const router = useRouter();
  const params = useParams();
  const publicId = params.id; // <-- this captures [id] from URL
  const type = "USER"; // Or pass this dynamically if needed

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicId) return;

    setLoading(true);
    api
      .get(`/users/${type}/${publicId}`)
      .then((res) => setUser(res.data.data))
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Failed to fetch user");
      })
      .finally(() => setLoading(false));
  }, [publicId, type]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (user) {
        await api.patch(`/users/${type}/${publicId}`, formData);
        toast.success("User updated successfully!");
      } else {
        await api.post("/users/create", { ...formData, type });
        toast.success("User created successfully!");
      }
      router.push("/admin/users");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {user ? "Update User" : "Add New User"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {user ? "Edit user details below" : "Register a new user/admin"}
            </p>
          </div>
        </div>
      </div>

      {/* User Form */}
      <UserForm
        user={user}
        onSubmit={handleSubmit}
        loading={loading}
        submitButtonText={user ? "Update User" : "Create User"}
        onCancel={() => router.back()}
      />
    </div>
  );
};

export default UserPage;
