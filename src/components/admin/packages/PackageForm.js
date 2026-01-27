// src\components\admin\packages\PackageForm.js
"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

const defaultPackageData = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  currency: "INR",
  features: [],
  isPopular: false,
  isActive: true,
  sortOrder: 0,
};

const defaultAddonData = {
  name: "",
  description: "",
  price: "",
  currency: "INR",
  isActive: true,
  sortOrder: 0,
};

export default function PackageForm({
  type = "package", // "package" or "addon"
  data = null,
  onSubmit,
  onCancel,
  loading = false,
  submitButtonText = "Create",
}) {
  const [formData, setFormData] = useState(
    type === "package" ? defaultPackageData : defaultAddonData
  );
  const [newFeature, setNewFeature] = useState("");

  // useEffect(() => {
  //   if (data) {
  //     setFormData({
  //       ...(type === "package" ? defaultPackageData : defaultAddonData),
  //       ...data,
  //       price: data.price?.toString() || "",
  //       originalPrice: data.originalPrice?.toString() || "",
  //     });
  //   }
  // }, [data, type]);

  useEffect(() => {
  if (data) {
    setFormData({
      ...(type === "package" ? defaultPackageData : defaultAddonData),
      ...data,
      price: data.price?.toString() || "",
      originalPrice: data.originalPrice?.toString() || "",
      sortOrder: data.sortOrder?.toString() || "0",
    });
  }
}, [data, type]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.price) {
      alert("Please fill in all required fields");
      return;
    }

    // Convert price fields to numbers
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      sortOrder: parseInt(formData.sortOrder) || 0,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>
                {type === "package" ? "Package" : "Addon"} Information
              </CardTitle>
              <CardDescription>
                Enter the {type === "package" ? "package" : "addon"} details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={`Enter ${type} name`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (INR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder={`Enter ${type} description`}
                  rows={3}
                />
              </div>

              {type === "package" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (INR)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                        placeholder="0.00"
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty if no discount
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sortOrder">Sort Order</Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        min="0"
                        value={formData.sortOrder}
                        onChange={(e) => handleInputChange("sortOrder", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="space-y-3">
                    <Label>Features</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add a feature"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddFeature}
                        disabled={!newFeature.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Features List */}
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {type === "addon" && (
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    min="0"
                    value={formData.sortOrder}
                    onChange={(e) => handleInputChange("sortOrder", e.target.value)}
                    placeholder="0"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active Status
                </Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                />
              </div>

              {type === "package" && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="isPopular" className="cursor-pointer">
                    Popular Package
                  </Label>
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => handleInputChange("isPopular", checked)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>{submitButtonText}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {loading
                  ? data
                    ? "Updating..."
                    : "Creating..."
                  : submitButtonText}
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