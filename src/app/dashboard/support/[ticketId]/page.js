// src/app/dashboard/support/[ticketId]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  User,
  Paperclip,
  Send,
  MoreVertical,
  Download,
  Copy,
  AlertCircle,
  CheckCircle2,
  Zap,
  CreditCard,
  Hammer,
  PaintBucket,
  HelpCircle,
  Calendar,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import api from "@/lib/axios";

const supportAPI = {
  // ✅ Get single ticket details
  async getTicket(ticketId) {
    try {
      const response = await api.get(`/support/${ticketId}`);
      return response.data.data;
    } catch (error) {
      console.error("❌ Failed to fetch ticket:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch ticket"
      );
    }
  },

  // ✅ Add new message to a ticket
  async addMessage(ticketId, message, attachments = []) {
    try {
      const response = await api.post(`/support/${ticketId}/messages`, {
        message,
        attachments,
      });
      return response.data.data;
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      throw new Error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  },

  // ✅ Update ticket status
  async updateTicketStatus(ticketId, status) {
    try {
      const response = await api.patch(`/support/${ticketId}/status`, {
        status,
      });
      return response.data.data;
    } catch (error) {
      console.error("❌ Failed to update ticket status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update ticket status"
      );
    }
  },

  // ✅ Close ticket
  async closeTicket(ticketId) {
    try {
      const response = await api.patch(`/support/${ticketId}/close`, {});
      return response.data.data;
    } catch (error) {
      console.error("❌ Failed to close ticket:", error);
      throw new Error(
        error.response?.data?.message || "Failed to close ticket"
      );
    }
  },

  // ✅ Close ticket
  async closeTicket(ticketId) {
    try {
      const response = await api.patch(`/support/${ticketId}/close`, {});
      return response.data.data;
    } catch (error) {
      console.error("❌ Failed to close ticket:", error);
      throw new Error(
        error.response?.data?.message || "Failed to close ticket"
      );
    }
  },

  // ✅ Upload file (attachments)
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data.data.fileUrl;
    } catch (error) {
      console.error("❌ Failed to upload file:", error);
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
      icon: AlertCircle,
    },
    HIGH: {
      label: "High",
      color: "text-orange-600 bg-orange-100",
      icon: AlertCircle,
    },
    URGENT: {
      label: "Urgent",
      color: "text-red-600 bg-red-100",
      icon: AlertCircle,
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
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

export default function TicketViewPage() {
  const params = useParams();
  const router = useRouter();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const ticketId = params.ticketId;

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const ticketData = await supportAPI.getTicket(ticketId);
      setTicket(ticketData);
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
      toast.error("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSubmitting(true);

    try {
      let attachmentUrls = [];

      // Upload files if any
      if (attachments.length > 0) {
        setUploadingFiles(true);
        const uploadPromises = attachments.map((file) =>
          supportAPI.uploadFile(file)
        );
        attachmentUrls = await Promise.all(uploadPromises);
      }

      // Send message
      await supportAPI.addMessage(ticketId, newMessage, attachmentUrls);

      // Refresh ticket data to get the new message
      await fetchTicket();

      setNewMessage("");
      setAttachments([]);

      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
      setUploadingFiles(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    // Validate file sizes (20MB max)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    const validFiles = files.filter((file) => file.size <= maxSize);

    if (validFiles.length !== files.length) {
      toast.warning("Some files exceed the 20MB limit and were not added");
    }

    setAttachments((prev) => [...prev, ...validFiles]);
    e.target.value = ""; // Reset file input
  };

  const handleCloseTicket = async () => {
    try {
      await supportAPI.closeTicket(ticketId);
      await fetchTicket(); // Refresh ticket data
      toast.success("Ticket closed successfully");
    } catch (error) {
      console.error("Failed to close ticket:", error);
      toast.error("Failed to close ticket");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await supportAPI.updateTicketStatus(ticketId, newStatus);
      await fetchTicket(); // Refresh ticket data

      toast.success("Ticket status updated successfully");
    } catch (error) {
      console.error("Failed to update ticket status:", error);
      toast.error("Failed to update ticket status");
    }
  };

  const copyTicketId = () => {
    if (ticket) {
      navigator.clipboard.writeText(ticket.publicId);
      toast.success("Ticket ID copied to clipboard");
    }
  };

  const downloadAttachment = (attachmentUrl) => {
    // Create a temporary link to download the file
    const link = document.createElement("a");
    link.href = attachmentUrl;
    link.download = attachmentUrl.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading ticket...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The ticket you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button onClick={() => router.push("/dashboard/support")}>
            Back to Tickets
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(ticket.status);
  const priorityConfig = getPriorityConfig(ticket.priority);
  const categoryConfig = getCategoryConfig(ticket.category);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/dashboard/support")}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tickets
      </Button>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">
                {ticket.title}
              </h1>
            </div>
            <p className="text-muted-foreground">
              Created by {ticket.user.name} • {formatDate(ticket.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={priorityConfig.color}>
            {priorityConfig.label} Priority
          </Badge>
          <Badge variant="outline" className={categoryConfig.color}>
            {categoryConfig.icon && (
              <categoryConfig.icon className="w-3 h-3 mr-1" />
            )}
            {categoryConfig.label}
          </Badge>
          <Badge variant="outline" className={statusConfig.color}>
            {statusConfig.icon && (
              <statusConfig.icon className="w-3 h-3 mr-1" />
            )}
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Messages */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conversation
                <Badge variant="secondary" className="ml-2">
                  {ticket.messages?.length || 0} messages
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages List */}
              <div className="max-h-[600px] overflow-y-auto p-6 space-y-6">
                {ticket.messages?.map((message, index) => (
                  <div key={message.id} className="flex gap-4">
                    {/* Avatar */}
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src="" />
                      <AvatarFallback
                        className={
                          message.senderType === "user"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }
                      >
                        {getInitials(message.senderName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {message.senderName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(message.createdAt)}
                        </span>
                        {message.senderType === "admin" && (
                          <Badge variant="outline" className="text-xs">
                            Support Team
                          </Badge>
                        )}
                      </div>

                      {/* Message Text */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-foreground whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>

                      {/* Attachments */}
                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment, attIndex) => (
                              <div
                                key={attIndex}
                                className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted/30 rounded border"
                              >
                                <Paperclip className="w-4 h-4" />
                                <span className="flex-1 truncate">
                                  {attachment.split("/").pop()}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => downloadAttachment(attachment)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ))}

                {(!ticket.messages || ticket.messages.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* New Message Form */}
              <div className="p-6">
               <form onSubmit={handleSendMessage} className="space-y-4">
  <div>
    <Textarea
      placeholder="Type your message here... Be as detailed as possible to help us resolve your issue quickly."
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      rows={4}
      className="resize-none"
      disabled={
        isSubmitting || uploadingFiles || ticket?.status === "CLOSED"
      }
    />
  </div>

  <div className="flex items-center justify-end">
    <Button
      type="submit"
      disabled={
        isSubmitting ||
        !newMessage.trim() ||
        uploadingFiles ||
        ticket?.status === "CLOSED"
      }
      className="min-w-32"
    >
      {isSubmitting ? (
        <>
          <Clock className="w-4 h-4 mr-2 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="w-4 h-4 mr-2" />
          {ticket?.status === "CLOSED" ? "Ticket Closed" : "Send Message"}
        </>
      )}
    </Button>
  </div>
</form>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Ticket Info */}
        <div className="space-y-6">
          {/* Ticket Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Status</p>
                  <Badge variant="outline" className={statusConfig.color}>
                    {statusConfig.label}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Priority</p>
                  <Badge className={priorityConfig.color}>
                    {priorityConfig.label}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Category</p>
                  <Badge variant="outline" className={categoryConfig.color}>
                    {categoryConfig.label}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">
                    Assigned To
                  </p>
                  <p className="text-foreground">
                    {ticket.assignedTo ? ticket.assignedTo.name : "Unassigned"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">
                    Created:
                  </span>
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">
                    Last Updated:
                  </span>
                  <span>{formatDate(ticket.updatedAt)}</span>
                </div>
                {ticket.resolvedAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">
                      Resolved:
                    </span>
                    <span>{formatDate(ticket.resolvedAt)}</span>
                  </div>
                )}
                {ticket.closedAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">
                      Closed:
                    </span>
                    <span>{formatDate(ticket.closedAt)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requester Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requester</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getInitials(ticket.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {ticket.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.user.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Info Card */}
          {ticket.project && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Project</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {ticket.project.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.project.publicId}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() =>
                    router.push(
                      `/dashboard/projects/${ticket.project.publicId}`
                    )
                  }
                >
                  View Project
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={copyTicketId}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Ticket ID
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
