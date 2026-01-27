  // src\app\admin\users\[id]\page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Building,
  FileText,
  Image,
  CheckCircle2,
  Clock,
  User,
  IndianRupee,
  Home,
  MessageSquare,
  Download,
  Eye,
  Plus,
  PhoneCall,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";


//TODO: When Projects section is complte replace this api
// Mock user projects
const mockUserProjects = [
  {
    id: 1,
    publicId: "HSP-2025-001",
    title: "Modern 3BHK Apartment",
    status: "UPLOADED",
    projectType: "RESIDENTIAL",
    areaSqFt: 1250,
    address: "Lokhandwala Complex, Andheri West, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    budgetRange: "PREMIUM",
    timeline: "STANDARD",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    boqStatus: "PENDING",
    rendersStatus: "PENDING",
    selectedPackage: "premium",
    progress: 65,
  },
  {
    id: 2,
    publicId: "HSP-2025-002",
    title: "Luxury Villa Interior",
    status: "QUESTIONNAIRE_COMPLETED",
    projectType: "RESIDENTIAL",
    areaSqFt: 3500,
    address: "Baner Road, Pune",
    city: "Pune",
    state: "Maharashtra",
    budgetRange: "LUXURY",
    timeline: "FLEXIBLE",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-22T16:45:00Z",
    boqStatus: "SENT",
    rendersStatus: "SENT",
    selectedPackage: "luxury",
    progress: 85,
  },
  {
    id: 3,
    publicId: "HSP-2025-003",
    title: "Family Home Design",
    status: "COMPLETED",
    projectType: "RESIDENTIAL",
    areaSqFt: 1800,
    address: "Cyber City, Gurgaon",
    city: "Gurgaon",
    state: "Haryana",
    budgetRange: "STANDARD",
    timeline: "STANDARD",
    createdAt: "2024-01-20T11:30:00Z",
    updatedAt: "2024-01-25T10:15:00Z",
    boqStatus: "SENT",
    rendersStatus: "SENT",
    selectedPackage: "essential",
    progress: 100,
  },
];

const getStatusConfig = (status) => {
  const configs = {
    DRAFT: {
      label: "Draft",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: Clock,
    },
    UPLOADED: {
      label: "Files Uploaded",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Building,
    },
    QUESTIONNAIRE_COMPLETED: {
      label: "Style Selected",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: CheckCircle2,
    },
    BOQ_GENERATED: {
      label: "BOQ Ready",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: FileText,
    },
    COMPLETED: {
      label: "Completed",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: CheckCircle2,
    },
    CANCELLED: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: Clock,
    },
  };
  return configs[status] || configs.DRAFT;
};

const getBOQStatusConfig = (status) => {
  const configs = {
    PENDING: {
      label: "Pending",
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: Clock,
    },
    GENERATED: {
      label: "Generated",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: FileText,
    },
    SENT: {
      label: "Sent to User",
      color: "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircle2,
    },
  };
  return configs[status] || configs.PENDING;
};

const getRendersStatusConfig = (status) => {
  const configs = {
    PENDING: {
      label: "Pending",
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: Clock,
    },
    UPLOADED: {
      label: "Uploaded",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Image,
    },
    SENT: {
      label: "Sent to User",
      color: "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircle2,
    },
  };
  return configs[status] || configs.PENDING;
};

const getRoleConfig = (role) => {
  const configs = {
    USER: {
      label: "Customer",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: User,
    },
    VENDOR: {
      label: "Vendor",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Building,
    },
    ADMIN: {
      label: "Admin",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: User,
    },
  };
  return (
    configs[role] || {
      label: role,
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: User,
    }
  );
};

const getStatusConfigUser = (status) => {
  const configs = {
    active: {
      label: "Active",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    inactive: {
      label: "Inactive",
      color: "bg-red-100 text-red-800 border-red-200",
    },
    suspended: {
      label: "Suspended",
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
  };
  return configs[status] || configs.inactive;
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id;
  const type = "USER";
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    if (userId) loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/${type}/${userId}`);
      // Adjust based on your backend response
      setUser(res.data.data);
      console.log("-------------",res.data.data);

      // If you have projects
      setUserProjects(mockUserProjects || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const formatCurrency = (amount) => {
    if (amount === 0) return "₹0";

    if (amount >= 10000000) {
      return "₹" + (amount / 10000000).toFixed(1) + "Cr";
    } else if (amount >= 100000) {
      return "₹" + (amount / 100000).toFixed(1) + "L";
    } else if (amount >= 1000) {
      return "₹" + (amount / 1000).toFixed(1) + "K";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
              {[...Array(2)].map((_, i) => (
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            User Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The user you're looking for doesn't exist.
          </p>
          <Link href="/admin/users">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const roleConfig = getRoleConfig(user.role);
  const statusConfig = getStatusConfigUser(user.status);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Client Profile
              </h1>
              <p className="text-muted-foreground">
                View and manage client information
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            

            <Link href={`/admin/users/${user.publicId}/edit`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Client Information
                </CardTitle>
                <CardDescription>
                  Personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {user.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={roleConfig.color}>
                            <roleConfig.icon className="w-3 h-3 mr-1" />
                            {roleConfig.label}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={statusConfig.color}
                          >
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Phone</p>
                            <p className="font-medium">{user.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">
                              Member Since
                            </p>
                            <p className="font-medium">
                              {formatDate(user.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Link href={`mailto:${user.email}`}>
                        <Button className="flex-1" variant="outline">
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </Button>
                      </Link>
                      <Link href={`tel:${user.phone}`}>
                        <Button className="flex-1" variant="outline">
                          <PhoneCall className="w-4 h-4 mr-2" />
                          Make a Call
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects Section */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Client Projects
                </CardTitle>
                <CardDescription>
                  All projects associated with this client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="all">
                      All Projects ({userProjects.length})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                      Active (
                      {
                        userProjects.filter((p) => p.status !== "COMPLETED")
                          .length
                      }
                      )
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed (
                      {
                        userProjects.filter((p) => p.status === "COMPLETED")
                          .length
                      }
                      )
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {userProjects.map((project) => {
                      const statusConfig = getStatusConfig(project.status);
                      const boqStatusConfig = getBOQStatusConfig(
                        project.boqStatus
                      );
                      const rendersStatusConfig = getRendersStatusConfig(
                        project.rendersStatus
                      );

                      return (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Home className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground">
                                  {project.title}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-200 font-mono text-xs"
                                >
                                  {project.publicId}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>
                                  {project.city}, {project.state}
                                </span>
                                <span>•</span>
                                <span>
                                  {project.areaSqFt.toLocaleString()} sq ft
                                </span>
                                <span>•</span>
                                <span>{project.budgetRange}</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>
                                  Created {formatTimeAgo(project.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right space-y-1">
                              <Badge
                                variant="outline"
                                className={statusConfig.color}
                              >
                                {statusConfig.label}
                              </Badge>
                              <div className="flex gap-2 text-xs">
                                <Badge
                                  variant="outline"
                                  className={boqStatusConfig.color}
                                >
                                  BOQ: {boqStatusConfig.label}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={rendersStatusConfig.color}
                                >
                                  Renders: {rendersStatusConfig.label}
                                </Badge>
                              </div>
                            </div>
                            <Link href={`/admin/projects/${project.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="active">
                    {userProjects
                      .filter((p) => p.status !== "COMPLETED")
                      .map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                        </div>
                      ))}
                  </TabsContent>

                  <TabsContent value="completed">
                    {userProjects
                      .filter((p) => p.status === "COMPLETED")
                      .map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                        </div>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card> */}
          </div>

          <div className="space-y-6">
            {/* <Card>
              <CardHeader>
                <CardTitle>Project Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {user.totalProjects}
                    </p>
                    <p className="text-sm text-blue-700">Total Projects</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {user.completedProjects}
                    </p>
                    <p className="text-sm text-green-700">Completed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Active Projects
                    </span>
                    <span className="font-medium">{user.activeProjects}</span>
                  </div>
                  <Progress
                    value={(user.activeProjects / user.totalProjects) * 100}
                    className="h-2"
                  />
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(user.totalValue)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">
                      Preferred Package
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200"
                    >
                      {user.packageType}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Last Login</p>
                    <p className="text-muted-foreground">
                      {formatTimeAgo(user.lastLoginAt)}
                    </p>
                  </div>
                </div>

                {/* <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Project Created</p>
                    <p className="text-muted-foreground">3 days ago</p>
                  </div>
                </div> */}
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/admin/users/${user.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
}
