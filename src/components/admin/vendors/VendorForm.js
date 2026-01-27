// src/components/admin/vendors/VendorForm.js
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  X,
  Package,
  Tag,
} from "lucide-react";

const categories = [
  "CARPENTRY",
  "PLUMBING",
  "ELECTRICAL",
  "PAINTING",
  "FLOORING",
  "FURNITURE",
];

const defaultFormData = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  website: "",
  gstin: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  specialization: "",
  description: "",
  products: "",
  brands: "",
  maxProjects: 5,
  isVerified: true,
  isActive: true,
};

export default function VendorForm({
  vendor = null,
  onSubmit,
  onCancel,
  loading = false,
  submitButtonText = "Create Vendor",
}) {
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Initialize form with vendor data if editing
  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        businessName: vendor.businessName || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        website: vendor.website || "",
        gstin: vendor.gstin || "",
        address: vendor.address || "",
        city: vendor.city || "",
        state: vendor.state || "",
        pincode: vendor.pincode || "",
        specialization: vendor.specialization || "",
        description: vendor.description || "",
        products: vendor.products || "",
        brands: vendor.brands || "",
        maxProjects: vendor.maxProjects || 5,
        isVerified: vendor.isVerified || false,
        isActive: vendor.isActive !== undefined ? vendor.isActive : true,
      });
      setSelectedCategories(vendor.categories || []);
    }
  }, [vendor]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    const submitData = {
      ...formData,
      categories: selectedCategories,
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the vendor's basic details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Vendor Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter vendor name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium">
                    Business Name
                  </Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                    placeholder="Enter registered business name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="vendor@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="www.example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstin" className="text-sm font-medium">
                    GSTIN
                  </Label>
                  <Input
                    id="gstin"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange("gstin", e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Street Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">
                    State
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="State"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-sm font-medium">
                    PIN Code
                  </Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) =>
                      handleInputChange("pincode", e.target.value)
                    }
                    placeholder="PIN Code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
              <CardDescription>
                Define the vendor's services and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Service Categories
                </Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={
                        selectedCategories.includes(category)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      {category.replace("_", " ")}
                      {selectedCategories.includes(category) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-sm font-medium">
                  Specialization
                </Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    handleInputChange("specialization", e.target.value)
                  }
                  placeholder="e.g., Luxury residential interiors, Office spaces"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the vendor's expertise and experience..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Products & Brands */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Products & Brands
              </CardTitle>
              <CardDescription>
                Information about products and brands the vendor deals with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="products" className="text-sm font-medium">
                  Products
                </Label>
                <Input
                  id="products"
                  value={formData.products}
                  onChange={(e) =>
                    handleInputChange("products", e.target.value)
                  }
                  placeholder="e.g., Tiles, Paints, Furniture, Electrical fittings"
                />
                <p className="text-xs text-muted-foreground">
                  List the main products or materials the vendor deals with
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brands" className="text-sm font-medium">
                  Brands
                </Label>
                <Input
                  id="brands"
                  value={formData.brands}
                  onChange={(e) => handleInputChange("brands", e.target.value)}
                  placeholder="e.g., Asian Paints, Kajaria, Havells, Godrej"
                />
                <p className="text-xs text-muted-foreground">
                  List the brands the vendor is associated with or distributes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVerified"
                  checked={formData.isVerified}
                  onChange={(e) =>
                    handleInputChange("isVerified", e.target.checked)
                  }
                  className="rounded border-border"
                />
                <Label htmlFor="isVerified" className="text-sm font-medium">
                  Verified Vendor
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                  className="rounded border-border"
                />
                <Label htmlFor="isActive" className="text-sm font-medium">
                  Active Status
                </Label>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="maxProjects" className="text-sm font-medium">
                  Maximum Projects
                </Label>
                <Input
                  id="maxProjects"
                  type="number"
                  value={formData.maxProjects}
                  onChange={(e) =>
                    handleInputChange("maxProjects", parseInt(e.target.value) || 5)
                  }
                  min="1"
                  max="100"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of projects this vendor can handle simultaneously
                </p>
              </div> */}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">{submitButtonText}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {vendor ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}