// src\app\admin\projects\[id]\edit\page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Building,
  User,
  MapPin,
  Ruler,
  IndianRupee,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image,
} from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";

const budgetRanges = [
  { value: "STANDARD", label: "Standard (₹5-15 Lakhs)" },
  { value: "PREMIUM", label: "Premium (₹15-30 Lakhs)" },
  { value: "LUXURY", label: "Luxury (₹30 Lakhs+)" },
];

const timelines = [
  { value: "STANDARD", label: "Standard (1-2 months)" },
  { value: "FLEXIBLE", label: "Flexible (2+ months)" },
];

const packages = [
  { value: "essential", label: "Essential" },
  { value: "premium", label: "Premium" },
  { value: "luxury", label: "Luxury" },
];

const enhancements = [
  { value: "fast-track", label: "Fast Track" },
  { value: "video-consultation", label: "Video Consultation" },
  { value: "extra-renders", label: "Extra Renders" },
  { value: "vastu-check", label: "Vastu Check" },
  { value: "budget-planning", label: "Budget Planning" },
];

const boqStatuses = [
  {
    value: "DRAFT",
    label: "Draft",
    color: "bg-yellow-300 text-yellow-800",
  },
  {
    value: "PENDING",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "GENERATED",
    label: "Generated",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "SENT",
    label: "Sent to User",
    color: "bg-green-100 text-green-800",
  },
];

const rendersStatuses = [
  {
    value: "PENDING",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "UPLOADED", label: "Uploaded", color: "bg-blue-100 text-blue-800" },
  {
    value: "COMPLETED",
    label: "Sent to User",
    color: "bg-green-100 text-green-800",
  },
];

const projectStatuses = [
  { value: "DRAFT", label: "Draft", color: "bg-gray-100 text-gray-800" },
  {
    value: "UPLOADED",
    label: "Files Uploaded",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "QUESTIONNAIRE_COMPLETED",
    label: "Style Selected",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "BOQ_GENERATED",
    label: "BOQ Ready",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    color: "bg-emerald-100 text-emerald-800",
  },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const projectTypes = [
  { value: "TWO_BHK", label: "2 BHK" },

  { value: "THREE_BHK", label: "3 BHK" },
  { value: "FOUR_BHK", label: "4 BHK" },
  { value: "CUSTOM", label: "CUSTOM" },
];

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectType: "",
    areaSqFt: "",
    address: "",
    city: "",
    state: "",
    budgetRange: "",
    timeline: "",
    selectedPlan: "",
    status: "",
    boqStatus: "",
    rendersStatus: "",
    enhancements: [],
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadProject(projectId);
  }, [projectId]);

  const loadProject = async (projectId) => {
    try {
      setLoading(true);
      setFormErrors({});

      const response = await api.get(`/admin/projects/${projectId}`);

      if (response.data.success) {
        const projectData = response.data.data.project;
        setProject(projectData);

        // Transform the data to match form structure
        setFormData({
          title: projectData.title || "",
          description: projectData.description || "",
          projectType: projectData.projectType || "",
          areaSqFt: projectData.areaSqFt?.toString() || "",
          address: projectData.address || "",
          city: projectData.city || "",
          state: projectData.state || "",
          budgetRange: projectData.budgetRange || "",
          timeline: projectData.timeline || "",
          selectedPlan: projectData.selectedPlan || "",
          status: projectData.status || "",
          boqStatus: projectData.boqStatus || "",
          rendersStatus: projectData.rendersStatus || "",
          enhancements: projectData.enhancements || [],
        });
      } else {
        throw new Error(response.data.message || "Failed to load project");
      }
    } catch (error) {
      console.error("Failed to load project:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load project";
      toast.error("Load Failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleEnhancementToggle = (enhancement) => {
    setFormData((prev) => ({
      ...prev,
      enhancements: prev.enhancements.includes(enhancement)
        ? prev.enhancements.filter((e) => e !== enhancement)
        : [...prev.enhancements, enhancement],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setFormErrors({});

    try {
      // Prepare data for API
      const updateData = {
        ...formData,
        areaSqFt: formData.areaSqFt ? Number(formData.areaSqFt) : null,
        enhancements: formData.enhancements,
      };

      // Remove empty fields
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === "" || updateData[key] === null) {
          updateData[key] = undefined;
        }
      });

      const response = await api.put(
        `/admin/projects/${projectId}`,
        updateData
      );

      if (response.data.success) {
        toast.success("Project Updated", {
          description: "Project details have been successfully updated.",
        });
        router.push("/admin/projects");
      } else {
        // Handle API validation errors
        if (response.data.errors && Array.isArray(response.data.errors)) {
          const errorsObj = {};
          response.data.errors.forEach((err) => {
            errorsObj[err.field] = err.message;
          });
          setFormErrors(errorsObj);

          toast.error("Validation Failed", {
            description: "Please fix the errors in the form.",
          });
        } else {
          throw new Error(response.data.message || "Update failed");
        }
      }
    } catch (error) {
      console.error("Update error:", error);

      // Handle different error types
      if (error.response?.data?.errors) {
        const errorsObj = {};
        error.response.data.errors.forEach((err) => {
          errorsObj[err.field] = err.message;
        });
        setFormErrors(errorsObj);

        toast.error("Validation Failed", {
          description: "Please fix the errors in the form.",
        });
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to update project";
        toast.error("Update Failed", {
          description: errorMessage,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getError = (field) => {
    return formErrors[field];
  };

  const hasErrors = Object.values(formErrors).some((error) => error !== "");

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <div className="animate-pulse h-8 w-8 bg-muted rounded"></div>
            <div className="animate-pulse h-8 w-64 bg-muted rounded"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
                    <div className="h-6 bg-muted rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Project Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The project you're looking for doesn't exist.
          </p>
          <Link href="/admin/projects">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/projects">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Edit Project
              </h1>
              <p className="text-muted-foreground">
                Update project details and status
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 font-mono"
            >
              {project.publicId}
            </Badge>
            <Button
              onClick={handleSave}
              disabled={saving || hasErrors}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Global Error Display */}
        {hasErrors && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">
                  Please fix the following errors:
                </span>
              </div>
              <ul className="mt-2 list-disc list-inside text-sm text-red-700">
                {Object.entries(formErrors).map(
                  ([field, error]) => error && <li key={field}>{error}</li>
                )}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Project Details
                </CardTitle>
                <CardDescription>
                  Basic information about the project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter project title"
                      className={getError("title") ? "border-red-500" : ""}
                    />
                    {getError("title") && (
                      <p className="text-red-500 text-sm">
                        {getError("title")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type *</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) =>
                        handleInputChange("projectType", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          getError("projectType") ? "border-red-500" : ""
                        }
                      >
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getError("projectType") && (
                      <p className="text-red-500 text-sm">
                        {getError("projectType")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe the project requirements and vision..."
                    rows={4}
                    className={getError("description") ? "border-red-500" : ""}
                  />
                  <div className="flex justify-between items-center">
                    {getError("description") ? (
                      <p className="text-red-500 text-sm">
                        {getError("description")}
                      </p>
                    ) : (
                      <div />
                    )}
                    <span
                      className={`text-xs ${
                        formData.description.length > 1000
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formData.description.length}/1000
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="areaSqFt"
                      className="flex items-center gap-2"
                    >
                      <Ruler className="w-4 h-4" />
                      Area (sq ft)
                    </Label>
                    <Input
                      id="areaSqFt"
                      type="number"
                      value={formData.areaSqFt}
                      onChange={(e) =>
                        handleInputChange("areaSqFt", e.target.value)
                      }
                      placeholder="Enter area in square feet"
                      className={getError("areaSqFt") ? "border-red-500" : ""}
                    />
                    {getError("areaSqFt") && (
                      <p className="text-red-500 text-sm">
                        {getError("areaSqFt")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budgetRange">Budget Range *</Label>
                    <Select
                      value={formData.budgetRange}
                      onValueChange={(value) =>
                        handleInputChange("budgetRange", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          getError("budgetRange") ? "border-red-500" : ""
                        }
                      >
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getError("budgetRange") && (
                      <p className="text-red-500 text-sm">
                        {getError("budgetRange")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Complete Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter complete address with landmark"
                    rows={3}
                    className={getError("address") ? "border-red-500" : ""}
                  />
                  {getError("address") && (
                    <p className="text-red-500 text-sm">
                      {getError("address")}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="Enter city"
                      className={getError("city") ? "border-red-500" : ""}
                    />
                    {getError("city") && (
                      <p className="text-red-500 text-sm">{getError("city")}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      placeholder="Enter state"
                      className={getError("state") ? "border-red-500" : ""}
                    />
                    {getError("state") && (
                      <p className="text-red-500 text-sm">
                        {getError("state")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Package & Enhancements Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Package & Enhancements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="selectedPackage">Selected Package</Label>
                    <Select
                      value={formData.selectedPlan}
                      onValueChange={(value) =>
                        handleInputChange("selectedPlan", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          getError("selectedPlan") ? "border-red-500" : ""
                        }
                      >
                        <SelectValue placeholder="Select package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem key={pkg.value} value={pkg.value}>
                            {pkg.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getError("selectedPackage") && (
                      <p className="text-red-500 text-sm">
                        {getError("selectedPackage")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline</Label>
                    <Select
                      value={formData.timeline}
                      onValueChange={(value) =>
                        handleInputChange("timeline", value)
                      }
                    >
                      <SelectTrigger
                        className={getError("timeline") ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {timelines.map((timeline) => (
                          <SelectItem
                            key={timeline.value}
                            value={timeline.value}
                          >
                            {timeline.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getError("timeline") && (
                      <p className="text-red-500 text-sm">
                        {getError("timeline")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Enhancements & Add-ons</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {enhancements.map((enhancement) => (
                      <div
                        key={enhancement.value}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={enhancement.value}
                          checked={formData.enhancements.includes(
                            enhancement.value
                          )}
                          onChange={() =>
                            handleEnhancementToggle(enhancement.value)
                          }
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor={enhancement.value}
                          className="text-sm cursor-pointer"
                        >
                          {enhancement.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Client Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {project.user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {project.user?.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      User ID: {project.user?.id || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">
                      {project.user?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">
                      {project.user?.phone || "N/A"}
                    </span>
                  </div>
                </div>

                {project.user?.id && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/admin/users/${project.user.id}`}>
                      View Client Profile
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Project Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Project Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Project Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger
                      className={getError("status") ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                status.color.split(" ")[0]
                              }`}
                            ></div>
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getError("status") && (
                    <p className="text-red-500 text-sm">{getError("status")}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="boqStatus"
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    BOQ Status
                  </Label>
                  <Select
                    value={formData.boqStatus}
                    onValueChange={(value) =>
                      handleInputChange("boqStatus", value)
                    }
                  >
                    <SelectTrigger
                      className={getError("boqStatus") ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select BOQ status" />
                    </SelectTrigger>
                    <SelectContent>
                      {boqStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getError("boqStatus") && (
                    <p className="text-red-500 text-sm">
                      {getError("boqStatus")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="rendersStatus"
                    className="flex items-center gap-2"
                  >
                    <Image className="w-4 h-4" />
                    Renders Status
                  </Label>
                  <Select
                    value={formData.rendersStatus}
                    onValueChange={(value) =>
                      handleInputChange("rendersStatus", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        getError("rendersStatus") ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select renders status" />
                    </SelectTrigger>
                    <SelectContent>
                      {rendersStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getError("rendersStatus") && (
                    <p className="text-red-500 text-sm">
                      {getError("rendersStatus")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project Timeline Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">
                    {formatDate(project.updatedAt)}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      Questionnaire:
                    </span>
                    <Badge
                      variant={
                        project.questionnaireCompleted ? "default" : "outline"
                      }
                    >
                      {project.questionnaireCompleted ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  {/* {project.selectedStyle && (
                    <div className="text-sm text-muted-foreground">
                      Selected: {project.selectedStyle.replace("_", " ")}
                    </div>
                  )} */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
