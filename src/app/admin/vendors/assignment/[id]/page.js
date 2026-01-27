// src/app/admin/vendor-management/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Building,
  MapPin,
  Users,
  Star,
  Phone,
  Mail,
  Globe,
  Calendar,
  MessageSquare,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import api from "@/lib/axios";

export default function VendorAssignmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadAssignment();
    }
  }, [params.id]);

  const loadAssignment = async () => {
    setLoading(true);
    try {
      // Since we don't have a direct endpoint for single assignment,
      // we'll fetch all and filter, or you can create a new endpoint
      const response = await api.get("/projects-vendor");
      if (response.data.success) {
        const foundAssignment = response.data.data.find(
          assignment => assignment.id === parseInt(params.id)
        );
        if (foundAssignment) {
          setAssignment(foundAssignment);
          setFeedback(foundAssignment.clientFeedback || "");
          setRating(foundAssignment.clientRating || 0);
        } else {
          toast.error("Assignment not found");
          router.push("/admin/vendor-management");
        }
      }
    } catch (error) {
      console.error("Error loading assignment:", error);
      toast.error("Failed to load assignment details");
      router.push("/admin/vendor-management");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const payload = {
        status: newStatus,
        ...(feedback && { clientFeedback: feedback }),
        ...(rating > 0 && { clientRating: rating })
      };

      const response = await api.patch(
        `/projects-vendor/project/${assignment.projectId}/vendor/${assignment.vendorId}/status`,
        payload
      );

      if (response.data.success) {
        toast.success("Status Updated", {
          description: `Vendor status updated to ${newStatus}`,
        });
        setAssignment(prev => ({ ...prev, status: newStatus }));
        setShowFeedbackForm(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveVendor = async () => {
    if (!confirm("Are you sure you want to remove this vendor from the project?")) {
      return;
    }

    try {
      const response = await api.delete(
        `/projects-vendor/project/${assignment.projectId}/vendor/${assignment.vendorId}`
      );

      if (response.data.success) {
        toast.success("Vendor Removed", {
          description: "Vendor has been removed from the project",
        });
        router.push("/admin/vendor-management");
      }
    } catch (error) {
      console.error("Error removing vendor:", error);
      toast.error("Failed to remove vendor");
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      PENDING: "outline",
      SENT: "secondary",
      VIEWED: "default",
      CONTACTED: "default",
      ACCEPTED: "success",
      REJECTED: "destructive"
    };
    return variants[status] || "outline";
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
      SENT: "text-blue-600 bg-blue-50 border-blue-200",
      VIEWED: "text-purple-600 bg-purple-50 border-purple-200",
      CONTACTED: "text-orange-600 bg-orange-50 border-orange-200",
      ACCEPTED: "text-green-600 bg-green-50 border-green-200",
      REJECTED: "text-red-600 bg-red-50 border-red-200"
    };
    return colors[status] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="border-border"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Assignment Details</h1>
              <p className="text-sm text-muted-foreground">
                View and manage vendor assignment details
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {showFeedbackForm ? "Cancel Feedback" : "Add Feedback"}
            </Button>
          </div>
        </div>

        {/* Feedback Form */}
        {showFeedbackForm && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Update Status & Feedback</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-blue-900">Client Rating</label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-2xl focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-blue-900">Client Feedback</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter client feedback..."
                    className="mt-1 border-blue-200"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() => handleStatusUpdate("ACCEPTED")}
                    disabled={updating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Accepted
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate("REJECTED")}
                    disabled={updating}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Mark Rejected
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate("CONTACTED")}
                    disabled={updating}
                    variant="outline"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Mark Contacted
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{assignment.project?.title}</h3>
                  <p className="text-muted-foreground">{assignment.project?.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Project Type:</span>
                    <Badge variant="outline" className="ml-2">
                      {assignment.project?.projectType}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Budget Range:</span>
                    <Badge variant="outline" className="ml-2">
                      {assignment.project?.budgetRange}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Area:</span>
                    <span className="ml-2">{assignment.project?.areaSqFt} sq.ft.</span>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <div className="flex items-center gap-1 ml-2">
                      <MapPin className="w-3 h-3" />
                      {assignment.project?.city}, {assignment.project?.state}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Client Information</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{assignment.project?.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{assignment.project?.user?.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{assignment.project?.user?.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Assignment Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Assignment Created</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(assignment.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {assignment.respondedAt && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Client Responded</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(assignment.respondedAt).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span>Last Updated</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(assignment.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Vendor Details & Actions */}
          <div className="space-y-6">
            {/* Vendor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Vendor Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {assignment.vendor?.logoUrl ? (
                    <img
                      src={assignment.vendor.logoUrl}
                      alt={assignment.vendor.name}
                      className="w-16 h-16 rounded-full mx-auto mb-3"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  )}
                  <h3 className="font-semibold">{assignment.vendor?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {assignment.vendor?.businessName}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{assignment.vendor?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{assignment.vendor?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {assignment.vendor?.city}, {assignment.vendor?.state}
                    </span>
                  </div>
                  {assignment.vendor?.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <a
                        href={assignment.vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-1">
                    {assignment.vendor?.categories?.map((category) => (
                      <Badge
                        key={category}
                        variant="outline"
                        className="bg-blue-50 text-blue-700 text-xs"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {assignment.vendor?.specialization && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Specialization</h4>
                    <p className="text-sm text-muted-foreground">
                      {assignment.vendor.specialization}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{assignment.vendor?.rating || "N/A"}</span>
                      <span className="text-muted-foreground">
                        ({assignment.vendor?.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Assignment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge
                    variant={getStatusVariant(assignment.status)}
                    className={`text-lg py-2 px-4 ${getStatusColor(assignment.status)}`}
                  >
                    {assignment.status}
                  </Badge>
                </div>

                {assignment.clientRating && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= assignment.clientRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Client Rating: {assignment.clientRating}/5
                    </span>
                  </div>
                )}

                {assignment.clientFeedback && (
                  <div>
                    <h4 className="font-medium mb-2">Client Feedback</h4>
                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                      {assignment.clientFeedback}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button
                    onClick={handleRemoveVendor}
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Remove Vendor from Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}