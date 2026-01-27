"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Edit,
  FileText,
  IndianRupee,
  Building,
  User,
  Calendar,
  Printer,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import api from "@/lib/axios";
import { downloadBOQAsPDF, downloadBOQAsPDFWithText } from "@/utils/pdfUtils";

const CategorySection = ({ category, items, categoryIndex }) => {
  const categoryLetter = String.fromCharCode(65 + categoryIndex);

  return (
    <div className="mb-6">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-3 p-3 bg-muted/30 rounded-lg">
        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
          {categoryLetter}
        </div>
        <h3 className="text-lg font-semibold text-foreground">{category}</h3>
      </div>
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-3 p-3 bg-muted/50 border border-border rounded-t-lg font-semibold text-foreground text-sm mb-2">
        <div className="col-span-1">S.no</div>
        <div className="col-span-5">Description</div>
        <div className="col-span-2">Unit</div>
        <div className="col-span-2">Qty</div>
        <div className="col-span-1">Rate</div>
        <div className="col-span-1">Amount</div>
      </div>

      {/* Items Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        {items.map((item, itemIndex) => (
          <div
            key={item.publicId || item.id}
            className="grid grid-cols-12 gap-3 p-3 border-b border-border hover:bg-muted/5 transition-colors"
          >
            <div className="col-span-1 text-sm text-muted-foreground font-medium">
              {categoryLetter}.{itemIndex + 1}
            </div>
            <div className="col-span-5 text-sm text-foreground">
              {item.customName || item.description || "No description"}
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">
              {item.customUnit || item.unit || "unit"}
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">
              {Number(item.quantity || 0).toLocaleString("en-IN")}
            </div>
            <div className="col-span-1 text-sm text-muted-foreground">
              ₹{Number(item.rate || 0).toLocaleString("en-IN")}
            </div>
            <div className="col-span-1 text-sm font-semibold text-foreground">
              ₹{Number(item.amount || 0).toLocaleString("en-IN")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ViewBOQPage() {
  const params = useParams();
  const router = useRouter();
  const [boq, setBoq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    if (params.boqId) {
      loadBOQ();
    }
  }, [params.boqId]);

  const loadBOQ = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/boq/${params.boqId}`);

      if (response.data.success) {
        setBoq(response.data.data);
      } else {
        toast.error("Failed to load BOQ", {
          description: response.data.message || "Failed to load BOQ data",
        });
      }
    } catch (error) {
      console.error("Error loading BOQ:", error);
      toast.error("Failed to load BOQ", {
        description: error.response?.data?.message || "Network error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePrint = () => window.print();

  // In your ViewBOQPage component, replace the handleDownloadPDF function:

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPDF(true);
      const filename = `BOQ-${transformedBOQ?.projectId || "document"}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      // Use the new PDF library
      await downloadBOQAsPDF(transformedBOQ, filename);

      toast.success("PDF Downloaded", {
        description: "BOQ has been downloaded as PDF",
      });
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Download Failed", {
        description: "Failed to download PDF. Please try again.",
      });
    } finally {
      setDownloadingPDF(false);
    }
  };
  // Transform API data to match component structure
  const transformBOQData = (apiData) => {
    if (!apiData) return null;

    // Group items by category
    const categories = {};
    apiData.boqCategoryItems?.forEach((item) => {
      const categoryName = item.category?.name || "Uncategorized";
      if (!categories[categoryName]) {
        categories[categoryName] = [];
      }
      categories[categoryName].push({
        ...item,
        id: item.publicId,
        description: item.customName || item.item?.name,
        unit: item.customUnit || item.item?.unit,
        quantity: Number(item.quantity) || 0,
        rate: Number(item.rate) || 0,
        amount: Number(item.amount) || 0,
      });
    });

    return {
      id: apiData.publicId,
      publicId: apiData.publicId,
      userId: apiData.project?.user?.publicId,
      user: {
        name: apiData.project?.user?.name || "N/A",
        email: apiData.project?.user?.email || "N/A",
        phone: apiData.project?.user?.phone || "N/A",
      },
      projectId: apiData.project?.publicId,
      projectTitle: apiData.project?.title || "N/A",
      title: apiData.title,
      description: apiData.description || "No description available",
      totalAmount: Number(apiData.totalAmount) || 0,
      status: apiData.status,
      isPublished: apiData.isPublished,
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt,
      categories: categories,
      _original: apiData,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!boq) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Budget not found
          </h1>
          <p className="text-muted-foreground mb-4">
            The requested BOQ could not be found.
          </p>
          <Button onClick={() => router.push("/admin/boq-management")}>
            Back to BOQ Management
          </Button>
        </div>
      </div>
    );
  }

  const transformedBOQ = transformBOQData(boq);
  const categories = Object.entries(transformedBOQ.categories || {});

  return (
    <div className="min-h-screen bg-background p-4 print:p-0">
      <div className="max-w-6xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-4 print:hidden">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/boq-management")}
            className="border-border"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="border-border"
              size="sm"
            >
              {downloadingPDF ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {downloadingPDF ? "Downloading..." : "PDF"}
            </Button>
            <Link href={`/admin/boq-management/${params.boqId}/edit`}>
              <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* PDF Content - This will be captured for PDF */}
        <div id="boq-pdf-content" ref={pdfRef}>
          <Card className="border-border shadow-lg print:shadow-none print:border-0 bg-white">
            <CardContent className="p-6 print:p-8">
              {/* Header */}
              <div className="text-center mb-6 border-b border-border pb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Budget Breakdown
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {transformedBOQ.title}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">Client</p>
                    <p className="text-muted-foreground">
                      {transformedBOQ.user.name}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Project</p>
                    <p className="text-muted-foreground">
                      {transformedBOQ.projectTitle}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Date</p>
                    <p className="text-muted-foreground">
                      {formatDate(transformedBOQ.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <Badge
                    variant={
                      transformedBOQ.status === "SENT" ||
                      transformedBOQ.status === "APPROVED"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      transformedBOQ.status === "SENT" ||
                      transformedBOQ.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }
                  >
                    {transformedBOQ.status || "DRAFT"}
                  </Badge>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-3 bg-muted/30 rounded-lg text-sm">
                <div className="text-center">
                  <Building className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-muted-foreground">Project ID</p>
                  <p className="font-semibold text-foreground">
                    {transformedBOQ.projectId}
                  </p>
                </div>
                <div className="text-center">
                  <User className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-muted-foreground">Client Email</p>
                  <p className="font-semibold text-foreground">
                    {transformedBOQ.user.email}
                  </p>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-semibold text-foreground">
                    {formatDate(transformedBOQ.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Description */}
              {transformedBOQ.description &&
                transformedBOQ.description !== "No description available" && (
                  <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    {transformedBOQ.description}
                  </div>
                )}

              {/* Categories */}
              <div className="space-y-4">
                {categories.length > 0 ? (
                  categories.map(([category, items], index) => (
                    <CategorySection
                      key={category}
                      category={category}
                      items={items}
                      categoryIndex={index}
                    />
                  ))
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3" />
                    <p>No items found in this BOQ</p>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-md font-semibold">Project Total</p>
                    <p className="text-blue-100 text-sm">
                      Inclusive of all taxes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold flex items-center gap-1">
                      <IndianRupee className="w-5 h-5" />
                      {transformedBOQ.totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
                <p>Generated by Houspire Interior Design</p>
                <p>
                  For queries: support@houspire.com | BOQ ID:{" "}
                  {transformedBOQ.publicId}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
