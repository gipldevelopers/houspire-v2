// src/app/dashboard/boq/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  IndianRupee,
  Calendar,
  Building,
  CheckCircle2,
  Eye,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { boqService } from '@/services/boq.service';
import { toast } from 'sonner';

const formatCurrency = (amount, currency = 'INR') => {
  if (!amount) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function BOQListPage() {
  const [boqs, setBoqs] = useState([]);
  const [filteredBOQs, setFilteredBOQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBOQs();
  }, []);

  useEffect(() => {
    filterBOQs();
  }, [boqs, searchQuery]);

  const loadBOQs = async () => {
    setLoading(true);
    try {
      const result = await boqService.getUserBOQs();
      
      if (result.success) {
        setBoqs(result.data?.boqs || []);
        
        // Clear BOQ notifications when user visits this page
        localStorage.setItem('new_boqs', '[]');
        localStorage.setItem('new_boq_count', '0');
        
      } else {
        toast.error(result.message || 'Failed to load BOQs');
        setBoqs([]);
      }
    } catch (error) {
      console.error('Error loading BOQs:', error);
      toast.error('Failed to load BOQs');
      setBoqs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBOQs = () => {
    let filtered = boqs;

    if (searchQuery) {
      filtered = filtered.filter(boq =>
        boq.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        boq.project?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBOQs(filtered);
  };

  const handleDownload = async (boqId, boqTitle) => {
    try {
      toast.info('Preparing download...');
      // This would call your backend PDF generation endpoint
      // For now, we'll simulate download
      setTimeout(() => {
        toast.success(`BOQ "${boqTitle}" download started`);
      }, 1000);
    } catch (error) {
      toast.error('Failed to download BOQ');
    }
  };

  if (loading) {
    return <BOQListSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Budget breakdown</h1>
            <p className="text-muted-foreground text-lg">
              Your approved project cost breakdowns
            </p>
          </div>
          
          <div className="flex gap-2">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search BOQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 border-border bg-background"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total BOQs</p>
                  <p className="text-2xl font-bold text-foreground">{boqs.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(boqs.reduce((sum, boq) => sum + (boq.totalAmount || 0), 0))}
                  </p>
                </div>
                <IndianRupee className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(boqs.map(boq => boq.projectId)).size}
                  </p>
                </div>
                <Building className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* BOQs Grid */}
        {filteredBOQs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBOQs.map((boq) => (
              <BOQCard 
                key={boq.publicId} 
                boq={boq} 
                onDownload={handleDownload}
              />
            ))}
          </div>
        ) : (
          <Card className="border-border bg-card">
            <CardContent className="p-12 text-center">
              {boqs.length === 0 ? (
                <>
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No BOQs Available</h3>
                  <p className="text-muted-foreground mb-6">
                    Your Bill of Quantities will appear here once they're sent by our team.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>Typically sent within 72 hours of project completion</span>
                  </div>
                </>
              ) : (
                <>
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No BOQs Found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms.
                  </p>
                  <Button onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// BOQ Card Component
function BOQCard({ boq, onDownload }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border bg-card group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-lg text-foreground">BOQ</CardTitle>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Sent
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2">{boq.title}</h3>
            {boq.project && (
              <p className="text-sm text-muted-foreground mt-1">
                {boq.project.title}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(boq.createdAt)}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-foreground text-lg">
                {formatCurrency(boq.totalAmount)}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <IndianRupee className="w-3 h-3" />
                <span>{boq.totalAmount ? Math.round(boq.totalAmount / 100000).toFixed(1) + ' L' : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Project Info */}
          {boq.project && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted/30 rounded">
              <Building className="w-3 h-3" />
              <span className="truncate">
                {boq.project.areaSqFt} sq ft • {boq.project.projectType?.replace('_', ' ')}
              </span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button 
              asChild
              className="flex-1"
            >
              <Link href={`/dashboard/boq/${boq.publicId}`}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </Button>
            {/* <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDownload(boq.publicId, boq.title)}
            >
              <Download className="w-4 h-4" />
            </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Loader
function BOQListSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-muted" />
            <Skeleton className="h-4 w-64 bg-muted" />
          </div>
          <Skeleton className="h-10 w-64 bg-muted" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-9 h-9 bg-muted rounded-lg" />
                    <Skeleton className="h-5 w-16 bg-muted" />
                  </div>
                  <Skeleton className="h-6 w-16 bg-muted" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-3 w-1/2 bg-muted" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 bg-muted" />
                  <Skeleton className="h-6 w-24 bg-muted" />
                </div>
                <Skeleton className="h-4 w-full bg-muted" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-9 flex-1 bg-muted" />
                  <Skeleton className="h-9 w-9 bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}