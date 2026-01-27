// src\app\admin\users\page.js
"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Mail,
  Phone,
  Shield,
  UserCheck,
  Building,
  Users,
  Download,
  PlusCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pagination from "@/components/ui/pagination";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";

const getRoleConfig = (role) => {
  const configs = {
    USER: {
      label: "Customer",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: UserCheck,
    },
    VENDOR: {
      label: "Vendor",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Building,
    },
    ADMIN: {
      label: "Admin",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: Shield,
    },
  };
  return (
    configs[role] || {
      label: role,
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: UserCheck,
    }
  );
};

const getStatusConfig = (isActive) => {
  return isActive
    ? {
        label: "Active",
        color: "bg-green-100 text-green-800 border-green-200",
        status: "active",
      }
    : {
        label: "Inactive",
        color: "bg-red-100 text-red-800 border-red-200",
        status: "inactive",
      };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");

      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        toast.error("Failed to fetch users");
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and filters, then sort newest first
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.publicId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

  // Calculate pagination
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  // Calculate statistics based on actual API data
  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    customers: users.filter((u) => u.role === "USER").length,
    vendors: users.filter((u) => u.role === "VENDOR").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  };

  const handleExportUsers = () => {
    toast.success("Export Started", {
      description: "User data export has been initiated",
    });
  };

 const handleSendEmail = (user) => {
  toast.success("Email Prepared", {
    description: `Composing email to ${user.email}`,
  });

  // Open default mail client
  window.location.href = `mailto:${user.email}`;
};

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Users Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all users and vendors
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Users Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all users and vendors
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={"/admin/users/create"}>
            <Button variant="default">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
          <CardContent className="p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Users</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {stats.active}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Customers</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">
                  {stats.customers}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Admins</p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {stats.admins}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-600 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone, or user ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-border"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Roles</option>
                <option value="USER">Customers</option>
                <option value="VENDOR">Vendors</option>
                <option value="ADMIN">Admins</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {paginatedUsers.map((user, index) => {
                  const roleConfig = getRoleConfig(user.role);
                  const statusConfig = getStatusConfig(user.isActive);
                  const RoleIcon = roleConfig.icon;
                  const serialNumber = startIndex + index + 1;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      {/* Serial Number Column */}
                      <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                        {serialNumber}
                      </td>

                      {/* User Details Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {user.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {user.name}
                              </p>
                              {user.role === "VENDOR" && (
                                <Building className="w-3 h-3 text-purple-600" />
                              )}
                              {user.role === "ADMIN" && (
                                <Shield className="w-3 h-3 text-red-600" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              ID: {user.publicId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Column */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">
                              {user.email}
                            </span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`text-xs ${roleConfig.color}`}
                        >
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {roleConfig.label}
                        </Badge>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`text-xs ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </Badge>
                        {user.emailVerifiedAt && (
                          <div className="text-xs text-green-600 mt-1">
                            Email Verified
                          </div>
                        )}
                      </td>

                      {/* Last Login Column */}
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(user.lastLoginAt)}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Button */}
                          <Link href={`/admin/users/${user.publicId}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                              title="View User"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>

                          {/* Edit Button */}
                          <Link href={`/admin/users/${user.publicId}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200"
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>

                          {/* Email Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendEmail(user)}
                            className="h-8 w-8 p-0 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200"
                            title="Send Email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          {filteredUsers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No users found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                ? "No users match your current filters. Try adjusting your search criteria."
                : "No users have been registered yet."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
              <Link href="/admin/users/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First User
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
