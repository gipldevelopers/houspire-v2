"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/axios";
import Pagination from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  // Search and filters
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    action: "ALL",
    resourceType: "ALL",
    userType: "ALL",
    status: "ALL",
  });
  
  // Date range filters
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // API call to fetch logs
  const fetchLogs = async (page = pagination.page, newFilters = filters, newLimit = pagination.limit) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: newLimit,
        search,
        action: newFilters.action !== "ALL" ? newFilters.action : undefined,
        resourceType: newFilters.resourceType !== "ALL" ? newFilters.resourceType : undefined,
        userType: newFilters.userType !== "ALL" ? newFilters.userType : undefined,
        status: newFilters.status !== "ALL" ? newFilters.status : undefined,
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
      };

      // Remove undefined parameters
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const { data } = await api.get("/audit-logs", { params });

      setLogs(data.logs || []);
      setPagination({
        page: data.page || page,
        limit: newLimit,
        total: data.total || 0,
        totalPages: data.totalPages || Math.ceil((data.total || 0) / newLimit),
      });
    } catch (err) {
      toast.error("Failed to fetch audit logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    const timeoutId = setTimeout(() => {
      fetchLogs(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchLogs(1, newFilters);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchLogs(newPage);
  };

  const handleItemsPerPageChange = (newLimit) => {
    setPagination(prev => ({
      ...prev,
      limit: newLimit,
      page: 1
    }));
    fetchLogs(1, filters, newLimit);
  };

  const handleExport = () => {
    toast.success("Export started", {
      description:
        "Audit logs export has been initiated. You will receive an email when it's ready.",
    });
  };

  const getActionVariant = (action) => {
    const variants = {
      CREATE: "default",
      UPDATE: "secondary",
      DELETE: "destructive",
      LOGIN: "outline",
      LOGOUT: "outline",
      PASSWORD_RESET: "default",
      PROFILE_UPDATE: "secondary",
      PAYMENT_INITIATED: "default",
      PAYMENT_COMPLETED: "default",
      PAYMENT_ORDER_FAILED: "destructive",
      PAYMENT_VERIFICATION_FAILED: "destructive",
      FILE_UPLOADED: "default",
      FILE_UPLOAD_ERROR: "destructive",
      FILE_DELETED: "secondary",
      VALIDATION_ERROR: "destructive",
    };
    return variants[action] || "default";
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: "bg-green-100 text-green-800 border-green-200",
      UPDATE: "bg-blue-100 text-blue-800 border-blue-200",
      DELETE: "bg-red-100 text-red-800 border-red-200",
      LOGIN: "bg-emerald-100 text-emerald-800 border-emerald-200",
      LOGOUT: "bg-gray-100 text-gray-800 border-gray-200",
      PASSWORD_RESET: "bg-amber-100 text-amber-800 border-amber-200",
      PROFILE_UPDATE: "bg-purple-100 text-purple-800 border-purple-200",
      PAYMENT_INITIATED: "bg-green-100 text-green-800 border-green-200",
      PAYMENT_COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
      PAYMENT_ORDER_FAILED: "bg-red-100 text-red-800 border-red-200",
      PAYMENT_VERIFICATION_FAILED: "bg-red-100 text-red-800 border-red-200",
      FILE_UPLOADED: "bg-green-100 text-green-800 border-green-200",
      FILE_UPLOAD_ERROR: "bg-red-100 text-red-800 border-red-200",
      FILE_DELETED: "bg-orange-100 text-orange-800 border-orange-200",
      VALIDATION_ERROR: "bg-red-100 text-red-800 border-red-200",
      VALIDATION_FAILED: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[action] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "ERROR":
      case "FAILURE":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "CRITICAL":
        return <AlertCircle className="w-4 h-4 text-red-700" />;
      case "WARNING":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800 border-green-200";
      case "ERROR":
      case "FAILURE":
        return "bg-red-100 text-red-800 border-red-200";
      case "CRITICAL":
        return "bg-red-200 text-red-900 border-red-300";
      case "WARNING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Track and monitor all system activities and user actions
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="text-lg">Filters</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Filter logs by different criteria</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by action, resource, user, or ID..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Action Filter */}
            <Select
              value={filters.action}
              onValueChange={(value) => handleFilterChange("action", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="LOGOUT">Logout</SelectItem>
                <SelectItem value="PASSWORD_RESET">Password Reset</SelectItem>
                <SelectItem value="PROFILE_UPDATE">Profile Update</SelectItem>
                <SelectItem value="PAYMENT_INITIATED">Payment Initiated</SelectItem>
                <SelectItem value="PAYMENT_COMPLETED">Payment Completed</SelectItem>
                <SelectItem value="PAYMENT_ORDER_FAILED">Payment Order Failed</SelectItem>
                <SelectItem value="PAYMENT_VERIFICATION_FAILED">Payment Verification Failed</SelectItem>
                <SelectItem value="PAYMENT_WEBHOOK_RECEIVED">Payment Webhook</SelectItem>
                <SelectItem value="FILE_UPLOADED">File Uploaded</SelectItem>
                <SelectItem value="FILE_UPLOAD_ERROR">File Upload Error</SelectItem>
                <SelectItem value="FILE_DELETED">File Deleted</SelectItem>
                <SelectItem value="VALIDATION_ERROR">Validation Error</SelectItem>
                <SelectItem value="VALIDATION_FAILED">Validation Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Resource Type Filter */}
            <Select
              value={filters.resourceType}
              onValueChange={(value) =>
                handleFilterChange("resourceType", value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Resource Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Resources</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="PROJECT">Project</SelectItem>
                <SelectItem value="PAYMENT">Payment</SelectItem>
                <SelectItem value="RENDER">Render</SelectItem>
                <SelectItem value="BOQ">BOQ</SelectItem>
                <SelectItem value="VENDOR">Vendor</SelectItem>
                <SelectItem value="STYLE">Style</SelectItem>
                <SelectItem value="PLAN">Plan</SelectItem>
                <SelectItem value="ADDON">Addon</SelectItem>
                <SelectItem value="SUPPORT_TICKET">Support Ticket</SelectItem>
                <SelectItem value="COUPON">Coupon</SelectItem>
              </SelectContent>
            </Select>

            {/* User Type Filter */}
            <Select
              value={filters.userType}
              onValueChange={(value) => handleFilterChange("userType", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Performed By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Users</SelectItem>
                <SelectItem value="USER">Regular Users</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="WARNING">Warning</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Date Range:</span>
            </div>
            <Input
              type="date"
              placeholder="Start Date"
              value={dateRange.startDate}
              onChange={(e) => {
                setDateRange({ ...dateRange, startDate: e.target.value });
                setTimeout(() => fetchLogs(1), 300);
              }}
              className="w-[180px]"
            />
            <Input
              type="date"
              placeholder="End Date"
              value={dateRange.endDate}
              onChange={(e) => {
                setDateRange({ ...dateRange, endDate: e.target.value });
                setTimeout(() => fetchLogs(1), 300);
              }}
              className="w-[180px]"
            />
            {(dateRange.startDate || dateRange.endDate) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDateRange({ startDate: "", endDate: "" });
                  fetchLogs(1);
                }}
              >
                Clear Dates
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              {pagination.total} log(s) found • Page {pagination.page} of{" "}
              {pagination.totalPages}
            </CardDescription>
          </div>
          <Button
            onClick={() => fetchLogs(pagination.page)}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCcw
              className={cn("w-4 h-4 mr-2", loading && "animate-spin")}
            />
            Refresh
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        No audit logs found.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => {
                    const hasError = log.status === "ERROR" || log.status === "CRITICAL";
                    const errorDetails = log.details?.error || null;
                    const isValidationError = log.action === "VALIDATION_FAILED";
                    const validationErrors = log.details?.errors || null;
                    
                    // Display status - show "FAILURE" for validation errors with ERROR status
                    const displayStatus = (isValidationError && log.status === "ERROR") ? "FAILURE" : log.status || "INFO";
                    
                    return (
                      <TableRow 
                        key={log.publicId} 
                        className={cn(
                          "hover:bg-muted/50",
                          hasError && "bg-red-50/50"
                        )}
                      >
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("text-xs flex items-center gap-1", getStatusColor(displayStatus))}
                          >
                            {getStatusIcon(displayStatus)}
                            {displayStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getActionVariant(log.action)}
                            className={cn("text-xs", getActionColor(log.action))}
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{log.resourceType}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            ID: {log.resourceId}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {log.user ? log.user.name : log.admin ? log.admin.name : "System"}
                          </div>
                          {(log.user || log.admin) && (
                            <div className="text-xs text-muted-foreground">
                              {log.user ? log.user.email : log.admin?.email}
                            </div>
                          )}
                          {/* {log.user && (
                            <div className="text-xs text-muted-foreground font-mono2">
                              ID: {log.user.id}
                            </div>
                          )} */}
                          {log.admin && (
                            <div className="text-xs text-muted-foreground font-mono">
                              ID: {log.admin.id}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.details ? (
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setExpanded(
                                    expanded === log.publicId ? null : log.publicId
                                  )
                                }
                              >
                                {expanded === log.publicId ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                              {hasError && errorDetails && !isValidationError && (
                                <Alert className="mt-2 border-red-200 bg-red-50">
                                  <AlertCircle className="h-4 w-4 text-red-600" />
                                  <AlertDescription className="text-xs text-red-800">
                                    {errorDetails.message || "An error occurred"}
                                  </AlertDescription>
                                </Alert>
                              )}
                              {isValidationError && validationErrors && (
                                <Alert className="mt-2 border-red-200 bg-red-50">
                                  <AlertCircle className="h-4 w-4 text-red-600" />
                                  <AlertDescription className="text-xs text-red-800">
                                    {validationErrors.length} validation error(s)
                                  </AlertDescription>
                                </Alert>
                              )}
                              {expanded === log.publicId && log.details && (
                                <div className="mt-2 space-y-3">
                                  {/* Validation Error Format */}
                                  {isValidationError && (
                                    <div className="space-y-2">
                                      <div className="text-sm font-semibold mb-2">Validation Error Details</div>
                                      <div className="bg-muted p-3 rounded">
                                        <div className="text-xs space-y-1">
                                          <div><strong>path:</strong> {log.details.path || "N/A"}</div>
                                          <div className="mt-2">
                                            <strong>errors:</strong>
                                            <pre className="mt-1 bg-background p-2 rounded border text-xs overflow-auto">
                                              {JSON.stringify(validationErrors || [], null, 2)}
                                            </pre>
                                          </div>
                                        </div>
                                      </div>
                                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                                        <div className="mt-2">
                                          <strong className="text-xs">Metadata:</strong>
                                          <pre className="bg-muted p-2 rounded mt-1 overflow-auto max-h-48 text-xs">
                                            {JSON.stringify(log.metadata, null, 2)}
                                          </pre>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Regular Error Format */}
                                  {!isValidationError && hasError && errorDetails && (
                                    <Alert className="border-red-200 bg-red-50">
                                      <AlertCircle className="h-4 w-4 text-red-600" />
                                      <AlertDescription>
                                        <div className="text-sm font-semibold text-red-800 mb-1">
                                          Error Details
                                        </div>
                                        <div className="text-xs text-red-700">
                                          <div><strong>Message:</strong> {errorDetails.message}</div>
                                          {errorDetails.code && (
                                            <div><strong>Code:</strong> {errorDetails.code}</div>
                                          )}
                                          {errorDetails.statusCode && (
                                            <div><strong>Status Code:</strong> {errorDetails.statusCode}</div>
                                          )}
                                          {errorDetails.validationErrors && (
                                            <div className="mt-2">
                                              <strong>Validation Errors:</strong>
                                              <ul className="list-disc list-inside mt-1">
                                                {errorDetails.validationErrors.map((err, idx) => (
                                                  <li key={idx}>
                                                    {err.field}: {err.message}
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                  
                                  {/* Full Details JSON (for non-validation errors or when needed) */}
                                  {!isValidationError && (
                                    <>
                                      <div className="text-xs font-semibold mb-1">Full Details:</div>
                                      <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-96">
                                        {JSON.stringify(log.details, null, 2)}
                                      </pre>
                                    </>
                                  )}
                                  
                                  {/* Metadata for non-validation errors */}
                                  {!isValidationError && log.metadata && Object.keys(log.metadata).length > 0 && (
                                    <div className="text-xs text-muted-foreground mt-2">
                                      <strong>Metadata:</strong>
                                      <pre className="bg-muted p-2 rounded mt-1 overflow-auto max-h-48">
                                        {JSON.stringify(log.metadata, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            "No details"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              className="mt-6"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}