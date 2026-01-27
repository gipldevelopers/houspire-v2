// src/app/dashboard/support/new/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { projectService } from "@/services/project.service";
import { toast } from "sonner";

export default function NewSupportTicketPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    projectPublicId: "",
  });
  const [projects, setProjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState("");

  // Fetch user's projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getUserProjects();

        if (response.success) {
          // Access the projects array from the nested structure and filter out any invalid projects
          const validProjects = (response.data?.projects || []).filter(
            (project) =>
              project &&
              (project.publicId || project.id) &&
              (project.publicId || project.id).trim() !== ""
          );
          setProjects(validProjects);
        } else {
          throw new Error(response.message || "Failed to load projects");
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setError("Failed to load your projects. Please try again.");
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const { data } = await api.post("/support", formData);

      if (data.success) {
        router.push("/dashboard/support");
      } else {
        throw new Error(data.message || "Failed to create ticket");
      }

      if (data.success) {
        // Redirect to tickets list
        router.push("/dashboard/support");
        toast.success("Support ticket created successfully!");
      } else {
        throw new Error(data.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error("Failed to create ticket:", error);
      setError(
        error.message || "Failed to create support ticket. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get project value safely
  const getProjectValue = (project) => {
    const value = project.id || project.id;
    // Ensure the value is not empty and is a string
    return value && value.toString().trim() !== ""
      ? value.toString()
      : `project-${project.id}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Create Support Ticket
          </h1>
          <p className="text-muted-foreground mt-2">
            Describe your issue and we'll help you resolve it quickly
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
              <CardDescription>
                Provide details about the issue you're facing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of your issue"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  minLength={5}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.title.length}/200 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about your issue. Include steps to reproduce, error messages, and what you were trying to accomplish."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={6}
                  required
                  minLength={10}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange("category", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TECHNICAL">Technical Issue</SelectItem>
                      <SelectItem value="BILLING">Billing & Payment</SelectItem>
                      <SelectItem value="PROJECT">Project Related</SelectItem>
                      <SelectItem value="DESIGN">Design & Renders</SelectItem>
                      <SelectItem value="PAYMENT">Payment Issues</SelectItem>
                      <SelectItem value="GENERAL">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleChange("priority", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Related Project (Optional)</Label>
                <Select
                  value={formData.projectId || "none"}
                  onValueChange={(value) =>
                    handleChange("projectId", value === "none" ? "" : value)
                  }
                  disabled={loadingProjects}
                >
                  <SelectTrigger>
                    {loadingProjects ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading projects...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select project" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No project selected</SelectItem>
                    {projects.map((project) => {
                      const projectValue = getProjectValue(project);
                      return (
                        <SelectItem key={projectValue} value={projectValue}>
                          {project.title}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">
                  {loadingProjects
                    ? "Loading your projects..."
                    : projects.length === 0
                    ? "You don't have any projects yet"
                    : "Linking a project helps us understand your issue better"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Help Tips Card */}
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Tips for getting help faster
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Be specific about the issue you're facing</li>
                    <li>• Include error messages if any</li>
                    <li>• Mention steps you've already tried</li>
                    <li>• Attach screenshots when possible</li>
                    <li>• Include your project name if relevant</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.title ||
                !formData.description ||
                !formData.category ||
                formData.title.length < 5 ||
                formData.description.length < 10
              }
              className="min-w-32"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Ticket...
                </>
              ) : (
                "Create Ticket"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
