// src/app/admin/vendors/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Globe,
  Shield,
  Download,
  Upload,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { toast } from "sonner";
import { vendorService } from '@/services/vendor.service';
import VendorImport from '@/components/admin/vendors/VendorImport';

const getProductColor = (product) => {
  const colors = {
    'Vitrified Tiles': "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300",
    'Quartz Countertops': "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300",
    'Modular Kitchen': "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300",
    'Sanitaryware': "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300",
    'Electrical': "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300",
  };
  return colors[product] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300";
};

const getBrandColor = (brand) => {
  const colors = {
    'Somany': "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300",
    'Kajaria': "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-300",
    'Nitco': "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900 dark:text-teal-300",
    'AGL Quartz': "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-300",
    'Kalina Stone': "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900 dark:text-lime-300",
  };
  return colors[brand] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300";
};

export default function AdminVendorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "all",
    state: "all",
    products: "all",
    brands: "all",
    isVerified: "all",
    isActive: "all"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Extract filter options from vendors data
  const cities = [...new Set(vendors.map(v => v.city).filter(Boolean))].sort();
  const productsList = [...new Set(vendors.flatMap(v => 
    v.products ? v.products.split(',').map(p => p.trim()) : []
  ).filter(Boolean))].sort();
  const brandsList = [...new Set(vendors.flatMap(v => 
    v.brands ? v.brands.split(',').map(b => b.trim()) : []
  ).filter(Boolean))].sort();

  useEffect(() => {
    fetchVendors();
    fetchStats();
  }, [pagination.page, filters, searchTerm]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      // Build filter params correctly - convert "all" to empty string for API
      const filterParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.city !== "all" && { city: filters.city }),
        ...(filters.state !== "all" && { state: filters.state }),
        ...(filters.products !== "all" && { products: filters.products }),
        ...(filters.brands !== "all" && { brands: filters.brands }),
        ...(filters.isVerified !== "all" && { 
          isVerified: filters.isVerified === "verified" 
        }),
        ...(filters.isActive !== "all" && { 
          isActive: filters.isActive === "active" 
        })
      };

      const result = await vendorService.getAllVendors(filterParams);
      
      if (result.success) {
        setVendors(result.data.vendors || result.data || []);
        setPagination(prev => ({
          ...prev,
          total: result.data.totalCount || result.data.length || 0,
          pages: result.data.totalPages || Math.ceil((result.data.totalCount || result.data.length || 0) / pagination.limit)
        }));
      } else {
        toast.error(result.message || "Failed to fetch vendors");
        setVendors([]);
      }
    } catch (err) {
      console.error("❌ Error fetching vendors:", err);
      toast.error("Failed to load vendors");
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await vendorService.getVendorStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleExportVendors = async () => {
    setExportLoading(true);
    try {
      const filterParams = {
        ...(searchTerm && { search: searchTerm }),
        ...(filters.city !== "all" && { city: filters.city }),
        ...(filters.products !== "all" && { products: filters.products }),
        ...(filters.brands !== "all" && { brands: filters.brands }),
        ...(filters.isVerified !== "all" && { isVerified: filters.isVerified === "verified" }),
        ...(filters.isActive !== "all" && { isActive: filters.isActive === "active" })
      };

      const result = await vendorService.exportVendors(filterParams);
      
      if (result.success) {
        toast.success('Export Completed', {
          description: 'Vendors exported successfully to Excel'
        });
      } else {
        toast.error('Export Failed', {
          description: result.message
        });
      }
    } catch (error) {
      toast.error('Export Failed', {
        description: error.message || 'Failed to export vendors'
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleImportComplete = (results) => {
    fetchVendors();
    fetchStats();
    toast.success('Import completed', {
      description: `Successfully processed ${results.total} vendors`
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      city: "all",
      state: "all",
      products: "all",
      brands: "all",
      isVerified: "all",
      isActive: "all"
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const hasActiveFilters = 
    searchTerm || 
    filters.city !== "all" || 
    filters.state !== "all" || 
    filters.products !== "all" || 
    filters.brands !== "all" || 
    filters.isVerified !== "all" || 
    filters.isActive !== "all";

  const handleSendEmail = (vendorEmail) => {
    window.open(`mailto:${vendorEmail}`, "_blank");
  };

  const handleVerifyVendor = async (vendorId, currentStatus) => {
    const action = currentStatus ? "unverify" : "verify";
    if (!confirm(`Are you sure you want to ${action} this vendor?`)) return;

    try {
      const res = await api.patch(`/vendors/${vendorId}/verify`);
      if (res.data.success) {
        toast.success(`Vendor ${action} successfully`);
        fetchVendors();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update verification status");
    }
  };

  const handleActiveVendor = async (vendorId, currentStatus) => {
    const action = currentStatus ? "deactivate" : "activate";
    if (!confirm(`Are you sure you want to ${action} this vendor?`)) return;

    try {
      const res = await api.patch(`/vendors/${vendorId}/status`, {
        isActive: !currentStatus,
      });

      if (res.data.success) {
        toast.success(`Vendor ${action}d successfully`);
        fetchVendors();
      } else {
        toast.error("Failed to update vendor status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating vendor status");
    }
  };

  if (loading && vendors.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Vendors
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage vendor network and partnerships
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleExportVendors}
            disabled={exportLoading}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            {exportLoading ? (
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {exportLoading ? 'Exporting...' : 'Export'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowImportModal(true)}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          
          <Link href="/admin/vendors/assignment" passHref>
            <Button variant="outline">
              Assign Vendors
            </Button>
          </Link>
          
          <Link href="/admin/vendors/create" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.total || vendors.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Vendors</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.verified || vendors.filter(v => v.isVerified).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.pending || vendors.filter(v => !v.isVerified).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.active || vendors.filter(v => v.isActive).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600 fill-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-1 gap-4 items-center w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial sm:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search vendors by name, business, email, city, products, brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 bg-background border-border"
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-border"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 flex h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </Button>

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
              
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted rounded-lg border border-border">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City
                  </label>
                  <Select
                    value={filters.city}
                    onValueChange={(value) => handleFilterChange('city', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Products
                  </label>
                  <Select
                    value={filters.products}
                    onValueChange={(value) => handleFilterChange('products', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      {productsList.map(product => (
                        <SelectItem key={product} value={product}>{product}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Brands
                  </label>
                  <Select
                    value={filters.brands}
                    onValueChange={(value) => handleFilterChange('brands', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brandsList.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Status
                    </label>
                    <Select
                      value={filters.isActive}
                      onValueChange={(value) => handleFilterChange('isActive', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Verification
                    </label>
                    <Select
                      value={filters.isVerified}
                      onValueChange={(value) => handleFilterChange('isVerified', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Count and Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {vendors.length} of {pagination.total} vendors
          {hasActiveFilters && " (filtered)"}
        </p>
        
        {pagination.pages > 1 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.pages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Vendors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <Card
            key={vendor.id}
            className="hover:shadow-lg transition-all duration-300 group border-border"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 ring-2 ring-background group-hover:ring-blue-200 transition-all">
                    <AvatarImage src={vendor.logoUrl} alt={vendor.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                      {vendor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate group-hover:text-blue-600 transition-colors">
                      {vendor.businessName || vendor.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground truncate">
                      {vendor.name}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={`/admin/vendors/edit/${vendor.id}`} passHref>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Vendor
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleSendEmail(vendor.email)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={
                        vendor.isActive
                          ? "text-red-600 cursor-pointer"
                          : "text-green-600 cursor-pointer"
                      }
                      onClick={() =>
                        handleActiveVendor(vendor.id, vendor.isActive)
                      }
                    >
                      {vendor.isActive ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Deactivate Vendor
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate Vendor
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center space-x-2 mt-3">
                <div className="flex items-center">
                  {vendor.isVerified ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
                <Badge
                  className={
                    vendor.isActive
                      ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300"
                  }
                >
                  {vendor.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Products and Brands */}
              <div className="space-y-2">
                {vendor.products && (
                  <div className="flex flex-wrap gap-1">
                    {vendor.products.split(',').map((product, index) => (
                      <Badge
                        key={index}
                        className={`${getProductColor(product.trim())} text-xs`}
                      >
                        {product.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {vendor.brands && (
                  <div className="flex flex-wrap gap-1">
                    {vendor.brands.split(',').map((brand, index) => (
                      <Badge
                        key={index}
                        className={`${getBrandColor(brand.trim())} text-xs`}
                      >
                        {brand.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2 shrink-0" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">
                    {vendor.city}
                    {vendor.state && `, ${vendor.state}`}
                  </span>
                </div>
                {vendor.website && (
                  <div className="flex items-center text-muted-foreground">
                    <Globe className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">{vendor.website}</span>
                  </div>
                )}
              </div>

              {/* Products & Brands Summary */}
              {(vendor.products || vendor.brands) && (
                <div className="p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Deals in:</strong>{" "}
                    {vendor.products || 'Various products'}
                    {vendor.brands && ` | Brands: ${vendor.brands}`}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Link href={`/admin/vendors/edit/${vendor.id}`} passHref>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendEmail(vendor.email)}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {vendors.length === 0 && !loading && (
        <Card className="border-border">
          <CardContent className="py-16 text-center">
            <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No vendors found
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {hasActiveFilters
                ? "No vendors match your current filters. Try adjusting your search criteria."
                : "No vendors have been added yet. Get started by adding your first vendor."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {hasActiveFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Link href="/admin/vendors/create" passHref>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Vendor
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Import Modal */}
      <VendorImport
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}