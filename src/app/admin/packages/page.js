// src\app\admin\packages\page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Add useSearchParams
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Package,
  PlusSquare,
  IndianRupee,
  Star,
  Zap,
  Crown,
  Download,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pagination from "@/components/ui/pagination";
import Link from "next/link";
import { toast } from "sonner";
import { packageService } from "@/services/package.service";

const getPackageIcon = (name) => {
  if (name.toLowerCase().includes('essential')) return Zap;
  if (name.toLowerCase().includes('premium')) return Star;
  if (name.toLowerCase().includes('luxury')) return Crown;
  return Package;
};

const getPackageColor = (name) => {
  if (name.toLowerCase().includes('essential')) return "from-blue-500 to-cyan-500";
  if (name.toLowerCase().includes('premium')) return "from-purple-500 to-pink-500";
  if (name.toLowerCase().includes('luxury')) return "from-amber-500 to-orange-500";
  return "from-blue-500 to-cyan-500";
};

export default function AdminPackagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Get active tab from URL or default to "packages"
  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(urlTab || "packages");

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', activeTab);
    router.replace(`/admin/packages?${params.toString()}`, { scroll: false });
  }, [activeTab, router, searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [packagesResponse, addonsResponse] = await Promise.all([
        packageService.getAllPackages(),
        packageService.getAllAddons()
      ]);

      if (packagesResponse.success) {
        setPackages(packagesResponse.data.packages || []);
      } else {
        throw new Error(packagesResponse.message || "Failed to load packages");
      }

      if (addonsResponse.success) {
        setAddons(addonsResponse.data.addons || []);
      } else {
        throw new Error(addonsResponse.message || "Failed to load addons");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error(err.message || "Failed to load data");
      setPackages([]);
      setAddons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on search and filters
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" ||
                         (statusFilter === "active" && pkg.isActive) ||
                         (statusFilter === "inactive" && !pkg.isActive);

    return matchesSearch && matchesStatus;
  });

  const filteredAddons = addons.filter((addon) => {
    const matchesSearch = addon.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         addon.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" ||
                         (statusFilter === "active" && addon.isActive) ||
                         (statusFilter === "inactive" && !addon.isActive);

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const currentData = activeTab === "packages" ? filteredPackages : filteredAddons;
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = currentData.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, activeTab]);

  const handleToggleStatus = async (id, isActive, type) => {
    try {
      let response;
      
      if (type === "package") {
        response = await packageService.updatePackageStatus(id, !isActive);
      } else {
        response = await packageService.updateAddonStatus(id, !isActive);
      }
      
      if (response.success) {
        toast.success(`${type === "package" ? "Package" : "Addon"} ${!isActive ? "activated" : "deactivated"} successfully`);
        fetchData(); // Refresh data
      } else {
        throw new Error(response.message || `Failed to update ${type}`);
      }
    } catch (err) {
      toast.error(err.message || `Failed to update ${type}`);
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      let response;
      
      if (type === "package") {
        response = await packageService.deletePackage(id);
      } else {
        response = await packageService.deleteAddon(id);
      }
      
      if (response.success) {
        toast.success(`${type === "package" ? "Package" : "Addon"} deleted successfully`);
        fetchData(); // Refresh data
      } else {
        throw new Error(response.message || `Failed to delete ${type}`);
      }
    } catch (err) {
      toast.error(err.message || `Failed to delete ${type}`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get the correct "Add New" button link based on active tab
  const getAddNewLink = () => {
    return activeTab === "packages" 
      ? "/admin/packages/create?type=package"
      : "/admin/packages/create?type=addon";
  };

  // Get the correct "Add New" button text based on active tab
  const getAddNewText = () => {
    return activeTab === "packages" ? "Add Package" : "Add Addon";
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Packages & Addons</h1>
            <p className="text-muted-foreground mt-1">Manage pricing packages and addons</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-foreground">Packages & Addons</h1>
          <p className="text-muted-foreground mt-1">Manage pricing packages and addons</p>
        </div>
        <div className="flex gap-3">
          <Link href={getAddNewLink()}>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              {getAddNewText()}
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
          <CardContent className="p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Packages</p>
                <p className="text-2xl font-bold mt-1">{packages.length}</p>
              </div>
              <Package className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Packages</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {packages.filter(p => p.isActive).length}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Addons</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">
                  {addons.length}
                </p>
              </div>
              <PlusSquare className="h-8 w-8 text-purple-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Popular Packages</p>
                <p className="text-2xl font-bold mt-1 text-amber-600">
                  {packages.filter(p => p.isPopular).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-amber-600 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="border-b border-border">
            <div className="flex">
              <button
                onClick={() => setActiveTab("packages")}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "packages"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Packages ({packages.length})
              </button>
              <button
                onClick={() => setActiveTab("addons")}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "addons"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Addons ({addons.length})
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Packages Table */}
      {activeTab === "packages" && (
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Pricing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Features
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {paginatedData.map((pkg) => {
                    const Icon = getPackageIcon(pkg.name);
                    const colorClass = getPackageColor(pkg.name);
                    const savings = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;

                    return (
                      <tr key={pkg.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">
                                  {pkg.name}
                                </p>
                                {pkg.isPopular && (
                                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {pkg.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-foreground">
                              {formatCurrency(pkg.price)}
                            </div>
                            {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                              <>
                                <div className="text-slate-500 line-through text-xs">
                                  {formatCurrency(pkg.originalPrice)}
                                </div>
                                <div className="text-green-600 font-medium text-xs">
                                  Save {formatCurrency(savings)}
                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-muted-foreground">
                            {pkg.features?.length || 0} features
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Order: {pkg.sortOrder}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={pkg.isActive 
                              ? "bg-green-100 text-green-800 border-green-200" 
                              : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {pkg.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(pkg.id, pkg.isActive, "package")}
                              className="h-8 w-8 p-0"
                              title={pkg.isActive ? "Deactivate" : "Activate"}
                            >
                              {pkg.isActive ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-red-600" />
                              )}
                            </Button>

                            <Link href={`/admin/packages/${pkg.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200"
                                title="Edit Package"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(pkg.id, "package")}
                              className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                              title="Delete Package"
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

            {/* Pagination */}
            {filteredPackages.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Addons Table */}
      {activeTab === "addons" && (
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Addon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {paginatedData.map((addon) => (
                    <tr key={addon.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <PlusSquare className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {addon.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Order: {addon.sortOrder}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-foreground">
                          {formatCurrency(addon.price)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                          {addon.description || "No description"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={addon.isActive 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {addon.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(addon.id, addon.isActive, "addon")}
                            className="h-8 w-8 p-0"
                            title={addon.isActive ? "Deactivate" : "Activate"}
                          >
                            {addon.isActive ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-red-600" />
                            )}
                          </Button>

                          <Link href={`/admin/packages/addons/${addon.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200"
                              title="Edit Addon"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(addon.id, "addon")}
                            className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                            title="Delete Addon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredAddons.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {currentData.length === 0 && (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No {activeTab} found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? `No ${activeTab} match your current filters. Try adjusting your search criteria.`
                : `No ${activeTab} have been created yet.`}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
              <Link href={getAddNewLink()}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First {activeTab === "packages" ? "Package" : "Addon"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}