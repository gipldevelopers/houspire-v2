// src\components\admin\boq\BOQForm.js
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  FileText,
  IndianRupee,
  Calculator,
  User,
  Building,
  Search,
  ChevronDown,
  Save,
  X,
  Edit,
  Loader2,
  Check,
  Clock,
  AlertCircle,
  Zap,
  PlayCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/axios";

// Project Search Component
const ProjectSearch = ({
  onProjectSelect,
  selectedProject,
  projects,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  // Update timer every second for real-time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine if project is single room plan (48 hours)
  const isSingleRoomPlan = (proj) => {
    return proj?.selectedPlan === 'Single Room Trial' || 
           proj?.selectedPlan?.toLowerCase().includes('single room') ||
           proj?.selectedPlan?.toLowerCase().includes('499') ||
           proj?.isSingleRoomPlan === true;
  };

  // Calculate time remaining for delivery
  const calculateTimeRemaining = (proj) => {
    if (!proj?.designStartTime) return null;
    const now = currentTime;
    const startTime = new Date(proj.designStartTime).getTime();
    const elapsed = now - startTime;
    const isSingleRoom = isSingleRoomPlan(proj);
    const totalTime = isSingleRoom ? 48 * 60 * 60 * 1000 : 72 * 60 * 60 * 1000;
    return Math.max(0, totalTime - elapsed);
  };

  // Get time remaining status
  const getTimeRemainingStatus = (timeRemaining, proj) => {
    if (timeRemaining === null) return "not-started";
    if (timeRemaining <= 0) return "overdue";
    const isSingleRoom = isSingleRoomPlan(proj);
    if (isSingleRoom) {
      if (timeRemaining <= (12 * 60 * 60 * 1000)) return "urgent";
      if (timeRemaining <= (24 * 60 * 60 * 1000)) return "warning";
    } else {
      if (timeRemaining <= (24 * 60 * 60 * 1000)) return "urgent";
      if (timeRemaining <= (48 * 60 * 60 * 1000)) return "warning";
    }
    return "normal";
  };

  // Format time remaining
  const formatTimeRemaining = (ms) => {
    if (ms === null) return "Not started";
    if (ms <= 0) return "Overdue";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${hours}h ${formattedMinutes}m ${formattedSeconds}s`;
  };

  // Check if project is completed
  const isProjectCompleted = (proj) => {
    if (!proj) return false;
    const rendersStatus = proj.rendersStatus;
    const vendorStatus = proj.vendorStatus;
    const boqStatus = proj.boqStatus;
    const isRendersComplete = rendersStatus === "COMPLETED";
    const isVendorComplete = vendorStatus === "SENT" || vendorStatus === "COMPLETED";
    const isBoqComplete = boqStatus === "SENT" || boqStatus === "COMPLETED";
    return isRendersComplete && isVendorComplete && isBoqComplete;
  };

  // Get time remaining badge
  const getTimeRemainingBadge = (timeRemaining, proj) => {
    if (isProjectCompleted(proj)) {
      return (
        <Badge
          variant="outline"
          className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>
      );
    }
    const isReadyToStart = proj.paymentStatus === "COMPLETED" && !proj.designStartTime;
    const status = getTimeRemainingStatus(timeRemaining, proj);
    const config = {
      "not-started": { 
        color: isReadyToStart 
          ? "bg-purple-100 text-purple-800 border-purple-200" 
          : "bg-gray-100 text-gray-800 border-gray-200", 
        label: isReadyToStart ? "Awaiting Questionnaire" : "Not Started",
        icon: PlayCircle
      },
      "normal": { 
        color: "bg-blue-100 text-blue-800 border-blue-200", 
        label: formatTimeRemaining(timeRemaining),
        icon: Clock
      },
      "warning": { 
        color: "bg-amber-100 text-amber-800 border-amber-200", 
        label: formatTimeRemaining(timeRemaining),
        icon: AlertCircle
      },
      "urgent": { 
        color: "bg-orange-100 text-orange-800 border-orange-200", 
        label: formatTimeRemaining(timeRemaining),
        icon: Zap
      },
      "overdue": { 
        color: "bg-red-100 text-red-800 border-red-200", 
        label: "Overdue",
        icon: AlertCircle
      }
    };
    const IconComponent = config[status].icon;
    return (
      <Badge variant="outline" className={`px-2 py-1 text-xs font-medium ${config[status].color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config[status].label}
      </Badge>
    );
  };

  // Transform the projects data to match the expected format
  const transformedProjects = projects.flatMap((user) =>
    user.projects.map((project) => ({
      projectId: project.id,
      displayId: project.displayId, // Add displayId
      projectTitle: project.title,
      projectType: project.configuration,
      userName: user.name,
      userEmail: user.email,
      userPhone: project.userPhone || user.phone,
      area: project.area,
      configuration: project.configuration,
      location: project.location,
      status: project.status,
      hasBOQ: project.hasBOQ,
      budgetRange: project.budgetRange,
      selectedStyle: project.selectedStyle,
      createdAt: project.createdAt,
      // Location fields
      city: project.city,
      pincode: project.pincode,
      address: project.address,
      // Timer-related fields
      designStartTime: project.designStartTime,
      selectedPlan: project.selectedPlan,
      paymentStatus: project.paymentStatus,
      rendersStatus: project.rendersStatus,
      vendorStatus: project.vendorStatus,
      boqStatus: project.boqStatus,
      // Payment information
      payments: project.payments || [],
      totalPaid: project.totalPaid || 0,
      totalAmount: project.totalAmount || 0,
    }))
  );

  const filteredProjects = transformedProjects.filter(
    (project) =>
      (project.projectId?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (project.displayId?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (project.projectTitle?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (project.userName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

  const handleProjectSelect = (project) => {
    onProjectSelect(project);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full justify-between border-border hover:bg-muted/50 h-11"
      >
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span
            className={
              selectedProject ? "text-foreground" : "text-muted-foreground"
            }
          >
            {selectedProject
              ? `${selectedProject.displayId || selectedProject.projectId} - ${selectedProject.projectTitle}`
              : "Search and select project"}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </Button>

      {isOpen && !disabled && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-20 border-border shadow-lg max-h-80 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by project ID, title, or client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-border"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredProjects.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {searchQuery ? "No projects found" : "No pending projects"}
                </div>
              ) : (
                filteredProjects.map((project) => {
                  const timeRemaining = calculateTimeRemaining(project);
                  const isSingleRoom = isSingleRoomPlan(project);
                  
                  return (
                    <div
                      key={project.projectId}
                      onClick={() => handleProjectSelect(project)}
                      className="p-3 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {project.displayId ? (
                              <p className="font-mono font-semibold text-blue-600 text-sm">
                                {project.displayId}
                              </p>
                            ) : (
                              <p className="font-medium text-foreground text-sm">
                                {project.projectId}
                              </p>
                            )}
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-gray-100 text-gray-700 border-gray-300"
                            >
                              {isSingleRoom ? '48H' : '72H'} plan
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs bg-amber-50 text-amber-700"
                            >
                              Pending BOQ
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground mt-1 truncate">
                            {project.projectTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground mb-1">
                            <User className="w-3 h-3" />
                            <span>{project.userName}</span>
                            <span>•</span>
                            <span>{project.configuration}</span>
                            {project.area && (
                              <>
                                <span>•</span>
                                <span>{project.area} sq ft</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getTimeRemainingBadge(timeRemaining, project)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const CategorySection = ({
  category,
  items,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
  isEdit = false,
}) => {
  const categoryTotal = items.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  const [suggestions, setSuggestions] = useState({});
  const [loadingSuggestions, setLoadingSuggestions] = useState({});
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState({});

  const addNewItem = () => {
    onAddItem(category, {
      id: `item_${Date.now()}`,
      description: "",
      unit: "",
      quantity: 0,
      rate: 0,
      amount: 0,
    });
  };

  const updateItem = (itemId, updates) => {
    onUpdateItem(category, itemId, updates);
  };

  const removeItem = (itemId) => {
    onRemoveItem(category, itemId);
  };

  // Search items from database when description changes
  const handleDescriptionChange = async (itemId, value) => {
    // Update the item description immediately
    updateItem(itemId, { description: value });

    // Clear suggestions if input is empty
    if (!value.trim()) {
      setSuggestions((prev) => ({
        ...prev,
        [itemId]: [],
      }));
      return;
    }

    // If query is long enough, search for suggestions
    if (value.length > 1) {
      setLoadingSuggestions((prev) => ({
        ...prev,
        [itemId]: true,
      }));

      try {
        const response = await api.get(
          `/boq-items/search?query=${encodeURIComponent(value)}`
        );
        if (response.data.success) {
          setSuggestions((prev) => ({
            ...prev,
            [itemId]: response.data.data.slice(0, 5), // Limit to 5 suggestions
          }));
          setActiveSuggestionIndex((prev) => ({
            ...prev,
            [itemId]: -1,
          }));
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions((prev) => ({
          ...prev,
          [itemId]: [],
        }));
      } finally {
        setLoadingSuggestions((prev) => ({
          ...prev,
          [itemId]: false,
        }));
      }
    } else {
      // Clear suggestions if query is too short
      setSuggestions((prev) => ({
        ...prev,
        [itemId]: [],
      }));
    }
  };

  // Apply suggestion to item
  const applySuggestion = (itemId, suggestion) => {
    const currentItem = items.find((item) => item.id === itemId);
    updateItem(itemId, {
      description: suggestion.name,
      unit: suggestion.unit,
      rate: suggestion.rate,
      amount: (parseFloat(suggestion.rate) || 0) * (currentItem?.quantity || 0),
    });

    // Clear suggestions for this item
    setSuggestions((prev) => ({
      ...prev,
      [itemId]: [],
    }));
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (itemId, e) => {
    const currentSuggestions = suggestions[itemId] || [];

    if (currentSuggestions.length === 0) return;

    const currentIndex = activeSuggestionIndex[itemId] || -1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestionIndex((prev) => ({
          ...prev,
          [itemId]: Math.min(currentIndex + 1, currentSuggestions.length - 1),
        }));
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestionIndex((prev) => ({
          ...prev,
          [itemId]: Math.max(currentIndex - 1, -1),
        }));
        break;

      case "Enter":
        e.preventDefault();
        if (currentIndex >= 0 && currentIndex < currentSuggestions.length) {
          applySuggestion(itemId, currentSuggestions[currentIndex]);
        }
        break;

      case "Escape":
        setSuggestions((prev) => ({
          ...prev,
          [itemId]: [],
        }));
        break;
    }
  };

  // Clear suggestions when input loses focus
  const handleInputBlur = (itemId) => {
    setTimeout(() => {
      setSuggestions((prev) => ({
        ...prev,
        [itemId]: [],
      }));
    }, 200);
  };

  // Format amount for display with proper handling for long numbers
  const formatAmount = (amount) => {
    if (amount >= 10000000) { // 1 crore and above
      return `${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 lakh and above
      return `${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) { // 1 thousand and above
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString("en-IN");
  };

  return (
    <Card className="border-border">
      <CardHeader className="bg-muted/30 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{category}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Category Total
              </div>
              <div className="text-lg font-bold text-foreground flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {categoryTotal.toLocaleString("en-IN")}
              </div>
            </div>
            <Button
              onClick={addNewItem}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="p-8 text-center border-t border-border">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No items added for {category}
            </p>
            <Button onClick={addNewItem} variant="outline" className="mt-2">
              <Plus className="w-4 h-4 mr-1" />
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="border-t border-border">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/20 text-sm font-medium text-foreground">
              <div className="col-span-4">Description</div> {/* Changed from col-span-5 to col-span-4 */}
              <div className="col-span-2">Unit</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Rate (₹)</div>
              <div className="col-span-2 text-right">Amount</div> {/* Changed from col-span-1 to col-span-2 */}
            </div>

            {/* Items */}
            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-border hover:bg-muted/10 transition-colors relative"
              >
                <div className="col-span-4 relative">
                  <div className="relative">
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        handleDescriptionChange(item.id, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(item.id, e)}
                      onBlur={() => handleInputBlur(item.id)}
                      placeholder="Type item description..."
                      className="border-border pr-8"
                    />

                    {/* Loading indicator */}
                    {loadingSuggestions[item.id] && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>

                  {/* Suggestions dropdown */}
                  {suggestions[item.id] && suggestions[item.id].length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      <div className="p-2 text-xs text-gray-500 border-b border-gray-200 bg-gray-50">
                        Suggestions from database (optional)
                      </div>
                      {suggestions[item.id].map((suggestion, index) => (
                        <div
                          key={suggestion.publicId}
                          onClick={() => applySuggestion(item.id, suggestion)}
                          className={cn(
                            "p-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors",
                            activeSuggestionIndex[item.id] === index
                              ? "bg-blue-50 border-blue-200"
                              : "hover:bg-gray-50"
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-900">
                                {suggestion.name}
                              </p>
                              {suggestion.description && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {suggestion.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-2">
                              <p className="text-sm font-semibold text-green-600">
                                ₹{suggestion.rate}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {suggestion.unit}
                              </p>
                            </div>
                          </div>
                          {suggestion.category && (
                            <div className="flex items-center mt-2">
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {suggestion.category.name}
                              </Badge>
                              <span className="text-xs text-gray-500 ml-2">
                                Click to auto-fill
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <Input
                    value={item.unit}
                    onChange={(e) =>
                      updateItem(item.id, { unit: e.target.value })
                    }
                    placeholder="sft, nos..."
                    className="border-border"
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const quantity = parseFloat(e.target.value) || 0;
                      const rate = parseFloat(item.rate) || 0;
                      updateItem(item.id, {
                        quantity,
                        amount: quantity * rate,
                      });
                    }}
                    className="border-border"
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value) || 0;
                      const quantity = parseFloat(item.quantity) || 0;
                      updateItem(item.id, {
                        rate,
                        amount: quantity * rate,
                      });
                    }}
                    className="border-border"
                  />
                </div>
                <div className="col-span-2 flex items-center justify-between gap-2 min-w-0">
                  <div className="flex-1 text-sm font-medium text-foreground text-right pr-2" 
                      title={`₹${item.amount.toLocaleString("en-IN")}`}>
                    ₹{item.amount.toLocaleString("en-IN")} {/* Show full amount instead of formatted */}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Add Category Modal Component
const AddCategoryModal = ({ onAddCategory, existingCategories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Validation Error", {
        description: "Please enter a category name",
      });
      return;
    }

    if (existingCategories.includes(categoryName)) {
      toast.error("Category exists", {
        description: `${categoryName} category already exists`,
      });
      return;
    }

    onAddCategory(categoryName);
    setCategoryName("");
    setIsOpen(false);

    toast.success("Category added", {
      description: `${categoryName} category added successfully`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-dashed border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name..."
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main BOQForm Component
export default function BOQForm({
  initialData = null,
  onSave,
  onCancel,
  isEdit = false,
  loading = false,
  projects,
  importedData = null,
  selectedProject,
  setSelectedProject,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categories: {},
  });
  const [apiCategories, setApiCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  // Use ref to track initial data load to prevent infinite loops
  const initialDataLoaded = useRef(false);

  // Update timer every second for real-time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine if project is single room plan (48 hours)
  const isSingleRoomPlan = (proj) => {
    return proj?.selectedPlan === 'Single Room Trial' || 
           proj?.selectedPlan?.toLowerCase().includes('single room') ||
           proj?.selectedPlan?.toLowerCase().includes('499') ||
           proj?.isSingleRoomPlan === true;
  };

  // Calculate time remaining for delivery
  const calculateTimeRemaining = (proj) => {
    if (!proj?.designStartTime) return null;
    const now = currentTime;
    const startTime = new Date(proj.designStartTime).getTime();
    const elapsed = now - startTime;
    const isSingleRoom = isSingleRoomPlan(proj);
    const totalTime = isSingleRoom ? 48 * 60 * 60 * 1000 : 72 * 60 * 60 * 1000;
    return Math.max(0, totalTime - elapsed);
  };

  // Get time remaining status
  const getTimeRemainingStatus = (timeRemaining, proj) => {
    if (timeRemaining === null) return "not-started";
    if (timeRemaining <= 0) return "overdue";
    const isSingleRoom = isSingleRoomPlan(proj);
    if (isSingleRoom) {
      if (timeRemaining <= (12 * 60 * 60 * 1000)) return "urgent";
      if (timeRemaining <= (24 * 60 * 60 * 1000)) return "warning";
    } else {
      if (timeRemaining <= (24 * 60 * 60 * 1000)) return "urgent";
      if (timeRemaining <= (48 * 60 * 60 * 1000)) return "warning";
    }
    return "normal";
  };

  // Format time remaining
  const formatTimeRemaining = (ms) => {
    if (ms === null) return "Not started";
    if (ms <= 0) return "Overdue";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${hours}h ${formattedMinutes}m ${formattedSeconds}s`;
  };

  // Check if project is completed
  const isProjectCompleted = (proj) => {
    if (!proj) return false;
    const rendersStatus = proj.rendersStatus;
    const vendorStatus = proj.vendorStatus;
    const boqStatus = proj.boqStatus;
    const isRendersComplete = rendersStatus === "COMPLETED";
    const isVendorComplete = vendorStatus === "SENT" || vendorStatus === "COMPLETED";
    const isBoqComplete = boqStatus === "SENT" || boqStatus === "COMPLETED";
    return isRendersComplete && isVendorComplete && isBoqComplete;
  };

  // Get time remaining badge
  const getTimeRemainingBadge = (timeRemaining, proj) => {
    if (isProjectCompleted(proj)) {
      return (
        <Badge
          variant="outline"
          className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>
      );
    }
    const isReadyToStart = proj.paymentStatus === "COMPLETED" && !proj.designStartTime;
    const status = getTimeRemainingStatus(timeRemaining, proj);
    const config = {
      "not-started": { 
        color: isReadyToStart 
          ? "bg-purple-100 text-purple-800 border-purple-200" 
          : "bg-gray-100 text-gray-800 border-gray-200", 
        label: isReadyToStart ? "Awaiting Questionnaire" : "Not Started",
        icon: PlayCircle
      },
      "normal": { 
        color: "bg-blue-100 text-blue-800 border-blue-200", 
        label: formatTimeRemaining(timeRemaining),
        icon: Clock
      },
      "warning": { 
        color: "bg-amber-100 text-amber-800 border-amber-200", 
        label: formatTimeRemaining(timeRemaining),
        icon: AlertCircle
      },
      "urgent": { 
        color: "bg-orange-100 text-orange-800 border-orange-200", 
        label: formatTimeRemaining(timeRemaining),
        icon: Zap
      },
      "overdue": { 
        color: "bg-red-100 text-red-800 border-red-200", 
        label: "Overdue",
        icon: AlertCircle
      }
    };
    const IconComponent = config[status].icon;
    return (
      <Badge variant="outline" className={`px-2 py-1 text-xs font-medium ${config[status].color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config[status].label}
      </Badge>
    );
  };

  // Fetch categories from API on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Search items when search query changes
  useEffect(() => {
    if (searchQuery.length > 2) {
      const delaySearch = setTimeout(() => {
        searchItems(searchQuery);
      }, 300);
      return () => clearTimeout(delaySearch);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // FIXED: Initialize form with existing data for edit mode
  useEffect(() => {
    // Only run if we have initialData, are in edit mode, and haven't loaded the data yet
    if (initialData && isEdit && !initialDataLoaded.current) {
      
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        categories: initialData.categories || {},
      });

      // Mark as loaded to prevent re-running
      initialDataLoaded.current = true;
    }
  }, [initialData, isEdit]); // Only depend on initialData and isEdit

  // Handle imported data
  useEffect(() => {
    if (importedData && Object.keys(importedData.categories).length > 0) {
      const mergedCategories = { ...formData.categories };

      Object.entries(importedData.categories).forEach(([category, items]) => {
        if (mergedCategories[category]) {
          mergedCategories[category] = [
            ...mergedCategories[category],
            ...items,
          ];
        } else {
          mergedCategories[category] = items;
        }
      });

      setFormData((prev) => ({
        ...prev,
        categories: mergedCategories,
      }));

      toast.success("Data Merged", {
        description: `Imported ${importedData.totalItems} items merged with existing data`,
      });
    }
  }, [importedData]);

  // Set default title when project is selected
  useEffect(() => {
    if (selectedProject && !isEdit) {
      setFormData((prev) => ({
        ...prev,
        title: `BUDGET - ${selectedProject.projectTitle}`,
        description: `Budget Breakdown for ${selectedProject.projectTitle}`,
      }));
    }
  }, [selectedProject, isEdit]);

  // API Functions
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await api.get("/boq-categories");
      if (response.data.success) {
        setApiCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const searchItems = async (query) => {
    try {
      setSearchLoading(true);
      const response = await api.get(`/boq-items/search?query=${query}`);
      if (response.data.success) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error("Error searching items:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const addCategoryToAPI = async (categoryName) => {
    try {
      const response = await api.post("/boq-categories", {
        name: categoryName,
        description: `${categoryName} works and materials`,
        isActive: true,
      });

      if (response.data.success) {
        toast.success("Category added to database");
        fetchCategories(); // Refresh categories list
        return response.data.data;
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.response?.data?.message || "Failed to add category");
      throw error;
    }
  };

  const addItemToAPI = async (itemData) => {
    try {
      // Find or create category
      let category = apiCategories.find(
        (cat) => cat.name === itemData.category
      );

      if (!category) {
        category = await addCategoryToAPI(itemData.category);
      }

      const payload = {
        name: itemData.description,
        description: itemData.description,
        unit: itemData.unit,
        rate: parseFloat(itemData.rate) || 0,
        categoryId: category.id,
        tags: [itemData.category.toLowerCase()],
        isActive: true,
        isStandard: true,
      };

      const response = await api.post("/boq-items", payload);

      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error adding item:", error);
      throw error;
    }
  };

  // Category Management
  const addCategory = async (category) => {
    if (formData.categories[category]) {
      toast.info("Category exists", {
        description: `${category} category already exists in this BOQ`,
      });
      return;
    }

    // Add to API if it doesn't exist
    const existingCategory = apiCategories.find((cat) => cat.name === category);
    if (!existingCategory) {
      try {
        await addCategoryToAPI(category);
      } catch (error) {
        return; // Stop if category creation fails
      }
    }

    setFormData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: [],
      },
    }));

    toast.success("Category added", {
      description: `${category} category added successfully`,
    });
  };

  const removeCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: Object.fromEntries(
        Object.entries(prev.categories).filter(([cat]) => cat !== category)
      ),
    }));

    toast.success("Category removed", {
      description: `${category} category removed`,
    });
  };

  // Item Management
  const addItem = async (category, item) => {
    setFormData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: [...(prev.categories[category] || []), item],
      },
    }));
  };

  const updateItem = (category, itemId, updates) => {
    setFormData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: prev.categories[category].map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      },
    }));
  };

  const removeItem = (category, itemId) => {
    setFormData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: prev.categories[category].filter(
          (item) => item.id !== itemId
        ),
      },
    }));
  };

  const addCustomItem = async (item) => {
    const category = item.category;

    if (!formData.categories[category]) {
      await addCategory(category);
    }

    setTimeout(() => {
      addItem(category, item);
    }, 100);
  };

  const addItemFromSearch = (item, categoryName) => {
    const newItem = {
      id: `item_${Date.now()}`,
      description: item.name,
      unit: item.unit,
      rate: item.rate,
      quantity: 1,
      amount: item.rate,
    };

    addItem(categoryName, newItem);
    setSearchQuery("");
    setOpenSearch(false);
  };

  // Enhanced Add Custom Item Component
  const EnhancedAddCustomItemSection = ({ onAddCustomItem }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [customItem, setCustomItem] = useState({
      category: "",
      description: "",
      unit: "",
      quantity: 0,
      rate: 0,
    });

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (
        !customItem.category.trim() ||
        !customItem.description.trim() ||
        !customItem.unit.trim()
      ) {
        toast.error("Validation Error", {
          description: "Please fill all required fields",
        });
        return;
      }

      const amount =
        (parseFloat(customItem.quantity) || 0) *
        (parseFloat(customItem.rate) || 0);

      const itemData = {
        id: `item_${Date.now()}`,
        ...customItem,
        amount,
      };

      onAddCustomItem(itemData);
      setCustomItem({
        category: "",
        description: "",
        unit: "",
        quantity: 0,
        rate: 0,
      });
      setIsOpen(false);

      toast.success("Item added", {
        description: "Custom item added successfully",
      });
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-dashed border-2 border-green-300 hover:border-green-400 hover:bg-green-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Item
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Custom Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customCategory">Category *</Label>
              <Input
                id="customCategory"
                value={customItem.category}
                onChange={(e) =>
                  setCustomItem((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                placeholder="Enter category name..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customDescription">Description *</Label>
              <Input
                id="customDescription"
                value={customItem.description}
                onChange={(e) =>
                  setCustomItem((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Item description..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customUnit">Unit *</Label>
                <Input
                  id="customUnit"
                  value={customItem.unit}
                  onChange={(e) =>
                    setCustomItem((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  placeholder="sft, nos..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customQuantity">Quantity</Label>
                <Input
                  id="customQuantity"
                  type="number"
                  value={customItem.quantity}
                  onChange={(e) =>
                    setCustomItem((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customRate">Rate (₹)</Label>
              <Input
                id="customRate"
                type="number"
                value={customItem.rate}
                onChange={(e) =>
                  setCustomItem((prev) => ({ ...prev, rate: e.target.value }))
                }
                placeholder="0"
              />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium text-foreground">
                Amount: ₹
                {(
                  (parseFloat(customItem.quantity) || 0) *
                  (parseFloat(customItem.rate) || 0)
                ).toLocaleString()}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Item Search Component
  const ItemSearch = () => (
    <div className="space-y-4">
      <Label>Search Existing Items from Database</Label>
      <Popover open={openSearch} onOpenChange={setOpenSearch}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openSearch}
            className="w-full justify-between"
          >
            {searchQuery || "Type to search items..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search items by name, description, or tags..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {searchLoading && (
                <CommandEmpty>
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Searching...
                  </div>
                </CommandEmpty>
              )}
              {!searchLoading && searchResults.length === 0 && searchQuery && (
                <CommandEmpty>No items found.</CommandEmpty>
              )}
              <CommandGroup>
                {searchResults.map((item) => (
                  <CommandItem
                    key={item.publicId}
                    value={item.name}
                    onSelect={() => {
                      addItemFromSearch(item, item.category?.name || "General");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        searchResults.some(
                          (result) => result.publicId === item.publicId
                        )
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.category?.name} • {item.unit} • ₹{item.rate}
                      </span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );

  // Utility Functions
  const calculateTotal = () => {
    return Object.values(formData.categories).reduce((total, items) => {
      return total + items.reduce((sum, item) => sum + (item.amount || 0), 0);
    }, 0);
  };

  const validateForm = () => {
    if (!selectedProject) {
      toast.error("Validation Error", {
        description: "Please select a project",
      });
      return false;
    }

    if (!formData.title.trim()) {
      toast.error("Validation Error", {
        description: "Please enter a BOQ title",
      });
      return false;
    }

    const hasItems = Object.values(formData.categories).some(
      (items) => items.length > 0
    );
    if (!hasItems) {
      toast.error("Validation Error", {
        description: "Please add at least one item",
      });
      return false;
    }

    for (const [category, items] of Object.entries(formData.categories)) {
      for (const item of items) {
        if (!item.description?.trim() || !item.unit?.trim()) {
          toast.error("Validation Error", {
            description: `Please fill all fields for items in ${category}`,
          });
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const boqData = {
      ...formData,
      totalAmount: calculateTotal(),
      user: selectedUser,
      project: selectedProjectForForm,
      userId: selectedUser?.id,
      projectId: selectedProjectForForm?.id,
      projectTitle: selectedProjectForForm?.title,
      createdAt: isEdit ? initialData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(boqData);
  };

  const totalAmount = calculateTotal();
  const selectedCategories = Object.keys(formData.categories);

  // Transform project data for compatibility
  const selectedUser = selectedProject
    ? {
        id: selectedProject.userId,
        name: selectedProject.userName,
        email: selectedProject.userEmail,
        projects: [
          {
            id: selectedProject.projectId,
            title: selectedProject.projectTitle,
            area: selectedProject.area,
            configuration: selectedProject.projectType,
            location: selectedProject.address,
            status: selectedProject.status,
            hasBOQ: isEdit,
          },
        ],
      }
    : null;

  const selectedProjectForForm = selectedProject
    ? {
        id: selectedProject.projectId,
        title: selectedProject.projectTitle,
        area: selectedProject.area,
        configuration: selectedProject.projectType,
        location: selectedProject.address,
        status: selectedProject.status,
        hasBOQ: isEdit,
      }
    : null;

  return (
    <div className="space-y-6">
      {/* Project Selection - Only show in create mode */}
      {!isEdit && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Project Selection</CardTitle>
            <p className="text-sm text-muted-foreground">
              Search and select a project that needs BOQ creation
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Select Project *</Label>
              <ProjectSearch
                onProjectSelect={setSelectedProject}
                selectedProject={selectedProject}
                disabled={isEdit}
                projects={projects}
              />
            </div>

            {selectedProject && (
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm">
                        Selected Project
                      </h4>
                      {isSingleRoomPlan(selectedProject) && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-gray-100 text-gray-700 border-gray-300"
                        >
                          {isSingleRoomPlan(selectedProject) ? '48H' : '72H'} plan
                        </Badge>
                      )}
                      {calculateTimeRemaining(selectedProject) !== null && (
                        <div className="ml-auto">
                          {getTimeRemainingBadge(calculateTimeRemaining(selectedProject), selectedProject)}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                        <div>
                          <strong>ID:</strong>{" "}
                          {selectedProject.displayId ? (
                            <span className="font-mono font-semibold text-green-800">
                              {selectedProject.displayId}
                            </span>
                          ) : (
                            <span>{selectedProject.projectId}</span>
                          )}
                        </div>
                        <div>
                          <strong>Title:</strong> {selectedProject.projectTitle}
                        </div>
                        <div>
                          <strong>Type:</strong> {selectedProject.projectType}
                        </div>
                        <div>
                          <strong>Style:</strong>{" "}
                          {selectedProject.selectedStyle ? (
                            <span>{selectedProject.selectedStyle}</span>
                          ) : (
                            <span className="text-gray-500 italic">Not selected</span>
                          )}
                        </div>
                        {selectedProject.paymentStatus && (
                          <div>
                            <strong>Payment Status:</strong>{" "}
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                selectedProject.paymentStatus === "COMPLETED"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : selectedProject.paymentStatus === "PENDING"
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-gray-100 text-gray-800 border-gray-300"
                              }`}
                            >
                              {selectedProject.paymentStatus}
                            </Badge>
                          </div>
                        )}
                        {selectedProject.totalPaid !== undefined && selectedProject.totalPaid > 0 && (
                          <div>
                            <strong>Amount Paid:</strong>{" "}
                            <span className="font-semibold text-green-700">
                              ₹{selectedProject.totalPaid.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                        <div>
                          <strong>Client:</strong> {selectedProject.userName}
                        </div>
                        <div>
                          <strong>Email:</strong> {selectedProject.userEmail}
                        </div>
                        {selectedProject.userPhone && (
                          <div>
                            <strong>Phone:</strong> {selectedProject.userPhone}
                          </div>
                        )}
                        <div>
                          <strong>City:</strong>{" "}
                          {selectedProject.city ? (
                            <>
                              {selectedProject.city}
                              {selectedProject.pincode && ` - ${selectedProject.pincode}`}
                            </>
                          ) : (
                            <span className="text-gray-500 italic">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Show project info in edit mode */}
      {isEdit && selectedProject && (
        <Card className="border-border bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editing BOQ for Existing Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-900 text-sm">
                  Project Details
                </h4>
                <div className="text-xs text-blue-700 mt-2 space-y-1">
                  <div>
                    <strong>ID:</strong>{" "}
                    {selectedProject.displayId ? (
                      <span className="font-mono font-semibold text-blue-800">
                        {selectedProject.displayId}
                      </span>
                    ) : (
                      <span>{selectedProject.projectId}</span>
                    )}
                  </div>
                  <div>
                    <strong>Title:</strong> {selectedProject.projectTitle}
                  </div>
                  <div>
                    <strong>Type:</strong> {selectedProject.projectType}
                  </div>
                  <div>
                    <strong>Area:</strong> {selectedProject.area} sq ft
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 text-sm">
                  Client Details
                </h4>
                <div className="text-xs text-blue-700 mt-2 space-y-1">
                  <div>
                    <strong>Name:</strong> {selectedProject.userName}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedProject.userEmail}
                  </div>
                  <div>
                    <strong>Address:</strong> {selectedProject.address}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Only show rest of form when project is selected OR in edit mode */}
      {(selectedProject || isEdit) && (
        <>
          {/* BOQ Information */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">BOQ Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">BOQ Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter BOQ title..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the scope of work..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Categories Section with API Integration */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Database Categories */}
                <div className="flex flex-wrap gap-2 p-1 max-h-60 overflow-y-auto">
                  {apiCategories
                    .filter((cat) => cat.isActive)
                    .map((category) => (
                      <button
                        key={category.publicId}
                        type="button"
                        onClick={() => addCategory(category.name)}
                        disabled={selectedCategories.includes(category.name)}
                        className={cn(
                          "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                          selectedCategories.includes(category.name)
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 shadow-sm"
                            : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:border-gray-300"
                        )}
                      >
                        {selectedCategories.includes(category.name) ? (
                          <Check className="w-3 h-3 mr-1.5 text-green-600" />
                        ) : (
                          <Plus className="w-3 h-3 mr-1.5 text-gray-500" />
                        )}
                        {category.name}
                      </button>
                    ))}
                </div>
              </div>

              {/* Custom Category & Item Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <AddCategoryModal
                  onAddCategory={addCategory}
                  existingCategories={selectedCategories}
                />

                {/* <EnhancedAddCustomItemSection onAddCustomItem={addCustomItem} /> */}
              </div>
            </CardContent>
          </Card>

          {/* Categories & Items */}
          {selectedCategories.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">BOQ Items</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage items for each category. Amount is calculated
                  automatically.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories Summary */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Categories Added
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedCategories.map((cat) => (
                          <Badge
                            key={cat}
                            variant="outline"
                            className="bg-white text-blue-700 cursor-pointer hover:bg-blue-50"
                            onClick={() => removeCategory(cat)}
                          >
                            {cat} <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-900">
                        Total Amount
                      </p>
                      <p className="text-2xl font-bold text-blue-700 flex items-center gap-1">
                        <IndianRupee className="w-5 h-5" />
                        {totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Categories Sections */}
                <div className="space-y-6">
                  {selectedCategories.map((category) => (
                    <CategorySection
                      key={category}
                      category={category}
                      items={formData.categories[category] || []}
                      onAddItem={addItem}
                      onUpdateItem={updateItem}
                      onRemoveItem={removeItem}
                      isEdit={isEdit}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Section */}
          <Card className="border-border sticky bottom-6 bg-background shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    <span>{selectedCategories.length} categories</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>
                      {Object.values(formData.categories).reduce(
                        (count, items) => count + items.length,
                        0
                      )}{" "}
                      items
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    <span className="font-semibold text-foreground">
                      Total: ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading || selectedCategories.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isEdit ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {isEdit ? "Update BOQ" : "Create BOQ"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}