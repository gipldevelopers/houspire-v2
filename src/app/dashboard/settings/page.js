// src/app/dashboard/settings/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Moon,
  Sun,
  Monitor,
  Bell,
  Loader2,
  Check,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { userService } from "@/services/user.service";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    projectUpdates: true,
  });

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    setLoading(true);
    try {
      const response = await userService.getUserProfile();
      if (response.success && response.data.user?.userPreferences) {
        const prefs = response.data.user.userPreferences;
        setSettings({
          emailNotifications: prefs.emailNotifications ?? true,
          projectUpdates: prefs.projectUpdates ?? true,
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    
    try {
      await userService.updateProfile({
        preferences: { [key]: value },
      });
      toast.success("Setting saved");
    } catch (error) {
      console.error("Error saving setting:", error);
      toast.error("Failed to save setting");
      setSettings((prev) => ({ ...prev, [key]: !value }));
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your preferences
          </p>
        </div>

        {/* Appearance */}
        <Card className="border-border">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Appearance</h3>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleThemeChange(option.id)}
                    className={`
                      relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                      ${isActive 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                      {option.label}
                    </span>
                    {isActive && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <h3 className="text-sm font-medium text-foreground">Notifications</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-normal text-foreground">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-normal text-foreground">Project Updates</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Get notified about project progress
                  </p>
                </div>
                <Switch
                  checked={settings.projectUpdates}
                  onCheckedChange={(checked) => handleSettingChange("projectUpdates", checked)}
                />
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
                  <p className="text-xs text-muted-foreground">Manage your data and privacy settings</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Houspire v2.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
