// src/app/dashboard/projects/[projectId]/boq/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Download, FileText, IndianRupee, ArrowLeft, Printer,
  Calendar, Package, Building, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';

// Mock BOQ data in the exact format your client wants
const mockBOQ = {
  id: 1,
  publicId: 'BOQ-2025-001',
  projectId: 1,
  title: 'Budget Breakdown for Rishi & Neetu',
  totalAmount: 2270905,
  currency: 'INR',
  category: 'PREMIUM',
  status: 'SENT',
  version: 1,
  versionName: 'Final Proposal',
  isPublished: true,
  isActive: true,
  sentAt: '2024-01-28T10:00:00Z',
  viewedAt: null,
  approvedAt: null,
  createdAt: '2024-01-27T14:30:00Z',
  projectDetails: {
    totalArea: 2200,
    configuration: '3 BHK',
    location: 'My Home Apartments, Hyderabad'
  },
  categories: [
    {
      code: 'A',
      name: 'Electrical',
      items: [
        {
          code: 'A.1',
          description: 'Material',
          unit: '',
          areaQty: '',
          rate: '',
          amount: 90110
        },
        {
          code: 'A.2',
          description: 'Labour',
          unit: 'sft',
          areaQty: 940,
          rate: 70,
          amount: 65800
        }
      ]
    },
    {
      code: 'B',
      name: 'Lighting',
      items: [
        {
          code: 'B.1',
          description: 'General',
          unit: 'nos',
          areaQty: 26,
          rate: 850,
          amount: 22100
        },
        {
          code: 'B.2',
          description: 'Decorative lighting',
          unit: 'nos',
          areaQty: 8,
          rate: 5000,
          amount: 40000
        }
      ]
    },
    {
      code: 'C',
      name: 'False Ceiling',
      items: [
        {
          code: 'C.1',
          description: 'All bedrooms and common areas',
          unit: 'sft',
          areaQty: 828,
          rate: 90,
          amount: 74520
        },
        {
          code: 'C.2',
          description: 'All Bathrooms',
          unit: 'sft',
          areaQty: 111,
          rate: 85,
          amount: 9435
        }
      ]
    },
    {
      code: 'D',
      name: 'Paintwork',
      items: [
        {
          code: 'D.1',
          description: 'Walls and ceiling',
          unit: 'sft',
          areaQty: 4104,
          rate: 25,
          amount: 102600
        }
      ]
    },
    {
      code: 'E',
      name: 'Carpentry',
      items: [
        {
          code: 'E.1',
          description: 'Kitchen',
          unit: 'sft',
          areaQty: 300,
          rate: 900,
          amount: 270000
        },
        {
          code: 'E.2',
          description: 'Wardrobes',
          unit: 'sft',
          areaQty: 270,
          rate: 1100,
          amount: 297000
        },
        {
          code: 'E.3',
          description: 'Other fixed carpentry\nWall panellings, fixed cabinets, fixed furniture',
          unit: 'sft',
          areaQty: 389,
          rate: 1000,
          amount: 389000
        }
      ]
    },
    {
      code: 'F',
      name: 'Loose Furniture',
      items: [
        {
          code: 'F.1',
          description: 'Loose furniture items',
          unit: '',
          areaQty: '',
          rate: '',
          amount: 685000
        }
      ]
    },
    {
      code: 'G',
      name: 'Décor',
      items: [
        {
          code: 'G.1',
          description: 'Wall décor',
          unit: 'nos',
          areaQty: 3,
          rate: 7200,
          amount: 21600
        },
        {
          code: 'G.2',
          description: 'Table décor',
          unit: 'nos',
          areaQty: 10,
          rate: 2000,
          amount: 20000
        }
      ]
    },
    {
      code: 'H',
      name: 'Furnishings',
      items: [
        {
          code: 'H.1',
          description: 'Curtains',
          unit: 'sft',
          areaQty: 255,
          rate: 650,
          amount: 165750
        },
        {
          code: 'H.2',
          description: 'Blinds',
          unit: 'sft',
          areaQty: 133,
          rate: 700,
          amount: 93100
        },
        {
          code: 'H.3',
          description: 'Rugs',
          unit: 'nos',
          areaQty: 1,
          rate: 15000,
          amount: 15000
        }
      ]
    }
  ]
};

const statusConfig = {
  SENT: { label: 'Sent for Review', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  VIEWED: { label: 'Viewed', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  APPROVED: { label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200' },
  REJECTED: { label: 'Revisions Requested', color: 'bg-red-100 text-red-800 border-red-200' }
};

export default function UserBOQPage() {
  const params = useParams();
  const projectId = params.projectId;
  
  const [boq, setBoq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBOQ = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBoq(mockBOQ);
      setLoading(false);
    };

    loadBOQ();
  }, [projectId]);

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
    if (!dateString) return 'Not yet';
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
    return <BOQSkeleton />;
  }

  if (!boq) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">BOQ Not Available</h1>
          <p className="text-muted-foreground mb-6">The BOQ for this project is not available yet.</p>
          <Link href={`/dashboard/projects/${projectId}`}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[boq.status];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/projects/${projectId}`}>
              <Button variant="outline" size="sm" className="border-border">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Project
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Bill of Quantities</h1>
              <p className="text-muted-foreground mt-2">
                Detailed cost breakdown for your project
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="border-border">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF} className="border-border">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">Total Area</p>
                      <p className="text-lg font-bold text-foreground">{formatNumber(boq.projectDetails.totalArea)} sft</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">Configuration</p>
                      <p className="text-lg font-bold text-foreground">{boq.projectDetails.configuration}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-lg font-bold text-foreground">{boq.projectDetails.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className={statusInfo.color}>
                    {statusInfo.label}
                  </Badge>
                  <div className="text-3xl font-bold text-foreground mt-2">
                    {formatCurrency(boq.totalAmount)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Project Cost</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sent: {formatDate(boq.sentAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* BOQ Table */}
            <div className="p-6">
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-r border-border">S.no</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-r border-border">Description</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-foreground border-r border-border">Unit</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-foreground border-r border-border">Area, Qty</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-foreground border-r border-border">Rate</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {boq.categories.map((category, categoryIndex) => (
                      <>
                        {/* Category Header */}
                        <tr key={category.code} className="bg-muted/30">
                          <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                            {category.code}
                          </td>
                          <td colSpan="5" className="px-4 py-3 font-semibold text-foreground">
                            {category.name}
                          </td>
                        </tr>
                        
                        {/* Category Items */}
                        {category.items.map((item, itemIndex) => (
                          <tr key={`${category.code}-${item.code}`} className="hover:bg-muted/10 transition-colors">
                            <td className="px-4 py-3 text-sm text-muted-foreground border-r border-border">
                              {item.code}
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground border-r border-border">
                              {item.description.split('\n').map((line, index) => (
                                <div key={index}>{line}</div>
                              ))}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-muted-foreground border-r border-border">
                              {item.unit}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-muted-foreground border-r border-border">
                              {formatNumber(item.areaQty)}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-foreground border-r border-border">
                              {formatNumber(item.rate)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-foreground">
                              {formatCurrency(item.amount)}
                            </td>
                          </tr>
                        ))}
                        
                        {/* Empty row for spacing between categories */}
                        {categoryIndex < boq.categories.length - 1 && (
                          <tr>
                            <td colSpan="6" className="px-4 py-2 border-r border-border"></td>
                          </tr>
                        )}
                      </>
                    ))}
                    
                    {/* Total Row */}
                    <tr className="bg-muted/50 border-t-2 border-border">
                      <td colSpan="5" className="px-4 py-4 text-right font-bold text-lg text-foreground border-r border-border">
                        Project Total
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-lg text-foreground">
                        {formatCurrency(boq.totalAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Skeleton Loader
function BOQSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
            <div>
              <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-64 mt-2 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
            <div className="h-9 w-32 bg-muted rounded animate-pulse"></div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg animate-pulse">
          <div className="p-6 border-b border-border">
            <div className="h-7 w-3/4 bg-muted rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-64 w-full bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}