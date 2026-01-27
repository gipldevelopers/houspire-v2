// src/app/admin/support/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Download,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import api from "@/lib/axios";

const adminSupportAPI = {
  // ✅ Get all tickets with optional filters
  async getAllTickets(filters = {}) {
    try {
      const params = {};
      if (filters.status && filters.status !== "ALL") {
        params.status = filters.status;
      }
      if (filters.category && filters.category !== "ALL") {
        params.category = filters.category;
      }
      if (filters.priority && filters.priority !== "ALL") {
        params.priority = filters.priority;
      }
      if (filters.search && filters.search.trim() !== "") {
        params.search = filters.search.trim();
      }
      const response = await api.get("/support/admin/tickets", { params });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch tickets"
      );
    }
  },

  // ✅ Get single ticket details
  async getTicket(ticketId) {
    try {
      const response = await api.get(`/support/${ticketId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching ticket:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch ticket"
      );
    }
  },

  // ✅ Add message (supports admin messages)
  async addMessage(ticketId, message, attachments = [], isAdmin = true) {
    try {
      const response = await api.post(`/support/${ticketId}/messages`, {
        message,
        attachments,
        isAdmin,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  },

  // ✅ Update ticket status (OPEN, IN_PROGRESS, CLOSED, etc.)
  async updateTicketStatus(ticketId, status) {
    try {
      const response = await api.patch(`/support/${ticketId}/status`, {
        status,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error updating ticket status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update ticket status"
      );
    }
  },

  // ✅ Assign ticket to an admin
  async assignTicket(ticketId, adminId) {
    try {
      const response = await api.patch(`/support/admin/${ticketId}/assign`, {
        adminId,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error assigning ticket:", error);
      throw new Error(
        error.response?.data?.message || "Failed to assign ticket"
      );
    }
  },

  // ✅ Upload attachment or file
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(`/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.data.fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error(error.response?.data?.message || "Failed to upload file");
    }
  },
};

const getStatusConfig = (status) => {
  const config = {
    OPEN: {
      label: "Open",
      variant: "default",
      color: "text-blue-600 bg-blue-100 border-blue-200",
      icon: AlertCircle,
    },
    IN_PROGRESS: {
      label: "In Progress",
      variant: "secondary",
      color: "text-amber-600 bg-amber-100 border-amber-200",
      icon: Clock,
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
      icon: XCircle,
    },
  };
  return config[status] || config.OPEN;
};

const getPriorityConfig = (priority) => {
  const config = {
    LOW: {
      label: "Low",
      color: "text-gray-600 bg-gray-100",
    },
    MEDIUM: {
      label: "Medium",
      color: "text-amber-600 bg-amber-100",
    },
    HIGH: {
      label: "High",
      color: "text-orange-600 bg-orange-100",
    },
    URGENT: {
      label: "Urgent",
      color: "text-red-600 bg-red-100",
    },
  };
  return config[priority] || config.MEDIUM;
};

const getCategoryConfig = (category) => {
  const config = {
    TECHNICAL: {
      label: "Technical",
      color: "text-purple-600 bg-purple-100",
    },
    BILLING: {
      label: "Billing",
      color: "text-blue-600 bg-blue-100",
    },
    PROJECT: {
      label: "Project",
      color: "text-green-600 bg-green-100",
    },
    DESIGN: {
      label: "Design",
      color: "text-pink-600 bg-pink-100",
    },
    PAYMENT: {
      label: "Payment",
      color: "text-indigo-600 bg-indigo-100",
    },
    GENERAL: {
      label: "General",
      color: "text-gray-600 bg-gray-100",
    },
  };
  return config[category] || config.GENERAL;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return formatDate(dateString);
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function AdminSupportPage() {
  const router = useRouter();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "ALL",
    category: "ALL",
    priority: "ALL",
    search: "",
  });
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await adminSupportAPI.getAllTickets(filters);
      setTickets(data.tickets || data);

      // Calculate stats
      if (data.tickets) {
        const ticketList = data.tickets;
        setStats({
          total: ticketList.length,
          open: ticketList.filter((t) => t.status === "OPEN").length,
          inProgress: ticketList.filter((t) => t.status === "IN_PROGRESS")
            .length,
          resolved: ticketList.filter((t) => t.status === "RESOLVED").length,
          closed: ticketList.filter((t) => t.status === "CLOSED").length,
        });
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const adminList = await adminSupportAPI.getAdmins();
      setAdmins(adminList);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    }
  };

  const handleAssignTicket = async (ticketId, adminId) => {
    try {
      await adminSupportAPI.assignTicket(ticketId, adminId);
      await fetchTickets(); // Refresh the list

      toast.success("Ticket assignment updated");
    } catch (error) {
      console.error("Failed to assign ticket:", error);
      toast({
        title: "Error",
        description: "Failed to assign ticket",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const exportTickets = () => {
    // Implement export functionality
    toast.success("Export functionality not implemented yet");
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Support Tickets
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and respond to customer support tickets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportTickets}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.inProgress}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <XCircle className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.closed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-10"
                  value={filters.search}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-[140px]">
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

              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="w-[140px]">
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

              <Select
                value={filters.priority}
                onValueChange={(value) => handleFilterChange("priority", value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    status: "ALL",
                    category: "ALL",
                    priority: "ALL",
                    search: "",
                  })
                }
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Support Tickets</CardTitle>
          <CardDescription>{tickets.length} tickets found</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead>Assigned To</TableHead> */}
                {/* <TableHead>Last Updated</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => {
                const statusConfig = getStatusConfig(ticket.status);
                const priorityConfig = getPriorityConfig(ticket.priority);
                const categoryConfig = getCategoryConfig(ticket.category);

                return (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      router.push(`/admin/support-tickets/${ticket.publicId}`)
                    }
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">
                          {ticket.title}
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {ticket.publicId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {getInitials(ticket.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {ticket.user.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {ticket.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={categoryConfig.color}>
                        {categoryConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityConfig.color}>
                        {priorityConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>
                      {ticket.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                              {getInitials(ticket.assignedTo.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {ticket.assignedTo.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Unassigned
                        </span>
                      )}
                    </TableCell> */}
                    {/* <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatTimeAgo(ticket.updatedAt)}
                      </div>
                    </TableCell> */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/admin/support-tickets/${ticket.publicId}`
                              );
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          {/* 
                          <DropdownMenuSeparator />

                      

                          <DropdownMenuSeparator /> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {tickets.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tickets found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
