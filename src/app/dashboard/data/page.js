// src/app/dashboard/data/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  AlertTriangle,
  User,
  Image,
  File,
  Loader2,
  ExternalLink,
  Lock,
  Eye,
  Database,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";

// Policy documents
const policies = [
  {
    id: "privacy",
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information",
    icon: Lock,
    lastUpdated: "January 2026",
    link: "/privacy-policy",
  },
  {
    id: "terms",
    title: "Terms of Service",
    description: "Rules and guidelines for using our platform",
    icon: FileText,
    lastUpdated: "January 2026",
    link: "/terms-of-service",
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    description: "Information about cookies and tracking technologies",
    icon: Eye,
    lastUpdated: "January 2026",
    link: "/cookie-policy",
  },
  {
    id: "data",
    title: "Data Processing",
    description: "Details on how your data is processed and stored",
    icon: Database,
    lastUpdated: "January 2026",
    link: "/data-processing",
  },
];

export default function DataPage() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("data");
  const [expandedPolicy, setExpandedPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [downloadingData, setDownloadingData] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const response = await userService.getUserProfile();
      if (response.success) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDownload = async () => {
    setDownloadingData(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Data export requested! You'll receive an email with download link within 24 hours.");
    } catch (error) {
      toast.error("Failed to request data export");
    } finally {
      setDownloadingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is PERMANENT and cannot be undone. All your data, projects, and files will be deleted forever."
    );

    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Type "DELETE" to confirm account deletion:'
    );

    if (doubleConfirm !== "DELETE") {
      toast.error("Account deletion cancelled");
      return;
    }

    setDeletingAccount(true);
    try {
      const response = await userService.deleteAccount();
      if (response.success) {
        toast.success("Account deleted successfully");
        logout();
      } else {
        toast.error(response.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    } finally {
      setDeletingAccount(false);
    }
  };

  const togglePolicy = (id) => {
    setExpandedPolicy(expandedPolicy === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Data & Privacy
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your data, privacy settings, and view our policies
          </p>
        </div>

        {/* Policies Section */}
        <Card className="border-border">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Our Policies</h3>
            <div className="space-y-2">
              {policies.map((policy) => {
                const Icon = policy.icon;
                const isExpanded = expandedPolicy === policy.id;
                return (
                  <div key={policy.id} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => togglePolicy(policy.id)}
                      className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/30 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{policy.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{policy.description}</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-3">
                            Last updated: {policy.lastUpdated}
                          </p>
                          <p className="text-sm text-foreground/80 mb-3">
                            {policy.description}. Click below to read the full policy document.
                          </p>
                          <Link
                            href={policy.link}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            Read full policy
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for My Data and Danger Zone */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full grid grid-cols-2 h-10">
            <TabsTrigger value="data" className="text-sm">
              My Data
            </TabsTrigger>
            <TabsTrigger value="danger" className="text-sm text-red-600 data-[state=active]:text-red-600">
              Danger Zone
            </TabsTrigger>
          </TabsList>

          {/* My Data Tab */}
          <TabsContent value="data" className="space-y-4 mt-4">
            {/* Uploaded Files */}
            <Card className="border-border">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Image className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Uploaded Files</h3>
                    <p className="text-xs text-muted-foreground">Images, documents, and project files</p>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Total Files</span>
                    <span className="text-sm font-medium text-foreground">
                      {userData?._count?.projects || 0} projects
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your uploaded files are securely stored and can be downloaded at any time.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRequestDownload}
                  disabled={downloadingData}
                  className="w-full h-9"
                >
                  {downloadingData ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Request Data Download
                </Button>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-border">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Personal Information</h3>
                    <p className="text-xs text-muted-foreground">Data we have collected about you</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground">Name</span>
                    <span className="text-sm text-foreground">{userData?.name || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground">Email</span>
                    <span className="text-sm text-foreground">{userData?.email || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground">Phone</span>
                    <span className="text-sm text-foreground">{userData?.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground">Address</span>
                    <span className="text-sm text-foreground truncate max-w-[200px]">
                      {userData?.address || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">Account Created</span>
                    <span className="text-sm text-foreground">
                      {userData?.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-green-700 dark:text-green-300">
                      Your data is encrypted and securely stored
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Zone Tab */}
          <TabsContent value="danger" className="space-y-4 mt-4">
            <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-700 dark:text-red-400">Danger Zone</h3>
                    <p className="text-xs text-red-600/70 dark:text-red-400/70">Irreversible actions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-background rounded-lg border border-red-200 dark:border-red-900/50">
                    <div className="flex items-start gap-3">
                      <Trash2 className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground">Delete Account</h4>
                        <p className="text-xs text-muted-foreground mt-1 mb-3">
                          Permanently delete your account and all associated data. This includes all your 
                          projects, files, renders, and personal information. This action cannot be undone.
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteAccount}
                          disabled={deletingAccount}
                          className="h-8"
                        >
                          {deletingAccount ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete My Account
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      <strong>Warning:</strong> Account deletion is permanent and cannot be recovered. 
                      Please download your data before proceeding if you want to keep a copy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
