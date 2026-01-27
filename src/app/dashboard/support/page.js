// src/app/dashboard/support/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  CreditCard,
  Hammer,
  PaintBucket,
  Zap,
  MoreVertical,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";

const getStatusConfig = (status) => {
  const config = {
    OPEN: {
      label: "Open",
      variant: "default",
      color: "text-blue-600 bg-blue-100 border-blue-200",
      icon: Clock,
    },
    IN_PROGRESS: {
      label: "In Progress",
      variant: "secondary",
      color: "text-amber-600 bg-amber-100 border-amber-200",
      icon: AlertCircle,
    },
    RESOLVED: {
      label: "Resolved",
      variant: "success",
      color: "text-green-600 bg-green-100 border-green-200",
      icon: CheckCircle2,
    },
    CLOSED: {
      label: "Closed",
      variant: "outline",
      color: "text-gray-600 bg-gray-100 border-gray-200",
      icon: CheckCircle2,
    },
  };
  return config[status] || config.OPEN;
};

const getPriorityConfig = (priority) => {
  const config = {
    LOW: {
      label: "Low",
      color: "text-gray-600 bg-gray-100",
      icon: AlertCircle,
    },
    MEDIUM: {
      label: "Medium",
      color: "text-amber-600 bg-amber-100",
      icon: AlertTriangle,
    },
    HIGH: {
      label: "High",
      color: "text-orange-600 bg-orange-100",
      icon: AlertTriangle,
    },
    URGENT: {
      label: "Urgent",
      color: "text-red-600 bg-red-100",
      icon: AlertTriangle,
    },
  };
  return config[priority] || config.MEDIUM;
};

const getCategoryConfig = (category) => {
  const config = {
    TECHNICAL: {
      label: "Technical",
      color: "text-purple-600 bg-purple-100",
      icon: Zap,
    },
    BILLING: {
      label: "Billing",
      color: "text-blue-600 bg-blue-100",
      icon: CreditCard,
    },
    PROJECT: {
      label: "Project",
      color: "text-green-600 bg-green-100",
      icon: Hammer,
    },
    DESIGN: {
      label: "Design",
      color: "text-pink-600 bg-pink-100",
      icon: PaintBucket,
    },
    PAYMENT: {
      label: "Payment",
      color: "text-indigo-600 bg-indigo-100",
      icon: CreditCard,
    },
    GENERAL: {
      label: "General",
      color: "text-gray-600 bg-gray-100",
      icon: HelpCircle,
    },
  };
  return config[category] || config.GENERAL;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

export default function SupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch tickets from API
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/support");

      // Axios response data
      const response = res.data;

      if (response.success) {
        const { tickets = [], pagination = {} } = response.data || {};
        setTickets(tickets);
        setPagination(pagination);
      } else {
        throw new Error(response.message || "Failed to load tickets");
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setError(
        error.message || "Failed to load support tickets. Please try again."
      );
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshTickets = async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
  };

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || ticket.status === statusFilter;
    const matchesCategory =
      categoryFilter === "ALL" || ticket.category === categoryFilter;
    const matchesPriority =
      priorityFilter === "ALL" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const stats = {
    open: tickets.filter((t) => t.status === "OPEN").length,
    inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter((t) => t.status === "RESOLVED").length,
    total: tickets.length,
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      const response = await api.patch(`/support/${ticketId}/status`, {
        status: "CLOSED",
      });

      if (response.data.success) {
        // Refresh tickets list
        await loadTickets();
      } else {
        throw new Error(response.data.message || "Failed to close ticket");
      }
    } catch (error) {
      console.error("Failed to close ticket:", error);
      setError(error.message || "Failed to close ticket. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading support tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Support Center</h1>
          <p className="text-muted-foreground mt-2">
            Get help with your projects, billing, and technical issues
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshTickets}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            onClick={() => router.push("/dashboard/support/new")}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Support Ticket
          </Button>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Open Tickets
                </p>
                <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  {stats.inProgress}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolved
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.resolved}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Tickets
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="TECHNICAL">Technical</SelectItem>
                  <SelectItem value="BILLING">Billing</SelectItem>
                  <SelectItem value="PROJECT">Project</SelectItem>
                  <SelectItem value="DESIGN">Design</SelectItem>
                  <SelectItem value="PAYMENT">Payment</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priority</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>
            {filteredTickets.length} ticket
            {filteredTickets.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {tickets.length === 0 ? "No tickets yet" : "No tickets found"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ||
                statusFilter !== "ALL" ||
                categoryFilter !== "ALL" ||
                priorityFilter !== "ALL"
                  ? "Try adjusting your search or filters"
                  : "Create your first support ticket to get help"}
              </p>
              {!searchTerm &&
                statusFilter === "ALL" &&
                categoryFilter === "ALL" &&
                priorityFilter === "ALL" &&
                tickets.length === 0 && (
                  <Button onClick={() => router.push("/dashboard/support/new")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Ticket
                  </Button>
                )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const statusConfig = getStatusConfig(ticket.status);
                const priorityConfig = getPriorityConfig(ticket.priority);
                const categoryConfig = getCategoryConfig(ticket.category);
                const StatusIcon = statusConfig.icon;
                const PriorityIcon = priorityConfig.icon;
                const CategoryIcon = categoryConfig.icon;

                return (
                  <Card
                    key={ticket.publicId || ticket.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Left Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge
                                variant="outline"
                                className={categoryConfig.color}
                              >
                                <CategoryIcon className="w-3 h-3 mr-1" />
                                {categoryConfig.label}
                              </Badge>
                              <Badge className={priorityConfig.color}>
                                <PriorityIcon className="w-3 h-3 mr-1" />
                                {priorityConfig.label}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={statusConfig.color}
                              >
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/support/${ticket.publicId}`
                                    )
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Ticket
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    handleCloseTicket(ticket.publicId)
                                  }
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Close Ticket
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <h3 className="font-semibold text-lg text-foreground mb-2 hover:text-primary transition-colors">
                            <Link
                              href={`/dashboard/support/${ticket.publicId}`}
                            >
                              {ticket.title}
                            </Link>
                          </h3>

                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {ticket.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>
                                {ticket._count?.messages || 0} messages
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                Created {formatDate(ticket.createdAt)}
                              </span>
                            </div>
                            {ticket.project && (
                              <Badge variant="outline" className="text-xs">
                                Project: {ticket.project.title}
                              </Badge>
                            )}
                            {ticket.assignedTo && (
                              <Badge variant="secondary" className="text-xs">
                                Assigned to: {ticket.assignedTo.name}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Right Action */}
                        <div className="flex lg:flex-col gap-2 lg:items-end">
                          <Button
                            onClick={() =>
                              router.push(
                                `/dashboard/support/${ticket.publicId}`
                              )
                            }
                            variant={
                              ticket.status === "OPEN" ? "default" : "outline"
                            }
                            size="sm"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {ticket.status === "OPEN" ? "Respond" : "View"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
