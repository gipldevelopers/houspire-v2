// src\components\admin\boq\AdminBOQTable.js
"use client";

import {
  Eye,
  Edit,
  Trash2,
  FileText,
  User,
  IndianRupee,
  Copy,
  Send,
  Undo,
  Loader2, // ✅ add this
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { toast } from "sonner";

const BOQTableRow = ({
  boq,
  sendingId, // ✅ add this
  onDelete,
  onSendToClient,
  onRevokeBOQ,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCopyProjectId = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(boq.projectId);
    toast.success("Copied!", {
      description: `${boq.projectId}  copied to clipboard`,
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        color: "bg-amber-100 text-amber-800 border-amber-200",
      },
      sent: {
        label: "Sent to Client",
        color: "bg-green-100 text-green-800 border-green-200",
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(boq.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 border-b border-border hover:bg-muted/50 transition-colors">
      {/* Project ID - First Column */}
      <div className="lg:col-span-2">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
              <div className="text-xs text-muted-foreground">
                <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{boq.displayId}</span>
              </div>
          </div>
          {/* <div className="text-xs text-muted-foreground">
            Created {formatDate(boq.createdAt)}
          </div> */}
        </div>
      </div>

      {/* BOQ & User Info */}
      <div className="lg:col-span-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm line-clamp-1">
              {boq.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {boq.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                <span>{boq.user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="lg:col-span-2">
        <div className="space-y-2">
          <span className="text-sm text-foreground line-clamp-3">
            {boq.projectTitle}
          </span>
          <div className="text-xs text-muted-foreground">
            {boq.items.length} items
          </div>
        </div>
      </div>

      {/* Financial Info */}
      <div className="lg:col-span-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-3 h-3 text-green-600" />
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(boq.totalAmount)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated {formatDate(boq.updatedAt)}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="lg:col-span-1 ">
        <Badge variant="outline" className={`text-xs ${statusConfig.color}`}>
          {statusConfig.label}
        </Badge>
      </div>

      {/* Actions */}
      <div className="lg:col-span-2 ">
        <div className="flex items-center justify-end gap-1">
          {/* View Button */}
          <Link href={`/admin/boq-management/${boq.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0  bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
              title="View BOQ"
            >
              <Eye className="w-3 h-3" />
            </Button>
          </Link>

          {/* Edit Button */}
          <Link href={`/admin/boq-management/${boq.id}/edit`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200"
              title="Edit BOQ"
            >
              <Edit className="w-3 h-3" />
            </Button>
          </Link>

          {/* Send to Client Button - Only show for pending status */}
          {boq.status !== "sent" && (
            <Button
              variant="ghost"
              size="sm"
              disabled={sendingId === boq.id} // ✅ disable while sending
              onClick={() => onSendToClient(boq.id)}
              className="h-8 w-8 p-0 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200"
              title="Send to Client"
            >
              {sendingId === boq.id ? (
                <Loader2 className="w-3 h-3 animate-spin" /> // ✅ loader icon
              ) : (
                <Send className="w-3 h-3" />
              )}
            </Button>
          )}

          {/* Revoke Button - Only show for sent status */}
          {boq.status === "sent" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRevokeBOQ(boq.id)}
              className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
              title="Revoke BOQ"
            >
              <Undo className="w-3 h-3" />
            </Button>
          )}

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(boq.id)}
            className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
            title="Delete BOQ"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const BOQTableSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 border-b border-border"
        >
          <div className="lg:col-span-2 space-y-2">
            <Skeleton className="h-4 w-24 bg-muted" />
            <Skeleton className="h-6 w-20 bg-muted" />
            <Skeleton className="h-3 w-16 bg-muted" />
          </div>
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 bg-muted" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-3 w-full bg-muted" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-2">
            <Skeleton className="h-4 w-2/3 bg-muted" />
            <Skeleton className="h-3 w-1/2 bg-muted" />
          </div>
          <div className="lg:col-span-2 space-y-2">
            <Skeleton className="h-4 w-3/4 bg-muted" />
            <Skeleton className="h-3 w-1/2 bg-muted" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-6 w-20 bg-muted" />
          </div>
          <div className="lg:col-span-2">
            <div className="flex gap-1">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-8 w-8 bg-muted" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// const EmptyState = () => {
//   return (
//     <Card className="border-border">
//       <CardContent className="p-12 text-center">
//         <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
//         <h3 className="text-lg font-semibold text-foreground mb-2">
//           No BOQs Found
//         </h3>
//         <p className="text-muted-foreground">
//           No BOQs have been created yet. Create the first BOQ to get started.
//         </p>
//       </CardContent>
//     </Card>
//   );
// };

export default function AdminBOQTable({
  boqs,
  loading,
  onEdit,
  onDelete,
  onView,
  onSendToClient,
  onRevokeBOQ,
}) {
  // Sort BOQs in descending order (newest first)
  const sortedBOQs = [...boqs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (loading) {
    return (
      <Card className="border-border">
        <CardContent className="p-0">
          <BOQTableSkeleton />
        </CardContent>
      </Card>
    );
  }

  // if (boqs.length === 0) {
  //   return <EmptyState />;
  // }

  return (
    <Card className="border-border">
      <CardContent className="p-0">
        {/* Table Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 border-b border-border bg-muted/50">
          <div className="lg:col-span-2">
            <span className="text-sm font-semibold text-foreground">
              Project ID
            </span>
          </div>
          <div className="lg:col-span-3">
            <span className="text-sm font-semibold text-foreground">
              BOQ & Client
            </span>
          </div>
          <div className="lg:col-span-2">
            <span className="text-sm font-semibold text-foreground">
              Project
            </span>
          </div>
          <div className="lg:col-span-2">
            <span className="text-sm font-semibold text-foreground">
              Financial
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="text-sm font-semibold text-foreground">
              Status
            </span>
          </div>
          <div className="lg:col-span-2">
            <span className="text-sm font-semibold text-foreground">
              Actions
            </span>
          </div>
        </div>

        {/* Table Rows */}
        {sortedBOQs.map((boq) => (
          <BOQTableRow
            key={boq.id}
            boq={boq}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onSendToClient={onSendToClient}
            onRevokeBOQ={onRevokeBOQ}
          />
        ))}
      </CardContent>
    </Card>
  );
}
