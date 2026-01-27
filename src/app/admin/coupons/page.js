// src/app/admin/coupons/page.js
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Ticket,
  Users,
  Percent,
  TrendingUp,
  Eye,
  Calendar,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  Filter,
  IndianRupee,
  Info,
  ArrowRight,
  Clock,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Pagination from "@/components/ui/pagination";
import { toast } from "sonner";
import { couponService } from "@/services/coupon.service";
import { packageService } from "@/services/package.service";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    totalRedemptions: 0,
    totalDiscountAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form State
  const initialFormState = {
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "",
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isActive: true,
    isSingleUse: false,
    applicablePlans: [],
    applicableAddons: [],
  };
  const [formData, setFormData] = useState(initialFormState);

  // Reference data for multi-select (simplified for now)
  const [availablePlans, setAvailablePlans] = useState([]);
  const [availableAddons, setAvailableAddons] = useState([]);

  useEffect(() => {
    fetchData();
    fetchMetadata();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [couponsRes, statsRes] = await Promise.all([
        couponService.getCoupons(),
        couponService.getCouponStats(),
      ]);

      if (couponsRes.success) {
        setCoupons(couponsRes.data.coupons || []);
      }
      if (statsRes.success) {
        setStats(statsRes.data.stats || stats);
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [plansRes, addonsRes] = await Promise.all([
        packageService.getAllPackages(),
        packageService.getAllAddons(),
      ]);
      if (plansRes.success) setAvailablePlans(plansRes.data.packages || []);
      if (addonsRes.success) setAvailableAddons(addonsRes.data.addons || []);
    } catch (err) {
      console.error("Error fetching metadata:", err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await couponService.updateCouponStatus(id, !currentStatus);
      if (response.success) {
        toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon? This action cannot be undone if there are no redemptions.")) return;
    try {
      const response = await couponService.deleteCoupon(id);
      if (response.success) {
        toast.success("Coupon deleted successfully");
        fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon) => {
    setIsEditing(true);
    setFormData({
      ...coupon,
      validFrom: new Date(coupon.validFrom).toISOString().split("T")[0],
      validUntil: new Date(coupon.validUntil).toISOString().split("T")[0],
      discountValue: coupon.discountValue.toString(),
      minOrderAmount: coupon.minOrderAmount?.toString() || "",
      maxDiscount: coupon.maxDiscount?.toString() || "",
      usageLimit: coupon.usageLimit?.toString() || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenViewModal = async (couponId) => {
    setViewLoading(true);
    setIsViewModalOpen(true);
    try {
      const response = await couponService.getCouponById(couponId);
      if (response.success) {
        setSelectedCoupon(response.data.coupon);
      } else {
        toast.error("Failed to load coupon details");
        setIsViewModalOpen(false);
      }
    } catch (err) {
      toast.error("Error loading coupon details");
      setIsViewModalOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    // Sanitize data for API
    const sanitizedData = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
    };

    try {
      let response;
      if (isEditing) {
        response = await couponService.updateCoupon(formData.publicId, sanitizedData);
      } else {
        response = await couponService.createCoupon(sanitizedData);
      }

      if (response.success) {
        toast.success(`Coupon ${isEditing ? "updated" : "created"} successfully`);
        setIsModalOpen(false);
        fetchData();
      } else {
        toast.error(response.message || "Validation failed");
      }
    } catch (err) {
      toast.error("Failed to save coupon");
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && coupon.isActive) ||
      (statusFilter === "inactive" && !coupon.isActive);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coupons & Promo Codes</h1>
          <p className="text-muted-foreground mt-1">Manage discounts and promotional campaigns</p>
        </div>
        <Button onClick={handleOpenCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-0 shadow-lg">
          <CardContent className="p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Coupons</p>
                <p className="text-3xl font-bold mt-1">{stats.totalCoupons}</p>
              </div>
              <Ticket className="h-10 w-10 opacity-30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Active Now</p>
                <p className="text-3xl font-bold mt-1 text-green-600">{stats.activeCoupons}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Redemptions</p>
                <p className="text-3xl font-bold mt-1 text-indigo-600">{stats.totalRedemptions}</p>
              </div>
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Savings</p>
                <p className="text-2xl font-bold mt-1 text-amber-600">
                  {formatCurrency(stats.totalDiscountAmount)}
                </p>
              </div>
              <div className="bg-amber-100 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by code or description..."
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

      {/* Coupon Table */}
      <Card className="border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Coupon Code</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Validity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedCoupons.length > 0 ? (
                  paginatedCoupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-md">
                            <Ticket className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{coupon.code}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {coupon.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 font-medium text-xs">
                          {coupon.discountType === "PERCENTAGE" 
                            ? `${coupon.discountValue}% OFF` 
                            : `₹${coupon.discountValue} OFF`}
                        </Badge>
                        {coupon.maxDiscount && (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Up to ₹{coupon.maxDiscount}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {coupon.usedCount} / {coupon.usageLimit || "∞"}
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-muted rounded-full mt-1.5 ">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ 
                              width: coupon.usageLimit 
                                ? `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` 
                                : "0%" 
                            }} 
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(coupon.validFrom).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(coupon.validUntil).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          className={coupon.isActive 
                            ? "bg-green-100 text-green-700 border-green-200" 
                            : "bg-red-100 text-red-700 border-red-200"}
                          variant="outline"
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                           <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleToggleStatus(coupon.publicId, coupon.isActive)}
                            title={coupon.isActive ? "Deactivate" : "Activate"}
                          >
                            {coupon.isActive ? (
                              <ToggleRight className="h-5 w-5 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                            onClick={() => handleOpenViewModal(coupon.publicId)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200"
                            onClick={() => handleOpenEditModal(coupon)}
                            title="Edit Coupon"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                            onClick={() => handleDelete(coupon.publicId)}
                            disabled={coupon.usedCount > 0}
                            title={coupon.usedCount > 0 ? "Cannot delete used coupon" : "Delete"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                      No coupons found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredCoupons.length > itemsPerPage && (
            <div className="p-4 border-t border-border">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredCoupons.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              {isEditing ? <Edit className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
              {isEditing ? "Edit Coupon" : "Create New Coupon"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Update existing coupon details and constraints." : "Configure a new discount coupon for your customers."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-semibold">Coupon Code</Label>
                  <Input
                    id="code"
                    placeholder="E.g. SUMMER50"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    className="uppercase font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe this offer..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              {/* Discount Config */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Discount Type</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="discountType"
                        checked={formData.discountType === "PERCENTAGE"}
                        onChange={() => setFormData({ ...formData, discountType: "PERCENTAGE" })}
                      />
                      <span className="text-sm">Percentage (%)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="discountType"
                        checked={formData.discountType === "FIXED_AMOUNT"}
                        onChange={() => setFormData({ ...formData, discountType: "FIXED_AMOUNT" })}
                      />
                      <span className="text-sm">Fixed Amount (₹)</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue" className="text-sm font-semibold">
                    {formData.discountType === "PERCENTAGE" ? "Percentage Value" : "Fixed Amount"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="discountValue"
                      type="number"
                      placeholder="0"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {formData.discountType === "PERCENTAGE" ? <Percent className="h-4 w-4" /> : <IndianRupee className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
                {formData.discountType === "PERCENTAGE" && (
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount" className="text-sm font-semibold">Max Discount (₹)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      placeholder="No limit"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-border">
              {/* Limits */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrderAmount" className="text-sm font-semibold">Min Order Amount (₹)</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    placeholder="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usageLimit" className="text-sm font-semibold">Total Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    placeholder="Unlimited"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="validFrom" className="text-sm font-semibold">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil" className="text-sm font-semibold">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-8 p-4 bg-muted/20 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive" className="cursor-pointer font-medium">Is Active</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="isSingleUse"
                  checked={formData.isSingleUse}
                  onCheckedChange={(checked) => setFormData({ ...formData, isSingleUse: checked })}
                />
                <Label htmlFor="isSingleUse" className="cursor-pointer font-medium">Single Use per User</Label>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitLoading}>
                {submitLoading ? "Saving..." : isEditing ? "Update Coupon" : "Create Coupon"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {viewLoading ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-muted-foreground">Fetching details...</p>
            </div>
          ) : selectedCoupon && (
            <div className="flex flex-col">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="bg-white/20 text-white border-0 mb-3 backdrop-blur-sm">
                      {selectedCoupon.isActive ? "ACTIVE COUPON" : "INACTIVE COUPON"}
                    </Badge>
                    <h2 className="text-4xl font-black tracking-tight">{selectedCoupon.code}</h2>
                    <p className="mt-2 text-blue-100 opacity-90 max-w-md">{selectedCoupon.description}</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                    <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-1">Total Saved</p>
                    <p className="text-2xl font-black">{formatCurrency(selectedCoupon.couponRedemptions?.reduce((acc, curr) => acc + curr.discountAmount, 0) || 0)}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                {/* Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                       <Percent className="w-4 h-4 text-blue-600" />
                       <span className="text-sm font-bold text-slate-500 uppercase">Benefit</span>
                    </div>
                    <p className="text-xl font-bold">
                      {selectedCoupon.discountType === "PERCENTAGE" 
                        ? `${selectedCoupon.discountValue}% Off` 
                        : `₹${selectedCoupon.discountValue} Off`}
                    </p>
                    {selectedCoupon.maxDiscount && <p className="text-xs text-muted-foreground mt-1">Up to ₹{selectedCoupon.maxDiscount}</p>}
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                       <Users className="w-4 h-4 text-indigo-600" />
                       <span className="text-sm font-bold text-slate-500 uppercase">Usage</span>
                    </div>
                    <p className="text-xl font-bold">{selectedCoupon.usedCount} <span className="text-sm text-slate-400 font-normal">/ {selectedCoupon.usageLimit || "∞"}</span></p>
                    <p className="text-xs text-muted-foreground mt-1">{selectedCoupon.isSingleUse ? "Single use per user" : "Multiple uses allowed"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                       <Clock className="w-4 h-4 text-amber-600" />
                       <span className="text-sm font-bold text-slate-500 uppercase">Expires</span>
                    </div>
                    <p className="text-xl font-bold">{new Date(selectedCoupon.validUntil).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Started on {new Date(selectedCoupon.validFrom).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Constraints */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Rule Constraints</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-100 p-2 rounded-lg"><IndianRupee className="w-4 h-4" /></div>
                      <div>
                        <p className="text-sm font-semibold">Min Order Amount</p>
                        <p className="text-sm text-muted-foreground">{selectedCoupon.minOrderAmount ? `₹${selectedCoupon.minOrderAmount}` : "No minimum"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-100 p-2 rounded-lg"><Settings className="w-4 h-4" /></div>
                      <div>
                        <p className="text-sm font-semibold">Config</p>
                        <p className="text-sm text-muted-foreground">{selectedCoupon.isSingleUse ? "Individual usage restricted" : "Broad promotional use"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Redemption History (If any) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2 flex justify-between">
                    Recent Redemptions
                    <span className="font-normal normal-case text-xs italic">Latest 5 records</span>
                  </h3>
                  <div className="bg-slate-50 rounded-xl overflow-hidden border">
                    {selectedCoupon.couponRedemptions && selectedCoupon.couponRedemptions.length > 0 ? (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-100/50">
                            <th className="px-4 py-3 text-left">User</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Discount</th>
                            <th className="px-4 py-3 text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedCoupon.couponRedemptions.slice(0, 5).map((redemption, idx) => (
                            <tr key={idx} className="hover:bg-slate-100/30 transition-colors">
                              <td className="px-4 py-3">
                                <div className="font-medium">{redemption.user.name}</div>
                                <div className="text-[10px] text-muted-foreground">{redemption.user.email}</div>
                              </td>
                              <td className="px-4 py-3">₹{redemption.orderAmount}</td>
                              <td className="px-4 py-3 text-green-600 font-bold">-₹{redemption.discountAmount}</td>
                              <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                                {new Date(redemption.redeemedAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                        <Info className="w-8 h-8 opacity-20" />
                        <p>No redemptions yet for this coupon.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
                 <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close View</Button>
                 <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setIsViewModalOpen(false); handleOpenEditModal(selectedCoupon); }}>
                   Edit This Coupon
                 </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}