// src/app/dashboard/profile/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  FolderOpen,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import PhoneNumberModal from "@/components/dashboard/PhoneNumberModal";

export default function ProfilePage() {
  const { user, checkAuth } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await userService.getUserProfile();
        if (response.success) {
          const profileData = response.data.user;
          setUserData(profileData);
          setInitialData(profileData);
        } else {
          toast.error(response.message || "Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!userData) return;

    setSaving(true);

    try {
      const updateData = {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
      };

      const response = await userService.updateProfile(updateData);

      if (response.success) {
        setIsEditing(false);
        const refreshResponse = await userService.getUserProfile();
        if (refreshResponse.success) {
          const updatedProfileData = refreshResponse.data.user;
          setUserData(updatedProfileData);
          setInitialData(updatedProfileData);
        }
        await checkAuth();
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUserData(initialData);
    setIsEditing(false);
  };

  const handlePhoneNumberAdded = async () => {
    setShowPhoneModal(false);
    try {
      const response = await userService.getUserProfile();
      if (response.success) {
        const updatedProfileData = response.data.user;
        setUserData(updatedProfileData);
        setInitialData(updatedProfileData);
      }
      await checkAuth();
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayData = userData || {
    name: user?.name || "User",
    email: user?.email || "",
    phone: "",
    address: "",
    avatar: user?.avatar || null,
    createdAt: new Date().toISOString(),
    _count: { projects: 0, payments: 0 },
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PhoneNumberModal
        isOpen={showPhoneModal}
        onPhoneNumberAdded={handlePhoneNumberAdded}
      />

      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarImage src={displayData.avatar} alt={displayData.name} />
                  <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary">
                    {getUserInitials(displayData.name)}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => toast.info("Avatar upload coming soon")}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-foreground truncate">
                  {displayData.name}
                </h2>
                <p className="text-sm text-muted-foreground truncate">
                  {displayData.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  {!displayData.phone && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs cursor-pointer hover:bg-amber-200"
                      onClick={() => setShowPhoneModal(true)}
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Add Phone
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border-border">
          <CardContent className="p-4 sm:p-6 space-y-5">
            {/* Edit Toggle */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Personal Information</h3>
              {!isEditing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 text-xs"
                >
                  Edit
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={saving}
                    className="h-8 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                    className="h-8 text-xs"
                  >
                    {saving ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Save className="h-3 w-3 mr-1" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs text-muted-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                value={displayData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                className="h-10"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={displayData.email || ""}
                  disabled
                  className="h-10 pl-9 bg-muted"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs text-muted-foreground">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={displayData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  placeholder="+91 98765 43210"
                  className="h-10 pl-9"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-xs text-muted-foreground">
                Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="address"
                  value={displayData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your address"
                  className="pl-9 min-h-[80px] resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card className="border-border">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Account Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Projects</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">
                  {displayData._count?.projects || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Member Since</span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(displayData.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy Link */}
        <Card className="border-border">
          <CardContent className="p-0">
            <Link 
              href="/dashboard/data"
              className="flex items-center justify-between p-4 sm:p-6 hover:bg-muted/30 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Data & Privacy</p>
                  <p className="text-xs text-muted-foreground">View policies, manage data, and account</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
