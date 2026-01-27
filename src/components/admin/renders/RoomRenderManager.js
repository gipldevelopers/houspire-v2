// src\components\admin\renders\RoomRenderManager.jsx
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Image,
  Palette,
  CheckCircle2,
  Plus,
  X,
  Eye,
  Edit,
  Search,
  Lock,
  Save,
  Clock,
  AlertCircle,
  Zap,
  PlayCircle,
  CheckCircle,
} from "lucide-react";

// Default rooms - 3 most important
const defaultRooms = [
  { value: "LIVING_ROOM", label: "Living Room" },
  { value: "MASTER_BEDROOM", label: "Master Bedroom" },
  { value: "KITCHEN", label: "Kitchen" },
];

const additionalRooms = [
  { value: "BEDROOM", label: "Bedroom" },
  { value: "BATHROOM", label: "Bathroom" },
  { value: "DINING_ROOM", label: "Dining Room" },
  { value: "STUDY_ROOM", label: "Study Room" },
  { value: "GUEST_ROOM", label: "Guest Room" },
  { value: "BALCONY", label: "Balcony" },
  { value: "CORRIDOR", label: "Corridor" },
  { value: "OFFICE", label: "Office" },
  { value: "KIDS_ROOM", label: "Kids Room" },
];

const allRoomTypes = [...defaultRooms, ...additionalRooms];

// Room Render Component
const RoomRenderUpload = ({
  room,
  index,
  onUpdate,
  onRemove,
  totalRooms,
  globalStyle,
  mode = "create",
}) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(room.previewUrl || null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (JPEG, PNG, etc.)");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setSelectedFile(file);

      onUpdate(room.id, {
        ...room,
        imageFile: file,
        previewUrl: objectUrl,
        fileName: file.name,
        hasChanges: true,
      });
    }
  };

  const handleRemove = () => {
    onRemove(room.id);
  };

  const handleRoomTypeChange = (roomType) => {
    const roomLabel =
      allRoomTypes.find((r) => r.value === roomType)?.label || roomType;
    const hasChanges = roomType !== room.originalType;

    onUpdate(room.id, {
      ...room,
      type: roomType,
      name: roomLabel,
      hasChanges: hasChanges,
    });
  };

  const hasExistingImage = room.imageUrl && !room.previewUrl;
  const hasChanges = room.hasChanges || previewUrl;
  const isNewRoom = !room.originalId;

  return (
    <Card
      className={`border-border bg-muted/20 hover:bg-muted/30 transition-colors ${
        hasChanges ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <CardContent className="p-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                hasChanges
                  ? "bg-blue-600"
                  : hasExistingImage
                  ? "bg-green-600"
                  : "bg-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-foreground">
                Room {index + 1}
              </span>
              {hasChanges && isNewRoom && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 text-xs"
                >
                  Modified & New
                </Badge>
              )}
              {hasChanges && !isNewRoom && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 text-xs"
                >
                  Modified
                </Badge>
              )}
              {!hasChanges && isNewRoom && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 text-xs"
                >
                  New
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {hasExistingImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(room.imageUrl, "_blank")}
                className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                title="View current render"
              >
                <Eye className="w-3 h-3" />
              </Button>
            )}
            {totalRooms > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* Room Selection */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-muted-foreground">
              Room Type {mode === "edit" && "(Optional)"}
            </Label>
            <Select
              value={room.type || ""}
              onValueChange={handleRoomTypeChange}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {allRoomTypes.map((roomType) => (
                  <SelectItem
                    key={roomType.value}
                    value={roomType.value}
                    className="text-sm"
                  >
                    {roomType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Render Image Upload */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-muted-foreground">
              Render Image {mode === "edit" ? "(Optional)" : "*"}
            </Label>
            <div
              className="border border-dashed border-border rounded-md p-3 cursor-pointer hover:border-primary transition-colors min-h-[80px] flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {previewUrl ? (
                <div className="flex items-center gap-3 w-full">
                  <img
                    src={previewUrl}
                    alt={`New render for ${room.name}`}
                    className="w-12 h-12 rounded object-cover shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-xs truncate">
                      {selectedFile?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile?.size / (1024 * 1024)).toFixed(1)} MB • New
                      version
                    </p>
                  </div>
                </div>
              ) : hasExistingImage ? (
                <div className="text-center w-full">
                  <div className="flex items-center gap-3">
                    <img
                      src={room.imageUrl}
                      alt={`Current render for ${room.name}`}
                      className="w-12 h-12 rounded object-cover shadow-sm"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-foreground text-xs truncate">
                        Current render
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {room.fileSize}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Click to upload new version (optional)
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">
                    {mode === "create"
                      ? "Click to upload"
                      : "Click to upload (optional)"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Information */}
        {hasExistingImage && !previewUrl && (
          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 p-2 rounded mt-2">
            <CheckCircle2 className="w-3 h-3" />
            <span>Current: {room.name}</span>
          </div>
        )}

        {/* Change Indicator - Only show when there are actual changes */}
        {hasChanges && previewUrl && (
          <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 p-1 rounded mt-2">
            <Edit className="w-3 h-3" />
            <span>New image uploaded</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Room Render Manager Component
export default function RoomRenderManager({
  project,
  initialRenders = [],
  onUpload,
  onCancel,
  mode = "create",
  onProjectChange,
  pendingProjects = [],
}) {
  const [uploading, setUploading] = useState(false);
  const [roomRenders, setRoomRenders] = useState([]);
  const [globalStyle, setGlobalStyle] = useState(project?.selectedStyle || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
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

  // Calculate time remaining for delivery (48h for single room, 72h for others)
  const calculateTimeRemaining = (proj) => {
    if (!proj?.designStartTime) return null;
    
    const now = currentTime;
    const startTime = new Date(proj.designStartTime).getTime();
    const elapsed = now - startTime;
    const isSingleRoom = isSingleRoomPlan(proj);
    const totalTime = isSingleRoom ? 48 * 60 * 60 * 1000 : 72 * 60 * 60 * 1000;
    
    return Math.max(0, totalTime - elapsed);
  };

  // Get time remaining status for color coding
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

  // Format time remaining for display
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

  // Get time remaining badge with color coding
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

  // Filter pending projects based on search
  const filteredProjects = pendingProjects.filter(
    (proj) =>
      proj.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.displayId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize rooms based on mode - FIXED: Only run once on mount
  useEffect(() => {
    if (isInitialized) return;

    if (mode === "edit" && initialRenders.length > 0) {
      const editRenders = initialRenders.map((render) => ({
        id: render.id,
        originalId: render.id,
        publicId: render.publicId,
        type: render.roomType,
        originalType: render.roomType,
        name: render.roomName,
        styleApplied: render.styleApplied,
        imageFile: null,
        previewUrl: null,
        fileName: "",
        imageUrl: render.imageUrl,
        status: render.status,
        fileSize: render.fileSize,
        hasChanges: false,
        isNew: false,
      }));
      setRoomRenders(editRenders);
    } else if (mode === "create" && project) {
      const createRenders = defaultRooms.map((roomType, index) => ({
        id: `room_${Date.now()}_${index}`,
        type: roomType.value,
        name: roomType.label,
        styleApplied: globalStyle,
        imageFile: null,
        previewUrl: null,
        fileName: "",
        hasChanges: false,
        isNew: true,
      }));
      setRoomRenders(createRenders);
    }

    setIsInitialized(true);
  }, [mode, project, initialRenders, globalStyle, isInitialized]);

  // Handle project selection change (only for create mode)
  const handleProjectSelect = (projectId) => {
    if (mode === "create" && onProjectChange) {
      const selectedProject = pendingProjects.find(
        (p) => p.projectId === projectId
      );
      onProjectChange(selectedProject || null);
    }
  };

  // Reset form when project changes - FIXED: Only run when project actually changes
  useEffect(() => {
    if (mode === "create" && project && isInitialized) {
      setGlobalStyle(project.selectedStyle);
      const newRenders = defaultRooms.map((roomType, index) => ({
        id: `room_${Date.now()}_${index}`,
        type: roomType.value,
        name: roomType.label,
        styleApplied: project.selectedStyle,
        imageFile: null,
        previewUrl: null,
        fileName: "",
        hasChanges: false,
        isNew: true,
      }));
      setRoomRenders(newRenders);
    }
  }, [project, mode, isInitialized]); // Removed globalStyle from dependencies

  // Add a new room render section
  const addRoomRender = () => {
    const newRoom = {
      id: `new_room_${Date.now()}_${roomRenders.length}`,
      type: "",
      name: "",
      styleApplied: globalStyle,
      imageFile: null,
      previewUrl: null,
      fileName: "",
      hasChanges: true,
      isNew: true,
    };
    setRoomRenders((prev) => [...prev, newRoom]);
  };

  const updateRoomRender = (roomId, updates) => {
    setRoomRenders((prev) =>
      prev.map((room) => (room.id === roomId ? { ...room, ...updates } : room))
    );
  };

  const removeRoomRender = (roomId) => {
    setRoomRenders((prev) => prev.filter((room) => room.id !== roomId));
  };

  const handleUpload = async () => {
    if (mode === "create") {
      const incompleteRooms = roomRenders.filter(
        (room) => !room.imageFile || !room.type
      );

      if (incompleteRooms.length > 0) {
        alert(
          `Please complete all room renders:\n• Select room type\n• Upload render image`
        );
        return;
      }
    }

    if (!project) {
      alert("Project information is required");
      return;
    }

    setUploading(true);

    try {
      const uploadData = {
        project: project,
        roomRenders: roomRenders.map((room) => ({
          id: room.originalId || room.id,
          publicId: room.publicId,
          roomType: room.type,
          roomName: room.name,
          styleApplied: room.styleApplied,
          imageFile: room.imageFile,
          previewUrl: room.previewUrl,
          fileName: room.fileName,
          hasChanges: room.hasChanges,
          isNew: !room.originalId,
          currentImageUrl: room.imageUrl,
          isFinal: room.isFinal || false,
        })),
        mode: mode,
      };

      await onUpload(uploadData);
    } catch (error) {
      console.error(
        `${mode === "create" ? "Upload" : "Update"} failed:`,
        error
      );
      alert(
        `${mode === "create" ? "Upload" : "Update"} failed. Please try again.`
      );
    } finally {
      setUploading(false);
    }
  };

  const hasChanges = roomRenders.some((room) => room.hasChanges);
  const changedCount = roomRenders.filter((room) => room.hasChanges).length;
  const newCount = roomRenders.filter((room) => !room.originalId).length;

  const allRoomsReady =
    mode === "create"
      ? roomRenders.length > 0 &&
        roomRenders.every((room) => room.imageFile && room.type)
      : true;

  return (
    <div className="space-y-6">
      {/* Project Selection - Only show in create mode */}
      {mode === "create" && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Select Project
            </CardTitle>
            <CardDescription>
              Choose a project to upload renders for. You can change the project
              anytime.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Project *</Label>
              <Select
                value={project?.projectId || ""}
                onValueChange={handleProjectSelect}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Search and select a project" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <div className="p-2 border-b border-border">
                    <div className="relative w-full">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 w-full"
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredProjects.map((proj) => {
                      const timeRemaining = calculateTimeRemaining(proj);
                      const isSingleRoom = isSingleRoomPlan(proj);
                      
                      return (
                        <SelectItem
                          key={proj.projectId}
                          value={proj.projectId}
                          className="w-full"
                        >
                          <div className="flex items-center justify-between w-full py-1">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate flex items-center gap-2 mb-1">
                                {proj.displayId ? (
                                  <span className="font-mono text-blue-600 font-semibold">
                                    {proj.displayId}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">{proj.projectId}</span>
                                )}
                                <Badge
                                  variant="outline"
                                  className="text-[10px] bg-gray-100 text-gray-700 border-gray-300"
                                >
                                  {isSingleRoom ? '48H' : '72H'} plan
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground truncate mb-1">
                                {proj.projectTitle} • {proj.userName}
                              </div>
                              <div className="flex items-center gap-2">
                                {getTimeRemainingBadge(timeRemaining, proj)}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </div>
                </SelectContent>
              </Select>
            </div>

            {/* Selected Project Info */}
            {project && (
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                        Selected Project
                      </h4>
                      {isSingleRoomPlan(project) && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-gray-100 text-gray-700 border-gray-300"
                        >
                          {isSingleRoomPlan(project) ? '48H' : '72H'} plan
                        </Badge>
                      )}
                      {calculateTimeRemaining(project) !== null && (
                        <div className="ml-auto">
                          {getTimeRemainingBadge(calculateTimeRemaining(project), project)}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                        <div>
                          <strong>ID:</strong>{" "}
                          {project.displayId ? (
                            <span className="font-mono font-semibold text-blue-800">
                              {project.displayId}
                            </span>
                          ) : (
                            <span>{project.projectId}</span>
                          )}
                        </div>
                        <div>
                          <strong>Title:</strong> {project.projectTitle}
                        </div>
                        <div>
                          <strong>Type:</strong> {project.projectType}
                        </div>
                        <div>
                          <strong>Style:</strong>{" "}
                          {project.selectedStyle ? (
                            <span>{project.selectedStyle}</span>
                          ) : (
                            <span className="text-gray-500 italic">Not selected</span>
                          )}
                        </div>
                        {project.paymentStatus && (
                          <div>
                            <strong>Payment Status:</strong>{" "}
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                project.paymentStatus === "COMPLETED"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : project.paymentStatus === "PENDING"
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-gray-100 text-gray-800 border-gray-300"
                              }`}
                            >
                              {project.paymentStatus}
                            </Badge>
                          </div>
                        )}
                        {project.totalPaid !== undefined && project.totalPaid > 0 && (
                          <div>
                            <strong>Amount Paid:</strong>{" "}
                            <span className="font-semibold text-green-700">
                              ₹{project.totalPaid.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                        <div>
                          <strong>Client:</strong> {project.userName}
                        </div>
                        <div>
                          <strong>Email:</strong> {project.userEmail}
                        </div>
                        {project.userPhone && (
                          <div>
                            <strong>Phone:</strong> {project.userPhone}
                          </div>
                        )}
                        <div>
                          <strong>City:</strong>{" "}
                          {project.city ? (
                            <>
                              {project.city}
                              {project.pincode && ` - ${project.pincode}`}
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

            {/* No Project Selected Message */}
            {!project && (
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-200 text-center">
                <Search className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  Please select a project to continue
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Project Info Display - Show in both modes, but different styling for edit mode */}
      {project && mode === "edit" && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                    Editing Project (Cannot be changed)
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <div>
                      <strong>ID:</strong>{" "}
                      {project.displayId ? (
                        <span className="font-mono font-semibold text-blue-800">
                          {project.displayId}
                        </span>
                      ) : (
                        <span>{project.projectId}</span>
                      )}
                    </div>
                    <div>
                      <strong>Title:</strong> {project.projectTitle}
                    </div>
                    <div>
                      <strong>Type:</strong> {project.projectType}
                    </div>
                    <div>
                      <strong>Style:</strong> {project.selectedStyle}
                    </div>
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <div>
                      <strong>Client:</strong> {project.userName}
                    </div>
                    <div>
                      <strong>Email:</strong> {project.userEmail}
                    </div>
                    <div>
                      <strong>Address:</strong> {project.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Only show the rest if project is selected (for create mode) or always (for edit mode) */}
      {(project || mode === "edit") && (
        <>
          {/* Design Style Info */}
          {project && (
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100 text-lg">
                  <Palette className="w-5 h-5" />
                  Design Style
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  {mode === "edit"
                    ? "Current design style"
                    : "Automatically selected from client's preference"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-green-900 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      {project.selectedStyle}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Applied to all room renders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Room Renders Section */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {mode === "edit" ? "Edit Room Renders" : "Room Renders"}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {mode === "create"
                      ? "Add/remove as needed."
                      : "Edit existing room renders. All changes are optional."}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {hasChanges && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      {changedCount} changed
                    </Badge>
                  )}
                  {newCount > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      {newCount} new
                    </Badge>
                  )}
                  <Badge variant="outline">{roomRenders.length} total</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Room Cards Grid */}
                {roomRenders.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roomRenders.map((room, index) => (
                        <RoomRenderUpload
                          key={room.id}
                          room={room}
                          index={index}
                          onUpdate={updateRoomRender}
                          onRemove={removeRoomRender}
                          totalRooms={roomRenders.length}
                          globalStyle={globalStyle}
                          mode={mode}
                        />
                      ))}
                    </div>

                    {/* Add Room Button */}
                    <div className="flex justify-center pt-2">
                      <Button
                        onClick={addRoomRender}
                        variant="outline"
                        size="sm"
                        className="border-dashed"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add {mode === "edit" ? "New " : ""}Room
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Image className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No rooms configured</p>
                    <Button
                      onClick={addRoomRender}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Room
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons at Bottom Right */}
          <Card className="border-border sticky bottom-6 bg-background shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    <span>{roomRenders.length} rooms</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {roomRenders.filter((room) => room.imageFile).length}{" "}
                      uploaded
                    </span>
                  </div>
                  {mode === "edit" && hasChanges && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        <span className="font-semibold text-foreground">
                          {changedCount} changes pending
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={
                      uploading || !allRoomsReady || roomRenders.length === 0
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {mode === "edit" ? "Updating..." : "Uploading..."}
                      </>
                    ) : (
                      <>
                        {mode === "edit" ? (
                          <Save className="w-4 h-4 mr-2" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        {mode === "edit" ? "Save Changes" : "Upload Renders"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Messages */}
          <div className="space-y-2">
            {mode === "edit" && !hasChanges && (
              <div className="text-sm text-muted-foreground text-center p-3 bg-muted/50 rounded-lg">
                No changes made. You can still save to confirm current state.
              </div>
            )}

            {mode === "create" && !allRoomsReady && roomRenders.length > 0 && (
              <div className="text-sm text-amber-600 text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                Complete all room renders to upload
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
