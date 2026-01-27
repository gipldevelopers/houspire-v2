// src/app/admin/email-templates/page.js
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  Edit,
  Copy,
  Trash2,
  FolderOpen,
  Mail,
  Star,
  Users,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function AdminEmailTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Available categories from enum
  const categories = [
    "PASSWORD_RESET",
    "WELCOME_EMAIL",
    "EMAIL_VERIFICATION",
    "PROJECT_STATUS_UPDATE",
    "PAYMENT_CONFIRMATION",
    "RENDER_READY",
    "BOQ_READY",
    "VENDOR_LIST_SENT",
    "SUPPORT_TICKET_CREATED",
    "SUPPORT_TICKET_UPDATED",
    "ACCOUNT_DEACTIVATED",
    "NEWSLETTER",
    "PROMOTIONAL",
    "SYSTEM_ALERT",
  ];

  // Calculate stats
  const stats = {
    total: templates.length,
    active: templates.filter((t) => t.isActive).length,
    default: templates.filter((t) => t.isDefault).length,
  };

  // Load templates
  const loadTemplates = async (page = 1, limit = 20) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
        ...(statusFilter !== "all" && { isActive: statusFilter === "active" }),
      });

      const response = await api.get(`/email-templates?${params}`);

      if (response.data.success) {
        setTemplates(response.data.data || []);
        setPagination(
          response.data.pagination || {
            page: parseInt(page),
            limit: parseInt(limit),
            total: response.data.data?.length || 0,
            pages: Math.ceil((response.data.data?.length || 0) / limit),
          }
        );
      } else {
        throw new Error(response.data.message || "Failed to load templates");
      }
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Error", {
        description: error.message || "Failed to load email templates",
      });
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadTemplates();
  }, []);

  // Filter templates when search or filters change
  useEffect(() => {
    loadTemplates(1, pagination.limit);
  }, [searchQuery, categoryFilter, statusFilter]);

  const handleSetDefault = async (templateId) => {
    try {
      if (confirm("Set this template as default for its category?")) {
        const response = await api.patch(
          `/email-templates/${templateId}/set-default`
        );

        if (response.data.success) {
          loadTemplates();
          toast.success("Default Template Set", {
            description: "Template has been set as default successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error setting default template:", error);
      toast.error("Error", {
        description: error.message || "Failed to set default template",
      });
    }
  };

  const handleToggleStatus = async (templateId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const action = newStatus ? "activate" : "deactivate";

      if (confirm(`Are you sure you want to ${action} this template?`)) {
        const response = await api.patch(
          `/email-templates/${templateId}/status`,
          {
            isActive: newStatus,
          }
        );

        if (response.data.success) {
          loadTemplates();
          toast.success(`Template ${action}d`, {
            description: `Template has been ${action}d successfully`,
          });
        }
      }
    } catch (error) {
      console.error("Error toggling template status:", error);
      toast.error("Error", {
        description: error.message || `Failed to ${action} template`,
      });
    }
  };

  const handleDuplicate = async (templateId) => {
    try {
      if (confirm("Duplicate this template?")) {
        const response = await api.post(
          `/email-templates/${templateId}/duplicate`
        );

        if (response.data.success) {
          loadTemplates();
          toast.success("Template Duplicated", {
            description: "Template has been duplicated successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error duplicating template:", error);
      toast.error("Error", {
        description: error.message || "Failed to duplicate template",
      });
    }
  };

  const handleDelete = async (templateId) => {
    try {
      if (
        confirm(
          "Are you sure you want to delete this template? This action cannot be undone."
        )
      ) {
        const response = await api.delete(`/email-templates/${templateId}`);

        if (response.data.success) {
          setTemplates((prev) => prev.filter((t) => t.publicId !== templateId));
          toast.success("Template Deleted", {
            description: "Template has been deleted successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Error", {
        description: error.message || "Failed to delete template",
      });
    }
  };

  const handleCopyTemplateId = (templateId) => {
    navigator.clipboard.writeText(templateId);
    toast.success("Copied!", {
      description: `Template ID ${templateId} copied to clipboard`,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  const hasActiveFilters =
    searchQuery || categoryFilter !== "all" || statusFilter !== "all";

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCategoryName = (category) => {
    return category
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "PASSWORD_RESET":
      case "EMAIL_VERIFICATION":
        return <FileText className="w-4 h-4" />;
      case "WELCOME_EMAIL":
        return <Users className="w-4 h-4" />;
      case "PROJECT_STATUS_UPDATE":
      case "RENDER_READY":
      case "BOQ_READY":
      case "VENDOR_LIST_SENT":
        return <CheckCircle2 className="w-4 h-4" />;
      case "PAYMENT_CONFIRMATION":
        return <FileText className="w-4 h-4" />;
      case "SUPPORT_TICKET_CREATED":
      case "SUPPORT_TICKET_UPDATED":
        return <Mail className="w-4 h-4" />;
      case "NEWSLETTER":
      case "PROMOTIONAL":
        return <Mail className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (template) => {
    if (!template.isActive) {
      return {
        label: "Inactive",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      };
    }

    if (template.isDefault) {
      return {
        label: "Default",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      };
    }

    return {
      label: "Active",
      color: "bg-green-100 text-green-800 border-green-200",
    };
  };

  if (loading && templates.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Email Templates
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage email templates for different scenarios
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Email Templates
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage email templates for different scenarios
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
          <CardContent className="p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Templates</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <Mail className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  Active Templates
                </p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {stats.active}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  Default Templates
                </p>
                <p className="text-2xl font-bold mt-1 text-amber-600">
                  {stats.default}
                </p>
              </div>
              <Star className="h-8 w-8 text-amber-600 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by template name, subject, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-border"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {formatCategoryName(category)}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}
      {templates.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No templates found
            </h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters
                ? "No templates match your current filters."
                : "No email templates found."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Template Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Variables
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {templates.map((template) => {
                    const statusBadge = getStatusBadge(template);

                    return (
                      <tr
                        key={template.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        {/* Template Details Column */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-foreground">
                              {template.name}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {template.subject}
                            </div>
                            {template.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {template.description}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Category Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(template.category)}
                            <span className="text-sm text-foreground">
                              {formatCategoryName(template.category)}
                            </span>
                          </div>
                        </td>

                        {/* Variables Column */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">
                              {template.variables?.length || 0} variables
                            </div>
                            {template.variables &&
                              template.variables.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {template.variables
                                    .slice(0, 3)
                                    .map((variable, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                      >
                                        {variable}
                                      </Badge>
                                    ))}
                                  {template.variables.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                                    >
                                      +{template.variables.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <Badge
                              variant="outline"
                              className={statusBadge.color}
                            >
                              {template.isDefault && (
                                <Star className="w-3 h-3 mr-1" />
                              )}
                              {statusBadge.label}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              v{template.version}
                            </div>
                          </div>
                        </td>

                        {/* Last Updated Column */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-foreground">
                            {formatDate(template.updatedAt)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            by {template.createdBy}
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {/* Preview Button */}
                            <Link
                              href={`/admin/email-templates/preview/${template.publicId}`}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                                title="Preview Template"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>

                            {/* Edit Button */}
                            <Link
                              href={`/admin/email-templates/edit/${template.publicId}`}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200"
                                title="Edit Template"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>

                            {/* Set as Default Button */}
                            {!template.isDefault && template.isActive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleSetDefault(template.publicId)
                                }
                                className="h-8 px-2 text-xs bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200"
                                title="Set as Default"
                              >
                                <Star className="w-3 h-3 mr-1" />
                                Set Default
                              </Button>
                            )}

                            {/* Toggle Status Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleToggleStatus(
                                  template.publicId,
                                  template.isActive
                                )
                              }
                              className={`h-8 px-2 text-xs ${
                                template.isActive
                                  ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                                  : "bg-green-50 hover:bg-green-100 text-green-600 border border-green-200"
                              }`}
                              title={
                                template.isActive ? "Deactivate" : "Activate"
                              }
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {template.isActive ? "Deactivate" : "Activate"}
                            </Button>

                            {/* Duplicate Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicate(template.publicId)}
                              className="h-8 px-2 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200"
                              title="Duplicate Template"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Duplicate
                            </Button>

                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(template.publicId)}
                              className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                              title="Delete Template"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} templates
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadTemplates(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pagination.page === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => loadTemplates(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadTemplates(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
