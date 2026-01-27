// src\app\admin\boq-management\page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, FileText, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import AdminBOQStats from "@/components/admin/boq/AdminBOQStats";
import AdminBOQTable from "@/components/admin/boq/AdminBOQTable";
import { toast } from "sonner";
import Link from "next/link";
import api from "@/lib/axios";

export default function BOQManagementPage() {
  const router = useRouter();
  const [boqs, setBoqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    loadBOQs();
  }, []);

  const loadBOQs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/boq");

      if (response.data.success) {
        setBoqs(response.data.data.boqs || []);
      } else {
        toast.error("Failed to load BOQs", {
          description: response.data.message || "Unknown error occurred",
        });
      }
    } catch (error) {
      console.error("Error loading BOQs:", error);
      toast.error("Failed to load BOQs", {
        description: error.response?.data?.message || "Network error occurred",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadBOQs();
  };

  const filteredBOQs = boqs.filter((boq) => {
    const matchesSearch =
      boq.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      boq.project?.user?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      boq.project?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      boq.publicId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      boq.project?.publicId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || boq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteBOQ = async (boqId) => {
    if (
      confirm(
        "Are you sure you want to delete this BOQ? This action cannot be undone."
      )
    ) {
      try {
        const response = await api.delete(`/boq/${boqId}`);

        if (response.data.success) {
          setBoqs((prev) => prev.filter((boq) => boq.publicId !== boqId));
          toast.success("BOQ Deleted", {
            description: "BOQ has been deleted successfully",
          });
        } else {
          toast.error("Delete Failed", {
            description: response.data.message || "Failed to delete BOQ",
          });
        }
      } catch (error) {
        console.error("Error deleting BOQ:", error);
        toast.error("Delete Failed", {
          description:
            error.response?.data?.message || "Network error occurred",
        });
      }
    }
  };

  const handleEditBOQ = (boq) => {
    router.push(`/admin/boq-management/${boq.publicId}/edit`);
  };

  const sendProjectStatusWhatsApp = async (
    projectPublicId,
    projectName,
    status
  ) => {
    try {
      const res = await api.post("/whatsapp/send", {
        projectPublicId,
        templateId: "PROJECT_STATUS",
        templateVars: { projectName, status },
      });

      if (res.data.success) {
        toast.success("WhatsApp notification sent");
      } else {
        toast.error(res.data.message || "Failed to send WhatsApp");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending WhatsApp");
    }
  };

  const handleViewBOQ = (boq) => {
    router.push(`/admin/boq-management/${boq.publicId}`);
  };

  const handleSendToClient = async (boqId) => {
    if (!confirm("Are you sure you want to send this BOQ to the client?"))
      return;

    setSendingId(boqId); // ✅ START LOADER

    try {
      const response = await api.patch(`/boq/${boqId}/status`, {
        status: "SENT",
      });

      if (response.data.success) {
        setBoqs((prev) =>
          prev.map((boq) =>
            boq.publicId === boqId
              ? { ...boq, status: "SENT", isPublished: true }
              : boq
          )
        );

        toast.success("BOQ Sent");
      } else {
        toast.error("Failed to send BOQ");
      }
    } catch (error) {
      toast.error("Send Failed");
    } finally {
      setSendingId(null); // ✅ STOP LOADER
    }
  };

  const handleRevokeBOQ = async (boqId) => {
    if (
      confirm(
        "Are you sure you want to revoke this BOQ? The client will no longer be able to view it."
      )
    ) {
      try {
        const response = await api.patch(`/boq/${boqId}/status`, {
          status: "DRAFT",
        });

        if (response.data.success) {
          setBoqs((prev) =>
            prev.map((boq) =>
              boq.publicId === boqId
                ? {
                    ...boq,
                    status: "DRAFT",
                    updatedAt: new Date().toISOString(),
                    isPublished: false,
                  }
                : boq
            )
          );
          toast.success("BOQ Revoked", {
            description: "BOQ has been revoked from the client",
          });
        } else {
          toast.error("Revoke Failed", {
            description: response.data.message || "Failed to revoke BOQ",
          });
        }
      } catch (error) {
        console.error("Error revoking BOQ:", error);
        toast.error("Revoke Failed", {
          description:
            error.response?.data?.message || "Network error occurred",
        });
      }
    }
  };

  // Transform API data to match your table structure
  const transformBOQData = (boq) => ({
    id: boq.publicId,
    publicId: boq.publicId,
    userId: boq.project?.user?.publicId,
    user: {
      name: boq.project?.user?.name || "N/A",
      email: boq.project?.user?.email || "N/A",
      phone: boq.project?.user?.phone || "N/A",
    },
    projectId: boq.project?.publicId,
    projectTitle: boq.project?.title || "N/A",
    displayId: boq.project?.displayId || "N/A",
    title: boq.title,
    description: boq.description || "No description",
    totalAmount: boq.totalAmount || 0,
    status: boq.status?.toLowerCase() || "draft",
    isPublished: boq.isPublished || false,
    createdAt: boq.createdAt,
    updatedAt: boq.updatedAt,
    items:
      boq.boqCategoryItems?.map((catItem) => ({
        id: catItem.publicId,
        category: catItem.category?.name || "Uncategorized",
        description:
          catItem.customName || catItem.item?.name || "No description",
        unit: catItem.customUnit || catItem.item?.unit || "unit",
        quantity: catItem.quantity || 0,
        rate: catItem.rate || 0,
        amount: catItem.amount || 0,
      })) || [],
    // Include original data for reference
    _original: boq,
  });

  const transformedBOQs = filteredBOQs.map(transformBOQData);

  // Stats calculation
  const stats = {
    total: boqs.length,
    totalAmount: boqs.reduce((sum, boq) => sum + (boq.totalAmount || 0), 0),
    pending: boqs.filter(
      (boq) => boq.status === "DRAFT" || boq.status === "PENDING"
    ).length,
    sent: boqs.filter(
      (boq) => boq.status === "SENT" || boq.status === "APPROVED"
    ).length,
    generated: boqs.filter((boq) => boq.status === "GENERATED").length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">BOQ Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all Bill of Quantities across projects
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Link href="/admin/boq-management/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create BOQ
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <AdminBOQStats stats={stats} />

      {/* Search and Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Project ID, client, project, or BOQ title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-border"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="generated">Generated</option>
                <option value="sent">Sent</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BOQ Table */}
  <AdminBOQTable
  boqs={transformedBOQs}
  loading={loading}
  sendingId={sendingId}          // ✅ this line
  onEdit={handleEditBOQ}
  onDelete={handleDeleteBOQ}
  onView={handleViewBOQ}
  onSendToClient={handleSendToClient}
  onRevokeBOQ={handleRevokeBOQ}
/>


      {/* Empty State */}
      {!loading && transformedBOQs.length === 0 && (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No BOQs Found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by creating your first Bill of Quantities."}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/admin/boq-management/create">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First BOQ
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
