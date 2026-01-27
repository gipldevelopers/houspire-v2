// src/app/dashboard/boq/[boqId]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Download, FileText, IndianRupee, ArrowLeft, Printer,
  Calendar, Building, Home, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { boqService } from '@/services/boq.service';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function BOQDetailPage() {
  const params = useParams();
  const boqId = params.boqId;
  
  const [boq, setBoq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBOQ();
  }, [boqId]);

  const loadBOQ = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await boqService.getBOQ(boqId);
      
      if (result.success) {
        setBoq(result.data);
        
        // Mark as viewed in localStorage for notifications
        const viewedBOQs = JSON.parse(localStorage.getItem('viewed_boqs') || '[]');
        if (!viewedBOQs.includes(boqId)) {
          viewedBOQs.push(boqId);
          localStorage.setItem('viewed_boqs', JSON.stringify(viewedBOQs));
        }
      } else {
        setError(result.message || 'Failed to load BOQ');
        toast.error(result.message || 'BOQ not available');
      }
    } catch (error) {
      console.error('Error loading BOQ:', error);
      setError('Failed to load BOQ');
      toast.error('Failed to load BOQ');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'INR') => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    if (!number && number !== 0) return '-';
    return new Intl.NumberFormat('en-IN').format(number);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadPDF = () => {
    toast.success('Download Started', {
      description: 'BOQ PDF download has been initiated'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <BOQDetailSkeleton />;
  }

  if (error || !boq) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Budget Not Available</h1>
          <p className="text-muted-foreground mb-6">{error || 'The BOQ you are looking for is not available.'}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard/boq">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Budget
              </Button>
            </Link>
            <Button variant="outline" onClick={loadBOQ}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/boq">
              <Button variant="outline" size="sm" className="border-border">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to BOQs
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Budget Breakdown</h1>
              <p className="text-muted-foreground mt-2">
                Detailed cost breakdown for your project
              </p>
            </div>
          </div>
          
          {/* <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="border-border">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF} className="border-border">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div> */}
        </div>

        {/* BOQ Document */}
        <Card className="border-border print:shadow-none">
          <CardContent className="p-0">
            {/* Header Section */}
            <div className="p-8 border-b border-border">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{boq.title}</h2>
                      <p className="text-muted-foreground">BOQ ID: {boq.publicId}</p>
                    </div>
                  </div>
                  
                  {/* Project Details */}
                  {boq.project && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">Project</p>
                        <p className="text-lg font-bold text-foreground">{boq.project.title}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">Area</p>
                        <p className="text-lg font-bold text-foreground">
                          {formatNumber(boq.project.areaSqFt)} sq ft
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">Configuration</p>
                        <p className="text-lg font-bold text-foreground">
                          {boq.project.projectType?.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  {/* <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200">
                    Sent for Review
                  </Badge> */}
                  <div className="text-3xl font-bold text-foreground mt-2">
                    {formatCurrency(boq.totalAmount)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Project Cost</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created: {formatDate(boq.createdAt)}
                  </p>
                  {boq.sentAt && (
                    <p className="text-xs text-muted-foreground">
                      Sent: {formatDate(boq.sentAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* BOQ Categories */}
            <div className="p-6">
              {boq.boqCategoryItems && boq.boqCategoryItems.length > 0 ? (
                <div className="space-y-6">
                  {boq.boqCategoryItems.map((categoryItem) => (
                    <div key={categoryItem.id} className="border border-border rounded-lg overflow-hidden">
                      {/* Category Header */}
                      <div className="bg-muted/50 px-4 py-3 border-b border-border">
                        <h3 className="font-semibold text-foreground">
                          {categoryItem.category?.name || 'Uncategorized'}
                        </h3>
                      </div>
                      
                      {/* Items Table */}
                      <table className="w-full">
                        <thead className="bg-muted/30">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-foreground border-r border-border">
                              Description
                            </th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-foreground border-r border-border">
                              Unit
                            </th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-foreground border-r border-border">
                              Quantity
                            </th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-foreground border-r border-border">
                              Rate
                            </th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-foreground">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr className="hover:bg-muted/10">
                            <td className="px-4 py-3 text-sm text-foreground border-r border-border">
                              {categoryItem.customName || categoryItem.item?.name}
                              {categoryItem.customDescription && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {categoryItem.customDescription}
                                </p>
                              )}
                              {categoryItem.remarks && (
                                <p className="text-xs text-amber-600 mt-1">
                                  {categoryItem.remarks}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-muted-foreground border-r border-border">
                              {categoryItem.customUnit || categoryItem.item?.unit}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-foreground border-r border-border">
                              {formatNumber(categoryItem.quantity)}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-foreground border-r border-border">
                              {formatCurrency(categoryItem.rate)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-foreground">
                              {formatCurrency(categoryItem.amount)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
                  
                  {/* Total Row */}
                  <div className="bg-muted/50 p-4 rounded-lg border border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-foreground">Project Total</span>
                      <span className="text-2xl font-bold text-foreground">
                        {formatCurrency(boq.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Items Available</h3>
                  <p className="text-muted-foreground">
                    The BOQ details are being prepared by our team.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions Footer */}
        {/* <div className="flex justify-center gap-4 pt-6 border-t border-border">
          <Button onClick={handleDownloadPDF} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Download Complete BOQ
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/projects/${boq.projectId}`}>
              <Building className="w-4 h-4 mr-2" />
              View Project
            </Link>
          </Button>
        </div> */}
      </div>
    </div>
  );
}

// Skeleton Loader
function BOQDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-24 bg-muted" />
            <div>
              <Skeleton className="h-8 w-48 bg-muted" />
              <Skeleton className="h-4 w-64 mt-2 bg-muted" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 bg-muted" />
            <Skeleton className="h-9 w-32 bg-muted" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg">
          <div className="p-8 border-b border-border">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1 space-y-4">
                <Skeleton className="h-7 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-48 bg-muted" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-16 bg-muted rounded" />
                  <Skeleton className="h-16 bg-muted rounded" />
                  <Skeleton className="h-16 bg-muted rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-32 bg-muted" />
                <Skeleton className="h-8 w-40 bg-muted" />
                <Skeleton className="h-4 w-48 bg-muted" />
              </div>
            </div>
          </div>
          <div className="p-6">
            <Skeleton className="h-64 w-full bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}