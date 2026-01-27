// src/app/dashboard/payments/[paymentId]/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import {
  ArrowLeft,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCcw,
  IndianRupee,
  FileText,
  User,
  Mail,
  Calendar,
  Hash,
  Phone,
  MapPin,
  Printer,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { paymentService } from "@/services/userPayment.service";


const getStatusConfig = (status) => {
  const config = {
    PENDING: {
      label: "Pending",
      color: "text-amber-600 bg-amber-100 border-amber-200",
      icon: Clock,
    },
    PROCESSING: {
      label: "Processing",
      color: "text-blue-600 bg-blue-100 border-blue-200",
      icon: RefreshCcw,
    },
    COMPLETED: {
      label: "Completed",
      color: "text-green-600 bg-green-100 border-green-200",
      icon: CheckCircle2,
    },
    FAILED: {
      label: "Failed",
      color: "text-red-600 bg-red-100 border-red-200",
      icon: XCircle,
    },
    REFUNDED: {
      label: "Refunded",
      color: "text-purple-600 bg-purple-100 border-purple-200",
      icon: RefreshCcw,
    },
  };
  return config[status] || config.PENDING;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Invoice Template Component
const InvoiceTemplate = ({ payment }) => {
  const planAmount = payment.subtotal - (payment.addons?.reduce((sum, a) => sum + a.price, 0) || 0);

  return (
    <div
      className="p-8 bg-white text-gray-900"
      style={{
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        width: "210mm",
        minHeight: "297mm",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b-2 border-gray-300 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">HOUSPIRE</h1>
          <p className="text-gray-600">Interior Design Services</p>
          <p className="text-gray-600">support@houspire.com</p>
          <p className="text-gray-600">+91 9876543210</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">INVOICE</h2>
          <p className="text-gray-600 font-semibold">#{payment.publicId}</p>
          <p className="text-gray-600">
            Date: {formatDate(payment.paidAt || payment.createdAt)}
          </p>
          <p className="text-gray-600">
            Status: <span className="font-semibold">{payment.status}</span>
          </p>
        </div>
      </div>

      {/* Bill To and Payment Details */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-bold text-lg mb-2 border-b pb-1">Bill To:</h3>
          <p className="font-semibold text-lg">{payment.customerName}</p>
          <p className="text-gray-700">{payment.customerEmail}</p>
          {payment.customerPhone && (
            <p className="text-gray-700">{payment.customerPhone}</p>
          )}
          {payment.billingAddress && (
            <div className="mt-2">
              <p className="text-gray-700">{payment.billingAddress}</p>
              {payment.billingCity && (
                <p className="text-gray-700">
                  {payment.billingCity}, {payment.billingPostalCode}
                </p>
              )}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2 border-b pb-1">
            Payment Details:
          </h3>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Payment Method:</span>{" "}
              {payment.gateway}
            </p>
            {payment.gatewayId && (
              <p>
                <span className="font-semibold">Transaction ID:</span>{" "}
                {payment.gatewayId}
              </p>
            )}
            {payment.razorpayOrderId && (
              <p>
                <span className="font-semibold">Order ID:</span>{" "}
                {payment.razorpayOrderId}
              </p>
            )}
            {payment.receipt && (
              <p>
                <span className="font-semibold">Receipt No:</span>{" "}
                {payment.receipt}
              </p>
            )}
            <p>
              <span className="font-semibold">Payment Date:</span>{" "}
              {formatDate(payment.paidAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Project Information */}
      {payment.project && (
        <div className="mb-6 p-4 bg-gray-50 rounded border">
          <h3 className="font-bold text-lg mb-2">Project Information:</h3>
          <p>
            <span className="font-semibold">Project Title:</span>{" "}
            {payment.project.title}
          </p>
          <p>
            <span className="font-semibold">Project ID:</span>{" "}
            {payment.project.publicId}
          </p>
        </div>
      )}

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4 border-b pb-1">
          Invoice Details:
        </h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left font-semibold">
                Description
              </th>
              <th className="border border-gray-300 p-3 text-center font-semibold">
                Quantity
              </th>
              <th className="border border-gray-300 p-3 text-right font-semibold">
                Unit Price
              </th>
              <th className="border border-gray-300 p-3 text-right font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Plan */}
            <tr>
              <td className="border border-gray-300 p-3">
                <div className="font-semibold">
                  {payment.plan?.name || "Essential Plan"}
                </div>
                <div className="text-sm text-gray-600">
                  Interior design service package
                </div>
              </td>
              <td className="border border-gray-300 p-3 text-center">1</td>
              <td className="border border-gray-300 p-3 text-right">
                {formatCurrency(planAmount)}
              </td>
              <td className="border border-gray-300 p-3 text-right">
                {formatCurrency(planAmount)}
              </td>
            </tr>

            {/* Addons */}
            {payment.addons?.map((addon, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-3">
                  <div className="font-semibold">{addon.addon.name}</div>
                  <div className="text-sm text-gray-600">
                    Additional service
                  </div>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  {addon.quantity}
                </td>
                <td className="border border-gray-300 p-3 text-right">
                  {formatCurrency(addon.price / addon.quantity)}
                </td>
                <td className="border border-gray-300 p-3 text-right">
                  {formatCurrency(addon.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="ml-auto w-80">
        <div className="space-y-3 border border-gray-300 p-4 rounded">
          <div className="flex justify-between text-lg">
            <span className="font-semibold">Subtotal:</span>
            <span>{formatCurrency(payment.subtotal)}</span>
          </div>

          {payment.taxAmount > 0 && (
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Tax:</span>
              <span>{formatCurrency(payment.taxAmount)}</span>
            </div>
          )}

          {payment.discount > 0 && (
            <div className="flex justify-between text-lg text-green-600">
              <span className="font-semibold">Discount:</span>
              <span>-{formatCurrency(payment.discount)}</span>
            </div>
          )}

          <div className="border-t border-gray-300 pt-3 mt-2">
            <div className="flex justify-between text-xl font-bold">
              <span>Total Amount:</span>
              <span>{formatCurrency(payment.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-gray-600">
        <p className="text-xs text-gray-500">
          This is a computer-generated invoice and does not require a physical
          signature.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Invoice generated on: {formatDate(new Date().toISOString())}
        </p>
      </div>
    </div>
  );
};

// Main Component
export default function PaymentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: payment ? `invoice-${payment.publicId}` : "invoice",
    onAfterPrint: () => console.log("Printed PDF successfully!"),
  });

  const loadPayment = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await paymentService.getPayment(params.paymentId);

      if (response.success) {
        setPayment(response.data);
      } else {
        throw new Error(response.message || "Failed to load payment details");
      }
    } catch (error) {
      console.error("Failed to fetch payment:", error);
      setError(error.message || "Failed to load payment details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.paymentId) {
      loadPayment();
    }
  }, [params.paymentId]);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    // You can replace this with a toast notification
    alert("Copied to clipboard!");
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-8 w-8 rounded" />
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Payment</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">{error}</p>
          <div className="flex gap-4">
            <Button onClick={loadPayment} variant="outline">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => router.push("/dashboard/payments")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Payments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Payment not found state
  if (!payment) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Payment Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The payment you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push("/dashboard/payments")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payments
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(payment.status);
  const StatusIcon = statusConfig.icon;

  // Calculate plan amount (subtotal minus addons)
  const planAmount = payment.subtotal - (payment.addons?.reduce((sum, a) => sum + a.price, 0) || 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/payments")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Payments
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Payment Details
            </h1>
            <p className="text-muted-foreground">
              Payment ID: {payment.publicId}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {payment.status === "COMPLETED" && (
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Printer className="w-4 h-4" />
              Download Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Summary Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Summary
                </CardTitle>
                <CardDescription>
                  Complete breakdown of your payment
                </CardDescription>
              </div>
              <Badge variant="outline" className={statusConfig.color}>
                <StatusIcon className="w-4 h-4 mr-1" />
                {statusConfig.label}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Amount Paid
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(payment.totalAmount, payment.currency)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Payment Date</p>
                  <p className="font-semibold">
                    {payment.paidAt ? formatDate(payment.paidAt) : "N/A"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Price Breakdown</h4>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Plan ({payment.plan?.name || "Service"})
                  </span>
                  <span>{formatCurrency(planAmount)}</span>
                </div>

                {payment.addons?.map((addon, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {addon.addon.name}{" "}
                      {addon.quantity > 1 ? `(×${addon.quantity})` : ""}
                    </span>
                    <span>{formatCurrency(addon.price)}</span>
                  </div>
                ))}

                {payment.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(payment.taxAmount)}</span>
                  </div>
                )}

                {payment.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(payment.discount)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>{formatCurrency(payment.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method & Details</CardTitle>
              <CardDescription>
                Transaction information and gateway details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Payment Gateway
                    </p>
                    <p className="text-foreground font-semibold">
                      {payment.gateway}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Transaction ID
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-foreground font-mono text-xs">
                        {payment.gatewayId || "N/A"}
                      </p>
                      {payment.gatewayId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(payment.gatewayId)}
                        >
                          <Hash className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Order ID
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-foreground font-mono text-xs">
                        {payment.razorpayOrderId || "N/A"}
                      </p>
                      {payment.razorpayOrderId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() =>
                            copyToClipboard(payment.razorpayOrderId)
                          }
                        >
                          <Hash className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Receipt Number
                    </p>
                    <p className="text-foreground">
                      {payment.receipt || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {payment.gatewayData && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Gateway Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {payment.gatewayData.bank && (
                        <div>
                          <p className="font-medium text-muted-foreground">
                            Bank
                          </p>
                          <p className="text-foreground">
                            {payment.gatewayData.bank}
                          </p>
                        </div>
                      )}
                      {payment.gatewayData.method && (
                        <div>
                          <p className="font-medium text-muted-foreground">
                            Payment Method
                          </p>
                          <p className="text-foreground capitalize">
                            {payment.gatewayData.method}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {payment.errorMessage && (
                <>
                  <Separator />
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <p className="font-medium text-red-800">Error Message</p>
                    <p className="text-red-700 text-sm">
                      {payment.errorMessage}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {payment.customerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.customerEmail}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {payment.customerPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{payment.customerPhone}</span>
                  </div>
                )}

                {payment.billingAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Billing Address:</p>
                      <p className="text-muted-foreground">
                        {payment.billingAddress}
                      </p>
                      {payment.billingCity && (
                        <p className="text-muted-foreground">
                          {payment.billingCity}, {payment.billingPostalCode}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Payment Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Created</p>
                  <p className="text-muted-foreground">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
              </div>

              {payment.paidAt && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="font-medium text-foreground">Paid</p>
                    <p className="text-muted-foreground">
                      {formatDate(payment.paidAt)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <RefreshCcw className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Last Updated</p>
                  <p className="text-muted-foreground">
                    {formatDate(payment.updatedAt)}
                  </p>
                </div>
              </div>

              {payment.attempts > 1 && (
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="font-medium text-foreground">Attempts</p>
                    <p className="text-muted-foreground">
                      {payment.attempts} attempt{payment.attempts > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Information */}
          {payment.project && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {payment.project.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID: {payment.project.publicId}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() =>
                    router.push(
                      `/dashboard/projects/${payment.project.publicId}`
                    )
                  }
                >
                  View Project Details
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payment.status === "COMPLETED" && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  onClick={handlePrint}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => copyToClipboard(payment.publicId)}
              >
                <Hash className="w-4 h-4 mr-2" />
                Copy Payment ID
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => router.push("/dashboard/support/new")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Get Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden Invoice Template for PDF */}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <InvoiceTemplate payment={payment} />
        </div>
      </div>
    </div>
  );
}