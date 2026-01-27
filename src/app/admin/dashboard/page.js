// src/app/admin/dashboard/page.js
"use client";

import {
  Users,
  FolderOpen,
  Receipt,
  Image,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Palette,
  Download,
  Eye,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useState } from "react";
import { useDashboard } from "@/services/dashbaord/useDashboard";
import Link from "next/link";

// Helper functions
const formatCurrency = (amount) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
};

const formatNumber = (num) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const getStatusColor = (status) => {
  const colors = {
    DRAFT: "bg-gray-500",
    UPLOADED: "bg-blue-500",
    QUESTIONNAIRE_COMPLETED: "bg-yellow-500",
    STYLE_SELECTED: "bg-purple-500",
    PAYMENT_COMPLETED: "bg-indigo-500",
    DESIGN_QUESTIONNAIRE_COMPLETED: "bg-pink-500",
    RENDER_IN_PROGRESS: "bg-orange-500",
    RENDER_COMPLETED: "bg-cyan-500",
    BOQ_GENERATED: "bg-green-500",
    COMPLETED: "bg-emerald-500",
    CANCELLED: "bg-red-500",
  };
  return colors[status] || "bg-gray-500";
};

const getPriorityColor = (priority) => {
  const colors = {
    HIGH: "bg-red-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-blue-500",
  };
  return colors[priority] || "bg-gray-500";
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            {entry.dataKey === "revenue"
              ? formatCurrency(entry.value)
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Loading components
const StatCardSkeleton = () => (
  <Card className="relative overflow-hidden border-border animate-pulse">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
    </CardHeader>
    <CardContent>
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </CardContent>
  </Card>
);

const ChartSkeleton = () => (
  <div className="w-full h-[300px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
    <div className="text-gray-400">Loading chart...</div>
  </div>
);

export default function AdminDashboard() {
  const { data, loading, error, refreshData, updateFilters } = useDashboard();
  const [timeRange, setTimeRange] = useState("month");

  // Handle filter changes
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    updateFilters({ period: range });
  };

  // Transform data for charts
  const revenueData =
    data?.revenueAnalytics?.revenueByMonth?.map((item) => ({
      month: item.month,
      revenue: item.revenue,
      projects: item.projects || 0,
    })) || [];

  const projectStatusData =
    data?.projectAnalytics?.projectsByStatus?.map((item) => {
      const colors = {
        COMPLETED: "#10b981",
        RENDER_IN_PROGRESS: "#f59e0b",
        PAYMENT_COMPLETED: "#3b82f6",
        UPLOADED: "#8b5cf6",
        DRAFT: "#6b7280",
        CANCELLED: "#ef4444",
      };

      return {
        name: item.status.replace(/_/g, " "),
        value: item.count,
        color: colors[item.status] || "#6b7280",
      };
    }) || [];

  const stylePopularityData =
    data?.projectAnalytics?.projectsByStyle?.map((style, index) => ({
      name: style.style,
      popularity:
        (style.count /
          Math.max(
            ...data.projectAnalytics.projectsByStyle.map((s) => s.count)
          )) *
        100,
      count: style.count,
    })) || [];

  const weeklyActivityData =
    data?.stats?.revenueTrend?.slice(-7).map((item) => ({
      day: item.month.split(" ")[0],
      uploads: Math.floor(Math.random() * 20) + 5, // This would come from actual data
      renders: Math.floor(Math.random() * 15) + 3,
      boqs: Math.floor(Math.random() * 10) + 2,
    })) || [];

  // Stats cards data
  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(
        data?.quickStats?.totalRevenue ||
          data?.stats?.overview?.totalRevenue ||
          0
      ),
      change: data?.stats?.growth?.revenue?.value
        ? `${
            data.stats.growth.revenue.value > 0 ? "+" : ""
          }${data.stats.growth.revenue.value.toFixed(1)}%`
        : "+0%",
      changeType:
        data?.stats?.growth?.revenue?.value >= 0 ? "positive" : "negative",
      icon: DollarSign,
      description: `From last ${timeRange}`,
    },
    {
      title: "Active Projects",
      value: formatNumber(
        data?.quickStats?.totalProjects ||
          data?.stats?.overview?.activeProjects ||
          0
      ),
      change: data?.stats?.growth?.projects?.value
        ? `${
            data.stats.growth.projects.value > 0 ? "+" : ""
          }${data.stats.growth.projects.value.toFixed(1)}%`
        : "+0%",
      changeType:
        data?.stats?.growth?.projects?.value >= 0 ? "positive" : "negative",
      icon: FolderOpen,
      description: `${
        data?.stats?.overview?.completedProjects || 0
      } completed this ${timeRange}`,
    },
    {
      title: "Registered Users",
      value: formatNumber(
        data?.quickStats?.totalUsers || data?.stats?.overview?.totalUsers || 0
      ),
      change: data?.stats?.growth?.users?.value
        ? `${
            data.stats.growth.users.value > 0 ? "+" : ""
          }${data.stats.growth.users.value.toFixed(1)}%`
        : "+0%",
      changeType:
        data?.stats?.growth?.users?.value >= 0 ? "positive" : "negative",
      icon: Users,
      description: `${data?.stats?.overview?.totalUsers || 0} total users`,
    },
    {
      title: "Renders Generated",
      value: formatNumber(
        data?.quickStats?.totalRenders ||
          data?.stats?.overview?.totalRenders ||
          0
      ),
      change: "+22%", // This would come from actual growth data
      changeType: "positive",
      icon: Image,
      description: `${
        data?.stats?.overview?.pendingPayments || 0
      } pending actions`,
    },
  ];

  // Recent projects from API
  const recentProjects =
    data?.projectAnalytics?.recentProjects?.map((project) => ({
      id: project.id,
      title: project.title,
      user: project.user,
      status: project.status,
      progress: getProjectProgress(project.status),
      createdAt: project.createdAt,
      budget: formatCurrency(project.revenue || 0),
      style: project.style || "Not selected",
    })) || [];

  // Pending actions (you might want to create an API for this)
  const pendingActions = [
    {
      id: 1,
      type: "BOQ_APPROVAL",
      title: "BOQ Approval Required",
      description: "Modern Apartment - Kitchen renovation",
      projectId: "PRJ-001",
      priority: "HIGH",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "VENDOR_VERIFICATION",
      title: "New Vendor Registration",
      description: "Elite Interiors - Furniture specialist",
      priority: "MEDIUM",
      time: "5 hours ago",
    },
  ];

  // Helper function to calculate project progress based on status
  function getProjectProgress(status) {
    const progressMap = {
      DRAFT: 10,
      UPLOADED: 25,
      QUESTIONNAIRE_COMPLETED: 40,
      STYLE_SELECTED: 50,
      PAYMENT_COMPLETED: 60,
      DESIGN_QUESTIONNAIRE_COMPLETED: 70,
      RENDER_IN_PROGRESS: 80,
      RENDER_COMPLETED: 90,
      BOQ_GENERATED: 95,
      COMPLETED: 100,
    };
    return progressMap[status] || 0;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Failed to load dashboard
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refreshData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            {loading
              ? "Loading dashboard data..."
              : "Welcome back! Here's what's happening with your platform today."}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-lg p-1">
            {["week", "month", "year"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTimeRangeChange(range)}
                className="capitalize"
              >
                {range}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {/* <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button> */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((stat) => {
              const Icon = stat.icon;
              const isPositive = stat.changeType === "positive";

              return (
                <Card
                  key={stat.title}
                  className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-border"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {isPositive ? (
                        <ArrowUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {stat.description}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue & Projects Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Revenue & Project Growth</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <TrendingUp className="h-3 w-3 mr-1" />
                {data?.stats?.growth?.revenue?.value
                  ? `${
                      data.stats.growth.revenue.value > 0 ? "+" : ""
                    }${data.stats.growth.revenue.value.toFixed(1)}%`
                  : "+0%"}{" "}
                Growth
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartSkeleton />
            ) : revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    name="Revenue (₹)"
                  />
                  <Area
                    type="monotone"
                    dataKey="projects"
                    stackId="2"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                    name="Projects"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartSkeleton />
            ) : projectStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No project data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Style Popularity */}
        <Card>
          <CardHeader>
            <CardTitle>Design Style Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartSkeleton />
            ) : stylePopularityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stylePopularityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="popularity"
                    name="Popularity Score"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No style data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Projects</span>
              <Link href="/admin/projects">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
            ) : recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h4>
                          <Badge
                            className={`${getStatusColor(
                              project.status
                            )} text-white text-xs`}
                          >
                            {project.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>{project.user}</span>
                          <span>•</span>
                          <span>{project.budget}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Palette className="h-3 w-3" />
                            {project.style}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress
                        value={project.progress}
                        className="flex-1 h-2"
                      />
                      <span className="text-sm font-medium text-foreground min-w-12">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                 <Link href={`/admin/projects/${project.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    View
                  </Button>
                </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent projects
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Pending Actions */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pending Actions</span>
                <Badge variant="destructive">{pendingActions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-1">
                    <div
                      className={`w-3 h-3 rounded-full ${getPriorityColor(
                        action.priority
                      )}`}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground text-sm">
                        {action.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {action.projectId && (
                        <p className="text-xs text-muted-foreground">
                          {action.projectId}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {action.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card> */}

          {/* Top Design Styles */}
          <Card>
            <CardHeader>
              <CardTitle>Top Design Styles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 animate-pulse"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                          </div>
                        </div>
                        <div className="w-12 h-6 bg-gray-200 rounded"></div>
                      </div>
                    ))
                : data?.projectAnalytics?.projectsByStyle
                    ?.slice(0, 3)
                    .map((style, index) => (
                      <div
                        key={style.style}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {style.style}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {style.count} projects
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 text-xs"
                        >
                          +{Math.floor(Math.random() * 20) + 5}%
                        </Badge>
                      </div>
                    ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ChartSkeleton />
          ) : weeklyActivityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={weeklyActivityData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="uploads"
                  name="File Uploads"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="renders"
                  name="Renders Generated"
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="boqs"
                  name="BOQs Created"
                  fill="#ffc658"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No activity data available
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}
