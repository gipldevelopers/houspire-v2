// components/admin/vendor/VendorAssignForm.jsx
"use client";

import { useState, useEffect } from "react";
import { Search, Check, Building, MapPin, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function VendorAssignForm({
  projects,
  vendors,
  onAssign,
  onCancel,
  loading,
  importedData,
  selectedProject,
  setSelectedProject,
}) {
  const [suggestedVendors, setSuggestedVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Load suggested vendors when project is selected
  useEffect(() => {
    if (selectedProject) {
      loadSuggestedVendors(selectedProject.id);
      setSelectedVendors(new Set()); // Clear selected vendors when project changes
    }
  }, [selectedProject]);

  const loadSuggestedVendors = async (projectId) => {
    try {
      const response = await api.get(
        `/projects-vendor/project/${projectId}/suggestions`
      );
      if (response.data.success) {
        setSuggestedVendors(response.data.data.suggestions || []);
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
      setSuggestedVendors([]);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleVendorToggle = (vendorId) => {
    const newSelected = new Set(selectedVendors);
    if (newSelected.has(vendorId)) {
      newSelected.delete(vendorId);
    } else {
      newSelected.add(vendorId);
    }
    setSelectedVendors(newSelected);
  };

  const handleAssign = () => {
    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }

    if (selectedVendors.size === 0) {
      toast.error("Please select at least one vendor");
      return;
    }

    onAssign({
      selectedVendors: Array.from(selectedVendors),
      projectId: selectedProject.id,
    });
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.categories?.some((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const filteredSuggestedVendors = suggestedVendors.filter(
    (vendor) =>
      vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.categories?.some((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Projects List */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Available Projects</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select a project to assign vendors
            </p>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No projects available</p>
              </div>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isSelected={selectedProject?.id === project.id}
                  onSelect={() => handleProjectSelect(project)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Vendors Selection */}
      <div className="lg:col-span-2 space-y-6">
        {selectedProject ? (
          <>
            {/* Selected Project Info */}
            <Card className="border-border bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      {selectedProject.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-blue-700">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedProject.user?.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedProject.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        <span>{selectedProject.projectType}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-blue-600">
                    {selectedProject.budgetRange}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors by name, business, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-border"
              />
            </div>

            {/* Vendors Tabs */}
            <Tabs defaultValue="suggested" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="suggested">
                  Suggested Vendors
                  <Badge variant="secondary" className="ml-2">
                    {filteredSuggestedVendors.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="all">
                  All Vendors
                  <Badge variant="secondary" className="ml-2">
                    {filteredVendors.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="suggested" className="space-y-3">
                {filteredSuggestedVendors.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No suggested vendors found</p>
                  </div>
                ) : (
                  filteredSuggestedVendors.map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      isSelected={selectedVendors.has(vendor.id)}
                      onToggle={() => handleVendorToggle(vendor.id)}
                      isSuggested={true}
                      matchScore={vendor.matchScore}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-3">
                {filteredVendors.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No vendors found</p>
                  </div>
                ) : (
                  filteredVendors.map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      isSelected={selectedVendors.has(vendor.id)}
                      onToggle={() => handleVendorToggle(vendor.id)}
                      isSuggested={false}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {selectedVendors.size}
                </span>{" "}
                vendors selected for{" "}
                <span className="font-semibold text-foreground">
                  {selectedProject.title}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssign}
                  disabled={loading || selectedVendors.size === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Assign Selected Vendors
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <Building className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Project Selected
              </h3>
              <p className="text-sm text-muted-foreground">
                Please select a project from the list to assign vendors
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Project Card Component
const ProjectCard = ({ project, isSelected, onSelect }) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-border hover:border-blue-300 hover:bg-blue-25"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-sm truncate">
              {project.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span className="truncate">{project.user?.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {project.projectType}
              </Badge>
              {project.city && (
                <Badge variant="outline" className="text-xs">
                  {project.city}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{project.city}, {project.state}</span>
            </div>
          </div>
          {isSelected && (
            <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Vendor Card Component
const VendorCard = ({
  vendor,
  isSelected,
  onToggle,
  isSuggested,
  matchScore,
}) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-green-500 bg-green-50"
          : "border-border hover:border-green-300 hover:bg-green-25"
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-foreground text-sm">
                {vendor.name}
              </h4>
              {vendor.businessName && (
                <span className="text-xs text-muted-foreground">
                  ({vendor.businessName})
                </span>
              )}
              {isSuggested && matchScore && (
                <Badge className="bg-orange-100 text-orange-700 text-xs">
                  {matchScore}% Match
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              {vendor.categories?.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700"
                >
                  {category}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {vendor.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{vendor.city}</span>
                </div>
              )}
              {vendor.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{vendor.rating}</span>
                  <span>({vendor.reviewCount} reviews)</span>
                </div>
              )}
              {vendor.isVerified && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 text-xs"
                >
                  Verified
                </Badge>
              )}
            </div>

            {vendor.specialization && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {vendor.specialization}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {isSelected ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};